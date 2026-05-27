<?php
// DESCRIPTION: 
//     Allows personnel to reverse/change their verdict on a processed permit.
//     e.g. REJECTED → COMPLETED, CANCELLED → COMPLETED, COMPLETED → REJECTED, etc.

include_once '../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "invalid method. endpoint requires POST."]);
    exit;
}

include_once '../config/DBConnector.php';
include_once '../auth/PersonnelMiddleware.php';

$data = json_decode(file_get_contents("php://input"), true);
$verified_personal_id = verifyPersonnelAccess($conn, $data);

$permit_id  = isset($data['permit_id']) ? (int)$data['permit_id'] : null;
$new_status = isset($data['new_status']) ? strtoupper(trim($data['new_status'])) : null;

if (!$permit_id || !$new_status) {
    echo json_encode(["success" => false, "message" => "incomplete arguments"]);
    $conn->close();
    exit;
}

// Validate new_status is one of the allowed target statuses
$allowed_targets = ['COMPLETED', 'REJECTED', 'CANCELLED', 'ACTIVE'];
if (!in_array($new_status, $allowed_targets)) {
    echo json_encode(["success" => false, "message" => "invalid target status"]);
    $conn->close();
    exit;
}

// Fetch current permit status and student_id
$q = $conn->prepare("SELECT status, student_id FROM permit WHERE permit_id = ?");
$q->bind_param("i", $permit_id);
$q->execute();
$res = $q->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "permit not found"]);
    $q->close();
    $conn->close();
    exit;
}

$row = $res->fetch_assoc();
$current_status = strtoupper($row['status']);
$student_id = (int)$row['student_id'];
$q->close();

// Only allow editing permits that are already processed (not ACTIVE or PENDING)
$processed_statuses = ['COMPLETED', 'REJECTED', 'CANCELLED'];
if (!in_array($current_status, $processed_statuses)) {
    echo json_encode(["success" => false, "message" => "can only edit already processed permits"]);
    $conn->close();
    exit;
}

// Don't allow setting to the same status
if ($current_status === $new_status) {
    echo json_encode(["success" => false, "message" => "permit already has this status"]);
    $conn->close();
    exit;
}

// Special validation: Uncancelling (CANCELLED → ACTIVE) — check for duplicate active or pending permit
if ($new_status === 'ACTIVE') {
    $check = $conn->prepare("SELECT COUNT(*) AS cnt FROM permit WHERE UPPER(TRIM(status)) IN ('ACTIVE', 'PENDING') AND student_id = ? AND permit_id != ?");
    $check->bind_param("ii", $student_id, $permit_id);
    $check->execute();
    $check_res = $check->get_result()->fetch_assoc();
    $check->close();

    if ($check_res && (int)$check_res['cnt'] > 0) {
        echo json_encode(["success" => false, "message" => "Uncancel unsuccessful: Student already has an active or pending permit."]);
        $conn->close();
        exit;
    }
}

// Update the permit status and manage permit_arrival / permit_validation rows
// based on the target status according to the business rules matrix.
$has_verdict = in_array($new_status, ['COMPLETED', 'REJECTED']);
$is_active = ($new_status === 'ACTIVE');
$is_cancelled = ($new_status === 'CANCELLED');

$conn->begin_transaction();

// Step 1: Update permit status
$upd = $conn->prepare("UPDATE permit SET status = ? WHERE permit_id = ?");
$upd->bind_param("si", $new_status, $permit_id);
$upd_ok = $upd->execute() && $upd->affected_rows > 0;
$upd->close();

if (!$upd_ok) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Permit update unsuccessful"]);
    $conn->close();
    exit;
}

// Step 2: Manage permit_arrival (only for COMPLETED, REJECTED, PENDING)
if ($has_verdict) {
    // Ensure arrival row exists (should already exist from LogReturn)
    $ins_arr = $conn->prepare("INSERT IGNORE INTO permit_arrival (permit_id, arrival_date, arrival_time) VALUES (?, CURRENT_DATE(), CURRENT_TIME())");
    $ins_arr->bind_param("i", $permit_id);
    $ins_arr->execute();
    $ins_arr->close();
} elseif ($is_active || $is_cancelled) {
    // Remove arrival record when reverting to ACTIVE or CANCELLED
    $del_arr = $conn->prepare("DELETE FROM permit_arrival WHERE permit_id = ?");
    $del_arr->bind_param("i", $permit_id);
    $del_arr->execute();
    $del_arr->close();
}

// Step 3: Manage permit_validation (only for COMPLETED, REJECTED)
if ($has_verdict) {
    // Upsert validation record
    $del_val = $conn->prepare("DELETE FROM permit_validation WHERE permit_id = ?");
    $del_val->bind_param("i", $permit_id);
    $del_val->execute();
    $del_val->close();

    $ins_val = $conn->prepare("INSERT INTO permit_validation (permit_id, personnel_id, validated_date, validated_time) VALUES (?, ?, CURRENT_DATE(), CURRENT_TIME())");
    $ins_val->bind_param("ii", $permit_id, $verified_personal_id);
    $ins_val->execute();
    $ins_val->close();
} elseif ($is_active || $is_cancelled) {
    // Remove validation record when reverting
    $del_val = $conn->prepare("DELETE FROM permit_validation WHERE permit_id = ?");
    $del_val->bind_param("i", $permit_id);
    $del_val->execute();
    $del_val->close();
}

$conn->commit();
echo json_encode(["success" => true, "message" => "Permit status updated to $new_status"]);

$conn->close();
?>
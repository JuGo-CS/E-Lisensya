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

// Update the permit status and assign the editing personnel
$upd = $conn->prepare("UPDATE permit SET status = ?, personnel_id = ? WHERE permit_id = ?");
$upd->bind_param("sii", $new_status, $verified_personal_id, $permit_id);

if ($upd->execute() && $upd->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Permit status updated to $new_status"]);
} else {
    echo json_encode(["success" => false, "message" => "Permit update unsuccessful"]);
}

$upd->close();
$conn->close();
?>
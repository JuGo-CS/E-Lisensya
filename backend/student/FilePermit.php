<?php
// DESCRIPTION: 
//     this handles filing of permit
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include '../config/DBConnector.php';

// get raw body
$data = json_decode(file_get_contents("php://input"), true);

// required: student_id and permit_name
$student_id   = isset($data['student_id']) ? (int)$data['student_id'] : null;
$personnel_id = isset($data['personnel_id']) ? (int)$data['personnel_id'] : 0; // default 0 if not provided
$permit_name  = isset($data['permit_name']) ? $data['permit_name'] : null;

if (!$student_id || !$permit_name) {
    echo json_encode(["success" => false, "message" => "incomplete arguments"]);
    $conn->close();
    exit;
}

// server-side time window check (06:00 - 18:00)
$serverHour = (int)date('H');
$serverOutside = ($serverHour < 6 || $serverHour >= 18);


// FOR THE TIME LOGIC CATCHER ~  NO FILING OF PERMIT AFTER 6:00PM
if ($serverOutside) {
    $msg = sprintf("Filing not allowed at this time. Allowed between %s and %s.", date('g:i A', strtotime('06:00')), date('g:i A', strtotime('18:00')));
    echo json_encode(["success" => false, "message" => $msg]);
    $conn->close();
    exit;
}

// prevent more than 1 active pending permit per student
$check = $conn->prepare("SELECT COUNT(*) AS cur_permit FROM permit WHERE UPPER(TRIM(status)) = 'ACTIVE' AND student_id = ?");
$check->bind_param("i", $student_id);
$check->execute();
$res = $check->get_result()->fetch_assoc();
$check->close();

if ($res && isset($res['cur_permit']) && (int)$res['cur_permit'] > 0) {
    echo json_encode(["success" => false, "message" => "You already have an active pending permit"]);
    $conn->close();
    exit;
}

// insert permit
$status = 'ACTIVE';

// Use authoritative server time (Philippines) for stored created date/time
$current_date = date('Y-m-d');
$current_time = date('H:i:s');

// If no personnel_id was provided (0), insert NULL for personnel_id to avoid FK violation
if ($personnel_id === 0) {
    $query = $conn->prepare("INSERT INTO permit (student_id, personnel_id, permit_name, status, date_created, time_created) VALUES (?, NULL, ?, ?, ?, ?)");
    $query->bind_param("issss", $student_id, $permit_name, $status, $current_date, $current_time);
} else {
    $query = $conn->prepare("INSERT INTO permit (student_id, personnel_id, permit_name, status, date_created, time_created) VALUES (?, ?, ?, ?, ?, ?)");
    $query->bind_param("iissss", $student_id, $personnel_id, $permit_name, $status, $current_date, $current_time);
}

if ($query && $query->execute()) {
    echo json_encode(["success" => true, "message" => "Permit filed successfully"]);
} else {
    $errMsg = $conn->error ?: ($query ? $query->error : 'Unknown DB error');
    echo json_encode(["success" => false, "message" => "Permit filing unsuccessful: " . $errMsg]);
}

if ($query) $query->close();
$conn->close();
?>
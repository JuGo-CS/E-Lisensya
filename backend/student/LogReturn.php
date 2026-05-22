<?php
// DESCRIPTION: 
//     handles cancellation of permit
//NOTE: data still stays in db
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

// expected: permit_id, actor_id, actor_is_student (1 = student, 0 = personnel)
$permit_id = isset($data['permit_id']) ? (int)$data['permit_id'] : null;
$actor_id = isset($data['actor_id']) ? (int)$data['actor_id'] : null;

if (!$permit_id || !$actor_id) {
    echo json_encode(["success" => false, "message" => "incomplete arguments"]);
    $conn->close();
    exit;
}

// fetch permit and check who filed it and permit's status
$q = $conn->prepare("SELECT student_id, status FROM permit WHERE permit_id = ?");
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
$permit_owner_id = (int)$row['student_id'];
$permit_status = strtoupper($row['status']);
$q->close();

// only active permits
if ($permit_status !== 'ACTIVE') {
    echo json_encode(["success" => false, "message" => "only active permits is permitted to do this task!"]);
    $conn->close();
    exit;
}

// only the student who owns the permit may log return (or personnel could be allowed)
$authorized = false;
if ($actor_id === $permit_owner_id) {
    $authorized = true;
}

if (! $authorized) {
    echo json_encode(["success" => false, "message" => "unauthorized to log return for this permit"]);
    $conn->close();
    exit;
}

// updating the db to set the date and time of return
$currentDate = date('Y-m-d');
$currentTime = date('H:i:s');

$upd = $conn->prepare("UPDATE permit SET status = 'PENDING', arrival_date = ?, arrival_time = ? WHERE permit_id = ?");
$upd->bind_param("ssi", $currentDate, $currentTime, $permit_id);
if ($upd->execute() && $upd->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Logged successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Logged unsuccessful"]);
}

$upd->close();

$conn->close();
?>
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
$actor_is_student = isset($data['actor_is_student']) ? (int)$data['actor_is_student'] : null;

if (!$permit_id || !$actor_id || !isset($actor_is_student)) {
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

// only pending permits can be cancelled
if ($permit_status !== 'PENDING') {
    echo json_encode(["success" => false, "message" => "only pending permits can be cancelled"]);
    $conn->close();
    exit;
}

//those who have an authorization are those students whoe filed the permit or personnels
$authorized = false;
if ($actor_is_student === 0) {
    $authorized = true;
} elseif ($actor_is_student === 1 && $actor_id === $permit_owner_id) {
    $authorized = true;
}

if (! $authorized) {
    echo json_encode(["success" => false, "message" => "unauthorized to cancel this permit"]);
    $conn->close();
    exit;
}

// perform update
$upd = $conn->prepare("UPDATE permit SET status = 'CANCELLED' WHERE permit_id = ?");
$upd->bind_param("i", $permit_id);
if ($upd->execute() && $upd->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Permit cancelled successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Permit cancellation unsuccessful"]);
}

$upd->close();

$conn->close();
?>
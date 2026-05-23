<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include '../config/DBConnector.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? (int)$data['id'] : null;
$username = isset($data['username']) ? trim($data['username']) : null;
$password = isset($data['password']) ? trim($data['password']) : null;

if (!$id) {
    echo json_encode(['success'=>false,'message'=>'Missing id']);
    $conn->close();
    exit;
}

$updates = [];
$types = '';
$values = [];

if ($username !== null && $username !== '') {
    $updates[] = 'username = ?';
    $types .= 's';
    $values[] = $username;
}
if ($password !== null && $password !== '') {
    $updates[] = 'password = ?';
    $types .= 's';
    $values[] = $password;
}

if (count($updates) === 0) {
    echo json_encode(['success'=>false,'message'=>'No fields to update']);
    $conn->close();
    exit;
}

$sql = 'UPDATE person SET ' . implode(', ', $updates) . ' WHERE personal_id = ?';
$types .= 'i';
$values[] = $id;

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success'=>false,'message'=>$conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param($types, ...$values);
if ($stmt->execute()) {
    echo json_encode(['success'=>true,'message'=>'Profile updated']);
} else {
    echo json_encode(['success'=>false,'message'=>$stmt->error]);
}

$stmt->close();
$conn->close();
?>

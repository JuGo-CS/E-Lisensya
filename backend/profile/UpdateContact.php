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
$old = isset($data['old_contact']) ? $data['old_contact'] : null;
$new = isset($data['new_contact']) ? $data['new_contact'] : null;

if (!$id || !$old || !$new) {
    echo json_encode(['success'=>false,'message'=>'Missing arguments']);
    $conn->close();
    exit;
}

$q = $conn->prepare("UPDATE person_contact SET contact_number = ? WHERE personal_id = ? AND contact_number = ?");
$q->bind_param("sis", $new, $id, $old);
if ($q->execute()) echo json_encode(['success'=>true,'message'=>'Contact updated']); else echo json_encode(['success'=>false,'message'=>$conn->error]);
$q->close();

$conn->close();
?>

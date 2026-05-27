<?php
// DESCRIPTION: 
//     this handles addition of contact

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
$contact_number = isset($data['contact_number']) ? $data['contact_number'] : null;

if (!$id || !$contact_number) {
    echo json_encode(["success" => false, "message" => "Incomplete arguments provided"]);
    $conn->close();
    exit;
}

// Check if contact number already exists for another user
$check = $conn->prepare("SELECT personal_id FROM person_contact WHERE contact_number = ? AND personal_id != ?");
$check->bind_param("si", $contact_number, $id);
$check->execute();
$check_res = $check->get_result();
$check->close();

if ($check_res && $check_res->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Contact number is already in use by another user"]);
    $conn->close();
    exit;
}

$query = $conn->prepare("INSERT INTO person_contact (personal_id, contact_number) VALUES (?, ?)");
$query->bind_param("is", $id, $contact_number);
if ($query->execute()) {
    echo json_encode(["success" => true, "message" => "Contact number added successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Contact number added unsuccessfully: " . $conn->error]);
}
$query->close();

$conn->close();
?>
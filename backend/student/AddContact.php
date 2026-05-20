<?php
// DESCRIPTION: 
//     this handles addition of contact

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include '../config/DBConnector.php';

//get raw body
$data = json_decode(file_get_contents("php://input"), true);
//check if id and contact passed are not null
$id = isset($data['id']) ? $data['id'] : null;
$contact_number = isset($data['contact_number']) ? $data['contact_number'] : null;


if ($id && $contact_number) {
    $query = $conn->prepare("
        INSERT INTO person_contact (personal_id, contact_number)
            VALUES (?, ?)
    ");
    $query->bind_param("is", $id, $contact_number);

    if ($query->execute()) {
        echo json_encode(["success" => true, "message" => "Contact number added successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Contact number added unsuccessfully"]);
    }
    
    $query->close();
} else {
    echo json_encode(["success" => false, "message" => "Incomplete arguments provided"]);
}

$conn->close();
?>
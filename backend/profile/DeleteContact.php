<?php
// DESCRIPTION: 
//     this handles addition of contact

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include '../config/DBConnector.php';
//get raw body
$data = json_decode(file_get_contents("php://input"), true); 

//check if id and contact passed are not null
$id = isset($data['id']) ? $data['id'] : null;
$contact_number = isset($data['contact_number']) ? $data['contact_number'] : null;


if ($id && $contact_number) {
    $query = $conn->prepare("
        DELETE 
        FROM person_contact 
        WHERE personal_id = ? AND contact_number = ?
    ");
    $query->bind_param("is", $id, $contact_number);

    if ($query->execute()) {
        echo json_encode(["success" => true, "message" => "Contact number deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Contact number deletion unsuccessful. try again"]);
    }
    
    $query->close();
} else {
    echo json_encode(["success" => false, "message" => "Incomplete arguments provided"]);
}

$conn->close();
?>
<?php
// DESCRIPTION: 
//     handles cancellation of permit
//NOTE: data still stays in db
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include '../config/DBConnector.php';

//get raw body
$data = json_decode(file_get_contents("php://input"), true);
//check if permit's and student's id passed are not null
$permit_id  = isset($data['permit_id']) ? $data['permit_id'] : null;
$student_id = isset($data['student_id']) ? $data['student_id'] : null; 

if ($permit_id && $student_id) {
    $query = $conn->prepare("
        UPDATE permit 
        SET status ='Cancelled' 
        WHERE permit_id = ? AND student_id = ?
    ");
    $query->bind_param("ii", $permit_id, $student_id);

    if ($query->execute() && $query->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Permit cancelled successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Permit cancellation unsiccessful"]);
    }
    $query->close();
} else {
    echo json_encode(["success" => false, "message" => "incomplete arguments" ]);
}

$conn->close();
?>
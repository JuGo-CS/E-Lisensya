<?php
// DESCRIPTION: 
//     this handles filing of permit
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include '../config/DBConnector.php';

//get raw body
$data = json_decode(file_get_contents("php://input"), true);
//check if id, personal id and permit name passed are not null
$student_id   = isset($data['student_id']) ? $data['student_id'] : null;
$personnel_id = isset($data['personnel_id']) ? $data['personnel_id'] : null;
$permit_name  = isset($data['permit_name']) ? $data['permit_name'] : null;

// default
$status = "Pending";
$current_date = date("Y-m-d");
$current_time = date("H:i:s");

//handles constraint since these can't be null d
if ($student_id && $personnel_id && $permit_name) {
    $query = $conn->prepare("
        INSERT INTO permit (student_id, personnel_id, permit_name, status, date_created, time_created)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $query->bind_param("iissss", $student_id, $personnel_id, $permit_name, $status, $current_date, $current_time);

    if ($query->execute()) {
        echo json_encode(["success" => true, "message" => "Permit filed successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Permit filing unsuccessful"]);
    }
    $query->close();
} else {
    echo json_encode(["success" => false, "message" => "incomplete arguments"]);
}

$conn->close();
?>
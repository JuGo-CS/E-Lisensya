<?php
    //DESCRIPTION: this secures files that only personnels should have access to

// get raw body
$data = json_decode(file_get_contents("php://input"), true);
$personal_id = isset($data['personal_id']) ? (int)$data['personal_id'] : null;

// if id not sent then block
if (!$personal_id) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(["success" => false, "message" => "Missing id"]);
    if (isset($conn)) { $conn->close(); }
    exit; 
}

//check if personnel exist within
$personnel_check = $conn->prepare("
            SELECT personal_id 
            FROM personnel 
            WHERE personal_id = ? AND work_status = 'Active'
        ");
$personnel_check->bind_param("i", $personal_id); 
$personnel_check->execute();
$personnel_check_res = $personnel_check->get_result();

//block access if not found
if ($personnel_check_res->num_rows === 0) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    $personnel_check->close();
    $conn->close();
    exit; 
}

$personnel_check->close();

?>
<?php
// DESCRIPTION: 
//     Handles updating permit status to rejected
// NOTE: 
//     Includes PersonnelMiddleware to ensure only authorized personnel members access

include_once '../config/cors.php';

//  restrict allowed method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode([
        "success" => false, "message" => "invalid method. endpoint requires POST."
    ]); 
    exit;
}

include_once '../config/DBConnector.php';
include_once '../auth/PersonnelMiddleware.php'; 

// get raw data
$data = json_decode(file_get_contents("php://input"), true);
// verify personnel access and get the verified personnel id
$verified_personal_id = verifyPersonnelAccess($conn, $data);
// check if permit id is passed
$permit_id = isset($data['permit_id']) ? (int)$data['permit_id'] : null;

if (!$permit_id) {
    echo json_encode(["success" => false, "message" => "incomplete arguments"]);
    $conn->close();
    exit;
}

// get permit status
$q = $conn->prepare("SELECT status FROM permit WHERE permit_id = ?");
$q->bind_param("i", $permit_id);
$q->execute();
$res = $q->get_result();

// check if permit exist
if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "permit not found"]);
    $q->close();
    $conn->close();
    exit;
}
$row = $res->fetch_assoc();
$permit_status = strtoupper($row['status']);
$q->close();

// action restirct to pending only
if ($permit_status !== 'PENDING') {
    echo json_encode(["success" => false, "message" => "only pending permits can be rejected"]);
    $conn->close();
    exit;
}


// update status and bind the person who handled it to that permit
$upd = $conn->prepare("UPDATE permit SET status = 'REJECTED', personnel_id = ? WHERE permit_id = ?");
$upd->bind_param("ii", $verified_personal_id, $permit_id);

if ($upd->execute() && $upd->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "permit rejected successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Permit rejection unsuccessful"]);
}

$upd->close();
$conn->close();
?>
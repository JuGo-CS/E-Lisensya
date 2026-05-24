<?php
// DESCRIPTION: 
//     this handles approving pending permits


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

// check if permit id is passed
$permit_id = isset($data['permit_id']) ? (int)$data['permit_id'] : null;


if (!$permit_id) {
    echo json_encode(["success" => false, "message" => "invalid. no permit id"]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("
    UPDATE permit 
    SET status = 'APPROVED' 
    WHERE permit_id = ? AND status = 'PENDING'
");

$stmt->bind_param("i", $permit_id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Permit approved"]);
} else {
    echo json_encode(["success" => false,"message" => "permit approval unsuccessful"]);
}

$stmt->close();
$conn->close();
?>
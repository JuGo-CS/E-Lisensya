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
$data = json_decode(file_get_contents("php://input"), true);
$verified_personal_id = verifyPersonnelAccess($conn, $data);
$permit_id = isset($data['permit_id']) ? (int)$data['permit_id'] : null;

header('Content-Type: application/json; charset=UTF-8');

if (!$permit_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid request. No permit id!"]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("
    UPDATE permit 
    SET status = 'APPROVED', personnel_id = ? 
    WHERE permit_id = ? AND status = 'PENDING'
");

$stmt->bind_param("ii", $verified_personal_id, $permit_id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Permit approved"]);
} else {
    echo json_encode(["success" => false,"message" => "permit approval unsuccessful"]);
}

$stmt->close();
$conn->close();
?>
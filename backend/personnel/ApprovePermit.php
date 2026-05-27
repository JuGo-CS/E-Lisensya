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

$validated_date = date('Y-m-d');
$validated_time = date('H:i:s');

$conn->begin_transaction();

// Step A: Update permit status
$stmt = $conn->prepare("UPDATE permit SET status = 'COMPLETED' WHERE permit_id = ? AND status = 'PENDING'");
$stmt->bind_param("i", $permit_id);
$stmt->execute();
$stmt_ok = $stmt->affected_rows > 0;
$stmt->close();

if (!$stmt_ok) {
    $conn->rollback();
    echo json_encode(["success" => false,"message" => "permit approval unsuccessful"]);
    $conn->close();
    exit;
}

// Step B: Upsert validation record (delete then insert to handle re-approvals)
$del = $conn->prepare("DELETE FROM permit_validation WHERE permit_id = ?");
$del->bind_param("i", $permit_id);
$del->execute();
$del->close();

$ins = $conn->prepare("INSERT INTO permit_validation (permit_id, personnel_id, validated_date, validated_time) VALUES (?, ?, ?, ?)");
$ins->bind_param("iiss", $permit_id, $verified_personal_id, $validated_date, $validated_time);
$ins->execute();
$ins->close();

$conn->commit();
echo json_encode(["success" => true, "message" => "Permit approved"]);

$conn->close();
?>
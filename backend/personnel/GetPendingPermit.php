<?php
// DESCRIPTION: 
//     this handles getting pending permits

include_once '../config/cors.php';

//  restrict allowed method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); 
    echo json_encode([
        "success" => false, "message" => "invalid method. endpoint requires GET"
    ]);
    exit;
}

include_once '../config/DBConnector.php';


$query = "
    SELECT 
        p.permit_id, 
        p.permit_name, 
        p.date_created, 
        p.status,
        per.first_name,
        per.last_name,
        s.room_number
    FROM permit p
    JOIN student s ON p.student_id = s.personal_id
    JOIN person per ON s.personal_id = per.personal_id
    WHERE p.status = 'PENDING'
    ORDER BY p.date_created ASC
";

$stmt = $conn->prepare($query);

$stmt->execute();
$result = $stmt->get_result();
$pending_permits = [];

// loop through database rows, map the data, and push into the results list as long as there is data
while ($row = $result->fetch_assoc()) {
    $pending_permits[] = [
        'permit_id' => (int)$row['permit_id'],
        'permit_name' => $row['permit_name'],
        'date_created' => $row['date_created'],
        'status' => $row['status'],
        'student_name'=> trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? '')),
        'room_number'=> (int)$row['room_number']
    ];
}

$stmt->close();
echo json_encode([
    "success" => true, "permits" => $pending_permits
]);

$conn->close();
?>
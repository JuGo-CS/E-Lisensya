<?php
// DESCRIPTION: 
//     this handles getting processed (approved/rejected) permits for personnel view

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
        p.time_created,
        p.status,
        p.arrival_date,
        p.arrival_time,
        p.validated_date,
        p.validated_time,
        per.first_name,
        per.last_name,
        s.room_number,
        CONCAT(personnel_person.first_name, ' ', personnel_person.last_name) AS personnel_name
    FROM permit p
    JOIN student s ON p.student_id = s.personal_id
    JOIN person per ON s.personal_id = per.personal_id
    LEFT JOIN personnel personnel_tbl ON p.personnel_id = personnel_tbl.personal_id
    LEFT JOIN person personnel_person ON personnel_tbl.personal_id = personnel_person.personal_id
    WHERE p.status IN ('COMPLETED', 'REJECTED', 'BREACHED', 'CANCELLED')
    ORDER BY p.date_created DESC, p.time_created DESC
";

$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();
$processed_permits = [];

// loop through database rows, map the data, and push into the results list as long as there is data
while ($row = $result->fetch_assoc()) {
    // Format the created date/time
    $created_dt = strtotime($row['date_created'] . ' ' . $row['time_created']);
    $time_created_ampm = date("g:i a", $created_dt);
    $date_created_fmt = date("n/j/Y", strtotime($row['date_created']));
    $full_created_date = $time_created_ampm . ', ' . $date_created_fmt;

    // Format arrival time if exists
    $arrival_time = null;
    if ($row['arrival_date'] && $row['arrival_time']) {
        $arrival_dt = strtotime($row['arrival_date'] . ' ' . $row['arrival_time']);
        $arrival_ampm = date("g:i a", $arrival_dt);
        $arrival_date_fmt = date("n/j/Y", strtotime($row['arrival_date']));
        $arrival_time = $arrival_ampm . ', ' . $arrival_date_fmt;
    }

    // Format validated date/time if exists
    $validated_at = null;
    if (!empty($row['validated_date']) && !empty($row['validated_time'])) {
        $val_dt = strtotime($row['validated_date'] . ' ' . $row['validated_time']);
        $validated_at = date("g:i a", $val_dt) . ', ' . date("n/j/Y", strtotime($row['validated_date']));
    }

    $processed_permits[] = [
        'permit_id' => (int)$row['permit_id'],
        'permit_name' => $row['permit_name'],
        'date_created' => $full_created_date,
        'status' => $row['status'],
        'student_name'=> trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? '')),
        'room_number'=> (int)$row['room_number'],
        'personnel_name' => $row['personnel_name'] ?? 'N/A',
        'arrival_time' => $arrival_time,
        'validated_at' => $validated_at
    ];
}

$stmt->close();
echo json_encode([
    "success" => true, "permits" => $processed_permits
]);

$conn->close();
?>
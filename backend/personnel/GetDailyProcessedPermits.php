<?php
// DESCRIPTION: 
//     this handles getting today's processed permits for the personnel dashboard
//     Uses a 24-hour cycle: 6:00 PM to 5:59 PM next day

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

// Window: 12:00 AM (midnight) of today → 5:59 PM of the next day
$now = new DateTime('now');
$currentDate = $now->format('Y-m-d');
$tomorrow = new DateTime('now');
$tomorrow->modify('+1 day');

$window_start = $currentDate . ' 00:00:00';
$window_end   = $tomorrow->format('Y-m-d') . ' 17:59:00';

$query = "
    SELECT 
        p.permit_id, 
        p.permit_name, 
        p.date_created, 
        p.time_created,
        p.status,
        p.arrival_date,
        p.arrival_time,
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
    AND CONCAT(p.date_created, ' ', p.time_created) >= ?
    AND CONCAT(p.date_created, ' ', p.time_created) <= ?
    ORDER BY p.date_created DESC, p.time_created DESC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $window_start, $window_end);
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

    $processed_permits[] = [
        'permit_id' => (int)$row['permit_id'],
        'permit_name' => $row['permit_name'],
        'date_created' => $full_created_date,
        'status' => $row['status'],
        'student_name'=> trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? '')),
        'room_number'=> (int)$row['room_number'],
        'personnel_name' => $row['personnel_name'] ?? 'N/A',
        'arrival_time' => $arrival_time
    ];
}

$stmt->close();
echo json_encode([
    "success" => true, "permits" => $processed_permits
]);

$conn->close();
?>
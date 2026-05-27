<?php
// DESCRIPTION: 
//     this handles getting active and pending permits for personnel view

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
        per.first_name,
        per.last_name,
        s.room_number,
        s.personal_id AS student_id
    FROM permit p
    JOIN student s ON p.student_id = s.personal_id
    JOIN person per ON s.personal_id = per.personal_id
    WHERE p.status IN ('ACTIVE', 'PENDING')
    ORDER BY p.date_created DESC, p.time_created DESC
";

$stmt = $conn->prepare($query);

$stmt->execute();
$result = $stmt->get_result();
$pending_permits = [];

// loop through database rows, map the data, and push into the results list as long as there is data
while ($row = $result->fetch_assoc()) {
    // Format the created date/time
    $created_dt = strtotime($row['date_created'] . ' ' . $row['time_created']);
    $time_created_ampm = date("g:i a", $created_dt);
    $date_created_fmt = date("n/j/Y", strtotime($row['date_created']));
    $full_created_date = $time_created_ampm . ', ' . $date_created_fmt;

    // Compute valid until based on permit name (same logic as student's ActivePermits.php)
    $valid_until_date = null;
    $valid_until_time = null;

    if ($row["permit_name"] == "Late") {
        $valid_until_date = date('Y-m-d', strtotime($row["date_created"]));
        $valid_until_time = "23:00:00";
    } else if ($row["permit_name"] == "Overnight") {
        $date_object = new DateTime($row["date_created"]);
        $date_object->modify('+1 day');
        $valid_until_date = $date_object->format('Y-m-d');
        $valid_until_time = "23:00:00";
    }

    $full_valid_datetime = "";
    if ($valid_until_date && $valid_until_time) {
        $valid_until_dt = strtotime($valid_until_date . ' ' . $valid_until_time);
        $valid_until_ampm = date("g:i a", $valid_until_dt);
        $valid_until_date_fmt = date("n/j/Y", strtotime($valid_until_date));
        $full_valid_datetime = $valid_until_ampm . ', ' . $valid_until_date_fmt;
    } else {
        $full_valid_datetime = "Until Return";
    }

    // Format arrival time if exists
    $arrival_time = null;
    $raw_arrival_date = $row['arrival_date'] ?? null;
    $raw_arrival_time = $row['arrival_time'] ?? null;
    if ($raw_arrival_date && $raw_arrival_time && $raw_arrival_time !== '00:00:00') {
        $arrival_dt = strtotime($raw_arrival_date . ' ' . $raw_arrival_time);
        if ($arrival_dt) {
            $arrival_ampm = date("g:i a", $arrival_dt);
            $arrival_date_fmt = date("n/j/Y", strtotime($raw_arrival_date));
            $arrival_time = $arrival_ampm . ', ' . $arrival_date_fmt;
        }
    }

    // Ensure arrival_time is explicitly null (not empty string) when there's no return
    $final_arrival_time = ($arrival_time !== null) ? $arrival_time : null;

    $pending_permits[] = [
        'permit_id' => (int)$row['permit_id'],
        'permit_name' => $row['permit_name'],
        'date_created' => $full_created_date,
        'valid_until' => $full_valid_datetime,
        'arrival_time' => $final_arrival_time,
        'status' => $row['status'],
        'student_name'=> trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? '')),
        'room_number'=> (int)$row['room_number'],
        'student_id'=> (int)$row['student_id']
    ];
}

$stmt->close();
echo json_encode([
    "success" => true, "permits" => $pending_permits
]);

$conn->close();
?>
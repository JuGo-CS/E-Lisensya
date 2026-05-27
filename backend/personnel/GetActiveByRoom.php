<?php
// DESCRIPTION: 
//     Returns active permits grouped by room for the Residents page.
//     Only rooms with at least one student on an active permit are shown.

include_once '../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "invalid method"]);
    exit;
}

include_once '../config/DBConnector.php';

$query = "
    SELECT 
        s.room_number,
        s.personal_id AS student_id,
        CONCAT(per.first_name, ' ', per.last_name) AS student_name,
        p.permit_id,
        p.permit_name,
        p.status,
        p.date_created,
        p.time_created,
        pa.arrival_date,
        pa.arrival_time
    FROM permit p
    LEFT JOIN permit_arrival pa ON p.permit_id = pa.permit_id
    JOIN student s ON p.student_id = s.personal_id
    JOIN person per ON s.personal_id = per.personal_id
    WHERE p.status = 'ACTIVE'
    ORDER BY s.room_number, per.last_name, per.first_name
";

$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

$rooms = [];

while ($row = $result->fetch_assoc()) {
    $room = (int)$row['room_number'];

    // Format created datetime
    $created_dt = strtotime($row['date_created'] . ' ' . $row['time_created']);
    $time_created = date("g:i a", $created_dt);
    $date_created = date("n/j/Y", strtotime($row['date_created']));

    // Compute valid until
    $valid_until = "Until Return";
    if ($row['permit_name'] == 'Late') {
        $valid_until_dt = strtotime($row['date_created'] . ' 23:00:00');
        $valid_until = date("g:i a", $valid_until_dt) . ', ' . date("n/j/Y", $valid_until_dt);
    } elseif ($row['permit_name'] == 'Overnight') {
        $next_day = date('Y-m-d', strtotime($row['date_created'] . ' +1 day'));
        $valid_until_dt = strtotime($next_day . ' 23:00:00');
        $valid_until = date("g:i a", $valid_until_dt) . ', ' . date("n/j/Y", $valid_until_dt);
    }

    if (!isset($rooms[$room])) {
        $rooms[$room] = [
            'room_number' => $room,
            'students' => []
        ];
    }

    $rooms[$room]['students'][] = [
        'student_id'   => (int)$row['student_id'],
        'student_name' => $row['student_name'],
        'permit_id'    => (int)$row['permit_id'],
        'permit_name'  => $row['permit_name'],
        'status'       => $row['status'],
        'time_created' => $time_created . ', ' . $date_created,
        'valid_until'  => $valid_until,
    ];
}

$stmt->close();

echo json_encode([
    "success" => true,
    "rooms" => array_values($rooms)
]);

$conn->close();
?>
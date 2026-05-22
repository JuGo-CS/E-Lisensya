<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include '../config/DBConnector.php';

$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id) {
    $query = $conn->prepare("SELECT * FROM permit WHERE status='PENDING' AND student_id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $active_permit = $query->get_result(); 

    if ($active_permit->num_rows > 0) {
        $permit = $active_permit->fetch_assoc();
    
        $valid_until_date = null;
        $valid_until_time = null;

        if ($permit["permit_name"] == "Late") {
            $valid_until_date = date('Y-m-d', strtotime($permit["date_created"]));
            $valid_until_time = "23:00:00"; 
        } 
        else if ($permit["permit_name"] == "Overnight") {
            $date_object = new DateTime($permit["date_created"]);
            $date_object->modify('+1 day');

            $valid_until_date = $date_object->format('Y-m-d');
            $valid_until_time = "23:00:00"; 
        }

        // combine date and time and use gmdate to avoid server timezone shifting client-local timestamps
        $created_dt = strtotime($permit["date_created"] . ' ' . $permit["time_created"]);
        $time_created_ampm = date("g:i a", $created_dt);
        $date_created_fmt = date("n/j/Y", strtotime($permit["date_created"]));

        $full_created_date = $time_created_ampm . ', ' . $date_created_fmt;

        $full_valid_datetime = "";

        if($valid_until_time != null) {
            $valid_until_dt = strtotime($valid_until_date . ' ' . $valid_until_time);
            $valid_until_ampm = date("g:i a", $valid_until_dt);
            $valid_until_date_fmt = date("n/j/Y", strtotime($valid_until_date));

            $full_valid_datetime = $valid_until_ampm . ', ' . $valid_until_date_fmt;
        } else {
            $full_valid_datetime = "Until Return";
        }

        echo json_encode([
            "permit_id" => (int)$permit["permit_id"],
            "student_id" => (int)$permit["student_id"],
            "permit_name" => $permit["permit_name"],
            "date_created" => $full_created_date,
            "valid_until" => $full_valid_datetime
        ]);
    } 
    else {
        echo json_encode([
            "permit" => null
        ]);
    }
} 
else {
    echo json_encode(["error" => "No ID provided"]);
}

if (isset($query)) {
    $query->close();
}
$conn->close();
?>
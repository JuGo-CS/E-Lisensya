<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include '../config/DBConnector.php';

$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id) {
    $query = $conn->prepare("SELECT * FROM permit WHERE status!='PENDING' AND student_id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $active_permit = $query->get_result(); 

    if ($active_permit->num_rows > 0) {
        $all_permits = [];

        while($permit = $active_permit->fetch_assoc()){

            // fetch personnel name only if personnel_id is present
            $personnel_name = null;
            if (!empty($permit['personnel_id'])) {
                $pstmt = $conn->prepare("SELECT CONCAT(per.first_name, ' ', per.last_name) AS personnel_name FROM person AS per WHERE per.personal_id = ?");
                $pstmt->bind_param("i", $permit['personnel_id']);
                $pstmt->execute();
                $pres = $pstmt->get_result();
                if ($pres && $pres->num_rows > 0) {
                    $prow = $pres->fetch_assoc();
                    $personnel_name = $prow['personnel_name'] ?? null;
                }
                $pstmt->close();
            }

            $time_created_ampm = isset($permit["time_created"]) && $permit["time_created"] !== null ? date("g:i a", strtotime($permit["time_created"])) : "N/A";

            if (!empty($permit["arrival_time"]) && !empty($permit["arrival_date"])) {
                $arrival_time_ampm = date("g:i a", strtotime($permit["arrival_time"]));
                $arrival_time_date_fmt = date("n/j/Y", strtotime($permit["arrival_date"]));
                $full_arrival_datetime = $arrival_time_ampm . ', ' . $arrival_time_date_fmt;
            } else {
                $full_arrival_datetime = "N/A";
            }

            
            if($personnel_name == null){
                $personnel_name = "N/A";
            } 

            $date_created_fmt = isset($permit["date_created"]) && $permit["date_created"] !== null ? date("n/j/Y", strtotime($permit["date_created"])) : "N/A";

            $full_created_date = $time_created_ampm . ', ' . $date_created_fmt;

            $all_permits[] = [
                "permit_name" => $permit["permit_name"],
                "personnel" => $personnel_name,
                "status" => $permit["status"],
                "date_created" => $full_created_date,
                "arrival_time" => $full_arrival_datetime
            ];

        }
        echo json_encode($all_permits);
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
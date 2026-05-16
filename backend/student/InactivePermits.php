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
            

            $personnel_query = $conn->query("SELECT CONCAT(per.first_name, ' ', per.last_name) AS personnel_name
                                            FROM permit AS p
                                            INNER JOIN person AS per
                                            ON p.personnel_id = per.personal_id
                                            WHERE p.permit_id = {$permit['permit_id']}");
            $personnel = $personnel_query->fetch_assoc();
            
            $time_created_ampm = date("g:i a", strtotime($permit["time_created"]));
            $arrival_time_ampm = date("g:i a", strtotime($permit["arrival_time"]));

            $date_created_fmt = date("n/j/Y", strtotime($permit["date_created"]));
            $arrival_time_date_fmt = date("n/j/Y", strtotime($permit["arrival_date"]));

            $full_created_date = $time_created_ampm . ', ' . $date_created_fmt;
            $full_arrival_datetime = $arrival_time_ampm . ', ' . $arrival_time_date_fmt;

            $all_permits[] = [
                "permit_name" => $permit["permit_name"],
                "personnel" => $personnel["personnel_name"],
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
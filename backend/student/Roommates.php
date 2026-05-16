<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include '../config/DBConnector.php';

$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id) {
    $query = $conn->prepare("SELECT room_number, personal_id FROM student WHERE personal_id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $student_info = $query->get_result(); 

    if ($student_info->num_rows > 0) {
        $student = $student_info->fetch_assoc();

        $roommates_query = $conn->prepare("
            SELECT st.*, CONCAT(per.first_name, ' ', per.last_name) as fullname, per.birthday
            FROM student AS st
            INNER JOIN person AS per 
            ON st.personal_id = per.personal_id
            WHERE st.room_number = ? AND st.personal_id != ?
        ");
        $roommates_query->bind_param("si", $student['room_number'], $student['personal_id']);
        $roommates_query->execute();
        $roommates_result = $roommates_query->get_result();

        if ($roommates_result->num_rows > 0) {

            $all_roommates = [];

            while($roommayt = $roommates_result->fetch_assoc()){
                // Formatting birthday seamlessly 
                $birthday_fmt = $roommayt["birthday"] ? date("n/j/Y", strtotime($roommayt["birthday"])) : null;

                $all_roommates[] = [
                    "roommate_name" => $roommayt["fullname"],
                    "program"       => $roommayt["program"],
                    "year_level"    => $roommayt["year_level"],
                    "birthday"      => $birthday_fmt
                ];
            }

            echo json_encode($all_roommates);
        }
        else {
            echo json_encode([
                "roommates" => null
            ]);
        }
        $roommates_query->close();
    } 
    else {
        echo json_encode([
            "error" => "Student not found"
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

<?php
// DESCRIPTION: 
//     what this does is return the student's info: name program, yr level, age, contact


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include '../config/DBConnector.php';



//check if id pass is not null
$id = isset($_GET['id'])? $_GET['id']: null;

if ($id) {
    $query = $conn-> prepare ("
        SELECT 
            s.program, 
            s.year_level, 
            CONCAT (p.first_name, ' ', p.last_name) AS fullname,
            p.birthday,
            TIMESTAMPDIFF(YEAR, p.birthday, CURDATE() ) AS age
        FROM student AS s
        INNER JOIN person AS p ON s.personal_id = p.personal_id 
        WHERE s.personal_id = ?
    ");
    $query-> bind_param("i", $id);
    $query->execute();

    $result = $query->get_result();

    //check if found
    if ($result->num_rows >0) {
        $profile = $result->fetch_assoc();
    

        $contact_query = $conn->prepare("SELECT contact_number FROM person_contact WHERE personal_id = ?");
        $contact_query->bind_param("i", $id);
        $contact_query->execute();
        $contact_result = $contact_query->get_result();
                
        $contacts = [];
        while ($row = $contact_result->fetch_assoc()) {
            $contacts[] = $row['contact_number'];
        }

        echo json_encode([
            "fullname" => $profile['fullname'],
            "program" => $profile['program'],
            "year_level" => $profile['year_level'],
            "age" => $profile['age'],
            "contacts" => $contacts
        ]); 
        } else {
            echo json_encode(["error" => "Student not found"]);
        }
        $query->close();
    } else {
        echo json_encode(["error" => "No ID"]);
    }
    $conn->close();

?>
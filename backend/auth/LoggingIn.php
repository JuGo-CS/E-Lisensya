<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include '../config/DBConnector.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = isset($data['userName']) ? $data['userName'] : (isset($_GET['userName']) ? $_GET['userName'] : null);
$password = isset($data['password']) ? $data['password'] : (isset($_GET['password']) ? $_GET['password'] : null);

if ($username && $password) {
    $query = $conn->prepare("SELECT * FROM person as p WHERE p.username = ? AND p.password = ?");$query->bind_param("ss", $username, $password);
    $query->execute();
    $person = $query->get_result(); 

    if ($person->num_rows == 1) {
        $person_deets = $person->fetch_assoc();

        echo json_encode([
            "personal_id" => $person_deets["personal_id"],
            "is_student" => $person_deets["is_student"],
        ]);

    } 
   else {
        echo json_encode([
            "personal_id" => null
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
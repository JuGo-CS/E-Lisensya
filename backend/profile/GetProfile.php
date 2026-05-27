<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include '../config/DBConnector.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "No ID provided"]);
    $conn->close();
    exit;
}

// base person info
$pstmt = $conn->prepare("SELECT personal_id, first_name, last_name, birthday, username, IFNULL(is_student,0) AS is_student FROM person WHERE personal_id = ?");
$pstmt->bind_param("i", $id);
$pstmt->execute();
$pres = $pstmt->get_result();

if (!$pres || $pres->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Person not found"]);
    $pstmt->close();
    $conn->close();
    exit;
}

$person = $pres->fetch_assoc();
$pstmt->close();

$fullname = trim(($person['first_name'] ?? '') . ' ' . ($person['last_name'] ?? '')); 
$birthday = $person['birthday'] ?? null;
$username = $person['username'] ?? null;
$is_student = (int)$person['is_student'];

$result = [
    'success' => true,
    'personal_id' => (int)$person['personal_id'],
    'fullname' => $fullname,
    'birthday' => $birthday,
    'username' => $username,
    'is_student' => $is_student,
    'contacts' => [],
];

if ($is_student === 1) {
    $sp = $conn->prepare("SELECT program, year_level, room_number FROM student WHERE personal_id = ?");
    $sp->bind_param("i", $id);
    $sp->execute();
    $sr = $sp->get_result();
    if ($sr && $sr->num_rows > 0) {
        $srow = $sr->fetch_assoc();
        $result['program'] = $srow['program'];
        $result['year_level'] = $srow['year_level'];
        $result['room_number'] = $srow['room_number'];
    }
    $sp->close();
} else {
    $pp = $conn->prepare("SELECT job_title FROM personnel WHERE personal_id = ?");
    $pp->bind_param("i", $id);
    $pp->execute();
    $pr = $pp->get_result();
    if ($pr && $pr->num_rows > 0) {
        $prow = $pr->fetch_assoc();
        $result['job_title'] = $prow['job_title'];
    }
    $pp->close();
}

// contacts
$cstmt = $conn->prepare("SELECT contact_number FROM person_contact WHERE personal_id = ?");
$cstmt->bind_param("i", $id);
$cstmt->execute();
$cr = $cstmt->get_result();
while ($crow = $cr->fetch_assoc()) {
    $result['contacts'][] = $crow['contact_number'];
}
$cstmt->close();

echo json_encode($result);

$conn->close();
?>

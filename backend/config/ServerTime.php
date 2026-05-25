<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once 'DBConnector.php';

// Use the same timezone set in DBConnector (Asia/Manila)
$now = new DateTime('now');
$date_fmt = $now->format('l, F j, Y');
$time_fmt = $now->format('g:i A');
$timezone = $now->format('T');

echo json_encode([
    "datetime" => $date_fmt . ' — ' . $time_fmt 
]);
?>
<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once '../config/Database.php';

$database = new Database();
$db = $database->connect();

$query = "SELECT DISTINCT Departament FROM news WHERE Departament IS NOT NULL ORDER BY Departament";
$stmt = $db->prepare($query);
$stmt->execute();

$departamentos = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $departamentos[] = $row['Departament'];
}

echo json_encode($departamentos);
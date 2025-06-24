<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once '../config/Database.php';

$database = new Database();
$db = $database->connect();

$query = "SELECT DISTINCT Category FROM news WHERE Category IS NOT NULL ORDER BY Category";
$stmt = $db->prepare($query);
$stmt->execute();

$categorias = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $categorias[] = $row['Category'];
}

echo json_encode($categorias);
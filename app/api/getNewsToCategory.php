<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once '../controllers/NewsControllers.php';

if (isset($_GET['categoria'])) {
    $controller = new NewsController();
    $controller->getByCategory($_GET['categoria']);
} else {
    echo json_encode(['error' => 'Falta el parámetro categoria']);
}

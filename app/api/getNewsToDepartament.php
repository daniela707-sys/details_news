<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once '../controllers/NewsControllers.php';

if (isset($_GET['departamento'])) {
    $controller = new NewsController();
    $controller->getByDepartament($_GET['departamento']);
} else {
    echo json_encode(['error' => 'Falta el parámetro departamento']);
}

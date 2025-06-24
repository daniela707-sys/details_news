<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once '../controllers/NewsControllers.php';

$controller = new NewsController();
$controller->getFeatured();

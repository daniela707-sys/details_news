<?php
require_once '../config/Database.php';
require_once '../models/News.php';

class NewsController {
    private $news;

    public function __construct() {
        $database = new Database();
        $db = $database->connect();
        $this->news = new News($db);
    }

    //Todas las noticias
    public function getAll(){
        $stmt = $this->news->read();
        $noticias = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($noticias);
    }
    // Noticias destacadas
    public function getFeatured() {
        $stmt = $this->news->readFeatured();
        $noticias = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($noticias);
    }

    // Noticias más leídas
    public function getMostRead() {
        $stmt = $this->news->readMostViewed();
        $noticias = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($noticias);
    }

    // Noticias por categoría (GET: ?categoria=Nombre)
    public function getByCategory($categoria) {
        $noticias = $this->news->readCategory($categoria);
        echo json_encode($noticias);
    }

    // Noticias por departamento (GET: ?departamento=Nombre)
    public function getByDepartament($departamento) {
        $noticias = $this->news->readDepartament($departamento);
        echo json_encode($noticias);
    }
}

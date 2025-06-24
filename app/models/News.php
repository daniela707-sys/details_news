<?php
class News{
    private $conn;
    private $table_name = "news";
    
    public function __construct($db){
        $this->conn = $db;
    }   

    public function read(){
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }   

    public function readOne($id){
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id); // Index 1
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function readFeatured(){
        $query = "SELECT * FROM " . $this->table_name . " WHERE featured = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readMostViewed() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY views DESC LIMIT 8";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readCategory($category){
        $query = "SELECT * FROM " . $this->table_name . " WHERE Category = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $category);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function readDepartament($departament){
        $query = "SELECT * FROM " . $this->table_name . " WHERE Departament = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $departament);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function increaseViews($id) {
        $query = "UPDATE " . $this->table_name . " SET views = views + 1 WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        return $stmt->execute();
    }

    public function getRecent($limit = 4) {
        $query = "SELECT id, titulo, fecha_publicacion FROM " . $this->table_name . " ORDER BY Date DESC LIMIT ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }



}
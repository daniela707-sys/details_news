<?php
require_once 'app/config/Database.php';
require_once 'app/models/News.php';

if (!isset($_GET['id'])) {
    echo "ID de noticia no especificado.";
    exit;
}

$id = $_GET['id'];

$db = new Database();
$conn = $db->connect();
$newsModel = new News($conn);

// Aumentar las vistas
$newsModel->increaseViews($id);

// Obtener la noticia
$noticia = $newsModel->readOne($id);

if (!$noticia) {
    echo "Noticia no encontrada.";
    exit;
}

// Obtener noticias recientes para mostrar debajo
$stmt = $newsModel->read();
$recientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
$recientes = array_slice($recientes, 0, 4);
?>


<header class="text-white py-4 d-flex justify-content-center align-items-center">
  <div class="container d-flex justify-content-between align-items-center">
    <h1 class="mb-0"><i class="bi bi-newspaper"></i> <?php echo $noticia['Title']; ?></h1>
    
  </div>
</header>
<!-- Breadcrumb de navegación -->
<nav aria-label="breadcrumb" class="container mt-3">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a >Inicio</a></li>
    <li class="breadcrumb-item"><a >Noticias</a></li>
    <li class="breadcrumb-item">
      <a href="noticias.php?categoria=<?php echo urlencode(strtolower($noticia['Category'])); ?>">
        <?php echo ucfirst($noticia['Category']); ?>
      </a>
    </li>
    <li class="breadcrumb-item active" aria-current="page"><?php echo substr($noticia['Title'], 0, 40) . '...'; ?></li>
  </ol>
</nav>

<section class="containerPrincipal">
  <article class="info">
    <h1 class="category bg-success"><?php echo $noticia['Category']; ?></h1>
    <div class="fecha-departamento">
      <span>Fecha: <?php echo $noticia['Date']; ?></span>
      <span>Departamento: <?php echo strtoupper($noticia['Departament']); ?></span>
    </div>
    <hr>
    <h2><?php echo $noticia['Title']; ?></h2>
    <hr>
    <div class="autor">
      <span>Por: <?php echo $noticia['author']; ?></span>
    </div>
    <img class="img-fluid" src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" alt="">
    <div><p><?php echo nl2br($noticia['Description']); ?></p></div>
  </article>

  <article class="masNoticias">
    <h1>Más noticias</h1>
    <div class="recent-articles">
      <div class="articles-list">
        <?php foreach ($recientes as $rec) : ?>
          <div class="article-item" onclick="window.location.href='?id=<?php echo $rec['id']; ?>'">
            <h2 class="article-title"><?php echo $rec['Title']; ?></h2>
            <p class="article-date"><?php echo $rec['Date']; ?></p>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </article>
</section>

# 📰 Módulo de Noticias - Red de Emprendedores SENA

Este proyecto implementa un completo módulo de noticias dinámicas con carruseles filtrables, vista detallada de noticias, modo oscuro, navegación entre noticias y contador de vistas, desarrollado con PHP (MVC), JavaScript y CSS.

---

## 🚀 Funcionalidades principales

- ✅ Carruseles dinámicos de noticias:
  - Noticias destacadas
  - Más leídas
  - Por categoría
  - Por departamento

- ✅ Filtros por categoría y departamento (dinámicos desde base de datos)
- ✅ Vista detallada de la noticia con:
  - Contador de vistas
  - Breadcrumbs de navegación
  - Noticias relacionadas
  - Modo claro / oscuro

- ✅ Diseño responsive y animaciones
- ✅ Backend en PHP (MVC)
- ✅ Comunicación frontend-backend mediante `fetch` (API REST)

---

## 🧱 Estructura del proyecto

/app
│
├── /config → Conexión a base de datos
├── /models → Modelos de datos (News.php)
├── /controllers → Lógica de negocio (NewsController.php)
├── /views → Carrusel y vista detalle (carrusel.php, details_noticia.php)
├── /api → Endpoints para AJAX/fetch (getNewsFeatured.php, etc)
│
/public
├── /css → Estilos (carrusel.css, tema.css)
├── /js → Lógica del carrusel y vista detalle
│
index.php → Página principal


---

## ⚙️ Requisitos

- Servidor local (XAMPP, Laragon, etc.)
- PHP 7.4+
- MySQL/MariaDB
- Navegador moderno

---

## 🛠️ Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/nombre-repo.git

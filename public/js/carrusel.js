// Inicia un carrusel específico (usado para cada sección)
function initNewsCarousel(trackSelector, prevBtnSelector, nextBtnSelector) {
  const track = document.querySelector(trackSelector);
  const prevBtn = document.querySelector(prevBtnSelector);
  const nextBtn = document.querySelector(nextBtnSelector);

  if (!track) return;

  // Usar ResizeObserver para recalcular cuando cambie el tamaño
  const observer = new ResizeObserver(() => setupCarousel());
  observer.observe(track.parentElement);

  function setupCarousel() {
    const cards = track.querySelectorAll('.blog-news-card');
    if (cards.length === 0) return;

    let currentPosition = 0;
    const cardWidth = 300;
    const containerWidth = track.parentElement.offsetWidth;
    const visibleCards = Math.max(1, Math.floor(containerWidth / cardWidth));
    const maxPosition = Math.max(0, cards.length - visibleCards);
    
    // Solo configurar estilos una vez
    if (!track.dataset.initialized) {
      track.style.display = 'flex';
      track.style.transition = 'transform 0.3s ease';
      track.parentElement.style.overflow = 'hidden';
      track.dataset.initialized = 'true';
    }

    function updateCarousel() {
      requestAnimationFrame(() => {
        track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
        
        if (prevBtn) {
          prevBtn.disabled = currentPosition === 0;
          prevBtn.style.opacity = currentPosition === 0 ? '0.5' : '1';
        }
        if (nextBtn) {
          nextBtn.disabled = currentPosition >= maxPosition;
          nextBtn.style.opacity = currentPosition >= maxPosition ? '0.5' : '1';
        }
      });
    }

    function moveNext() {
      if (currentPosition < maxPosition) {
        currentPosition++;
      } else {
        currentPosition = 0; // Loop infinito
      }
      updateCarousel();
    }

    function movePrev() {
      if (currentPosition > 0) {
        currentPosition--;
      } else {
        currentPosition = maxPosition; // Loop infinito
      }
      updateCarousel();
    }

    // Limpiar event listeners anteriores
    const newNextBtn = nextBtn?.cloneNode(true);
    const newPrevBtn = prevBtn?.cloneNode(true);
    
    if (nextBtn && newNextBtn) {
      nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
      newNextBtn.addEventListener('click', moveNext);
    }
    if (prevBtn && newPrevBtn) {
      prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
      newPrevBtn.addEventListener('click', movePrev);
    }
    
    // Gestos táctiles optimizados
    let startX = 0;
    let startTime = 0;
    
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startTime = Date.now();
    };
    
    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endTime = Date.now();
      const diff = endX - startX;
      const duration = endTime - startTime;
      
      // Solo procesar swipes rápidos y con suficiente distancia
      if (Math.abs(diff) > 50 && duration < 300) {
        if (diff < 0) {
          moveNext();
        } else {
          movePrev();
        }
      }
    };
    
    track.removeEventListener('touchstart', handleTouchStart);
    track.removeEventListener('touchend', handleTouchEnd);
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Autoplay mejorado
    let autoplayInterval;
    
    const startAutoplay = () => {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(moveNext, 4000);
    };
    
    const stopAutoplay = () => {
      clearInterval(autoplayInterval);
    };
    
    // Pausar autoplay en hover y focus
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('focusin', stopAutoplay);
    track.addEventListener('focusout', startAutoplay);
    
    // Pausar cuando la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
    
    startAutoplay();
    updateCarousel();
  }
  
  // Inicializar después de un breve delay
  setTimeout(setupCarousel, 50);
}

// Carga noticias destacadas (featured)
function cargarNoticiasCarrusel() {
  fetch('app/api/getNewsFeatured.php')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then(text => {
      console.log('Respuesta destacadas:', text);
      const noticias = JSON.parse(text);
      generarCarruselNoticias(noticias, '#featured-news-carousel', '.blog-news-carousel:nth-child(1)');
    })
    .catch(error => console.error('Error al cargar noticias destacadas:', error));
}

// Cargar categorías y departamentos dinámicamente
function cargarOpcionesFiltro() {
  // Categorías
  fetch('app/api/getCategory.php')
    .then(res => res.json())
    .then(categorias => {
      const select = document.getElementById('category-filter');
      select.innerHTML = '<option value="all">Ver categorías</option>';
      categorias.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.toLowerCase();
        opt.textContent = cat;
        select.appendChild(opt);
      });
    });

  // Departamentos
  fetch('app/api/getDepartament.php')
    .then(res => res.json())
    .then(departamentos => {
      const select = document.getElementById('departament-filter');
      select.innerHTML = '<option value="all">Ver departamentos</option>';
      departamentos.forEach(dep => {
        const opt = document.createElement('option');
        opt.value = dep.toLowerCase();
        opt.textContent = dep;
        select.appendChild(opt);
      });
    });
}

// Cargar noticias por categoría
document.getElementById('category-filter').addEventListener('change', function () {
  const categoria = this.value;
  if (categoria === 'all') return;

  fetch(`app/api/getNewsToCategory.php?categoria=${encodeURIComponent(categoria)}`)
    .then(res => res.json())
    .then(data => {
      generarCarruselNoticias(data, '#category-news-carousel', '.blog-news-carousel:nth-child(3)');
    });
});

// Cargar noticias por departamento
document.getElementById('departament-filter').addEventListener('change', function () {
  const dep = this.value;
  if (dep === 'all') return;

  fetch(`app/api/getNewsToDepartament.php?departamento=${encodeURIComponent(dep)}`)
    .then(res => res.json())
    .then(data => {
      generarCarruselNoticias(data, '#departament-news-carousel', '.blog-news-carousel:nth-child(4)');
    });
});

// Cargar noticias más leídas
function cargarNoticiasMasLeidas() {
  fetch('app/api/getPopularNews.php')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then(text => {
      console.log('Respuesta populares:', text);
      const noticias = JSON.parse(text);
      generarCarruselNoticias(noticias, '#popular-news-carousel', '.blog-news-carousel:nth-child(2)');
    })
    .catch(error => console.error('Error al cargar noticias más leídas:', error));
}

// Función para renderizar tarjetas de noticias en el carrusel
function generarCarruselNoticias(noticias, trackSelector, containerSelector) {
  const track = document.querySelector(trackSelector);
  const container = document.querySelector(containerSelector);
  const cardsTrack = container.querySelector(trackSelector);
  const prevBtn = container.querySelector('.prev');
  const nextBtn = container.querySelector('.next');

  cardsTrack.innerHTML = '';

  noticias.forEach(noticia => {
    const card = document.createElement('article');
    card.classList.add('blog-news-card');

    let imagenUrl = 'https://inkscape.app/wp-content/uploads/imagen-vectorial.webp';
    if (noticia.Image) {
      try {
        const arr = JSON.parse(noticia.Image);
        if (arr[0]?.name) imagenUrl = convertLocalPathToUrl(arr[0].name);
      } catch (e) {
        imagenUrl = convertLocalPathToUrl(noticia.Image);
      }
    }

    card.innerHTML = `
      <div class="blog-news-image">
        <img src="${imagenUrl}" alt="${noticia.Title}">
        <span class="blog-news-category tech" style="color:4e4e4e">${(noticia.Category || 'GENERAL').toUpperCase()}</span>
      </div>
      <div class="blog-news-content">
        <div class="blog-news-meta">
          <div class="blog-news-author-avatar">${getAuthorInitials(noticia.Author)}</div>
          <span>${noticia.Author || 'Admin'}</span>
        </div>
        <h4 class="blog-news-title-text">${noticia.Title}</h4>
        <p class="blog-news-excerpt">${noticia.Principal_Description ? noticia.Principal_Description.substring(0, 120) + '...' : 'Sin descripción disponible'}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `?id=${noticia.id}`;
    });

    cardsTrack.appendChild(card);
  });

  // Iniciar carrusel
  initNewsCarousel(trackSelector, containerSelector + ' .prev', containerSelector + ' .next');
}




// Funciones auxiliares
function convertLocalPathToUrl(path) {
  return path.startsWith('http') ? path : `public/uploads/${path}`;
}

function getAuthorInitials(author) {
  if (!author) return 'A';
  return author.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
}

// Cargar todos los carruseles cuando se cargue la página
window.addEventListener('DOMContentLoaded', () => {
  cargarNoticiasCarrusel();       // Noticias destacadas
  cargarNoticiasMasLeidas();      // Noticias más leídas
  cargarOpcionesFiltro();         // Filtros dinámicos
});

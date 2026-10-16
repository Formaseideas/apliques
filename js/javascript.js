/* ==========================================
   FORMAS E IDEAS - SCRIPT LIGHT LUXE
   ================================---------- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. BARRA DE CARGA INICIAL (SPLASH SCREEN)
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    let progress = 0;

    const loadInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
            }, 200);
        }
        progressBar.style.width = progress + '%';
    }, 100);

    // 2. MENÚ RESPONSIVE HAMBURGUESA
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => { navMenu.classList.remove('active'); });
    });

    // 3. CARRUSEL "TU MODELO AQUÍ" CON TUS 4 IMÁGENES OFICIALES
    const promoSlider = document.getElementById('promoSlider');
    const promoSlides = document.querySelectorAll('.promo-slide');
    const promoPrev = document.getElementById('promoPrev');
    const promoNext = document.getElementById('promoNext');
    const promoDotsContainer = document.getElementById('promoDots');

    let promoIndex = 0;
    let promoTimer;

    // Crear puntos de navegación del carrusel
    promoSlides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('promo-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToPromoSlide(idx));
        promoDotsContainer.appendChild(dot);
    });

    const promoDots = document.querySelectorAll('.promo-dot');

    function updatePromoSlider() {
        promoSlider.style.transform = `translateX(-${promoIndex * 100}%)`;
        promoDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === promoIndex);
        });
    }

    function nextPromoSlide() {
        promoIndex = (promoIndex + 1) % promoSlides.length;
        updatePromoSlider();
    }

    function prevPromoSlide() {
        promoIndex = (promoIndex - 1 + promoSlides.length) % promoSlides.length;
        updatePromoSlider();
    }

    function goToPromoSlide(idx) {
        promoIndex = idx;
        updatePromoSlider();
        resetPromoTimer();
    }

    promoNext.addEventListener('click', () => { nextPromoSlide(); resetPromoTimer(); });
    promoPrev.addEventListener('click', () => { prevPromoSlide(); resetPromoTimer(); });

    function startPromoTimer() { promoTimer = setInterval(nextPromoSlide, 5000); }
    function resetPromoTimer() { clearInterval(promoTimer); startPromoTimer(); }

    startPromoTimer();

    // 4. FORMULARIO DE CONTACTO
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('cName').value;
            alert(`¡Gracias por escribirnos, ${name}!\nHemos recibido tu solicitud y un asesor de Formas e Ideas te contactará a la brevedad.`);
            contactForm.reset();
        });
    }
});

//NOTA PARA CUALQUEIR CAMBIO ES NECESARIO GUARDAR EL ARCHIVO ORIGINAL Y EXPERIEMTNAR CON LA COPIA
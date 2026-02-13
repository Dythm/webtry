// --- CONFIGURACIÓN DE COMPONENTES ---
function loadComponent(id, file) {
    return fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Error cargando ${file}`);
            return response.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (id === 'nav-placeholder') {
                highlightActiveLink();
                initBurgerMenu(); // <--- IMPORTANTE: Inicializar el burger DESPUÉS de cargar el nav
            }
        })
        .catch(err => console.error(err));
}

// Resaltar la página actual
function highlightActiveLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active-link');
        }
    });
}

// Lógica del Menú Burger (Movida aquí para que encuentre los elementos)
function initBurgerMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle'); // Animación opcional de la X
        });
    }
}

// --- LÓGICA DEL SLIDER ---
function startSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    if (!slider || slides.length === 0) return;

    function moveSlider(index) {
        // Movemos el contenedor entero multiplicando el índice por -100%
        slider.style.transform = `translateX(-${index * 100}%)`;
        
        // Actualizamos los puntos (dots)
        dots.forEach(d => d.classList.remove('active'));
        if(dots[index]) dots[index].classList.add('active');
        
        currentSlide = index;
    }

    // Cambio automático
    let slideInterval = setInterval(() => {
        let next = (currentSlide + 1) % slides.length;
        moveSlider(next);
    }, 5000);

    // Click en los puntos
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval); // Detenemos el auto-cambio al hacer click
            moveSlider(idx);
            // Reiniciamos el intervalo después de la interacción
            slideInterval = setInterval(() => {
                let next = (currentSlide + 1) % slides.length;
                moveSlider(next);
            }, 5000);
        });
    });
}

// --- EVENTOS DE SCROLL Y FORMULARIO ---
// Estos pueden ir fuera porque el objeto 'window' o el ID 'contact-form' 
// se manejan cuando el DOM ya está listo o por delegación.

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 5%';
            navbar.style.background = '#fff';
        } else {
            navbar.style.padding = '1rem 5%';
        }
    }
});

// --- INICIALIZACIÓN TOTAL ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar componentes
    Promise.all([
        loadComponent("nav-placeholder", "nav.html"),
        loadComponent("footer-placeholder", "footer.html")
    ]).then(() => {
        // 2. Una vez cargado el HTML externo, iniciamos el slider
        startSlider();
    });

    // 3. Manejo del formulario (si existe en la página actual)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('¡Gracias por contactarnos! Te responderemos a la brevedad.');
            this.reset();
        });
    }
});

// Funciones para la Galería de Proyectos
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Evita scroll al estar abierto
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Devuelve el scroll
}

const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Alternar Menú
        nav.classList.toggle('nav-active');

        // Animación Burger
        burger.classList.toggle('toggle');

        // Animación de Links (opcional, para que aparezcan suave)
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });
}

navSlide();


// Función para animar los contadores
const startCounters = () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Cuanto más alto, más lenta la animación

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target'); // El número final
            const count = +counter.innerText; // El número actual

            // Calculamos el incremento
            const inc = target / speed;

            if (count < target) {
                // Sumamos el incremento y redondeamos hacia arriba
                counter.innerText = Math.ceil(count + inc);
                // Llamamos a la función de nuevo cada 10 milisegundos
                setTimeout(updateCount, 20);
            } else {
                // Si ya llegó o se pasó, fijamos el número final exacto
                counter.innerText = target + (target === 15 || target === 200 || target === 50 ? '+' : '');
            }
        };

        updateCount();
    });
};

// Intersection Observer para disparar la animación solo cuando se vea la sección
const statsSection = document.querySelector('.stats-bar');

const observerOptions = {
    threshold: 0.5 // Se dispara cuando el 50% de la sección es visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounters();
            observer.unobserve(entry.target); // Deja de observar para que no se repita
        }
    });
}, observerOptions);

if (statsSection) {
    observer.observe(statsSection);
}

const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 150; // Distancia para activarse

        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', reveal);
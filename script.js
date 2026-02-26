// --- 1. CONFIGURACIÓN Y CARGA DE COMPONENTES ---
const loadComponent = (id, file) => {
    return fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Error cargando ${file}`);
            return response.text();
        })
        .then(data => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = data;
                if (id === 'nav-placeholder') {
                    highlightActiveLink();
                    initBurgerMenu();
                }
            }
        })
        .catch(err => console.error("Error en componentes:", err));
};

const highlightActiveLink = () => {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active-link');
        }
    });
};

// --- 2. NAVEGACIÓN Y MENÚ ---
const initBurgerMenu = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');

            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }
};

// --- 3. ANIMACIONES DE APARICIÓN (REVEAL) ---
const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    reveals.forEach(el => {
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
};

// --- 4. CONTADORES DE ESTADÍSTICAS ---
const startCounters = () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target + (target === 30 || target === 100 ? '+' : '');
            }
        };
        updateCount();
    });
};

// --- 5. LÓGICA DEL SLIDER ---
const startSlider = () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    if (!slider || slides.length === 0) return;

    const moveSlider = (index) => {
        slider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
        currentSlide = index;
    };

    let slideInterval = setInterval(() => {
        let next = (currentSlide + 1) % slides.length;
        moveSlider(next);
    }, 5000);

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            moveSlider(idx);
        });
    });
};

// --- 6. INICIALIZACIÓN GENERAL ---
document.addEventListener("DOMContentLoaded", () => {
    // Ejecutar Reveal al cargar para mostrar lo que ya está en pantalla
    initBurgerMenu();
    highlightActiveLink()
    reveal();

    // Cargar Navbar y Footer si tienes los placeholders
    Promise.all([
        loadComponent("nav-placeholder", "nav.html"),
        loadComponent("footer-placeholder", "footer.html")
    ]).then(() => {
        startSlider();
    });

    // Observer para las estadísticas
    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // Scroll Events
    window.addEventListener('scroll', () => {
        reveal(); // Ejecutar animaciones al hacer scroll
        
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = '#fff';
                navbar.style.padding = '0.5rem 5%';
            } else {
                navbar.style.padding = '1rem 5%';
            }
        }
    });
});

// Lightbox (Global para que funcione con onclick del HTML)
window.openLightbox = (src) => {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if(lightbox && img) {
        img.src = src;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.closeLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Manejo del estado de envío en el formulario de empleo
document.addEventListener("DOMContentLoaded", () => {
    const jobForm = document.querySelector('.main-form');
    const submitBtn = document.querySelector('#submit-btn');

    if (jobForm && submitBtn) {
        jobForm.addEventListener('submit', function() {
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            // Cambiar estado del botón
            submitBtn.classList.add('loading');
            btnText.textContent = "ENVIANDO...";
            btnLoader.style.display = "inline-block";
            
            // El formulario seguirá su curso natural hacia Web3Forms
        });
    }
});
const moveSlider = (index) => {
    // Usamos backticks para asegurar que el cálculo sea exacto
    slider.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
};
window.addEventListener('resize', () => {
    // Esto resetea la posición del slider al redimensionar la pantalla
    const slider = document.querySelector('.slider');
    if(slider) slider.style.transform = `translateX(-${currentSlide * 100}%)`;
});
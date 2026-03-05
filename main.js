/* ─────────────────────────────────────────────────────
   main.js — Portfolio Nazim Hamia  v4.0
───────────────────────────────────────────────────── */

// ── Year ──────────────────────────────────────────────
const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();

// ── Header scroll effect ──────────────────────────────
const header = document.querySelector('.site-header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
}

// ── Theme toggle ──────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const THEME_KEY = 'nh-theme';

const applyTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    if (themeIcon) {
        themeIcon.className = theme === 'dark'
            ? 'fa-solid fa-sun'
            : 'fa-solid fa-moon';
    }
    localStorage.setItem(THEME_KEY, theme);
};

// Restaurer le thème sauvegardé
const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// ── Mobile nav ────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navAnchors.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ── Active nav link on scroll ─────────────────────────
const sections = document.querySelectorAll('main section[id]');

if (sections.length && navAnchors.length) {
    const activeObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navAnchors.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        });
    }, { threshold: 0.38 });
    sections.forEach(s => activeObs.observe(s));
}

// ── Reveal on scroll + intro stagger ──────────────────
const revealEls = Array.from(document.querySelectorAll('.reveal'));
if (revealEls.length) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        revealEls.forEach(el => el.classList.add('visible'));
    } else {
        const aboveFoldLimit = window.innerHeight * 0.92;
        const initiallyVisible = revealEls
            .filter(el => el.getBoundingClientRect().top <= aboveFoldLimit)
            .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

        initiallyVisible.forEach((el, index) => {
            el.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
            el.dataset.revealDone = 'true';
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                initiallyVisible.forEach(el => el.classList.add('visible'));
            });
        });

        const revealObs = new IntersectionObserver((entries, obs) => {
            const batch = entries
                .filter(entry => entry.isIntersecting && !entry.target.dataset.revealDone)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            batch.forEach((entry, index) => {
                const el = entry.target;
                const configuredDelay = getComputedStyle(el).getPropertyValue('--reveal-delay').trim();

                if (!configuredDelay) {
                    el.style.setProperty('--reveal-delay', `${Math.min(index * 45, 135)}ms`);
                }

                el.classList.add('visible');
                el.dataset.revealDone = 'true';
                obs.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        revealEls.forEach(el => {
            if (!el.dataset.revealDone) {
                revealObs.observe(el);
            }
        });
    }
}

// ── Form contact AJAX + Popup ─────────────────────────
const contactForm = document.querySelector('.contact-form');
const popupOverlay = document.getElementById('popupOverlay');
const popupContent = document.getElementById('popupContent');
const popupIcon = document.getElementById('popupIcon');
const popupTitle = document.getElementById('popupTitle');
const popupMessage = document.getElementById('popupMessage');
const popupClose = document.getElementById('popupClose');

if (contactForm && popupOverlay) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Envoi...';

        try {
            const response = await fetch('index.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            // Configure popup based on result
            if (data.success) {
                popupIcon.className = 'popup-icon success';
                popupIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
                popupTitle.textContent = 'Message envoyé !';
                popupMessage.textContent = 'Je vous répondrai rapidement.';
                contactForm.reset();
            } else {
                popupIcon.className = 'popup-icon error';
                popupIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
                popupTitle.textContent = 'Erreur';
                popupMessage.textContent = data.message || 'Une erreur est survenue.';
            }

            // Show popup
            popupOverlay.classList.add('active');
            popupContent.classList.add('show');

        } catch (error) {
            popupIcon.className = 'popup-icon error';
            popupIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
            popupTitle.textContent = 'Erreur';
            popupMessage.textContent = 'Une erreur de connexion est survenue.';
            popupOverlay.classList.add('active');
            popupContent.classList.add('show');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Close popup handlers
    popupClose.addEventListener('click', () => {
        popupContent.classList.remove('show');
        popupOverlay.classList.remove('active');
    });

    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupContent.classList.remove('show');
            popupOverlay.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
            popupContent.classList.remove('show');
            popupOverlay.classList.remove('active');
        }
    });
}

/* ============================================================
   main.js — Global site behaviour
   ============================================================ */

// ── Loading screen ──────────────────────────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('loading');
    if (loader) {
        setTimeout(() => loader.classList.add('hidden'), 1200);
    }
    // Trigger hero zoom
    const hero = document.querySelector('.hero');
    if (hero) setTimeout(() => hero.classList.add('loaded'), 50);
});

// ── Sticky Navbar ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

// ── Hamburger Menu ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
const mobileLinks = document.querySelectorAll('#mobile-menu a');

function toggleMenu(open) {
    hamburger && hamburger.classList.toggle('open', open);
    if (mobileMenu) {
        mobileMenu.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }
}

hamburger && hamburger.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
mobileClose && mobileClose.addEventListener('click', () => toggleMenu(false));
mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

// ── Scroll-triggered animations ──────────────────────────────
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ── Counter animation ────────────────────────────────────────
function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 1800;
    const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const suffix = el.dataset.suffix || '';
                animateCounter(el, target, suffix);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
}

document.addEventListener('DOMContentLoaded', initCounters);

// ── Active nav link highlighting ─────────────────────────────
function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentPath || (currentPath === '' && href === 'index.html'));
    });
}
document.addEventListener('DOMContentLoaded', setActiveNav);

// ── Testimonials auto-scroll ─────────────────────────────────
let testimonialIdx = 0;
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.tslide');
    const dots = document.querySelectorAll('.tdot');
    if (!slides.length) return;

    function goTo(idx) {
        slides.forEach((s, i) => s.classList.toggle('active', i === idx));
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        testimonialIdx = idx;
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
    setInterval(() => goTo((testimonialIdx + 1) % slides.length), 5000);
}
document.addEventListener('DOMContentLoaded', initTestimonialSlider);

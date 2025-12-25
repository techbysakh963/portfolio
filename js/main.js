/**
 * Portfolio Main JavaScript
 * Handles animations, interactivity, language switching, and the geometric background
 */

// ===== Geometric Background Animation =====
class GeometricBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.lines = [];
        this.mouse = { x: null, y: null };
        this.animationId = null;

        this.config = {
            particleCount: 80,
            particleSize: { min: 1, max: 3 },
            lineDistance: 150,
            speed: 0.3,
            colors: {
                particle: 'rgba(6, 182, 212, 0.6)',
                line: 'rgba(6, 182, 212, 0.15)',
                accent: 'rgba(16, 185, 129, 0.4)'
            }
        };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
                speedX: (Math.random() - 0.5) * this.config.speed,
                speedY: (Math.random() - 0.5) * this.config.speed,
                isAccent: Math.random() > 0.8
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.isAccent ? this.config.colors.accent : this.config.colors.particle;
        this.ctx.fill();
    }

    drawLine(p1, p2, distance) {
        const opacity = 1 - (distance / this.config.lineDistance);
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.15})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
    }

    updateParticle(particle) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
            particle.speedY *= -1;
        }

        if (this.mouse.x && this.mouse.y) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.x -= dx * force * 0.02;
                particle.y -= dy * force * 0.02;
            }
        }
    }

    animate() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#0a0a0f');
        gradient.addColorStop(0.5, '#0a1015');
        gradient.addColorStop(1, '#0a0f14');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGeometricShapes();

        this.particles.forEach((particle, i) => {
            this.updateParticle(particle);
            this.drawParticle(particle);

            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = particle.x - this.particles[j].x;
                const dy = particle.y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.lineDistance) {
                    this.drawLine(particle, this.particles[j], distance);
                }
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawGeometricShapes() {
        const time = Date.now() * 0.0005;

        this.drawHexagon(this.canvas.width * 0.15, this.canvas.height * 0.2, 80, time, 'rgba(6, 182, 212, 0.03)');
        this.drawHexagon(this.canvas.width * 0.85, this.canvas.height * 0.7, 120, -time * 0.7, 'rgba(16, 185, 129, 0.03)');
        this.drawHexagon(this.canvas.width * 0.7, this.canvas.height * 0.15, 60, time * 1.2, 'rgba(59, 130, 246, 0.03)');

        this.drawTriangle(this.canvas.width * 0.2, this.canvas.height * 0.8, 100, time * 0.5, 'rgba(6, 182, 212, 0.02)');
        this.drawTriangle(this.canvas.width * 0.9, this.canvas.height * 0.3, 70, -time * 0.8, 'rgba(16, 185, 129, 0.02)');

        this.drawCircleOutline(this.canvas.width * 0.1, this.canvas.height * 0.5, 150, 'rgba(6, 182, 212, 0.02)');
        this.drawCircleOutline(this.canvas.width * 0.8, this.canvas.height * 0.9, 100, 'rgba(16, 185, 129, 0.02)');
    }

    drawHexagon(x, y, size, rotation, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const px = Math.cos(angle) * size;
            const py = Math.sin(angle) * size;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawTriangle(x, y, size, rotation, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
            const px = Math.cos(angle) * size;
            const py = Math.sin(angle) * size;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawCircleOutline(x, y, size, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
}

// ===== Language Switcher =====
class LanguageSwitcher {
    constructor() {
        this.currentLang = 'en';
        this.buttons = document.querySelectorAll('.lang-btn');
        this.translatableElements = document.querySelectorAll('[data-en]');

        // Arabic typewriter words
        this.wordsEN = [
            'Systems Engineer',
            'DevOps Specialist',
            'Cybersecurity Specialist',
            'Automation Expert'
        ];

        this.wordsAR = [
            'مهندس أنظمة',
            'متخصص DevOps',
            'مختص أمن سيبراني',
            'خبير أتمتة'
        ];

        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => this.switchLanguage(btn.dataset.lang));
        });

        // Check for saved language preference
        const savedLang = localStorage.getItem('portfolio-lang');
        if (savedLang) {
            this.switchLanguage(savedLang);
        }
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('portfolio-lang', lang);

        // Update HTML direction
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update active button
        this.buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update all translatable elements
        this.translatableElements.forEach(el => {
            const text = el.dataset[lang];
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Update typewriter
        if (window.typewriterInstance) {
            window.typewriterInstance.updateWords(lang === 'ar' ? this.wordsAR : this.wordsEN);
        }
    }

    getCurrentWords() {
        return this.currentLang === 'ar' ? this.wordsAR : this.wordsEN;
    }
}

// ===== Navigation =====
class Navigation {
    constructor() {
        this.nav = document.getElementById('nav');
        this.toggle = document.getElementById('mobile-toggle');
        this.links = document.getElementById('nav-links');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());

        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMobile());
        }

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => this.closeMobile());
        });
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    }

    toggleMobile() {
        this.toggle.classList.toggle('active');
        this.links.classList.toggle('active');
        document.body.style.overflow = this.links.classList.contains('active') ? 'hidden' : '';
    }

    closeMobile() {
        this.toggle.classList.remove('active');
        this.links.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== Typewriter Effect =====
class Typewriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = wait;
        this.wordIndex = 0;
        this.text = '';
        this.isDeleting = false;
        this.type();
    }

    updateWords(newWords) {
        this.words = newWords;
        this.wordIndex = 0;
        this.text = '';
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullText = this.words[current];

        if (this.isDeleting) {
            this.text = fullText.substring(0, this.text.length - 1);
        } else {
            this.text = fullText.substring(0, this.text.length + 1);
        }

        this.element.innerHTML = this.text;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.text === fullText) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== Scroll Reveal =====
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.skill-card, .project-card, .contact-card, .about-content, .section-header, .timeline-item, .education-card, .certifications');
        this.init();
    }

    init() {
        this.elements.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }
}

// ===== Counter Animation =====
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animate(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };

        update();
    }
}

// ===== Project Filters =====
class ProjectFilters {
    constructor() {
        this.buttons = document.querySelectorAll('.filter-btn');
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => this.filter(btn));
        });
    }

    filter(btn) {
        const filter = btn.getAttribute('data-filter');

        this.buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.cards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ===== Smooth Scroll =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: position,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize geometric background
    const canvas = document.getElementById('geometric-bg');
    if (canvas) {
        new GeometricBackground(canvas);
    }

    // Initialize language switcher
    const langSwitcher = new LanguageSwitcher();

    // Initialize navigation
    new Navigation();

    // Initialize typewriter
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const words = langSwitcher.getCurrentWords();
        window.typewriterInstance = new Typewriter(typewriterEl, words, 2000);
    }

    // Initialize scroll reveal
    new ScrollReveal();

    // Initialize counter animation
    new CounterAnimation();

    // Initialize project filters
    new ProjectFilters();

    // Initialize smooth scroll
    new SmoothScroll();

    // Log welcome message
    console.log('%c Welcome to Salah Khatib\'s Portfolio! ', 'background: linear-gradient(135deg, #06b6d4, #10b981); color: white; padding: 10px 20px; border-radius: 5px; font-size: 14px;');
});


// ===== Performance: Disable animations if reduced motion preferred =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-smooth', '0s');
}

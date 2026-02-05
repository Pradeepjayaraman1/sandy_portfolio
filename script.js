document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');

    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');

            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            burger.classList.toggle('toggle');
        });
    }

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (document.querySelector(targetId)) {
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            }

            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                if (burger) burger.classList.remove('toggle');
                navLinks.forEach(l => l.style.animation = '');
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('section');
    const options = { threshold: 0.12 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, options);

    revealElements.forEach(element => {
        element.classList.add('reveal');
        observer.observe(element);
    });

    // Header shadow & back-to-top visibility
    const header = document.getElementById('main-header');
    const backBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
        if (backBtn) backBtn.classList.toggle('visible', window.scrollY > 300);
    });

    if (backBtn) backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Download resume (opens resume.pdf if present)
    const downloadBtn = document.getElementById('download-resume');
    if (downloadBtn) downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const resume = 'resume.pdf';
        window.open(resume, '_blank');
    });

    // WhatsApp send button (quick send)
    const waBtn = document.getElementById('whatsapp-send');
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            const name = document.getElementById('name') ? document.getElementById('name').value : '';
            const email = document.getElementById('email') ? document.getElementById('email').value : '';
            const message = document.getElementById('message') ? document.getElementById('message').value : '';
            const whatsappNumber = '919655900911';
            const prefilledMessage = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Avatar fallback: if image fails to load, show inline SVG fallback
    const heroImg = document.getElementById('hero-photo');
    const avatarFallback = document.querySelector('.avatar-fallback');
    const avatarInput = document.getElementById('avatar-input');
    const avatarBtn = document.getElementById('avatar-upload-btn');

    // Load persisted avatar (data URL) if user uploaded previously
    try {
        const stored = localStorage.getItem('profileAvatarDataUrl');
        if (stored && heroImg) {
            heroImg.src = stored;
            heroImg.style.display = 'block';
            if (avatarFallback) avatarFallback.style.display = 'none';
        }
    } catch (err) { /* ignore */ }

    if (avatarBtn && avatarInput && heroImg) {
        avatarBtn.addEventListener('click', () => avatarInput.click());
        avatarInput.addEventListener('change', (e) => {
            const file = (e.target.files && e.target.files[0]) || null;
            if (!file) return;
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result;
                heroImg.src = dataUrl;
                heroImg.style.display = 'block';
                if (avatarFallback) avatarFallback.style.display = 'none';
                try { localStorage.setItem('profileAvatarDataUrl', dataUrl); } catch (err) { /* ignore */ }
            };
            reader.readAsDataURL(file);
        });
    }

    if (heroImg) {
        const showFallback = () => {
            // try svg placeholder first
            if (heroImg.src && heroImg.src.indexOf('avatar.png') !== -1) {
                heroImg.src = 'assets/avatar.svg';
                // if still fails, hide and show inline fallback after a short wait
                setTimeout(() => {
                    if (heroImg.naturalWidth === 0) {
                        heroImg.style.display = 'none';
                        if (avatarFallback) avatarFallback.style.display = 'block';
                    }
                }, 200);
                return;
            }
            heroImg.style.display = 'none';
            if (avatarFallback) avatarFallback.style.display = 'block';
        };
        heroImg.addEventListener('error', showFallback);
        // Some servers return 404 but image may be 'complete' — check naturalWidth
        heroImg.addEventListener('load', () => {
            if (heroImg.naturalWidth === 0) showFallback();
        });
        if (heroImg.complete && heroImg.naturalWidth === 0) showFallback();
    }
    // Remove any lingering Live Demo link if present
    document.querySelectorAll('.project-links a').forEach(a => {
        if (a.textContent && a.textContent.toLowerCase().includes('live demo')) a.remove();
    });
});


// Contact form handler — try Formspree if configured, otherwise open WhatsApp
(function() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name') ? document.getElementById('name').value : (this.elements['name'] && this.elements['name'].value) || '';
        const email = document.getElementById('email') ? document.getElementById('email').value : (this.elements['email'] && this.elements['email'].value) || '';
        const message = document.getElementById('message') ? document.getElementById('message').value : (this.elements['message'] && this.elements['message'].value) || '';
        const whatsappNumber = '919655900911';
        const prefilledMessage = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledMessage}`;

        const action = contactForm.getAttribute('action') || '';
        if (action.includes('formspree') && action.indexOf('{your-form-id}') === -1) {
            // Looks configured — allow normal submission
            contactForm.submit();
            return;
        }
        // Otherwise fallback to WhatsApp
        window.open(whatsappUrl, '_blank');
    });
})();
// ===== Typing + Deleting Role Animation (Loop) =====
const roles = ["Java Full Stack Developer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingElement = document.getElementById("typing-role");

function typeLoop() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        // Typing
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            setTimeout(() => (isDeleting = true), 1200); // pause after typing
        }
    } else {
        // Deleting
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    const speed = isDeleting ? 50 : 90;
    setTimeout(typeLoop, speed);
}

document.addEventListener("DOMContentLoaded", typeLoop);
/* ═══════════════════════════════════════════════════════════════
   luisdantas.studio — Main JS
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initRevealAnimations();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavLink();
  initContactForm();
});

/* ── Reveal on Scroll (Intersection Observer) ────────────────── */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach((el) => observer.observe(el));
}

/* ── Header scroll effect ────────────────────────────────────── */
function initHeaderScroll() {
  const header = document.getElementById('header');

  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ── Mobile menu toggle ──────────────────────────────────────── */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav');

  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  nav.querySelectorAll('.header__link').forEach((link) => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Smooth scroll for anchor links ──────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');

      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ── Active nav link based on scroll position ────────────────── */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--header-height')} 0px -40% 0px`
  });

  sections.forEach((section) => observer.observe(section));
}

/* ── Contact form handling ───────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Basic validation
    const name = form.querySelector('#name').value.trim();
    const contact = form.querySelector('#contact').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !contact || !message) {
      showFormMessage(form, 'Por favor, preencha todos os campos.', 'error');
      return;
    }

    // Show loading
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        showFormMessage(form, 'Mensagem enviada! Respondo em até 24 horas.', 'success');
      } else {
        showFormMessage(form, 'Erro ao enviar. Tente pelo WhatsApp.', 'error');
      }
    } catch {
      showFormMessage(form, 'Erro de conexão. Tente pelo WhatsApp.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showFormMessage(form, message, type) {
  // Remove existing message
  const existing = form.querySelector('.form-message');
  if (existing) existing.remove();

  const el = document.createElement('p');
  el.className = `form-message form-message--${type}`;
  el.textContent = message;
  el.style.cssText = `
    text-align: center;
    font-size: 0.85rem;
    padding: 12px;
    border-radius: 6px;
    margin-top: 8px;
    background: ${type === 'success' ? 'rgba(37, 211, 102, 0.15)' : 'rgba(212, 135, 109, 0.15)'};
    color: ${type === 'success' ? '#25D366' : '#D4876D'};
  `;

  form.appendChild(el);

  setTimeout(() => el.remove(), 5000);
}

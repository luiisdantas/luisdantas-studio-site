/* ═══════════════════════════════════════════════════════════════
   luisdantas.studio — Main JS
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initLoadAnimations();
  initRevealAnimations();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavLink();
  initContactForm();
});

/* ── Load animations (hero — above the fold) ─────────────────── */
function initLoadAnimations() {
  const loadEls = document.querySelectorAll('.reveal--load');

  loadEls.forEach((el, i) => {
    const baseDelay = parseFloat(el.style.transitionDelay) || i * 0.15;
    setTimeout(() => {
      el.classList.add('visible');
    }, baseDelay * 1000 + 80);
  });
}

/* ── Scroll-triggered reveals ────────────────────────────────── */
function initRevealAnimations() {
  const targets = document.querySelectorAll('.reveal:not(.reveal--load), .mask-wipe, .line-mask-parent');

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  targets.forEach((el) => observer.observe(el));
}

/* ── Header scroll effect ────────────────────────────────────── */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
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

  nav.querySelectorAll('.header__link').forEach((link) => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Smooth scroll ───────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');

      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, '', window.location.pathname);
        return;
      }

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          history.replaceState(null, '', window.location.pathname);
        }, 800);
      }
    });
  });

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          history.replaceState(null, '', window.location.pathname);
        }, 800);
      }, 100);
    }
  }
}

/* ── Active nav link ─────────────────────────────────────────── */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--header-height')} 0px -40% 0px`
  });

  sections.forEach((section) => observer.observe(section));
}

/* ── Contact form ────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    const name = form.querySelector('#name').value.trim();
    const contact = form.querySelector('#contact').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !contact || !message) {
      showFormMessage(form, 'Por favor, preencha todos os campos.', 'error');
      return;
    }

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
    background: ${type === 'success' ? 'rgba(37, 211, 102, 0.12)' : 'rgba(212, 135, 109, 0.12)'};
    color: ${type === 'success' ? '#25D366' : '#D4876D'};
  `;

  form.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

// ── Scroll reveal ───────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal], [data-reveal-group]').forEach(el => {
  revealObserver.observe(el);
});

// ── Nav scroll state ───────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Smooth scroll for anchor buttons ──────────────────────────
document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', () => {
    const target = document.getElementById(el.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Hamburger menu ─────────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  const openMenu = () => {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-label', 'Close menu');
  };
  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-label', 'Open menu');
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close when a menu item is tapped
  mobileMenu.querySelectorAll('a, [data-close-menu]').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

  // Close on outside tap
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on scroll
  window.addEventListener('scroll', closeMenu, { passive: true });
}

// ── Back to top ────────────────────────────────────────────────
document.querySelectorAll('.footer__back').forEach(btn => {
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

// ── Password gate ──────────────────────────────────────────────
(function () {
  const CORRECT_PW   = 'marina2024';
  const SESSION_KEY  = 'portfolio_auth';
  const overlay      = document.getElementById('pwOverlay');
  const input        = document.getElementById('pwInput');
  const submitBtn    = document.getElementById('pwSubmit');
  const cancelBtn    = document.getElementById('pwCancel');
  const errorEl      = document.getElementById('pwError');

  if (!overlay) return;

  let pendingHref = null;

  // Open the modal for gated links
  document.querySelectorAll('.work-card--gated').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      pendingHref = card.getAttribute('data-gated-href') || card.getAttribute('href');

      // Already authenticated?
      if (sessionStorage.getItem(SESSION_KEY) === '1') {
        window.location.href = pendingHref;
        return;
      }

      openModal();
    });
  });

  function openModal() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => input && input.focus(), 60);
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    if (input) { input.value = ''; }
    if (errorEl) { errorEl.textContent = ''; }
  }

  function submit() {
    if (!input) return;
    if (input.value.trim() === CORRECT_PW) {
      sessionStorage.setItem(SESSION_KEY, '1');
      closeModal();
      if (pendingHref) window.location.href = pendingHref;
    } else {
      if (errorEl) {
        errorEl.textContent = 'Incorrect password. Please try again.';
      }
      input.value = '';
      input.focus();
    }
  }

  if (submitBtn) submitBtn.addEventListener('click', submit);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
      if (e.key === 'Escape') closeModal();
    });
  }

  // Close on overlay backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
})();

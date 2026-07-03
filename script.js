/* ============================================
   PRO WEB TEAM — Interactions
   Vanilla JS: scroll progress, reveal on scroll,
   parallax, scroll-scrubbed hero text, process line
   ============================================ */

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open-mobile');
    document.body.classList.toggle('nav-open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open-mobile');
      document.body.classList.remove('nav-open');
    });
  });

  /* ---------- nav background on scroll ---------- */
  const nav = document.getElementById('nav');

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- hero title lines reveal ---------- */
  const heroLines = document.querySelectorAll('.hero__title .line[data-progress]');
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.5 });
  heroLines.forEach(el => lineObserver.observe(el));

  /* ---------- process line fill ---------- */
  const processSection = document.getElementById('process');
  const processFill = document.getElementById('processFill');

  /* ---------- parallax layers (work cards + laptop scene) ---------- */
  const parallaxEls = document.querySelectorAll('.parallax-layer, .work-card__visual');

  /* ---------- hero orb parallax ---------- */
  const orb = document.getElementById('orb');
  const progressLine = document.getElementById('progressLine');

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  function update() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    /* nav background */
    if (scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    /* top progress bar */
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressLine.style.width = progress + '%';

    if (!prefersReducedMotion) {
      /* hero orb parallax — drifts slower than scroll */
      if (orb) {
        orb.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
      }

      /* parallax layers — each element moves at its own speed */
      parallaxEls.forEach(el => {
        const speedSource = el.dataset.speed ? el : el.closest('[data-speed]');
        const speed = parseFloat(speedSource?.dataset.speed) || 0.15;
        const rect = el.getBoundingClientRect();
        const centerOffset = rect.top - window.innerHeight / 2;
        el.style.transform = `translateY(${centerOffset * speed * -0.15}px)`;
      });
    }

    /* process scroll-scrub fill */
    if (processSection && processFill) {
      const rect = processSection.getBoundingClientRect();
      const start = window.innerHeight * 0.8;
      const end = -rect.height * 0.5;
      const raw = (start - rect.top) / (start - end);
      const clamped = Math.min(1, Math.max(0, raw));
      processFill.style.width = (clamped * 100) + '%';
    }

    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

})();

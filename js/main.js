/* ============================================================
   GRUPO PANYAGA — Interactions
   Vanilla JS: loader, nav, particles, scroll reveals,
   parallax, timeline progress, music toggle
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), 900);
  });
  // Fallback if load already fired or hangs
  setTimeout(() => loader.classList.add('done'), 3200);

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const onScrollNav = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Hero floating particles ---------- */
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles && !prefersReduced) {
    const foods = ['🍚', '🍗', '🥤', '🍟', '🍜', '🍱', '🥪', '🍎'];
    const count = window.innerWidth < 768 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      const kind = Math.random();
      const size = 10 + Math.random() * 22;
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.setProperty('--dur', (6 + Math.random() * 8) + 's');
      el.style.setProperty('--delay', (-Math.random() * 10) + 's');
      el.style.setProperty('--size', size + 'px');
      if (kind < 0.4) {
        el.className = 'hp hp-food';
        el.textContent = foods[Math.floor(Math.random() * foods.length)];
        el.style.fontSize = size * 1.4 + 'px';
      } else if (kind < 0.65) {
        el.className = 'hp hp-circle';
      } else if (kind < 0.82) {
        el.className = 'hp hp-heart';
        el.textContent = '♥';
      } else {
        el.className = 'hp hp-paper';
      }
      heroParticles.appendChild(el);
    }
  }

  /* ---------- Final section particles ---------- */
  const finalParticles = document.getElementById('finalParticles');
  if (finalParticles && !prefersReduced) {
    const symbols = ['♥', '✦', '❋', '♡'];
    const count = window.innerWidth < 768 ? 16 : 30;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'fp';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.setProperty('--dur', (7 + Math.random() * 9) + 's');
      el.style.setProperty('--delay', (-Math.random() * 12) + 's');
      el.style.setProperty('--size', (10 + Math.random() * 18) + 'px');
      finalParticles.appendChild(el);
    }
  }

  /* ---------- Parallax on hero ---------- */
  const hero = document.getElementById('hero');
  const heroContent = hero ? hero.querySelector('.hero-content') : null;
  if (hero && heroContent && !prefersReduced) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroContent.style.transform = `translateY(${y * 0.25}px)`;
          heroContent.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.9));
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Friendship timeline progress ---------- */
  const progress = document.getElementById('timelineProgress');
  const ftimeline = document.querySelector('.ftimeline-track');
  if (progress && ftimeline) {
    const updateProgress = () => {
      const rect = ftimeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.35;
      let p = (start - rect.top) / (start - end);
      p = Math.min(1, Math.max(0, p));
      progress.style.height = (p * 100) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* ---------- Memory image fallback (missing files) ---------- */
  document.querySelectorAll('.g-item img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const ph = document.createElement('div');
      ph.style.cssText = 'width:100%;aspect-ratio:4/3;background:linear-gradient(135deg,#0066ff,#00aaff);display:flex;align-items:center;justify-content:center;font-size:3rem;';
      ph.textContent = '🍱';
      img.parentElement.insertBefore(ph, img);
    });
  });

  /* ---------- Lightbox for gallery images ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  document.querySelectorAll('.g-item img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---------- Smooth anchor offset for fixed navbar ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset + 8;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Video play/pause on visibility ---------- */
  const video = document.querySelector('.video-frame video');
  if (video) {
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: 0.25 });
    videoObserver.observe(video);
  }

  /* ---------- Card tilt effect (desktop only) ---------- */
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.tcard, .p-card, .member-card, .ft-card, .profile-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
})();

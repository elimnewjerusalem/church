/**
 * ENJC — Shared site scripts
 * Handles: theme toggle, mobile menu, scroll-to-top,
 *          reveal-on-scroll, section entrance animations
 */
(function () {
  'use strict';

  /* ── THEME ──────────────────────────────────────────────── */
  const THEME_KEY = 'enjc-theme';
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };


  /* ── MOBILE MENU (main.css nav-hamburger style) ─────────── */
  function getMenuBtn() { return document.querySelector('.nav-hamburger'); }
  function getMenu()    { return document.getElementById('mobile-menu'); }
  window.toggleMenu = function () {
    const menu = getMenu(); const btn = getMenuBtn();
    if (!menu) return;
    const opening = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', opening);
    if (btn) btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
  };
  function closeMenu() {
    const menu = getMenu(); const btn = getMenuBtn();
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  /* ── MOBILE NAV TOGGLE (mob-toggle / #nav-links style) ──── */
  document.addEventListener('DOMContentLoaded', function () {
    /* Close main.css mobile menu on Escape / outside click */
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', function (e) {
      const menu = getMenu(); const btn = getMenuBtn();
      if (!menu || !menu.classList.contains('is-open')) return;
      if (menu.contains(e.target) || (btn && btn.contains(e.target))) return;
      closeMenu();
    });

    /* mob-toggle / #nav-links style used by individual pages */
    var mobBtn   = document.getElementById('mob-toggle');
    var navLinks = document.getElementById('nav-links');
    if (mobBtn && navLinks) {
      mobBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = navLinks.classList.toggle('mob-open');
        mobBtn.classList.toggle('active', isOpen);
      });
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('mob-open');
          mobBtn.classList.remove('active');
        });
      });
      document.addEventListener('click', function (e) {
        if (!navLinks.classList.contains('mob-open')) return;
        if (navLinks.contains(e.target) || mobBtn.contains(e.target)) return;
        navLinks.classList.remove('mob-open');
        mobBtn.classList.remove('active');
      });
    }

    /* ── SCROLL-TO-TOP ──────────────────────────────────────── */
    const SCROLL_THRESHOLD = 320;
    window.addEventListener('scroll', function () {
      const btn = document.getElementById('scroll-top-btn');
      if (btn) btn.classList.toggle('is-visible', window.scrollY > SCROLL_THRESHOLD);
    }, { passive: true });

    /* ── REVEAL-ON-SCROLL ───────────────────────────────────── */
    /* Handles both .reveal-on-scroll (gallery/other pages) and .reveal (index) */
    var revealEls = document.querySelectorAll('.reveal-on-scroll, .reveal');
    if (revealEls.length) {
      if (!window.IntersectionObserver) {
        revealEls.forEach(function (el) {
          el.classList.add('is-visible', 'visible');
        });
      } else {
        var revealObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('is-visible', 'visible');
              revealObs.unobserve(en.target);
            }
          });
        }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { revealObs.observe(el); });
      }
    }

    /* ── SECTION ENTRANCE ANIMATIONS ───────────────────────── */
    /* Each <section> slides/fades in from bottom as you scroll */
    var sections = document.querySelectorAll('main section');
    if (sections.length && window.IntersectionObserver) {
      var secObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('section-in');
            secObs.unobserve(en.target);
          }
        });
      }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
      sections.forEach(function (sec) {
        if (!sec.classList.contains('hero')) {
          sec.classList.add('section-animate');
          secObs.observe(sec);
        }
      });
    }

    /* ── VIDEO SLIDE-IN ─────────────────────────────────────── */
    /* .about-video slides from outside-left into position */
    var videoEls = document.querySelectorAll('.about-video, .video-embed-wrap');
    if (videoEls.length && window.IntersectionObserver) {
      var vidObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('video-in');
            vidObs.unobserve(en.target);
          }
        });
      }, { threshold: 0.15 });
      videoEls.forEach(function (el) {
        el.classList.add('video-slide');
        vidObs.observe(el);
      });
    }

    /* ── TEXT SIDE SLIDE-IN ─────────────────────────────────── */
    /* .about-text slides from right */
    var textEls = document.querySelectorAll('.about-text');
    if (textEls.length && window.IntersectionObserver) {
      var txtObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('text-in');
            txtObs.unobserve(en.target);
          }
        });
      }, { threshold: 0.15 });
      textEls.forEach(function (el) {
        el.classList.add('text-slide');
        txtObs.observe(el);
      });
    }

  }); /* end DOMContentLoaded */


  /* ── SCROLL-TO-TOP (works before DOMContentLoaded too) ──── */
  window.goTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── SERVICE WORKER ─────────────────────────────────────── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

})();

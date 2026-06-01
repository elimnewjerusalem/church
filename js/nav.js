/**
 * ENJC — Shared Navigation Component
 * Fixes: nav inconsistency across pages, aria-expanded, theme toggle, mobile menu
 * Usage: <script src="js/nav.js"></script> — replaces all hard-coded nav HTML
 *
 * Each page sets window.ENJC_PAGE = 'home' | 'about' | 'ministries' |
 *   'events' | 'gallery' | 'bible' | 'imagegen' | 'contact'
 * before loading this script.
 */
(function () {
  'use strict';

  /* ── Site data ── */
  var PAGES = [
    { id: 'home',       href: 'index.html',      label: 'Home',    icon: 'ti-home' },
    { id: 'about',      href: 'about.html',       label: 'About',   icon: 'ti-info-circle' },
    { id: 'ministries', href: 'ministries.html',  label: 'Ministries', icon: 'ti-heart' },
    { id: 'events',     href: 'events.html',      label: 'Events',  icon: 'ti-calendar' },
    { id: 'gallery',    href: 'gallery.html',     label: 'Gallery', icon: 'ti-photo' },
    { id: 'bible',      href: 'bible.html',       label: 'Bible',   icon: 'ti-book' },
    { id: 'imagegen',   href: 'imagegen.html',    label: 'Cards',   icon: 'ti-cards' },
    { id: 'contact',    href: 'contact.html',     label: 'Contact', icon: 'ti-mail' }
  ];

  /* Bottom mobile nav — 5 most important */
  var MOB_PAGES = ['home', 'about', 'bible', 'events', 'contact'];

  var CURRENT = window.ENJC_PAGE || 'home';

  /* ── Build desktop nav links ── */
  function buildDesktopLinks() {
    return PAGES.map(function (p) {
      var isCurrent = p.id === CURRENT;
      return '<li><a href="' + p.href + '" class="nav-link' +
        (isCurrent ? ' nav-link--active' : '') + '"' +
        (isCurrent ? ' aria-current="page"' : '') +
        '>' + p.label + '</a></li>';
    }).join('');
  }

  /* ── Build mobile dropdown links ── */
  function buildMobileMenu() {
    return PAGES.map(function (p) {
      var isCurrent = p.id === CURRENT;
      return '<a href="' + p.href + '" class="mobile-menu__link' +
        (isCurrent ? ' is-active' : '') + '"' +
        (isCurrent ? ' aria-current="page"' : '') +
        '>' + p.label + '</a>';
    }).join('');
  }

  /* ── Build bottom mobile nav ── */
  function buildBottomNav() {
    return MOB_PAGES.map(function (id) {
      var p = PAGES.filter(function (x) { return x.id === id; })[0];
      if (!p) return '';
      var isCurrent = p.id === CURRENT;
      return '<a href="' + p.href + '" class="mob-item' +
        (isCurrent ? ' active' : '') + '"' +
        (isCurrent ? ' aria-current="page"' : '') +
        ' aria-label="' + p.label + '">' +
        '<i class="ti ' + p.icon + '" aria-hidden="true"></i>' +
        '<span>' + p.label + '</span></a>';
    }).join('');
  }

  /* ── Inject header ── */
  function injectNav() {
    /* Skip if index.html's custom canvas nav is present (flagged with data-custom-nav) */
    if (document.querySelector('[data-custom-nav]')) return;

    /* Remove any pre-existing hardcoded nav/header/mob-nav */
    var old;
    old = document.querySelector('header'); if (old) old.remove();
    old = document.querySelector('#main-nav'); if (old) old.remove();
    old = document.querySelectorAll('.mob-nav'); old.forEach(function(el){ el.remove(); });
    old = document.querySelector('.bottom-nav'); if (old) old.remove();
    old = document.querySelector('.skip-to-content'); if (old) old.remove();

    var skip = '<a href="#main" class="skip-to-content">Skip to main content</a>';

    var header = '<header>' +
      '<nav class="site-nav" id="site-nav" aria-label="Primary navigation">' +
        '<div class="container">' +
          '<a href="index.html" class="nav-logo" aria-label="ENJC home">' +
            '<img src="images/logo/logo.png" class="nav-logo__img" alt="ENJC logo" width="36" height="36"' +
              ' onerror="this.style.display=\'none\'">' +
            '<div>' +
              '<div class="nav-logo__name">ENJC</div>' +
              '<div class="nav-logo__sub">Elim New Jerusalem Church</div>' +
            '</div>' +
          '</a>' +
          '<ul class="nav-links" aria-label="Main navigation">' +
            buildDesktopLinks() +
          '</ul>' +
          '<div class="nav-controls">' +
            '<button class="theme-toggle" id="theme-btn" aria-label="Toggle dark/light theme" aria-pressed="false">' +
              '<div class="theme-toggle__dot"></div>' +
            '</button>' +
            '<a href="https://wa.me/919444345102?text=Hi%2C+I+want+to+visit+ENJC"' +
               ' target="_blank" rel="noopener" class="nav-visit-btn">' +
              'Plan a Visit' +
            '</a>' +
          '</div>' +
          '<button class="nav-hamburger" id="nav-hamburger"' +
            ' aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-menu">' +
            '<span class="nav-hamburger__line"></span>' +
            '<span class="nav-hamburger__line"></span>' +
            '<span class="nav-hamburger__line"></span>' +
          '</button>' +
        '</div>' +
        '<div class="mobile-menu" id="mobile-menu" aria-hidden="true">' +
          buildMobileMenu() +
        '</div>' +
      '</nav>' +
    '</header>';

    var bottomNav = '<nav class="mob-nav" aria-label="Mobile navigation">' +
      '<div class="mob-nav-inner">' + buildBottomNav() + '</div>' +
    '</nav>';

    /* Insert before <body> first child */
    var body = document.body;
    body.insertAdjacentHTML('afterbegin', header + skip);
    body.insertAdjacentHTML('beforeend', bottomNav);
  }

  /* ── Mobile menu toggle ── */
  function initMobileMenu() {
    var btn = document.getElementById('nav-hamburger');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      menu.setAttribute('aria-hidden', String(open));
      btn.classList.toggle('is-open', !open);
      menu.classList.toggle('is-open', !open);
    });

    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        btn.classList.remove('is-open');
        menu.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        btn.classList.remove('is-open');
        menu.classList.remove('is-open');
        btn.focus();
      }
    });
  }

  /* ── Theme toggle ── */
  function initTheme() {
    var stored = localStorage.getItem('enjc-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', stored);

    var btn = document.getElementById('theme-btn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', stored === 'light' ? 'true' : 'false');

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('enjc-theme', next);
      btn.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
    });
  }

  /* ── Scroll to top (shared) ── */
  function initScrollTop() {
    var btn = document.getElementById('scroll-top-btn');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── WhatsApp float ── */
  function injectWAFloat() {
    if (document.querySelector('.wa-float')) return;
    document.body.insertAdjacentHTML('beforeend',
      '<a href="https://wa.me/919444345102" class="wa-float" target="_blank" rel="noopener"' +
      ' aria-label="Chat on WhatsApp"><i class="ti ti-brand-whatsapp" aria-hidden="true"></i></a>' +
      '<button id="scroll-top-btn" class="scroll-top" aria-label="Back to top">' +
      '<i class="ti ti-arrow-up" aria-hidden="true"></i></button>'
    );
  }

  /* ── Reveal on scroll (shared) ── */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!window.IntersectionObserver) {
      els.forEach(function (e) { e.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });
    els.forEach(function (e) { obs.observe(e); });
    /* Safety fallback */
    setTimeout(function () {
      els.forEach(function (e) { e.classList.add('visible'); });
    }, 2000);
  }

  /* ── Run on DOM ready ── */
  function run() {
    injectNav();
    initMobileMenu();
    initTheme();
    injectWAFloat();
    initScrollTop();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

}());

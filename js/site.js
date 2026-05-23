/**
 * ENJC site.js — Global scroll + nav utilities
 */
(function () {
  'use strict';

  /* Scroll-top button */
  var btn = document.getElementById('scroll-top-btn');
  if (btn) {
    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 300);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* mob-toggle (index.html navbar) */
  var mobToggle = document.getElementById('mob-toggle');
  if (mobToggle) {
    mobToggle.addEventListener('click', function () {
      var links = document.querySelector('.nav-links');
      if (links) links.classList.toggle('nav-open');
      mobToggle.setAttribute('aria-expanded',
        mobToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });
  }

  /* Nav scroll shadow */
  var nav = document.querySelector('.navbar, .site-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }
})();

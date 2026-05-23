/**
 * ENJC — Shared site scripts
 * Animations: fade-up · roll-in · wipe-reveal
 */
(function () {
  'use strict';

  /* ── THEME ── */
  const THEME_KEY = 'enjc-theme';
  function applyTheme(t) {
    t === 'light'
      ? document.documentElement.setAttribute('data-theme','light')
      : document.documentElement.removeAttribute('data-theme');
  }
  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
  window.toggleTheme = function () {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'light' ? 'dark' : 'light';
    applyTheme(next); localStorage.setItem(THEME_KEY, next);
  };

  /* ── MOBILE MENU (main.css hamburger) ── */
  function getMenuBtn() { return document.querySelector('.nav-hamburger'); }
  function getMenu()    { return document.getElementById('mobile-menu'); }
  window.toggleMenu = function () {
    const m = getMenu(), b = getMenuBtn(); if (!m) return;
    const opening = !m.classList.contains('is-open');
    m.classList.toggle('is-open', opening);
    if (b) b.setAttribute('aria-expanded', opening ? 'true' : 'false');
  };
  function closeMenu() {
    const m = getMenu(), b = getMenuBtn();
    if (!m || !m.classList.contains('is-open')) return;
    m.classList.remove('is-open');
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  /* ── SCROLL TO TOP ── */
  window.goTop = function () { window.scrollTo({ top:0, behavior:'smooth' }); };

  /* ── SERVICE WORKER ── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function(){});
    });
  }

  /* ══════════════════════════════════════════════════════
     ALL DOM-READY LOGIC
  ══════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {

    /* ── Close menu on Escape / outside click ── */
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeMenu(); });
    document.addEventListener('click', function(e){
      const m = getMenu(), b = getMenuBtn();
      if (!m || !m.classList.contains('is-open')) return;
      if (m.contains(e.target) || (b && b.contains(e.target))) return;
      closeMenu();
    });

    /* ── mob-toggle / #nav-links (per-page mobile nav) ── */
    var mobBtn   = document.getElementById('mob-toggle');
    var navLinks = document.getElementById('nav-links');
    if (mobBtn && navLinks) {
      mobBtn.addEventListener('click', function(e){
        e.stopPropagation();
        var open = navLinks.classList.toggle('mob-open');
        mobBtn.classList.toggle('active', open);
      });
      navLinks.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){
          navLinks.classList.remove('mob-open');
          mobBtn.classList.remove('active');
        });
      });
      document.addEventListener('click', function(e){
        if (!navLinks.classList.contains('mob-open')) return;
        if (navLinks.contains(e.target) || mobBtn.contains(e.target)) return;
        navLinks.classList.remove('mob-open');
        mobBtn.classList.remove('active');
      });
    }

    /* ── Scroll-to-top button ── */
    window.addEventListener('scroll', function(){
      var btn = document.getElementById('scroll-top-btn');
      if (btn) btn.classList.toggle('is-visible', window.scrollY > 320);
    }, { passive:true });

    /* ════════════════════════════════════════════════════
       REVEAL-ON-SCROLL  (.reveal  /  .reveal-on-scroll)
       Legacy class support — used by index.html inline JS
    ════════════════════════════════════════════════════ */
    var legacyEls = document.querySelectorAll('.reveal-on-scroll, .reveal');
    if (legacyEls.length) {
      if (!window.IntersectionObserver) {
        legacyEls.forEach(function(el){ el.classList.add('is-visible','visible'); });
      } else {
        var legObs = new IntersectionObserver(function(entries){
          entries.forEach(function(en){
            if (en.isIntersecting){
              en.target.classList.add('is-visible','visible');
              legObs.unobserve(en.target);
            }
          });
        }, { threshold:0.07, rootMargin:'0px 0px -30px 0px' });
        legacyEls.forEach(function(el){ legObs.observe(el); });
      }
    }

    /* ════════════════════════════════════════════════════
       NEW ANIMATION SYSTEM
       .anim-fade-up  |  .anim-roll-left  |  .anim-roll-right
       .anim-wipe
       All trigger .anim-in on scroll intersection
    ════════════════════════════════════════════════════ */
    if (!window.IntersectionObserver) {
      document.querySelectorAll(
        '.anim-fade-up,.anim-roll-left,.anim-roll-right,.anim-wipe'
      ).forEach(function(el){ el.classList.add('anim-in'); });
      return;
    }

    var animObs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          en.target.classList.add('anim-in');
          animObs.unobserve(en.target);
        }
      });
    }, { threshold:0.08, rootMargin:'0px 0px -30px 0px' });

    document.querySelectorAll(
      '.anim-fade-up,.anim-roll-left,.anim-roll-right,.anim-wipe'
    ).forEach(function(el){ animObs.observe(el); });

  }); /* end DOMContentLoaded */

})();

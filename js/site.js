/**
 * ENJC — Shared site scripts
 * Handles: theme toggle, mobile menu, scroll-to-top visibility
 *
 * Runs immediately as an IIFE so theme is applied before first paint,
 * preventing a flash of the wrong colour scheme.
 */
(function () {
  'use strict';

  /* ── THEME ──────────────────────────────────────────────── */

  const THEME_KEY = 'enjc-theme';

  /** Apply a theme by toggling the data-theme attribute on <html>. */
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Restore saved preference immediately (before paint) to avoid flicker.
  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

  /** Toggle between dark and light; persists choice in localStorage. */
  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };


  /* ── MOBILE MENU ────────────────────────────────────────── */

  function getMenuBtn() { return document.querySelector('.nav-hamburger'); }
  function getMenu()    { return document.getElementById('mobile-menu'); }

  /** Open or close the mobile dropdown menu. Updates aria-expanded. */
  window.toggleMenu = function () {
    const menu = getMenu();
    const btn  = getMenuBtn();
    if (!menu) return;

    const opening = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', opening);

    if (btn) btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
  };

  /** Close the mobile menu (used by outside-click and Escape). */
  function closeMenu() {
    const menu = getMenu();
    const btn  = getMenuBtn();
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  // Wire up close behaviours once DOM is ready.
  document.addEventListener('DOMContentLoaded', function () {
    // Close on Escape key.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Close when clicking anywhere outside the nav (hamburger + menu).
    document.addEventListener('click', function (e) {
      const menu = getMenu();
      const btn  = getMenuBtn();
      if (!menu || !menu.classList.contains('is-open')) return;
      // If click is inside the menu or on the button, don't close.
      if (menu.contains(e.target) || (btn && btn.contains(e.target))) return;
      closeMenu();
    });
  });


  /* ── SCROLL-TO-TOP ──────────────────────────────────────── */

  const SCROLL_THRESHOLD = 320; // px before button appears

  // Show / hide the scroll-to-top button based on scroll position.
  window.addEventListener('scroll', function () {
    const btn = document.getElementById('scroll-top-btn');
    if (btn) btn.classList.toggle('is-visible', window.scrollY > SCROLL_THRESHOLD);
  }, { passive: true });

  /** Smooth-scroll back to the top of the page. */
  window.goTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

})();

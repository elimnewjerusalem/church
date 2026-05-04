/**
 * ENJC Premium Upgrade — Micro Interactions & Scroll Animations
 * Add this AFTER site.js on every page:
 * <script src="js/premium-upgrade.js" defer></script>
 *
 * What it does:
 *   1. Scroll-reveal animation for cards, sections, and key elements
 *   2. Parallax depth on hero image (subtle, non-jarring)
 *   3. Nav gold glow on scroll
 *   4. Scroll-top button opacity
 */

(function () {
  'use strict';

  /* ── 1. SCROLL REVEAL ──────────────────────────────────── */
  const revealTargets = [
    '.card',
    '.section-heading',
    '.section-tag',
    '.section-rule',
    '.section-sub',
    '.btn',
    'blockquote',
    '.grid-2 > *',
    '.grid-3 > *',
    '.grid-4 > *',
    '.divider',
    '.page-hero h1',
    '.page-hero p',
  ].join(', ');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once visible, stop observing
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  // Apply reveal class and observe — skip hero content (has its own CSS animation)
  document.querySelectorAll(revealTargets).forEach((el) => {
    // Don't apply to hero section elements
    if (!el.closest('.hero') && !el.closest('.hero__content')) {
      el.classList.add('enjc-reveal');
      observer.observe(el);
    }
  });

  /* ── 2. NAV SCROLL STATE ───────────────────────────────── */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 30) {
            nav.style.borderBottomColor = 'rgba(232, 168, 37, .18)';
            nav.style.boxShadow = '0 4px 32px rgba(0,0,0,.4)';
          } else {
            nav.style.borderBottomColor = '';
            nav.style.boxShadow = '';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 3. HERO PARALLAX ──────────────────────────────────── */
  const heroImg = document.querySelector('.hero__image');
  if (heroImg && window.matchMedia('(min-width: 768px)').matches) {
    // Only do parallax if user hasn't requested reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      let rafId;
      window.addEventListener('scroll', () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroH = heroImg.closest('.hero')?.offsetHeight || window.innerHeight;
          if (scrollY < heroH) {
            // Subtle: move image only 20% of scroll amount
            heroImg.style.transform = `scale(1.0) translateY(${scrollY * 0.18}px)`;
          }
        });
      }, { passive: true });
    }
  }

  /* ── 4. SCROLL-TOP BUTTON VISIBILITY ───────────────────── */
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
      }
    }, { passive: true });
  }

  /* ── 5. CARD STAGGER DELAY ─────────────────────────────── */
  // Give grid children a staggered reveal delay
  document.querySelectorAll('.grid-3, .grid-2, .grid-4').forEach((grid) => {
    const cards = grid.querySelectorAll('.card, article, li');
    cards.forEach((card, i) => {
      // Override the CSS nth-child with JS for accurate counting
      card.style.transitionDelay = `${i * 0.08}s`;
    });
  });

})();

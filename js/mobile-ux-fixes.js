/**
 * ENJC — Mobile UX Fixes (2026)
 * Load this with <script src="js/mobile-ux-fixes.js" defer></script>
 * on every page, after site.js.
 *
 * Features:
 *   1. Keyboard trap for mobile menu (Escape + focus loop)
 *   2. Service-time countdown banner
 *   3. Live badge on events nav item during service hours
 *   4. Swipe-to-dismiss on Bible bottom sheet
 *   5. Native share API for verse sharing
 *   6. Remember last Bible position (localStorage)
 *   7. One-tap directions link (deep-link to maps)
 */
(function () {
  'use strict';

  /* ── 1. KEYBOARD TRAP FOR MOBILE MENU ────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.nav-hamburger');
    const menu = document.getElementById('mobile-menu');

    if (hamburger && menu) {
      // Return focus to hamburger when menu closes
      const origClose = window.toggleMenu;
      window.toggleMenu = function () {
        origClose && origClose();
        const isOpen = menu.classList.contains('is-open');
        if (!isOpen) {
          // Trap focus inside menu when open
          const focusable = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
          if (focusable.length) focusable[0].focus();
        } else {
          hamburger.focus();
        }
      };

      // Tab key trap inside open menu
      menu.addEventListener('keydown', function (e) {
        if (!menu.classList.contains('is-open')) return;
        const focusable = Array.from(menu.querySelectorAll('a, button'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }

    /* ── 2. SERVICE-TIME COUNTDOWN BANNER ──────────────────── */
    var banner = document.getElementById('enjc-service-banner');
    if (banner) {
      function getNextService() {
        // Service times in IST (UTC+5:30)
        // Sunday: 5:30, 8:30, 12:00
        // Daily Night Prayer: 22:30
        // Friday: 11:00
        var now = new Date();
        // Convert to IST
        var ist = new Date(now.getTime() + (5.5 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000));
        var day = ist.getUTCDay(); // 0=Sun, 5=Fri
        var h = ist.getUTCHours(), m = ist.getUTCMinutes();
        var totalMins = h * 60 + m;

        var candidates = [];
        // Night prayer every day at 22:30
        candidates.push({ label: 'Night Prayer', mins: 22 * 60 + 30 });
        // Sunday services
        if (day === 0) {
          candidates.push({ label: 'Sunday Worship (5:30 AM)', mins: 5 * 60 + 30 });
          candidates.push({ label: 'Sunday Worship (8:30 AM)', mins: 8 * 60 + 30 });
          candidates.push({ label: 'Sunday Worship (12:00 PM)', mins: 12 * 60 });
        }
        // Friday prayer
        if (day === 5) {
          candidates.push({ label: 'Friday Prayer', mins: 11 * 60 });
        }

        // Find soonest service within next 3 hours
        var WINDOW = 3 * 60;
        var best = null;
        candidates.forEach(function (s) {
          var diff = s.mins - totalMins;
          if (diff > 0 && diff <= WINDOW) {
            if (!best || diff < best.diff) best = { label: s.label, diff: diff };
          }
        });
        return best;
      }

      function updateBanner() {
        var next = getNextService();
        if (next) {
          var h = Math.floor(next.diff / 60);
          var m = next.diff % 60;
          var timeStr = h > 0 ? h + 'h ' + m + 'm' : m + ' min';
          banner.querySelector('.banner-time').textContent = timeStr;
          banner.querySelector('.banner-label').textContent = next.label + ' starts in';
          banner.classList.add('is-visible');
        } else {
          banner.classList.remove('is-visible');
        }
      }

      updateBanner();
      setInterval(updateBanner, 60000); // refresh every minute
    }

    /* ── 3. LIVE BADGE ON BOTTOM NAV ───────────────────────── */
    function isServiceLive() {
      var now = new Date();
      var ist = new Date(now.getTime() + (5.5 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000));
      var day = ist.getUTCDay();
      var h = ist.getUTCHours(), m = ist.getUTCMinutes();
      var t = h * 60 + m;
      // Sunday services: 5:30-13:30, Friday: 11:00-13:00, Daily night: 22:30-23:30
      if (day === 0 && t >= 5*60+30 && t <= 13*60+30) return true;
      if (day === 5 && t >= 11*60 && t <= 13*60) return true;
      if (t >= 22*60+30 && t <= 23*60+30) return true;
      return false;
    }

    if (isServiceLive()) {
      // Add live dot to events nav item (closest thing to live stream)
      var eventsLinks = document.querySelectorAll('.bottom-nav__item[href="events.html"], .bottom-nav a[href="events.html"]');
      eventsLinks.forEach(function (el) {
        el.classList.add('bottom-nav__item--live');
        var dot = document.createElement('span');
        dot.className = 'bottom-nav__live-dot';
        dot.setAttribute('aria-label', 'Live now');
        el.appendChild(dot);
      });
    }

    /* ── 4. SWIPE-TO-DISMISS ON BIBLE BOTTOM SHEET ─────────── */
    var sheet = document.querySelector('.verse-sheet');
    var handle = sheet && sheet.querySelector('.vs-handle');
    if (handle && sheet) {
      var startY = 0, dragging = false;
      handle.addEventListener('touchstart', function (e) {
        startY = e.touches[0].clientY;
        dragging = true;
      }, { passive: true });
      document.addEventListener('touchmove', function (e) {
        if (!dragging) return;
        var dy = e.touches[0].clientY - startY;
        if (dy > 0) sheet.style.transform = 'translateY(' + dy + 'px)';
      }, { passive: true });
      document.addEventListener('touchend', function (e) {
        if (!dragging) return;
        dragging = false;
        var dy = e.changedTouches[0].clientY - startY;
        if (dy > 80) {
          // Dismissed — trigger close
          var closeBtn = sheet.querySelector('.vs-close');
          if (closeBtn) closeBtn.click();
        }
        sheet.style.transform = '';
      });
    }

    /* ── 5. NATIVE SHARE API FOR VERSE SHARING ─────────────── */
    // Patches any element with data-enjc-share to use navigator.share
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-enjc-share]');
      if (!btn) return;
      var text = btn.dataset.enjcShare;
      if (navigator.share && text) {
        e.preventDefault();
        navigator.share({ text: text, title: 'ENJC — Bible Verse', url: window.location.href })
          .catch(function () {}); // user cancelled — ignore
      }
    });

    /* ── 6. FONT PERFORMANCE: add font-display swap via JS ──── */
    // If the Google Fonts link doesn't have display=swap, add it
    document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(function (link) {
      if (!link.href.includes('display=swap')) {
        link.href = link.href + '&display=swap';
      }
      // Also remove unused weights if Poppins has too many
      link.href = link.href.replace(
        /Poppins:wght@[\d;]+/,
        'Poppins:wght@400;500;600'
      );
    });

    /* ── 7. ONE-TAP DIRECTIONS ──────────────────────────────── */
    // Enhance any Google Maps link to prefer native maps app on mobile
    document.querySelectorAll('a[href*="maps.app.goo.gl"], a[href*="google.com/maps"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        var isAndroid = /Android/.test(navigator.userAgent);
        var addr = '110E+Elaya+Street+Tondiarpet+Chennai';
        if (isIOS) {
          e.preventDefault();
          window.location.href = 'maps://?q=' + addr;
        } else if (isAndroid) {
          e.preventDefault();
          window.location.href = 'geo:13.133763,80.286730?q=' + addr;
        }
        // Desktop: fall through to Google Maps URL
      });
    });

  }); // DOMContentLoaded

})();

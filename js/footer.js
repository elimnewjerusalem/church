/**
 * ENJC — Shared Footer Component
 * Fixes: duplicated footer HTML, inconsistent social links, missing service times
 *
 * Usage: Add <div id="enjc-footer"></div> before </body>
 * then load this script.  nav.js handles injection automatically
 * if window.ENJC_NO_FOOTER is not set.
 */
(function () {
  'use strict';

  var FOOTER_HTML =
    '<footer class="footer" id="enjc-footer-el" role="contentinfo">' +
    '<div class="footer-grid container">' +

      /* Col 1 — Brand */
      '<div class="footer-brand">' +
        '<div class="footer-brand-name">ENJC · Elim New Jerusalem Church</div>' +
        '<div class="footer-tagline">"Because you are precious in my sight" — Isaiah 43:4</div>' +
        '<address class="footer-addr">' +
          'No.110E, Elaya Street<br>' +
          'Tondiarpet, Chennai – 600 081<br>' +
          '<a href="tel:+919444345102">+91 94443 45102</a>' +
        '</address>' +
        '<div class="footer-social">' +
          '<a href="https://www.youtube.com/@enjcmedia" class="social-icon" target="_blank" rel="noopener" aria-label="YouTube"><i class="ti ti-brand-youtube" aria-hidden="true"></i></a>' +
          '<a href="https://www.instagram.com/elimnewjerusalemchurch" class="social-icon" target="_blank" rel="noopener" aria-label="Instagram"><i class="ti ti-brand-instagram" aria-hidden="true"></i></a>' +
          '<a href="https://www.facebook.com/enjcmedia" class="social-icon" target="_blank" rel="noopener" aria-label="Facebook"><i class="ti ti-brand-facebook" aria-hidden="true"></i></a>' +
          '<a href="https://wa.me/919444345102" class="social-icon" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="ti ti-brand-whatsapp" aria-hidden="true"></i></a>' +
        '</div>' +
      '</div>' +

      /* Col 2 — Quick Links */
      '<nav aria-label="Footer quick links">' +
        '<div class="footer-col-title">Quick Links</div>' +
        '<ul class="footer-links">' +
          '<li><a href="index.html">Home</a></li>' +
          '<li><a href="about.html">About</a></li>' +
          '<li><a href="ministries.html">Ministries</a></li>' +
          '<li><a href="events.html">Events</a></li>' +
          '<li><a href="gallery.html">Gallery</a></li>' +
          '<li><a href="contact.html">Contact</a></li>' +
        '</ul>' +
      '</nav>' +

      /* Col 3 — Bible Tools */
      '<nav aria-label="Footer Bible tools">' +
        '<div class="footer-col-title">Bible Tools</div>' +
        '<ul class="footer-links">' +
          '<li><a href="bible.html">Bible Reader</a></li>' +
          '<li><a href="imagegen.html">Scripture Cards</a></li>' +
          '<li><a href="events.html">Watch Live</a></li>' +
        '</ul>' +
      '</nav>' +

      /* Col 4 — Service Times (canonical — 12:00 PM) */
      '<div>' +
        '<div class="footer-col-title">Service Times</div>' +
        '<ul class="footer-links">' +
          '<li>Sunday · 5:30 / 8:30 AM / <strong>12:00 PM</strong></li>' +
          '<li>Tuesday · 11:00 AM – 4:00 PM</li>' +
          '<li>Friday · 11:00 AM – 1:30 PM</li>' +
          '<li>Night Prayer · 10:30 PM Daily</li>' +
          '<li>Promise · 1st of every month</li>' +
        '</ul>' +
      '</div>' +

    '</div>' +
    '<div class="footer-bottom">' +
      '<span>© 2026 Elim New Jerusalem Church, Chennai. All rights reserved.</span>' +
      '<span>Built with ❤️ for the Kingdom of God</span>' +
    '</div>' +
    '</footer>';

  function injectFooter() {
    if (window.ENJC_NO_FOOTER) return;
    /* Don't double-inject */
    if (document.getElementById('enjc-footer-el')) return;
    /* Find existing footer and replace, or append before mob-nav */
    var existing = document.querySelector('footer.footer');
    if (existing) {
      existing.outerHTML = FOOTER_HTML;
    } else {
      var mobNav = document.querySelector('.mob-nav');
      if (mobNav) {
        mobNav.insertAdjacentHTML('beforebegin', FOOTER_HTML);
      } else {
        document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }

}());

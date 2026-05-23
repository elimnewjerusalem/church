/**
 * ENJC Gallery — gallery.js
 * Lightbox functions are defined inline in gallery.html for gallery-specific data access.
 * This file handles gallery-level scroll behavior and any shared utilities.
 */

(function () {
  'use strict';

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function (e) {
    var lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'ArrowRight') { if (typeof navLightbox === 'function') navLightbox(1); }
    if (e.key === 'ArrowLeft')  { if (typeof navLightbox === 'function') navLightbox(-1); }
    if (e.key === 'Escape')     { if (typeof closeLightbox === 'function') closeLightbox(); }
  });

  // Gallery grid: staggered reveal
  var galleryItems = document.querySelectorAll('.gallery-item, .gallery-card');
  if (galleryItems.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('is-visible');
          }, i * 60);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    galleryItems.forEach(function (el) { obs.observe(el); });
  }
})();

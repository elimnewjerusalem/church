(function () {
  'use strict';

  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbCounter = document.getElementById('lb-counter');
  const galleryItems = Array.from(document.querySelectorAll('#gallery-grid .bento__item'));

  if (!galleryItems.length || !lbImg || !lbCaption || !lbCounter) return;

  const images = galleryItems.map((item, index) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.bento__cap');
    return {
      src: img ? img.src : '',
      alt: img ? img.alt : '',
      caption: caption ? caption.textContent.trim() : `Gallery image ${index + 1}`
    };
  });

  let currentIndex = 0;

  function render() {
    const image = images[currentIndex];
    lbImg.src = image.src;
    lbImg.alt = image.alt;
    lbCaption.textContent = image.caption;
    lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  window.openLightbox = function (index) {
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
    render();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.navLightbox = function (direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    render();
  };

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      window.closeLightbox();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'ArrowRight') {
      window.navLightbox(1);
    } else if (event.key === 'ArrowLeft') {
      window.navLightbox(-1);
    } else if (event.key === 'Escape') {
      window.closeLightbox();
    }
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (event) {
    const dx = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      window.navLightbox(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
})();

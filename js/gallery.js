/* ===================================
   ENJC Church - Gallery Script
   Enhanced with lightbox/modal viewer
=================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // Create lightbox modal
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    display: none;
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    justify-content: center;
    align-items: center;
  `;
  
  lightbox.innerHTML = `
    <span style="
      position: absolute;
      top: 20px;
      right: 40px;
      font-size: 40px;
      color: white;
      cursor: pointer;
      z-index: 10001;
    " id="lightbox-close">&times;</span>
    
    <img id="lightbox-img" style="
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 0 50px rgba(0,0,0,0.5);
    ">
    
    <div id="lightbox-caption" style="
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 18px;
      background: rgba(0,0,0,0.7);
      padding: 12px 24px;
      border-radius: 8px;
      max-width: 80%;
      text-align: center;
    "></div>
    
    <button id="lightbox-prev" style="
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.2);
      border: 2px solid white;
      color: white;
      font-size: 30px;
      padding: 10px 18px;
      cursor: pointer;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    ">&#10094;</button>
    
    <button id="lightbox-next" style="
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.2);
      border: 2px solid white;
      color: white;
      font-size: 30px;
      padding: 10px 18px;
      cursor: pointer;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    ">&#10095;</button>
  `;
  
  document.body.appendChild(lightbox);
  
  // Get all gallery items
  const galleryItems = document.querySelectorAll('.gallery .item');
  let currentImageIndex = 0;
  let images = [];
  
  // Collect all images and their captions
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('p');
    
    if (img) {
      images.push({
        src: img.src,
        alt: img.alt,
        caption: caption ? caption.textContent : ''
      });
      
      // Add click event to open lightbox
      item.addEventListener('click', function() {
        currentImageIndex = index;
        openLightbox(index);
      });
      
      // Add pointer cursor
      item.style.cursor = 'pointer';
    }
  });
  
  // Open lightbox
  function openLightbox(index) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightboxImg.src = images[index].src;
    lightboxImg.alt = images[index].alt;
    lightboxCaption.textContent = images[index].caption;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
  
  // Close lightbox
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Navigate to next image
  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    openLightbox(currentImageIndex);
  }
  
  // Navigate to previous image
  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    openLightbox(currentImageIndex);
  }
  
  // Event listeners
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next').addEventListener('click', nextImage);
  document.getElementById('lightbox-prev').addEventListener('click', prevImage);
  
  // Close lightbox when clicking outside image
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
  });
  
  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  lightbox.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
      nextImage(); // Swipe left
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      prevImage(); // Swipe right
    }
  }
  
});

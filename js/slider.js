/* ===================================
   ENJC Church - Slider Script
   Enhanced with auto-play and touch support
=================================== */

// Initialize slider
document.addEventListener('DOMContentLoaded', function() {
  
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  
  if (!slides.length) return; // Exit if no slides found
  
  let currentIndex = 0;
  let autoPlayInterval;
  
  // Show specific slide
  function showSlide(index) {
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove("active"));
    
    // Add active class to current slide
    slides[index].classList.add("active");
  }
  
  // Next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }
  
  // Previous slide
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }
  
  // Auto-play functionality
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }
  
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }
  
  // Button event listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      stopAutoPlay();
      nextSlide();
      startAutoPlay(); // Restart auto-play after manual interaction
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      stopAutoPlay();
      prevSlide();
      startAutoPlay(); // Restart auto-play after manual interaction
    });
  }
  
  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  const slider = document.querySelector('.slider');
  
  if (slider) {
    slider.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }
  
  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for swipe
    
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped left - next slide
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped right - previous slide
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    }
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    } else if (e.key === 'ArrowLeft') {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    }
  });
  
  // Pause auto-play when user hovers over slider (desktop only)
  if (slider && window.innerWidth > 768) {
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
  }
  
  // Start auto-play
  startAutoPlay();
  
  // Show first slide
  showSlide(currentIndex);
  
});

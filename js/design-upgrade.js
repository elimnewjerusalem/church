/* ENJC Design Upgrade 2026 — Scroll animations + UI polish */
(function(){
  /* Fade-up on scroll */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

  /* Auto fade-up cards on scroll */
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach((e,i) => {
      if(e.isIntersecting){
        setTimeout(() => { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }, i * 80);
        cardObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.card, .testimony-card, .ministry-card, .enjc-video-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    cardObs.observe(el);
  });

  /* Scroll top button */
  const btn = document.getElementById('scroll-top-btn');
  if(btn){
    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 400);
    });
  }
})();

/* ── ENJC Image Slider ── */
(function(){
  var slides = document.querySelectorAll('.enjc-slide');
  var dots   = document.querySelectorAll('.enjc-dot');
  var cur    = 0;
  var timer;

  if (!slides.length) return;

  function go(n) {
    slides[cur].classList.remove('enjc-slide--active');
    dots[cur].classList.remove('enjc-dot--on');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('enjc-slide--active');
    dots[cur].classList.add('enjc-dot--on');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(function(){ go(cur + 1); }, 10000);
  }

  window.sliderNext = function(){ go(cur + 1); startAuto(); };
  window.sliderPrev = function(){ go(cur - 1); startAuto(); };
  window.sliderGo   = function(n){ go(n); startAuto(); };

  // Touch swipe support
  var startX = 0;
  var el = document.getElementById('hero-slider');
  if (el) {
    el.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, {passive:true});
    el.addEventListener('touchend', function(e){
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? sliderNext() : sliderPrev(); }
    }, {passive:true});
  }

  startAuto();
})();


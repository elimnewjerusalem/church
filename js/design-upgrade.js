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

  /* ── SVG Running Border — inject one <svg> per .card ──────────
     Draws a rounded-rect that traces the full perimeter on hover.
     fill → full reveal → retract = 2.4 s loop.
     Skipped for prefers-reduced-motion users.                  */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function injectCardSVG(card) {
    if (card.querySelector('.card-svg')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'card-svg');
    svg.setAttribute('aria-hidden', 'true');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '1');
    rect.setAttribute('y', '1');
    const r = parseFloat(getComputedStyle(card).borderRadius) || 20;
    rect.setAttribute('rx', r);
    svg.appendChild(rect);
    card.appendChild(svg);
    function sizeRect() {
      const w = card.offsetWidth, h = card.offsetHeight;
      if (!w || !h) return;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      rect.setAttribute('width', w - 2);
      rect.setAttribute('height', h - 2);
      const p = Math.round(2 * (w + h) - (8 - 2 * Math.PI) * r);
      card.style.setProperty('--p', p);
      rect.style.strokeDasharray  = '0 ' + p;
      rect.style.strokeDashoffset = p;
    }
    sizeRect();
    if (window.ResizeObserver) new ResizeObserver(sizeRect).observe(card);
  }

  if (!reduceMotion) {
    document.querySelectorAll('.card').forEach(injectCardSVG);
    const borderObs = new MutationObserver(() => {
      document.querySelectorAll('.card:not(:has(.card-svg))').forEach(injectCardSVG);
    });
    borderObs.observe(document.body, { childList: true, subtree: true });
  }

  /* Scroll top button */
  const btn = document.getElementById('scroll-top-btn');
  if(btn){
    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 400);
    });
  }
})();



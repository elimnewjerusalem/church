// ═══════════════════════════════════════════════════════════
//  ENJC events.js — loads data/events.json into all sections
// ═══════════════════════════════════════════════════════════

async function loadEvents() {
  try {
    const res = await fetch('data/events.json');
    if (!res.ok) throw new Error('JSON not found');
    const data = await res.json();

    renderRecentStreams(data.recentStreams || []);
    renderMostWatched(data.mostWatched   || []);
    renderVerseReels(data.verseReels     || []);
    renderSpecialEvents(data.specialEvents || []);
    renderTestimonials(data.testimonials  || []);

  } catch (err) {
    console.error('events.js error:', err);
  }
}

// ── helpers ──────────────────────────────────────────────────

function cleanId(id) {
  // Strip any leading slash that crept into videoId
  return (id || '').replace(/^\/+/, '');
}

function youtubeThumb(videoId) {
  const id = cleanId(videoId);
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function videoCard(item, tag) {
  const id = cleanId(item.videoId);
  const link = item.youtubeLink || `https://www.youtube.com/watch?v=${id}`;
  return `
<div class="ev-card">
  <a href="${link}" target="_blank" rel="noopener" class="ev-thumb-link">
    <div class="ev-thumb" style="background:linear-gradient(135deg,#0b2545,#050d1a)">
      <img src="${youtubeThumb(id)}"
           alt="${item.title}"
           loading="lazy"
           onerror="this.style.display='none'"
           style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.7">
      <div class="ev-play"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg></div>
    </div>
  </a>
  <div class="ev-body">
    <p class="ev-tag">${tag}</p>
    <p class="ev-title">${item.title}</p>
    <p class="ev-meta">${item.date || item.views || item.verse || ''}</p>
    <a href="${link}" target="_blank" rel="noopener" class="ev-watch">Watch &#8594;</a>
  </div>
</div>`;
}

// ── renderers ─────────────────────────────────────────────────

function renderRecentStreams(items) {
  const el = document.getElementById('recent-streams-container');
  if (!el || !items.length) return;
  el.innerHTML = items.map(i => videoCard(i, 'Recent Stream')).join('');
}

function renderMostWatched(items) {
  const el = document.getElementById('most-watched-container');
  if (!el || !items.length) return;
  el.innerHTML = items.map(i => videoCard(i, i.views || 'Most Watched')).join('');
}

function renderVerseReels(items) {
  const el = document.getElementById('verse-reels-container');
  if (!el || !items.length) return;
  el.innerHTML = items.map(i => {
    const id = cleanId(i.videoId);
    const link = i.youtubeLink || `https://www.youtube.com/shorts/${id}`;
    return `
<div class="reel-card-js">
  <span class="reel-icon">&#128214;</span>
  <p class="reel-verse">${i.title}</p>
  <p class="reel-ref">&#8212; ${i.verse}</p>
  <a href="${link}" target="_blank" rel="noopener" class="reel-btn">Watch Reel &#8594;</a>
</div>`;
  }).join('');
}

function renderSpecialEvents(items) {
  const el = document.getElementById('special-events-container');
  if (!el || !items.length) return;
  el.innerHTML = items.map(i => `
<div class="spec-card-js fi">
  <div class="spec-icon">${i.icon || '&#10013;'}</div>
  <p class="spec-schedule">${i.schedule}</p>
  <h4 class="spec-title">${i.title}</h4>
  <p class="spec-desc">${i.description}</p>
  ${i.time ? `<span class="spec-time">${i.time}</span>` : ''}
</div>`).join('');
}

function renderTestimonials(items) {
  const el = document.getElementById('testimonial-track');
  if (!el || !items.length) return;
  el.innerHTML = items.map(i => `
<div class="test-card">
  <p class="test-q">"${i.text}"</p>
  <span class="test-a">&#8212; ${i.author}</span>
</div>`).join('');
}

// ── also handle events-container (legacy events array) ────────
async function loadLegacyEvents() {
  try {
    const res = await fetch('data/events.json');
    const data = await res.json();
    const el = document.getElementById('events-container');
    if (!el) return;
    const events = data.events || [];
    if (!events.length) { el.style.display='none'; return; }
    el.innerHTML = events.map(ev => {
      const id = cleanId(ev.videoId);
      return `
<div class="event-card">
  <div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden">
    <iframe style="position:absolute;top:0;left:0;width:100%;height:100%"
      src="https://www.youtube.com/embed/${id}"
      title="${ev.title}" frameborder="0"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
      allowfullscreen></iframe>
  </div>
  <div class="event-content">
    <h3>${ev.title}</h3>
    <p><strong>&#128197; ${ev.schedule}</strong><br>${(ev.times||[]).join('<br>')}</p>
    <p>${ev.description}</p>
    <a href="${ev.youtubeLink||'#'}" class="btn ${ev.buttonClass||'register'}" target="_blank">${ev.buttonText||'Watch Live'}</a>
  </div>
</div>`;
    }).join('');
  } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  loadLegacyEvents();
});
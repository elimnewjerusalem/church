/**
 * ENJC — events.js
 * Fetches data/events.json and renders all dynamic sections on events.html.
 * v2 — includes Search + Topic Filter across all video sections.
 */

(function () {
  'use strict';

  let allVideos    = [];
  let activeFilter = 'all';
  let searchQuery  = '';

  async function loadEventsData() {
    try {
      const res = await fetch('data/events.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('events.js: could not load events.json —', err.message);
      return null;
    }
  }

  function cleanId(id) { return (id || '').replace(/^\/+/, ''); }

  function topicColor(topic) {
    return { worship:'#7c6cf0', prayer:'#059669', message:'#d97706', shorts:'#dc2626' }[topic] || '#6b7280';
  }

  function buildVideoCard(item, label) {
    const id   = cleanId(item.videoId);
    const meta = item.date || item.views || item.verse || '';
    const badge = item.topic
      ? `<span style="display:inline-block;padding:2px 8px;border-radius:99px;font-size:9px;font-weight:700;
             text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;
             background:${topicColor(item.topic)};color:#fff;">${item.topic}</span><br>`
      : '';
    return `
      <article class="card video-card" style="overflow:hidden;">
        <div style="aspect-ratio:16/9;position:relative;background:var(--color-bg-3);">
          <iframe src="https://www.youtube.com/embed/${id}" title="${item.title}"
            frameborder="0" loading="lazy"
            allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>
        </div>
        <div style="padding:18px;">
          ${badge}
          <div style="font-size:10px;color:var(--color-gold);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:7px;">${label}</div>
          <h4 style="color:var(--color-text);margin-bottom:4px;font-size:14px;">${item.title}</h4>
          <p style="font-size:12px;color:var(--color-text-faint);">${meta}</p>
        </div>
      </article>`;
  }

  function buildReelCard(item) {
    const id = cleanId(item.videoId);
    return `
      <div style="width:240px;aspect-ratio:9/16;border-radius:14px;overflow:hidden;
           background:var(--color-bg-2);border:1px solid var(--color-border);position:relative;flex-shrink:0;">
        <iframe src="https://www.youtube.com/embed/${id}" title="${item.title}"
          frameborder="0" loading="lazy"
          allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
          allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>
      </div>`;
  }

  /* ── SEARCH + FILTER ── */

  function applyFilter() {
    const q = searchQuery.trim().toLowerCase();
    const f = activeFilter;

    if (!q && f === 'all') {
      showNormalSections(); return;
    }

    const results = allVideos.filter(item => {
      const matchTopic = f === 'all' || item.topic === f;
      const matchQuery = !q ||
        (item.title       || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.verse       || '').toLowerCase().includes(q);
      return matchTopic && matchQuery;
    });

    renderSearchResults(results, q, f);
  }

  function renderSearchResults(results, q, f) {
    const grid    = document.getElementById('search-results-grid');
    const section = document.getElementById('search-results-section');
    document.querySelectorAll('.normal-section').forEach(s => s.style.display = 'none');
    if (section) section.style.display = 'block';
    if (!grid) return;

    const label = f !== 'all'
      ? `Topic: <strong>${f}</strong>`
      : `Results for "<strong>${q}</strong>"`;

    const countEl = document.getElementById('search-result-count');
    if (countEl) countEl.innerHTML = `${results.length} video${results.length !== 1 ? 's' : ''} — ${label}`;

    grid.innerHTML = results.length
      ? results.map(i => buildVideoCard(i, i._label || 'Video')).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--color-text-faint);">
           <div style="font-size:48px;margin-bottom:12px;">🔍</div>
           <p>No videos found. Try a different search or filter.</p>
         </div>`;
  }

  function showNormalSections() {
    const section = document.getElementById('search-results-section');
    if (section) section.style.display = 'none';
    document.querySelectorAll('.normal-section').forEach(s => s.style.display = '');
  }

  function initFilterButtons() {
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(b => {
          b.classList.toggle('enjc-filter-active', b.dataset.filter === activeFilter);
        });
        applyFilter();
      });
    });
  }

  function initSearch() {
    const input    = document.getElementById('video-search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    if (!input) return;
    input.addEventListener('input', () => {
      searchQuery = input.value;
      if (clearBtn) clearBtn.style.display = searchQuery ? 'flex' : 'none';
      applyFilter();
    });
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = ''; searchQuery = '';
        clearBtn.style.display = 'none';
        input.focus(); applyFilter();
      });
    }
  }

  /* ── RENDERERS ── */

  function renderRecentStreams(items) {
    const el = document.getElementById('recent-streams-grid');
    if (!el || !items.length) return;
    el.innerHTML = items.map(i => buildVideoCard(i, 'Recent Stream')).join('');
  }

  function renderMostWatched(items) {
    const el = document.getElementById('most-watched-grid');
    if (!el || !items.length) return;
    el.innerHTML = items.map(i => buildVideoCard(i, i.views || 'Most Watched')).join('');
  }

  function renderVerseReels(items) {
    const el = document.getElementById('verse-reels-row');
    if (!el || !items.length) return;
    el.innerHTML = items.map(buildReelCard).join('');
  }

  /* ── TESTIMONIALS ── */

  function initTestimonials(items) {
    if (!items.length) return;
    const textEl   = document.getElementById('testimonial-text');
    const authorEl = document.getElementById('testimonial-author');
    if (!textEl || !authorEl) return;
    let idx = 0;
    function render() {
      textEl.innerHTML     = `\u201c${items[idx].text}\u201d`;
      authorEl.textContent = `\u2014 ${items[idx].author}`;
    }
    window.changeTestimonial = dir => { idx = (idx + dir + items.length) % items.length; render(); };
    setInterval(() => window.changeTestimonial(1), 5000);
    render();
  }

  /* ── COUNTDOWN ── */

  function startCountdown() {
    function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }
    function getNextSunday() {
      const now = new Date();
      const d   = now.getDay() === 0 ? 7 : 7 - now.getDay();
      const next = new Date(now);
      next.setDate(now.getDate() + d);
      next.setHours(5, 30, 0, 0);
      return next;
    }
    function tick() {
      const diff = getNextSunday() - Date.now();
      if (diff < 0) return;
      document.getElementById('cd-d').textContent = pad(diff / 86_400_000);
      document.getElementById('cd-h').textContent = pad((diff % 86_400_000) / 3_600_000);
      document.getElementById('cd-m').textContent = pad((diff % 3_600_000)  / 60_000);
      document.getElementById('cd-s').textContent = pad((diff % 60_000)     / 1_000);
    }
    setInterval(tick, 1000); tick();
  }

  /* ── INIT ── */

  document.addEventListener('DOMContentLoaded', async function () {
    startCountdown();
    const data = await loadEventsData();
    if (!data) return;

    allVideos = [
      ...(data.recentStreams || []).map(i => ({ ...i, _label: 'Recent Stream' })),
      ...(data.mostWatched   || []).map(i => ({ ...i, _label: i.views || 'Most Watched' })),
      ...(data.verseReels    || []).map(i => ({ ...i, _label: 'Verse Reel', topic: i.topic || 'shorts' })),
    ];

    renderRecentStreams(data.recentStreams || []);
    renderMostWatched(data.mostWatched    || []);
    renderVerseReels(data.verseReels      || []);
    initTestimonials(data.testimonials    || []);
    initFilterButtons();
    initSearch();
  });

})();

/**
 * ENJC — events.js
 * Fetches data/events.json and renders all dynamic sections on events.html.
 *
 * Containers it populates:
 *   #recent-streams-grid  ← recentStreams[]
 *   #most-watched-grid    ← mostWatched[]
 *   #verse-reels-row      ← verseReels[]
 *   #testimonial-text     ← testimonials[] (carousel)
 *   #testimonial-author
 *
 * To add/update a video: edit data/events.json — no HTML changes needed.
 */

(function () {
  'use strict';

  /* ── FETCH ──────────────────────────────────────────────── */

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

  /* ── HELPERS ────────────────────────────────────────────── */

  function cleanId(id) {
    return (id || '').replace(/^\/+/, '');
  }

  function buildVideoCard(item, label) {
    const id   = cleanId(item.videoId);
    const meta = item.date || item.views || '';
    return `
      <article class="card video-card" style="overflow:hidden;">
        <div class="video-card__embed" style="aspect-ratio:16/9;position:relative;background:var(--color-bg-3);">
          <iframe src="https://www.youtube.com/embed/${id}" title="${item.title}"
            frameborder="0" loading="lazy"
            allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>
        </div>
        <div class="video-card__body" style="padding:18px;">
          <div style="font-size:10px;color:var(--color-gold);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:7px;">${label}</div>
          <h4 style="color:var(--color-text);margin-bottom:4px;font-size:14px;">${item.title}</h4>
          <p style="font-size:12px;color:var(--color-text-faint);">${meta}</p>
        </div>
      </article>`;
  }

  function buildReelCard(item) {
    const id = cleanId(item.videoId);
    return `
      <div class="reel" style="width:240px;aspect-ratio:9/16;border-radius:14px;overflow:hidden;
           background:var(--color-bg-2);border:1px solid var(--color-border);position:relative;flex-shrink:0;">
        <iframe src="https://www.youtube.com/embed/${id}" title="${item.title}"
          frameborder="0" loading="lazy"
          allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
          allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>
      </div>`;
  }

  /* ── RENDERERS ──────────────────────────────────────────── */

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

  /* ── TESTIMONIALS CAROUSEL ──────────────────────────────── */

  function initTestimonials(items) {
    if (!items.length) return;
    const textEl   = document.getElementById('testimonial-text');
    const authorEl = document.getElementById('testimonial-author');
    if (!textEl || !authorEl) return;

    let currentIndex = 0;

    function render() {
      const { text, author } = items[currentIndex];
      textEl.innerHTML     = `\u201c${text}\u201d`;
      authorEl.textContent = `\u2014 ${author}`;
    }

    // Exposed globally for prev/next buttons in HTML
    window.changeTestimonial = function (dir) {
      currentIndex = (currentIndex + dir + items.length) % items.length;
      render();
    };

    setInterval(() => window.changeTestimonial(1), 5000);
    render();
  }

  /* ── COUNTDOWN ──────────────────────────────────────────── */

  function startCountdown() {
    function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }

    function getNextSunday() {
      const now = new Date();
      const daysUntil = now.getDay() === 0 ? 7 : 7 - now.getDay();
      const next = new Date(now);
      next.setDate(now.getDate() + daysUntil);
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

    setInterval(tick, 1000);
    tick();
  }

  /* ── INIT ───────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', async function () {
    startCountdown();

    const data = await loadEventsData();
    if (!data) return;

    renderRecentStreams(data.recentStreams || []);
    renderMostWatched(data.mostWatched    || []);
    renderVerseReels(data.verseReels      || []);
    initTestimonials(data.testimonials    || []);
  });

})();

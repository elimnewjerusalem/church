/**
 * ENJC — events.js v8
 * Full auto-update from YouTube Data API v3
 * Sections:
 *  1. Featured Services  — Sunday / Friday / Promise (latest 1 each + playlist link)
 *  2. Recent Live        — latest 4 completed live streams
 *  3. Deliverance        — latest 3 from playlist
 *  4. Testimony          — latest 3 from playlist
 *  5. Shorts / Reels     — latest 3 short videos
 *  6. Most Watched       — top 3 by viewCount from channel videos (real-time)
 *  7. Search + Filter    — across all loaded videos
 *  8. Testimonials       — from events.json (static)
 *  9. Countdown          — to next service
 */
(function () {
  'use strict';

  // SECURITY: Restrict in Google Cloud Console → APIs → Credentials
  // → HTTP referrers → add: elimnewjerusalem.github.io/*
  // SECURITY: Set your YouTube Data API v3 key here.
  // Restrict it in Google Cloud Console to your GitHub Pages domain to prevent abuse.
  const YT_API_KEY = 'AIzaSyCJGQlJzkfqykHnq1pxbIR_gx0SwkpCo_Y';
  const CHANNEL_ID = 'UC4yhaUWMXi-Ven-QAVx4j7w';

  const PL = {
    sunday:      'PLcsOT9w6kTBWWnEn2ECktbwK44EsMNuBy',
    friday:      'PLcsOT9w6kTBUfrNOqp_JIBGY_ZnYt2Yc6',
    promise:     'PLcsOT9w6kTBU0HnSDCBIuMdWVPZaoM7w4',
    testimony:   'PLcsOT9w6kTBXwTSQuvtQDI7gq3nZjIbxJ',
    deliverance: 'PLcsOT9w6kTBUbVgaE9w9rP6lA_EWwqPTj',
  };

  let allVideos    = [];
  let activeFilter = 'all';
  let searchQuery  = '';

  /* ──────────────────────────────
     SKELETON LOADERS
  ────────────────────────────── */

  function skeletonCard() {
    return `<article class="card video-card enjc-skeleton-card" style="overflow:hidden;">
      <div class="enjc-skeleton" style="aspect-ratio:16/9;"></div>
      <div style="padding:14px;">
        <div class="enjc-skeleton" style="height:16px;width:60%;margin-bottom:8px;border-radius:4px;"></div>
        <div class="enjc-skeleton" style="height:13px;width:90%;margin-bottom:5px;border-radius:4px;"></div>
        <div class="enjc-skeleton" style="height:11px;width:45%;border-radius:4px;"></div>
      </div>
    </article>`;
  }

  function skeletonServiceSection() {
    return `<div style="max-width:420px;">
      <div class="enjc-skeleton" style="aspect-ratio:16/9;border-radius:12px;"></div>
      <div class="enjc-skeleton" style="height:36px;width:160px;border-radius:99px;margin-top:14px;"></div>
    </div>`;
  }

  function showSkeletons(elId, count, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (type === 'service') {
      el.innerHTML = skeletonServiceSection();
    } else {
      el.innerHTML = Array(count).fill(skeletonCard()).join('');
    }
  }

  /* ──────────────────────────────
     INJECT SKELETON CSS
  ────────────────────────────── */

  (function injectSkeletonStyles() {
    if (document.getElementById('enjc-skeleton-style')) return;
    const style = document.createElement('style');
    style.id = 'enjc-skeleton-style';
    style.textContent = `
      @keyframes enjcShimmer {
        0%   { background-position: -600px 0; }
        100% { background-position: 600px 0; }
      }
      .enjc-skeleton {
        background: linear-gradient(90deg,
          var(--color-bg-3, #0d1e3a) 25%,
          var(--color-bg-2, #111e35) 50%,
          var(--color-bg-3, #0d1e3a) 75%
        );
        background-size: 600px 100%;
        animation: enjcShimmer 1.4s infinite linear;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);
  })();

  /* ──────────────────────────────
     YOUTUBE API HELPERS
  ────────────────────────────── */

  async function ytFetch(endpoint, params) {
    if (!YT_API_KEY) return null;  // No API key — skip, use local fallback
    const qs = new URLSearchParams({ ...params, key: YT_API_KEY }).toString();
    try {
      const res  = await fetch(`https://www.googleapis.com/youtube/v3/${endpoint}?${qs}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data;
    } catch (e) {
      console.warn(`YT [${endpoint}]:`, e.message);
      return null;
    }
  }

  async function fetchPlaylist(playlistId, max) {
    const data = await ytFetch('playlistItems', {
      part: 'snippet', playlistId, maxResults: max
    });
    if (!data?.items?.length) return [];
    return data.items.map(item => ({
      videoId:   item.snippet.resourceId.videoId,
      title:     item.snippet.title,
      date:      fmtDate(item.snippet.publishedAt),
      thumbnail: item.snippet.thumbnails?.medium?.url || '',
    }));
  }

  async function fetchRecentLives(max) {
    const data = await ytFetch('search', {
      part: 'snippet', channelId: CHANNEL_ID,
      eventType: 'completed', type: 'video', order: 'date', maxResults: max
    });
    if (!data?.items?.length) return [];
    return data.items.map(item => ({
      videoId:   item.id.videoId,
      title:     item.snippet.title,
      date:      fmtDate(item.snippet.publishedAt),
      thumbnail: item.snippet.thumbnails?.medium?.url || '',
    }));
  }

  async function fetchShorts(max) {
    const data = await ytFetch('search', {
      part: 'snippet', channelId: CHANNEL_ID,
      type: 'video', videoDuration: 'short', order: 'date', maxResults: max
    });
    if (!data?.items?.length) return [];
    return data.items.map(item => ({
      videoId:   item.id.videoId,
      title:     item.snippet.title,
      date:      fmtDate(item.snippet.publishedAt),
      thumbnail: item.snippet.thumbnails?.medium?.url || '',
    }));
  }

  /* fetchMostWatched — real view counts from YouTube
     1. Search for latest 20 videos from channel
     2. Batch-fetch statistics for those video IDs
     3. Sort by viewCount descending, return top N
  */
  async function fetchMostWatched(topN) {
    // Step 1: get recent video IDs
    const searchData = await ytFetch('search', {
      part: 'id', channelId: CHANNEL_ID,
      type: 'video', order: 'viewCount', maxResults: 20
    });
    if (!searchData?.items?.length) return [];

    const ids = searchData.items.map(i => i.id.videoId).join(',');

    // Step 2: get stats + snippet for those IDs
    const statsData = await ytFetch('videos', {
      part: 'snippet,statistics', id: ids
    });
    if (!statsData?.items?.length) return [];

    // Step 3: sort by viewCount and return top N
    return statsData.items
      .sort((a, b) => Number(b.statistics.viewCount || 0) - Number(a.statistics.viewCount || 0))
      .slice(0, topN)
      .map(item => ({
        videoId:   item.id,
        title:     item.snippet.title,
        date:      fmtDate(item.snippet.publishedAt),
        thumbnail: item.snippet.thumbnails?.medium?.url || '',
        views:     fmtViews(item.statistics.viewCount),
      }));
  }

  function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  function fmtViews(n) {
    if (!n) return '';
    const num = Number(n);
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M views';
    if (num >= 1_000)     return (num / 1_000).toFixed(1) + 'K views';
    return num + ' views';
  }

  /* ──────────────────────────────
     CARD BUILDER
  ────────────────────────────── */

  const COLORS = {
    live:        '#ef4444',
    sunday:      '#7c6cf0',
    friday:      '#059669',
    promise:     '#0369a1',
    deliverance: '#b91c1c',
    testimony:   '#d97706',
    shorts:      '#dc2626',
    popular:     '#f59e0b',
  };
  const LABELS = {
    live:        '🔴 Live Stream',
    sunday:      '🙏 Sunday Service',
    friday:      '✝️ Friday Prayer',
    promise:     '🎯 Promise Service',
    deliverance: '🔥 Deliverance',
    testimony:   '💬 Testimony',
    shorts:      '📱 Shorts',
    popular:     '🔥 Most Watched',
  };

  function normalizeVideo(item, type) {
    const videoId = item.videoId || item.id || '';
    return {
      videoId,
      title:     item.title || '',
      date:      item.date  || '',
      views:     item.views || '',
      thumbnail: item.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : ''),
      _type:     type,
    };
  }

  function buildCard(item, type) {
    const id    = (item.videoId || '').replace(/^\/+/, '');
    const color = COLORS[type] || '#6b7280';
    const label = LABELS[type] || type;
    const meta  = item.views
      ? `${item.views}${item.date ? ' · ' + item.date : ''}`
      : (item.date || '');

    const isShort = type === 'shorts';
    const thumbRatio = isShort ? '9/16' : '16/9';
    return `
      <article class="card video-card${isShort ? ' video-card--short' : ''}" style="overflow:hidden;" data-type="${type}">
        <a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener"
           style="display:block;position:relative;aspect-ratio:${thumbRatio};background:#000;overflow:hidden;">
          <img src="${item.thumbnail || `https://img.youtube.com/vi/${id}/mqdefault.jpg`}"
               alt="${escHtml(item.title)}"
               style="width:100%;height:100%;object-fit:cover;opacity:0.88;" loading="lazy">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
            <div style="width:50px;height:50px;background:rgba(255,0,0,0.9);border-radius:50%;
                 display:flex;align-items:center;justify-content:center;">
              <span style="color:#fff;font-size:18px;margin-left:3px;">▶</span>
            </div>
          </div>
        </a>
        <div style="padding:14px;">
          <span style="display:inline-block;padding:2px 9px;border-radius:99px;font-size:9px;
              font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:7px;
              background:${color};color:#fff;">${label}</span>
          <h4 style="color:var(--color-text);font-size:13px;line-height:1.45;margin-bottom:4px;">${escHtml(item.title)}</h4>
          <p style="font-size:11px;color:var(--color-text-faint);">${meta}</p>
        </div>
      </article>`;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ──────────────────────────────
     RENDER HELPERS
  ────────────────────────────── */

  function renderGrid(elId, items, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (!items.length) {
      el.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;
        color:var(--color-text-faint);">No videos found.</div>`;
      return;
    }
    el.innerHTML = items.map(v => buildCard(normalizeVideo(v, type), type)).join('');
  }

  function renderServiceSection(elId, video, type, playlistId) {
    const el = document.getElementById(elId);
    if (!el) return;
    const color = COLORS[type];
    const plUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
    const cardHtml = video
      ? buildCard(normalizeVideo(video, type), type)
      : `<div class="card" style="aspect-ratio:16/9;display:flex;align-items:center;
           justify-content:center;color:var(--color-text-faint);">No video found</div>`;

    el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr;max-width:420px;">
        ${cardHtml}
        <div style="margin-top:14px;">
          <a href="${plUrl}" target="_blank" rel="noopener"
             style="display:inline-flex;align-items:center;gap:8px;
                    padding:10px 24px;border-radius:99px;
                    background:${color};color:#fff;
                    font-size:13px;font-weight:700;text-decoration:none;">
            ▶ View Full Playlist
          </a>
        </div>
      </div>`;
  }

  /* ──────────────────────────────
     SEARCH + FILTER
  ────────────────────────────── */

  function applyFilter() {
    const q = searchQuery.trim().toLowerCase();
    const f = activeFilter;
    if (!q && f === 'all') { showNormalSections(); return; }

    const results = allVideos.filter(v => {
      const mt = f === 'all' || v._type === f;
      const mq = !q || (v.title || '').toLowerCase().includes(q);
      return mt && mq;
    });
    renderSearchResults(results);
  }

  function renderSearchResults(results) {
    const grid    = document.getElementById('search-results-grid');
    const section = document.getElementById('search-results-section');
    document.querySelectorAll('.normal-section').forEach(s => s.style.display = 'none');
    if (section) section.style.display = 'block';
    if (!grid) return;

    const f     = activeFilter;
    const q     = searchQuery.trim();
    const label = f !== 'all' ? (LABELS[f] || f) : (q ? `"${q}"` : 'All');
    const countEl = document.getElementById('search-result-count');
    if (countEl) countEl.innerHTML =
      `${results.length} video${results.length !== 1 ? 's' : ''} — ${label}`;

    grid.innerHTML = results.length
      ? results.map(v => buildCard(v, v._type)).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--color-text-faint);">
           <div style="font-size:48px;margin-bottom:12px;">🔍</div>
           <p>No videos found. Try a different search.</p>
         </div>`;
  }

  function showNormalSections() {
    const s = document.getElementById('search-results-section');
    if (s) s.style.display = 'none';
    document.querySelectorAll('.normal-section').forEach(el => el.style.display = '');
  }

  function initFilterButtons() {
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(b =>
          b.classList.toggle('enjc-filter-active', b.dataset.filter === activeFilter));
        applyFilter();
      });
    });
  }

  function initSearch() {
    const input = document.getElementById('video-search-input');
    const clear = document.getElementById('search-clear-btn');
    if (!input) return;
    input.addEventListener('input', () => {
      searchQuery = input.value;
      if (clear) clear.style.display = searchQuery ? 'flex' : 'none';
      applyFilter();
    });
    if (clear) clear.addEventListener('click', () => {
      input.value = ''; searchQuery = '';
      clear.style.display = 'none';
      input.focus(); applyFilter();
    });
  }

  /* ──────────────────────────────
     TESTIMONIAL CAROUSEL
  ────────────────────────────── */

  function initTestimonials(items) {
    if (!items?.length) return;
    const textEl   = document.getElementById('testimonial-text');
    const authorEl = document.getElementById('testimonial-author');
    if (!textEl || !authorEl) return;
    let idx = 0;
    const render = () => {
      textEl.innerHTML     = `\u201c${escHtml(items[idx].text)}\u201d`;
      authorEl.textContent = `\u2014 ${items[idx].author}`;
    };
    window.changeTestimonial = d => {
      idx = (idx + d + items.length) % items.length; render();
    };
    setInterval(() => window.changeTestimonial(1), 5000);
    render();
  }

  /* ──────────────────────────────
     COUNTDOWN
  ────────────────────────────── */

  function startCountdown() {
    const pad = n => String(Math.floor(n)).padStart(2, '0');
    const SLOTS = [
      [0,  5, 30],  // Sunday 5:30 AM
      [0,  8, 30],  // Sunday 8:30 AM
      [0, 12,  0],  // Sunday 12:00 PM
      [5, 11,  0],  // Friday 11:00 AM
    ];
    const getNext = () => {
      const now = new Date();
      let best = null;
      for (const [day, h, m] of SLOTS) {
        const t = new Date(now);
        let diff = day - now.getDay();
        if (diff < 0) diff += 7;
        t.setDate(now.getDate() + diff);
        t.setHours(h, m, 0, 0);
        if (t <= now) t.setDate(t.getDate() + 7);
        if (!best || t < best) best = t;
      }
      return best;
    };
    const tick = () => {
      const diff = getNext() - Date.now();
      if (diff < 0) return;
      const dEl = document.getElementById('cd-d');
      const hEl = document.getElementById('cd-h');
      const mEl = document.getElementById('cd-m');
      const sEl = document.getElementById('cd-s');
      if (dEl) dEl.textContent = pad(diff / 86_400_000);
      if (hEl) hEl.textContent = pad((diff % 86_400_000) / 3_600_000);
      if (mEl) mEl.textContent = pad((diff % 3_600_000) / 60_000);
      if (sEl) sEl.textContent = pad((diff % 60_000) / 1_000);
    };
    setInterval(tick, 1000); tick();
  }

  /* ──────────────────────────────
     MAIN INIT
  ────────────────────────────── */

  document.addEventListener('DOMContentLoaded', async () => {
    startCountdown();
    initFilterButtons();
    initSearch();

    // Show skeletons immediately while fetching
    showSkeletons('sunday-section',      1, 'service');
    showSkeletons('friday-section',      1, 'service');
    showSkeletons('promise-section',     1, 'service');
    showSkeletons('recent-streams-grid', 4, 'grid');
    showSkeletons('most-watched-grid',   3, 'grid');
    showSkeletons('deliverance-grid',    3, 'grid');
    showSkeletons('testimony-grid',      3, 'grid');
    showSkeletons('verse-reels-row',     3, 'grid');

    // Load events.json for testimonials fallback
    let jsonData = null;
    try {
      const r = await fetch('data/events.json').catch(() => fetch('./data/events.json'));
      if (r.ok) jsonData = await r.json();
    } catch {}
    initTestimonials(jsonData?.testimonials || []);

    // Fallback normalizer for events.json videos
    function jsonVideos(arr, type) {
      return (arr || []).map(v => normalizeVideo(v, type));
    }

    // Parallel fetch everything — UI stays responsive via skeletons
    const [lives, sunday, friday, promise, deliverance, testimony, shorts, mostWatched] =
      await Promise.all([
        fetchRecentLives(4),
        fetchPlaylist(PL.sunday,      1),
        fetchPlaylist(PL.friday,      1),
        fetchPlaylist(PL.promise,     1),
        fetchPlaylist(PL.deliverance, 3),
        fetchPlaylist(PL.testimony,   3),
        fetchShorts(3),
        fetchMostWatched(3),
      ]);

    // Use API results; fall back to events.json if API returned nothing
    const liveFinal        = lives.length        ? lives        : jsonVideos(jsonData?.recentStreams, 'live');
    const sundayFinal      = sunday.length        ? sunday       : jsonVideos((jsonData?.recentStreams || []).filter(e => e.topic === 'worship').slice(0, 1), 'sunday');
    const fridayFinal      = friday.length        ? friday       : jsonVideos((jsonData?.recentStreams || []).filter(e => e.topic === 'prayer').slice(0, 1), 'friday');
    const promiseFinal     = promise.length       ? promise      : jsonVideos((jsonData?.recentStreams || []).slice(0, 1), 'promise');
    const deliveranceFinal = deliverance.length   ? deliverance  : jsonVideos(jsonData?.deliverance, 'deliverance');
    const testimonyFinal   = testimony.length     ? testimony    : jsonVideos(jsonData?.testimony,   'testimony');
    const shortsFinal      = shorts.length        ? shorts       : jsonVideos(jsonData?.verseReels, 'shorts');
    const popularFinal     = mostWatched.length   ? mostWatched  : jsonVideos(jsonData?.mostWatched, 'popular');

    // Render all sections (replaces skeletons)
    renderServiceSection('sunday-section',  sundayFinal[0]  || null, 'sunday',  PL.sunday);
    renderServiceSection('friday-section',  fridayFinal[0]  || null, 'friday',  PL.friday);
    renderServiceSection('promise-section', promiseFinal[0] || null, 'promise', PL.promise);
    renderGrid('recent-streams-grid', liveFinal,        'live');
    renderGrid('most-watched-grid',   popularFinal,     'popular');
    renderGrid('deliverance-grid',    deliveranceFinal, 'deliverance');
    renderGrid('testimony-grid',      testimonyFinal,   'testimony');
    renderGrid('verse-reels-row',     shortsFinal,      'shorts');

    // Build global search pool
    allVideos = [
      ...liveFinal.map(v        => ({ ...normalizeVideo(v, 'live'),        _type: 'live' })),
      ...sundayFinal.map(v      => ({ ...normalizeVideo(v, 'sunday'),      _type: 'sunday' })),
      ...fridayFinal.map(v      => ({ ...normalizeVideo(v, 'friday'),      _type: 'friday' })),
      ...promiseFinal.map(v     => ({ ...normalizeVideo(v, 'promise'),     _type: 'promise' })),
      ...deliveranceFinal.map(v => ({ ...normalizeVideo(v, 'deliverance'), _type: 'deliverance' })),
      ...testimonyFinal.map(v   => ({ ...normalizeVideo(v, 'testimony'),   _type: 'testimony' })),
      ...shortsFinal.map(v      => ({ ...normalizeVideo(v, 'shorts'),      _type: 'shorts' })),
      ...popularFinal.map(v     => ({ ...normalizeVideo(v, 'popular'),     _type: 'popular' })),
    ];
  });

})();

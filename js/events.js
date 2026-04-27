/**
 * ENJC — events.js v7
 * 1. Recent Live       — latest 3
 * 2. Sunday Service    — latest 1 + playlist link
 * 3. Friday Prayer     — latest 1 + playlist link
 * 4. Promise Service   — latest 1 + playlist link
 * 5. Deliverance       — latest 3
 * 6. Testimony         — latest 3
 * 7. Shorts            — latest 3
 */
(function () {
  'use strict';

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

  /* ── API ── */

  async function ytFetch(endpoint, params) {
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
    if (!data?.items) return [];
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
    if (!data?.items) return [];
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
    if (!data?.items) return [];
    return data.items.map(item => ({
      videoId:   item.id.videoId,
      title:     item.snippet.title,
      date:      fmtDate(item.snippet.publishedAt),
      thumbnail: item.snippet.thumbnails?.medium?.url || '',
    }));
  }

  function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  /* ── CARD ── */

  const COLORS = {
    live:'#ef4444', sunday:'#7c6cf0', friday:'#059669',
    promise:'#0369a1', deliverance:'#b91c1c', testimony:'#d97706', shorts:'#dc2626'
  };
  const LABELS = {
    live:'🔴 Live Stream', sunday:'🙏 Sunday Service', friday:'✝️ Friday Prayer',
    promise:'🎯 Promise Service', deliverance:'🔥 Deliverance',
    testimony:'💬 Testimony', shorts:'📱 Shorts'
  };

  function buildCard(item, type) {
    const id    = (item.videoId || '').replace(/^\/+/, '');
    const color = COLORS[type] || '#6b7280';
    const label = LABELS[type] || type;

    const thumb = item.thumbnail
      ? `<a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener"
            style="display:block;position:relative;aspect-ratio:16/9;background:#000;overflow:hidden;">
           <img src="${item.thumbnail}" alt="${item.title}"
                style="width:100%;height:100%;object-fit:cover;opacity:0.88;" loading="lazy">
           <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
             <div style="width:50px;height:50px;background:rgba(255,0,0,0.9);border-radius:50%;
                  display:flex;align-items:center;justify-content:center;">
               <span style="color:#fff;font-size:18px;margin-left:3px;">▶</span>
             </div>
           </div>
         </a>`
      : `<div style="aspect-ratio:16/9;position:relative;background:#1a1a1a;">
           <iframe src="https://www.youtube.com/embed/${id}" title="${item.title}"
             frameborder="0" loading="lazy"
             allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
             allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>
         </div>`;

    return `
      <article class="card video-card" style="overflow:hidden;" data-type="${type}">
        ${thumb}
        <div style="padding:14px;">
          <span style="display:inline-block;padding:2px 9px;border-radius:99px;font-size:9px;
              font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:7px;
              background:${color};color:#fff;">${label}</span>
          <h4 style="color:var(--color-text);font-size:13px;line-height:1.45;margin-bottom:4px;">${item.title}</h4>
          <p style="font-size:11px;color:var(--color-text-faint);">${item.date || ''}</p>
        </div>
      </article>`;
  }

  /* ── SERVICE SECTION (latest 1 card + playlist button) ── */

  function renderServiceSection(elId, video, type, playlistId, title) {
    const el = document.getElementById(elId);
    if (!el) return;
    const color  = COLORS[type];
    const plUrl  = `https://www.youtube.com/playlist?list=${playlistId}`;
    const cardHtml = video ? buildCard(video, type)
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

  /* ── RENDER GRID ── */

  function renderGrid(elId, items, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (!items.length) {
      el.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;
        color:var(--color-text-faint);">No videos found.</div>`;
      return;
    }
    el.innerHTML = items.map(v => buildCard(v, type)).join('');
  }

  /* ── SEARCH + FILTER ── */

  function applyFilter() {
    const q = searchQuery.trim().toLowerCase();
    const f = activeFilter;
    if (!q && f === 'all') { showNormalSections(); return; }
    const results = allVideos.filter(v => {
      const mt = f === 'all' || v._type === f;
      const mq = !q || (v.title || '').toLowerCase().includes(q);
      return mt && mq;
    });
    renderSearchResults(results, q, f);
  }

  function renderSearchResults(results, q, f) {
    const grid    = document.getElementById('search-results-grid');
    const section = document.getElementById('search-results-section');
    document.querySelectorAll('.normal-section').forEach(s => s.style.display = 'none');
    if (section) section.style.display = 'block';
    if (!grid) return;
    const label = f !== 'all' ? LABELS[f] || f : `"${q}"`;
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

  /* ── TESTIMONIAL CAROUSEL ── */

  function initTestimonials(items) {
    if (!items?.length) return;
    const textEl   = document.getElementById('testimonial-text');
    const authorEl = document.getElementById('testimonial-author');
    if (!textEl || !authorEl) return;
    let idx = 0;
    const render = () => {
      textEl.innerHTML     = `\u201c${items[idx].text}\u201d`;
      authorEl.textContent = `\u2014 ${items[idx].author}`;
    };
    window.changeTestimonial = d => {
      idx = (idx + d + items.length) % items.length; render();
    };
    setInterval(() => window.changeTestimonial(1), 5000);
    render();
  }

  /* ── COUNTDOWN ── */

  function startCountdown() {
    const pad = n => String(Math.floor(n)).padStart(2, '0');
    const getNext = () => {
      const now = new Date(), d = now.getDay() === 0 ? 7 : 7 - now.getDay();
      const next = new Date(now);
      next.setDate(now.getDate() + d); next.setHours(5, 30, 0, 0); return next;
    };
    const tick = () => {
      const diff = getNext() - Date.now(); if (diff < 0) return;
      document.getElementById('cd-d').textContent = pad(diff / 86_400_000);
      document.getElementById('cd-h').textContent = pad((diff % 86_400_000) / 3_600_000);
      document.getElementById('cd-m').textContent = pad((diff % 3_600_000) / 60_000);
      document.getElementById('cd-s').textContent = pad((diff % 60_000) / 1_000);
    };
    setInterval(tick, 1000); tick();
  }

  /* ── INIT ── */

  document.addEventListener('DOMContentLoaded', async () => {
    startCountdown();

    // Fallback testimonials
    try {
      const r = await fetch('data/events.json');
      if (r.ok) { const d = await r.json(); initTestimonials(d.testimonials || []); }
    } catch {}

    // Parallel fetch everything
    const [lives, sunday, friday, promise, deliverance, testimony, shorts] = await Promise.all([
      fetchRecentLives(3),
      fetchPlaylist(PL.sunday, 1),
      fetchPlaylist(PL.friday, 1),
      fetchPlaylist(PL.promise, 1),
      fetchPlaylist(PL.deliverance, 3),
      fetchPlaylist(PL.testimony, 3),
      fetchShorts(3),
    ]);

    // Render all sections
    renderGrid('recent-streams-grid', lives, 'live');
    renderServiceSection('sunday-section',  sunday[0]  || null, 'sunday',  PL.sunday,  'Sunday Service');
    renderServiceSection('friday-section',  friday[0]  || null, 'friday',  PL.friday,  'Friday Prayer');
    renderServiceSection('promise-section', promise[0] || null, 'promise', PL.promise, 'Promise Service');
    renderGrid('deliverance-grid', deliverance, 'deliverance');
    renderGrid('testimony-grid',   testimony,   'testimony');
    renderGrid('shorts-grid',      shorts,      'shorts');

    // Search pool
    allVideos = [
      ...lives.map(v       => ({ ...v, _type: 'live' })),
      ...sunday.map(v      => ({ ...v, _type: 'sunday' })),
      ...friday.map(v      => ({ ...v, _type: 'friday' })),
      ...promise.map(v     => ({ ...v, _type: 'promise' })),
      ...deliverance.map(v => ({ ...v, _type: 'deliverance' })),
      ...testimony.map(v   => ({ ...v, _type: 'testimony' })),
      ...shorts.map(v      => ({ ...v, _type: 'shorts' })),
    ];

    initFilterButtons();
    initSearch();
  });

})();

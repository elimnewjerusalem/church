/**
 * ENJC — events.js v5
 * Sections:
 *   1. Recent Live Streams     — YouTube Search API (latest completed lives)
 *   2. Sunday & Friday Service — fixed cards
 *   3. Deliverance Meeting     — playlist PLcsOT9w6kTBUbVgaE9w9rP6lA_EWwqPTj
 *   4. Believers Testimony     — playlist PLcsOT9w6kTBXwTSQuvtQDI7gq3nZjIbxJ
 *   5. Shorts / Verse Reels    — channel shorts
 *   6. Countdown + Testimonials carousel
 */

(function () {
  'use strict';

  const YT_API_KEY          = 'AIzaSyCJGQlJzkfqykHnq1pxbIR_gx0SwkpCo_Y';
  const CHANNEL_ID          = 'UC4yhaUWMXi-Ven-QAVx4j7w';
  const PLAYLIST_DELIVERANCE = 'PLcsOT9w6kTBUbVgaE9w9rP6lA_EWwqPTj';
  const PLAYLIST_TESTIMONY   = 'PLcsOT9w6kTBXwTSQuvtQDI7gq3nZjIbxJ';

  let allVideos    = [];
  let activeFilter = 'all';
  let searchQuery  = '';

  /* ── API HELPERS ── */

  async function ytFetch(endpoint, params) {
    const qs = new URLSearchParams({ ...params, key: YT_API_KEY }).toString();
    try {
      const res  = await fetch(`https://www.googleapis.com/youtube/v3/${endpoint}?${qs}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data;
    } catch (e) {
      console.warn(`YT API [${endpoint}] error:`, e.message);
      return null;
    }
  }

  async function fetchPlaylistVideos(playlistId, maxResults = 6) {
    const data = await ytFetch('playlistItems', {
      part: 'snippet', playlistId, maxResults, order: 'date'
    });
    if (!data?.items) return [];
    return data.items.map(item => ({
      videoId:     item.snippet.resourceId.videoId,
      title:       item.snippet.title,
      description: item.snippet.description || '',
      date:        fmtDate(item.snippet.publishedAt),
      thumbnail:   item.snippet.thumbnails?.medium?.url || '',
      _source:     'youtube'
    }));
  }

  async function fetchRecentLives(maxResults = 3) {
    const data = await ytFetch('search', {
      part: 'snippet', channelId: CHANNEL_ID,
      eventType: 'completed', type: 'video',
      order: 'date', maxResults
    });
    if (!data?.items) return [];
    return data.items.map(item => ({
      videoId:     item.id.videoId,
      title:       item.snippet.title,
      description: item.snippet.description || '',
      date:        fmtDate(item.snippet.publishedAt),
      thumbnail:   item.snippet.thumbnails?.medium?.url || '',
      topic:       guessTopic(item.snippet.title),
      _label:      'Live Stream',
      _source:     'youtube'
    }));
  }

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  function guessTopic(title) {
    const t = title.toLowerCase();
    if (/worship|praise|song|sing|glory|ஆராதனை/.test(t))          return 'worship';
    if (/prayer|pray|fast|blessing|family|ஜெபம்/.test(t))         return 'prayer';
    if (/deliverance|deliver|விடுதலை/.test(t))                     return 'deliverance';
    if (/testimony|testimon|சாட்சி/.test(t))                       return 'testimony';
    if (/short|reel|verse|scripture/.test(t))                       return 'shorts';
    return 'message';
  }

  /* ── CARD BUILDERS ── */

  const TOPIC_COLOR = {
    worship:     '#7c6cf0',
    prayer:      '#059669',
    message:     '#d97706',
    shorts:      '#dc2626',
    deliverance: '#b91c1c',
    testimony:   '#0369a1'
  };
  const TOPIC_LABEL = {
    worship:     '🙏 Worship',
    prayer:      '✝️ Prayer',
    message:     '📢 Message',
    shorts:      '📱 Shorts',
    deliverance: '🔥 Deliverance',
    testimony:   '💬 Testimony'
  };

  function buildCard(item, label, topic) {
    const id    = (item.videoId || '').replace(/^\/+/, '');
    const tp    = topic || item.topic || 'message';
    const badge = `<span style="display:inline-block;padding:2px 9px;border-radius:99px;font-size:9px;
        font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:7px;
        background:${TOPIC_COLOR[tp]||'#6b7280'};color:#fff;">${TOPIC_LABEL[tp]||tp}</span>`;

    const thumb = item.thumbnail
      ? `<a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener"
            style="display:block;position:relative;aspect-ratio:16/9;background:#000;overflow:hidden;">
           <img src="${item.thumbnail}" alt="${item.title}"
                style="width:100%;height:100%;object-fit:cover;opacity:0.88;" loading="lazy">
           <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
             <div style="width:50px;height:50px;background:rgba(255,0,0,0.88);border-radius:50%;
                  display:flex;align-items:center;justify-content:center;">
               <span style="color:#fff;font-size:18px;margin-left:3px;">▶</span>
             </div>
           </div>
         </a>`
      : `<div style="aspect-ratio:16/9;position:relative;background:var(--color-bg-3);">
           <iframe src="https://www.youtube.com/embed/${id}" title="${item.title}"
             frameborder="0" loading="lazy"
             allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
             allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>
         </div>`;

    return `
      <article class="card video-card" style="overflow:hidden;">
        ${thumb}
        <div style="padding:15px;">
          ${badge}
          <div style="font-size:10px;color:var(--color-gold);font-weight:700;
               letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;">${label}</div>
          <h4 style="color:var(--color-text);font-size:13px;line-height:1.45;margin-bottom:4px;">${item.title}</h4>
          <p style="font-size:11px;color:var(--color-text-faint);">${item.date||item.views||''}</p>
        </div>
      </article>`;
  }

  /* Fixed service cards */
  function buildServiceCard(icon, title, subtitle, schedule, times, ytLink, topic) {
    return `
      <article class="card" style="overflow:hidden;text-align:center;padding:28px 20px;">
        <div style="font-size:44px;margin-bottom:12px;">${icon}</div>
        <div style="font-size:10px;color:${TOPIC_COLOR[topic]||'var(--color-gold)'};font-weight:700;
             letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">${TOPIC_LABEL[topic]||''}</div>
        <h4 style="color:var(--color-text);font-size:15px;margin-bottom:4px;">${title}</h4>
        <p style="font-size:12px;color:var(--color-text-faint);margin-bottom:10px;">${subtitle}</p>
        <p style="font-size:12px;color:var(--color-gold);font-weight:600;margin-bottom:4px;">${schedule}</p>
        ${times.map(t=>`<p style="font-size:11px;color:var(--color-text-faint);">${t}</p>`).join('')}
        <a href="${ytLink}" target="_blank" rel="noopener"
           style="display:inline-flex;align-items:center;gap:6px;margin-top:14px;
                  padding:8px 20px;border-radius:99px;background:var(--color-gold);
                  color:#111;font-size:12px;font-weight:700;text-decoration:none;">
          ▶ Watch Live
        </a>
      </article>`;
  }

  /* Shorts / reel card */
  function buildReelCard(item) {
    const id = (item.videoId || '').replace(/^\/+/, '');
    return `
      <div style="width:180px;aspect-ratio:9/16;border-radius:14px;overflow:hidden;
           background:var(--color-bg-2);border:1px solid var(--color-border);
           position:relative;flex-shrink:0;">
        <iframe src="https://www.youtube.com/embed/${id}" title="${item.title||'Short'}"
          frameborder="0" loading="lazy"
          allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
          allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>
      </div>`;
  }

  /* ── SEARCH + FILTER ── */

  function applyFilter() {
    const q = searchQuery.trim().toLowerCase();
    const f = activeFilter;
    if (!q && f === 'all') { showNormalSections(); return; }
    const results = allVideos.filter(v => {
      const mt = f === 'all' || v.topic === f || v._topic === f;
      const mq = !q || (v.title||'').toLowerCase().includes(q) || (v.description||'').toLowerCase().includes(q);
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
    const label = f !== 'all'
      ? `${TOPIC_LABEL[f]||f}`
      : `"${q}"`;
    const countEl = document.getElementById('search-result-count');
    if (countEl) countEl.innerHTML = `${results.length} video${results.length!==1?'s':''} — ${label}`;
    grid.innerHTML = results.length
      ? results.map(i => buildCard(i, i._label||'Video', i.topic||i._topic)).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--color-text-faint);">
           <div style="font-size:48px;margin-bottom:12px;">🔍</div>
           <p>No videos found. Try a different search or filter.</p>
         </div>`;
  }

  function showNormalSections() {
    document.getElementById('search-results-section').style.display = 'none';
    document.querySelectorAll('.normal-section').forEach(s => s.style.display = '');
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

  /* ── RENDER SECTIONS ── */

  function renderRecentLives(videos) {
    const el = document.getElementById('recent-streams-grid');
    if (el) el.innerHTML = videos.length
      ? videos.map(v => buildCard(v, 'Live Stream', v.topic)).join('')
      : '<p style="color:var(--color-text-faint);padding:20px;">No recent streams found.</p>';
  }

  function renderServices() {
    const el = document.getElementById('services-grid');
    if (!el) return;
    el.innerHTML =
      buildServiceCard('🙏','Sunday Service','Family Gathering',
        'Every Sunday',['5:30 AM • 8:30 AM • 11:30 AM'],
        'https://www.youtube.com/@ElimNewJerusalemChurchOfficial/streams','worship') +
      buildServiceCard('✝️','Friday Prayer','Family Blessing',
        'Every Friday',['11:00 AM – 1:30 PM'],
        'https://www.youtube.com/@ElimNewJerusalemChurchOfficial/streams','prayer') +
      buildServiceCard('🔥','Deliverance Meeting','Power & Freedom',
        'Special Sessions',['Check announcements'],
        `https://www.youtube.com/playlist?list=${PLAYLIST_DELIVERANCE}`,'deliverance');
  }

  function renderDeliverance(videos) {
    const el = document.getElementById('deliverance-grid');
    if (el) el.innerHTML = videos.map(v => buildCard(v, 'Deliverance', 'deliverance')).join('');
  }

  function renderTestimony(videos) {
    const el = document.getElementById('testimony-grid');
    if (el) el.innerHTML = videos.map(v => buildCard(v, 'Testimony', 'testimony')).join('');
  }

  function renderShorts(videos) {
    const el = document.getElementById('verse-reels-row');
    if (el && videos.length) el.innerHTML = videos.map(buildReelCard).join('');
  }

  /* ── TESTIMONIALS CAROUSEL ── */

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
    window.changeTestimonial = d => { idx = (idx+d+items.length)%items.length; render(); };
    setInterval(() => window.changeTestimonial(1), 5000);
    render();
  }

  /* ── COUNTDOWN ── */

  function startCountdown() {
    const pad = n => String(Math.floor(n)).padStart(2,'0');
    const getNext = () => {
      const now = new Date(), d = now.getDay()===0?7:7-now.getDay(), next = new Date(now);
      next.setDate(now.getDate()+d); next.setHours(5,30,0,0); return next;
    };
    const tick = () => {
      const diff = getNext() - Date.now(); if (diff<0) return;
      document.getElementById('cd-d').textContent = pad(diff/86_400_000);
      document.getElementById('cd-h').textContent = pad((diff%86_400_000)/3_600_000);
      document.getElementById('cd-m').textContent = pad((diff%3_600_000)/60_000);
      document.getElementById('cd-s').textContent = pad((diff%60_000)/1_000);
    };
    setInterval(tick,1000); tick();
  }

  /* ── FALLBACK ── */

  async function loadFallback() {
    try {
      const r = await fetch('data/events.json'); if (!r.ok) return null;
      return await r.json();
    } catch { return null; }
  }

  /* ── INIT ── */

  document.addEventListener('DOMContentLoaded', async () => {
    startCountdown();
    renderServices();

    const fallback = await loadFallback();
    if (fallback) initTestimonials(fallback.testimonials||[]);

    // Parallel fetch all
    const [lives, deliverance, testimony] = await Promise.all([
      fetchRecentLives(3),
      fetchPlaylistVideos(PLAYLIST_DELIVERANCE, 6),
      fetchPlaylistVideos(PLAYLIST_TESTIMONY, 6),
    ]);

    renderRecentLives(lives);
    renderDeliverance(deliverance);
    renderTestimony(testimony);

    // Shorts from fallback reels
    if (fallback?.verseReels) renderShorts(fallback.verseReels);

    // Build search pool
    allVideos = [
      ...lives.map(v=>({...v, _label:'Live Stream'})),
      ...deliverance.map(v=>({...v, _label:'Deliverance', topic:'deliverance'})),
      ...testimony.map(v=>({...v, _label:'Testimony', topic:'testimony'})),
    ];

    initFilterButtons();
    initSearch();
  });

})();

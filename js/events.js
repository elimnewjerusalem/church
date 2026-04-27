/**
 * ENJC — events.js v4
 * Fetches LIVE STREAMS from main channel using YouTube Search API.
 * Channel: @ElimNewJerusalemChurchOfficial
 * Falls back to events.json if API fails.
 */

(function () {
  'use strict';

  const YT_API_KEY = 'AIzaSyCJGQlJzkfqykHnq1pxbIR_gx0SwkpCo_Y';
  const CHANNEL_ID = 'UC4yhaUWMXi-Ven-QAVx4j7w'; // ElimNewJerusalemChurchOfficial
  const MAX_RESULTS = 12;

  let allVideos    = [];
  let activeFilter = 'all';
  let searchQuery  = '';

  /* ── YOUTUBE API: fetch completed live streams ── */

  async function fetchLiveStreams() {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet`
        + `&channelId=${CHANNEL_ID}`
        + `&eventType=completed`
        + `&type=video`
        + `&order=date`
        + `&maxResults=${MAX_RESULTS}`
        + `&key=${YT_API_KEY}`;

      const res  = await fetch(url);
      const data = await res.json();

      if (data.error) throw new Error(data.error.message);

      return (data.items || []).map(item => ({
        videoId:     item.id.videoId,
        title:       item.snippet.title,
        description: item.snippet.description,
        date:        new Date(item.snippet.publishedAt).toLocaleDateString('en-IN', {
                       day: 'numeric', month: 'long', year: 'numeric'
                     }),
        thumbnail:   item.snippet.thumbnails?.medium?.url || '',
        topic:       guessTopic(item.snippet.title, item.snippet.description),
        _label:      'Live Stream',
        _source:     'youtube'
      }));
    } catch (err) {
      console.warn('YouTube API error:', err.message);
      return null;
    }
  }

  function guessTopic(title, desc) {
    const t = (title + ' ' + desc).toLowerCase();
    if (/worship|praise|song|sing|glory|hallelujah|ஆராதனை/.test(t)) return 'worship';
    if (/prayer|pray|fast|intercession|night prayer|ஜெபம்/.test(t)) return 'prayer';
    if (/short|reel|verse|scripture/.test(t))                        return 'shorts';
    return 'message';
  }

  /* ── FALLBACK ── */

  async function loadEventsData() {
    try {
      const res = await fetch('data/events.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('events.js: fallback failed —', err.message);
      return null;
    }
  }

  /* ── CARD BUILDERS ── */

  function topicColor(topic) {
    return { worship:'#7c6cf0', prayer:'#059669', message:'#d97706', shorts:'#dc2626' }[topic] || '#6b7280';
  }

  function topicLabel(topic) {
    return { worship:'🙏 Worship', prayer:'✝️ Prayer', message:'📢 Message', shorts:'📱 Shorts' }[topic] || '🎬 Video';
  }

  function buildVideoCard(item, label) {
    const id    = (item.videoId || '').replace(/^\/+/, '');
    const meta  = item.date || item.views || '';
    const badge = item.topic
      ? `<span style="display:inline-block;padding:2px 8px;border-radius:99px;font-size:9px;
             font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;
             background:${topicColor(item.topic)};color:#fff;">${topicLabel(item.topic)}</span><br>`
      : '';

    const media = item.thumbnail
      ? `<a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener"
            style="display:block;position:relative;aspect-ratio:16/9;background:#000;overflow:hidden;">
           <img src="${item.thumbnail}" alt="${item.title}"
                style="width:100%;height:100%;object-fit:cover;opacity:0.9;"
                loading="lazy">
           <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
             <div style="width:52px;height:52px;background:rgba(255,0,0,0.9);border-radius:50%;
                  display:flex;align-items:center;justify-content:center;">
               <span style="color:#fff;font-size:20px;margin-left:4px;">▶</span>
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
        ${media}
        <div style="padding:16px;">
          ${badge}
          <div style="font-size:10px;color:var(--color-gold);font-weight:700;
               letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">${label}</div>
          <h4 style="color:var(--color-text);margin-bottom:4px;font-size:13px;line-height:1.4;">${item.title}</h4>
          <p style="font-size:11px;color:var(--color-text-faint);">${meta}</p>
        </div>
      </article>`;
  }

  function buildReelCard(item) {
    const id = (item.videoId || '').replace(/^\/+/, '');
    return `
      <div style="width:200px;aspect-ratio:9/16;border-radius:14px;overflow:hidden;
           background:var(--color-bg-2);border:1px solid var(--color-border);
           position:relative;flex-shrink:0;">
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
    if (!q && f === 'all') { showNormalSections(); return; }

    const results = allVideos.filter(item => {
      const matchTopic = f === 'all' || item.topic === f;
      const matchQuery = !q ||
        (item.title       || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q);
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
      ? `Topic: <strong>${topicLabel(f)}</strong>`
      : `Results for "<strong>${q}</strong>"`;

    const countEl = document.getElementById('search-result-count');
    if (countEl) countEl.innerHTML =
      `${results.length} video${results.length !== 1 ? 's' : ''} — ${label}`;

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
        document.querySelectorAll('[data-filter]').forEach(b =>
          b.classList.toggle('enjc-filter-active', b.dataset.filter === activeFilter)
        );
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

  /* ── RENDER SECTIONS ── */

  function renderYouTubeVideos(videos) {
    const recentEl = document.getElementById('recent-streams-grid');
    if (recentEl) {
      recentEl.innerHTML = videos.slice(0, 3)
        .map(i => buildVideoCard(i, 'Live Stream')).join('');
    }
    const watchedEl = document.getElementById('most-watched-grid');
    if (watchedEl) {
      watchedEl.innerHTML = videos.slice(3, 6)
        .map(i => buildVideoCard(i, 'Live Stream')).join('');
    }
    // Update headings
    const h1 = document.getElementById('streams-heading');
    if (h1) h1.innerHTML = '📺 Recent Live <em>Streams</em>';
    const h2 = document.getElementById('popular-heading');
    if (h2) h2.innerHTML = '🔥 More Live <em>Sessions</em>';
  }

  function renderFallback(data) {
    const recentEl = document.getElementById('recent-streams-grid');
    if (recentEl) recentEl.innerHTML =
      (data.recentStreams || []).map(i => buildVideoCard(i, 'Recent Stream')).join('');
    const watchedEl = document.getElementById('most-watched-grid');
    if (watchedEl) watchedEl.innerHTML =
      (data.mostWatched || []).map(i => buildVideoCard(i, i.views || 'Most Watched')).join('');
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
    window.changeTestimonial = dir => {
      idx = (idx + dir + items.length) % items.length; render();
    };
    setInterval(() => window.changeTestimonial(1), 5000);
    render();
  }

  /* ── COUNTDOWN ── */

  function startCountdown() {
    function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }
    function getNextSunday() {
      const now  = new Date();
      const days = now.getDay() === 0 ? 7 : 7 - now.getDay();
      const next = new Date(now);
      next.setDate(now.getDate() + days);
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

    // Always load fallback for reels + testimonials
    const data = await loadEventsData();
    if (data) {
      initTestimonials(data.testimonials || []);
      renderVerseReels(data.verseReels   || []);
    }

    // Fetch live streams from YouTube
    const streams = await fetchLiveStreams();

    if (streams && streams.length) {
      renderYouTubeVideos(streams);
      allVideos = [
        ...streams.map(i => ({ ...i, _label: 'Live Stream' })),
        ...(data?.verseReels || []).map(i => ({ ...i, _label: 'Verse Reel', topic: 'shorts' })),
      ];
      console.log(`✅ YouTube API: ${streams.length} live streams loaded`);
    } else {
      if (data) renderFallback(data);
      allVideos = [
        ...(data?.recentStreams || []).map(i => ({ ...i, _label: 'Recent Stream' })),
        ...(data?.mostWatched   || []).map(i => ({ ...i, _label: i.views || 'Most Watched' })),
        ...(data?.verseReels    || []).map(i => ({ ...i, _label: 'Verse Reel', topic: 'shorts' })),
      ];
      console.warn('⚠️ Fallback: using events.json');
    }

    initFilterButtons();
    initSearch();
  });

})();

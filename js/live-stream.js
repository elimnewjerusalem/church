// ═══════════════════════════════════════════════════════════
//  ENJC live-stream.js — Dark Cinematic Edition
//  Auto-detects live time, shows live player or offline card
// ═══════════════════════════════════════════════════════════

// ── UPDATE THESE WHEN GOING LIVE ────────────────────────────
const YOUTUBE_LIVE_IDS = {
  mainChannel:   '',   // paste live videoId here e.g. 'dQw4w9WgXcQ'
  shortsChannel: ''
};

// ── CHANNEL & SCHEDULE CONFIG ────────────────────────────────
const LIVE_STREAMS = {
  mainChannel: {
    name: 'Elim New Jerusalem Church',
    channelUrl: 'https://www.youtube.com/@ElimNewJerusalemChurchOfficial',
    liveUrl:    'https://www.youtube.com/@ElimNewJerusalemChurchOfficial/live',
    images: {
      friday: 'images/Live/friday-prayer.jpg',
      sunday: 'images/Live/sunday-worship.jpg'
    },
    schedule: [
      { day:5, startTime:'11:00', endTime:'14:00', imageKey:'friday', title:'Friday Family Blessing Prayer',  description:'Join us for powerful prayer and worship' },
      { day:0, startTime:'05:30', endTime:'07:30', imageKey:'sunday', title:'Sunday Worship — 1st Service',   description:'Join us for inspiring worship and messages' },
      { day:0, startTime:'08:30', endTime:'10:30', imageKey:'sunday', title:'Sunday Worship — 2nd Service',   description:'Join us for inspiring worship and messages' },
      { day:0, startTime:'12:00', endTime:'14:00', imageKey:'sunday', title:'Sunday Worship — 3rd Service',   description:'Join us for inspiring worship and messages' }
    ]
  },
  shortsChannel: {
    name: 'ENJC Shorts',
    channelUrl: 'https://www.youtube.com/@ENJCShorts',
    liveUrl:    'https://www.youtube.com/@ENJCShorts/live',
    image: 'images/Live/night-prayer.jpg',
    schedule: [
      { day:'all', startTime:'22:30', endTime:'23:00', title:'Daily Night Prayer', description:'End your day with prayer and devotion' }
    ]
  }
};

// ── HELPERS ──────────────────────────────────────────────────
function isLiveTime(schedule) {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  for (const slot of schedule) {
    if (slot.day !== 'all' && slot.day !== day) continue;
    const [sh, sm] = slot.startTime.split(':').map(Number);
    const [eh, em] = slot.endTime.split(':').map(Number);
    if (mins >= sh*60+sm && mins <= eh*60+em) return slot;
  }
  return null;
}

function getActiveLiveStream() {
  const mainSlot = isLiveTime(LIVE_STREAMS.mainChannel.schedule);
  if (mainSlot) return { stream: LIVE_STREAMS.mainChannel, slot: mainSlot, type: 'main' };
  const shortsSlot = isLiveTime(LIVE_STREAMS.shortsChannel.schedule);
  if (shortsSlot) return { stream: LIVE_STREAMS.shortsChannel, slot: shortsSlot, type: 'shorts' };
  return null;
}

// ── DARK CINEMATIC STYLES ─────────────────────────────────────
const lsStyles = document.createElement('style');
lsStyles.textContent = `
  #live-stream-section{background:var(--dark2,#0d1520)}
  .ls-live-wrap{max-width:960px;margin:0 auto}
  .ls-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,0,0,.15);border:1px solid rgba(255,0,0,.4);color:#ff4444;font-size:10px;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px}
  .ls-live-dot{width:7px;height:7px;border-radius:50%;background:#ff4444;animation:lspulse 1.2s infinite}
  @keyframes lspulse{0%,100%{opacity:1}50%{opacity:.3}}
  .ls-thumb-wrap{position:relative;border-radius:8px;overflow:hidden;cursor:pointer;border:1px solid rgba(245,166,35,.2)}
  .ls-thumb-wrap img{width:100%;height:auto;display:block;object-fit:cover;transition:transform .4s}
  .ls-thumb-wrap:hover img{transform:scale(1.02)}
  .ls-thumb-overlay{position:absolute;inset:0;background:rgba(5,8,16,.35)}
  .ls-play-btn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:72px;height:72px;border-radius:50%;background:rgba(255,0,0,.9);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 12px rgba(255,0,0,.2);transition:transform .2s}
  .ls-thumb-wrap:hover .ls-play-btn{transform:translate(-50%,-50%) scale(1.08)}
  .ls-desc{color:rgba(232,237,244,.55);font-size:.9rem;margin:14px 0 18px;text-align:center}
  .ls-btn-live{display:inline-flex;align-items:center;gap:8px;background:#ff0000;color:white;padding:11px 28px;border-radius:4px;font-weight:700;font-size:13px;text-decoration:none;transition:all .2s}
  .ls-btn-live:hover{background:#cc0000;transform:translateY(-1px)}

  /* ── OFFLINE CARD ── */
  .ls-offline-card{max-width:760px;margin:0 auto;background:rgba(255,255,255,.04);border:1px solid rgba(245,166,35,.2);border-radius:8px;overflow:hidden}
  .ls-offline-top{background:linear-gradient(135deg,var(--navy,#0b2545),#050d1a);padding:28px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .ls-offline-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(232,237,244,.4);margin-bottom:6px}
  .ls-offline-title{font-family:'Playfair Display',Georgia,serif;color:white;font-size:1.25rem;font-weight:700}
  .ls-offline-sub{color:rgba(232,237,244,.45);font-size:.83rem;margin-top:4px}
  .ls-offline-btn{background:var(--gold,#f5a623);color:#080c10;padding:10px 22px;border-radius:4px;font-weight:700;font-size:12px;text-decoration:none;white-space:nowrap;transition:all .2s;flex-shrink:0}
  .ls-offline-btn:hover{background:var(--gold2,#ffd166);transform:translateY(-1px)}
  .ls-schedule-grid{display:grid;grid-template-columns:repeat(3,1fr);padding:0}
  .ls-sched-cell{padding:18px;border-right:1px solid rgba(255,255,255,.07);text-align:center}
  .ls-sched-cell:last-child{border-right:none}
  .ls-sched-day{color:var(--gold,#f5a623);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
  .ls-sched-time{color:white;font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:800;line-height:1.2;margin-bottom:4px}
  .ls-sched-name{color:rgba(232,237,244,.4);font-size:9px;text-transform:uppercase;letter-spacing:.5px}
  .ls-offline-footer{padding:14px 20px;border-top:1px solid rgba(255,255,255,.07);text-align:center}
  .ls-offline-footer p{color:rgba(232,237,244,.35);font-size:.8rem}
  @media(max-width:768px){
    .ls-schedule-grid{grid-template-columns:1fr}
    .ls-sched-cell{border-right:none;border-bottom:1px solid rgba(255,255,255,.07);padding:14px 16px}
    .ls-sched-cell:last-child{border-bottom:none}
    .ls-offline-top{flex-direction:column;text-align:center}
    .ls-play-btn{width:56px;height:56px}
  }
`;
document.head.appendChild(lsStyles);

// ── RENDER ───────────────────────────────────────────────────
function displayLiveStream() {
  const container = document.getElementById('live-stream-container');
  const section   = document.getElementById('live-stream-section');
  if (!container || !section) return;

  section.style.display = 'block';
  const activeData = getActiveLiveStream();

  if (activeData) {
    // ── LIVE NOW ──
    const { stream, slot, type } = activeData;
    const videoId = type === 'main' ? YOUTUBE_LIVE_IDS.mainChannel : YOUTUBE_LIVE_IDS.shortsChannel;
    const thumbUrl = videoId && videoId.length > 4
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : (type === 'main' ? stream.images[slot.imageKey] : stream.image);

    container.innerHTML = `
<div class="ls-live-wrap">
  <div style="text-align:center;margin-bottom:16px">
    <div class="ls-badge"><div class="ls-live-dot"></div>Live Now</div>
    <h2 style="font-family:'Playfair Display',serif;color:white;font-size:1.5rem;font-weight:700;margin-bottom:4px">${slot.title}</h2>
    <p class="ls-desc">${slot.description}</p>
  </div>
  <a href="${stream.liveUrl}" target="_blank" rel="noopener" class="ls-thumb-wrap" style="display:block;text-decoration:none">
    <img src="${thumbUrl}" alt="${slot.title}" onerror="this.src='images/Live/common.jpg'">
    <div class="ls-thumb-overlay"></div>
    <div class="ls-play-btn"><svg width="26" height="26" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg></div>
  </a>
  <div style="text-align:center;margin-top:20px">
    <a href="${stream.liveUrl}" target="_blank" rel="noopener" class="ls-btn-live">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
      Watch Live Now
    </a>
  </div>
</div>`;

  } else {
    // ── OFFLINE — dark cinematic card ──
    container.innerHTML = `
<div class="ls-offline-card">
  <div class="ls-offline-top">
    <div>
      <div class="ls-offline-label">Live stream</div>
      <div class="ls-offline-title">Join Us This Week</div>
      <div class="ls-offline-sub">We stream live on YouTube every service</div>
    </div>
    <a href="https://www.youtube.com/@ElimNewJerusalemChurchOfficial" target="_blank" rel="noopener" class="ls-offline-btn">
      &#128250; Visit YouTube Channel
    </a>
  </div>

  <div class="ls-schedule-grid">
    <div class="ls-sched-cell">
      <div class="ls-sched-day">Friday</div>
      <div class="ls-sched-time">11:00am</div>
      <div class="ls-sched-name">Family Blessing Prayer</div>
    </div>
    <div class="ls-sched-cell">
      <div class="ls-sched-day">Sunday</div>
      <div class="ls-sched-time">5:30 &middot; 8:30 &middot; 12:00</div>
      <div class="ls-sched-name">Sunday Service</div>
    </div>
    <div class="ls-sched-cell">
      <div class="ls-sched-day">Every Night</div>
      <div class="ls-sched-time">10:30pm</div>
      <div class="ls-sched-name">Family Prayer</div>
    </div>
  </div>

  <div class="ls-offline-footer">
    <p>We&rsquo;re not live right now &mdash; watch our previous services on YouTube</p>
  </div>
</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayLiveStream();
  setInterval(displayLiveStream, 60000);
});
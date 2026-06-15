// ═══════════════════════════════════════════════════════════════
//  ENJC Bible — bible-mobile.js
//  Mobile-only Bible app UI: Book picker → Chapter grid → Reader
//  Injects a full-screen app shell on mobile (≤640px).
//  Hooks into bible.js state (S, BOOKS, loadCh, getRead etc.)
// ═══════════════════════════════════════════════════════════════
'use strict';

(function(){
  const isMobile = () => window.innerWidth <= 640 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile()) return; // PC: don't run

  // Immediately hide desktop content to prevent flash
  const _earlyHide = document.createElement('style');
  _earlyHide.textContent = `
    @media (max-width: 640px) {
      .nx-top, .nx-mid, #bcontent, .ch-bar, header,
      .site-footer, .mob-nav { visibility: hidden; }
    }
  `;
  document.head.appendChild(_earlyHide);

  // ── Wait for DOM ready (handle if already fired) ────────────
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      setTimeout(fn, 0);
    }
  }
  onReady(() => setTimeout(initMobileApp, 80));

  // ── State ────────────────────────────────────────────────────
  const MS = {
    screen: 'books', // 'books' | 'chapters' | 'reader'
    otnt: 'OT',
    selBook: null,   // BOOKS entry
    selCh: null,
  };

  // ── Build app shell ──────────────────────────────────────────
  function initMobileApp() {
    if (typeof BOOKS === 'undefined' || !BOOKS?.length) {
      // BOOKS not ready yet — retry
      setTimeout(initMobileApp, 100);
      return;
    }
    injectHideStyles();
    buildShell();
    renderBooks();
  }

  function injectHideStyles() {
    const s = document.createElement('style');
    s.id = 'mob-bible-hide';
    s.textContent = `
      @media (max-width: 640px) {
        .nx-top, .nx-mid, .nx-feat-bar, .offline-bar { display: none !important; }
        #bcontent { display: none !important; }
        .ch-bar, .ch-prog, .audio-bar { display: none !important; }
        header, .mob-nav, .wa-float, .site-footer, .scroll-top-btn { display: none !important; }
        body { overflow: hidden !important; }
        #mob-bible-app { display: flex !important; }
      }
    `;
    document.head.appendChild(s);
  }

  function buildShell() {
    const app = document.createElement('div');
    app.id = 'mob-bible-app';
    app.innerHTML = `
      <!-- SCREEN: BOOKS -->
      <div id="mb-screen-books" class="mb-screen mb-active">
        <div class="mb-header">
          <a href="app.html" class="mb-back" aria-label="Home">‹ Home</a>
          <div class="mb-brand">📖 ENJC Bible</div>
          <div class="mb-lang-row">
            <button class="mb-lang on" id="mb-btn-ta" onclick="mbSetLang('ta')">தமிழ்</button>
            <button class="mb-lang" id="mb-btn-en" onclick="mbSetLang('en')">English</button>
          </div>
        </div>
        <div class="mb-tabs">
          <button class="mb-tab on" id="mb-ot" onclick="mbTab('OT')">பழைய ஏற்பாடு</button>
          <button class="mb-tab" id="mb-nt" onclick="mbTab('NT')">புதிய ஏற்பாடு</button>
        </div>
        <div class="mb-search-row">
          <input id="mb-bsearch" class="mb-search" type="search" placeholder="Book தேடுக..." oninput="mbBookSearch(this.value)" autocomplete="off">
        </div>
        <div class="mb-book-list" id="mb-book-list"></div>
      </div>

      <!-- SCREEN: CHAPTERS -->
      <div id="mb-screen-chapters" class="mb-screen">
        <div class="mb-header">
          <button class="mb-back" onclick="mbGoBooks()">‹ புத்தகங்கள்</button>
          <div class="mb-header-title" id="mb-ch-title">—</div>
          <div style="width:70px"></div>
        </div>
        <div class="mb-ch-meta" id="mb-ch-meta"></div>
        <div class="mb-ch-grid" id="mb-ch-grid"></div>
      </div>

      <!-- SCREEN: READER -->
      <div id="mb-screen-reader" class="mb-screen">
        <div class="mb-header">
          <button class="mb-back" onclick="mbGoChapters()">‹ அதிகாரங்கள்</button>
          <div class="mb-header-title" id="mb-reader-title">—</div>
          <button class="mb-header-btn" onclick="mbOpenSettings()">⚙</button>
        </div>
        <div id="mb-reader-content" class="mb-reader-content"></div>
        <div class="mb-reader-nav">
          <button class="mb-nav-btn" id="mb-prev" onclick="mbPrevCh()">← Prev</button>
          <button class="mb-nav-play" onclick="mbPlayAll()">▶ Play</button>
          <button class="mb-nav-btn" id="mb-next" onclick="mbNextCh()">Next →</button>
        </div>
        <div class="mb-audio-bar" id="mb-audio-bar">
          <button class="mb-aud-play" onclick="mbTogPlay()" id="mb-aud-play-btn">▶</button>
          <div class="mb-aud-info">
            <div class="mb-aud-title" id="mb-aud-title">ENJC Bible</div>
            <div class="mb-aud-sub" id="mb-aud-sub">வசனத்தை தொட்டு கேளுங்கள்</div>
          </div>
          <button class="mb-aud-stop" onclick="mbStopAud()">■</button>
        </div>
      </div>

      <!-- VERSE ACTION SHEET -->
      <div class="mb-backdrop" id="mb-verse-backdrop" onclick="mbCloseVerse()"></div>
      <div class="mb-verse-sheet" id="mb-verse-sheet">
        <div class="mb-vs-handle"></div>
        <div class="mb-vs-ref" id="mb-vs-ref">—</div>
        <div class="mb-vs-ta" id="mb-vs-ta"></div>
        <div class="mb-vs-en" id="mb-vs-en"></div>
        <div class="mb-vs-acts">
          <button class="mb-vs-act" onclick="mbVAct('ta-audio')">
            <span class="mb-vs-act-ic" style="background:#166534">🔊</span>
            <span>Tamil</span>
          </button>
          <button class="mb-vs-act" onclick="mbVAct('en-audio')">
            <span class="mb-vs-act-ic" style="background:#134e4a">🔉</span>
            <span>English</span>
          </button>
          <button class="mb-vs-act" onclick="mbVAct('save')">
            <span class="mb-vs-act-ic" id="mb-vs-bm-ic" style="background:#991b1b">♡</span>
            <span id="mb-vs-bm-lbl">Save</span>
          </button>
          <button class="mb-vs-act" onclick="mbVAct('image')">
            <span class="mb-vs-act-ic" style="background:#581c87">🖼</span>
            <span>Image</span>
          </button>
          <button class="mb-vs-act" onclick="mbVAct('copy')">
            <span class="mb-vs-act-ic" style="background:#92400e">📋</span>
            <span>Copy</span>
          </button>
          <button class="mb-vs-act" onclick="mbVAct('share')">
            <span class="mb-vs-act-ic" style="background:#1e3a8a">↗</span>
            <span>Share</span>
          </button>
        </div>
      </div>

      <!-- SETTINGS SHEET -->
      <div class="mb-backdrop" id="mb-settings-backdrop" onclick="mbCloseSettings()"></div>
      <div class="mb-settings-sheet" id="mb-settings-sheet">
        <div class="mb-vs-handle"></div>
        <div class="mb-set-title">⚙ Settings</div>
        <div class="mb-set-row">
          <span class="mb-set-lbl">மொழி</span>
          <div class="mb-set-pills">
            <button class="mb-set-pill on" id="mb-set-ta" onclick="mbSetLang('ta')">தமிழ்</button>
            <button class="mb-set-pill" id="mb-set-en" onclick="mbSetLang('en')">English</button>
          </div>
        </div>
        <div class="mb-set-row">
          <span class="mb-set-lbl">எழுத்து அளவு</span>
          <div class="mb-set-pills">
            <button class="mb-set-pill" onclick="mbFont(-2)">A−</button>
            <span class="mb-set-fsz" id="mb-set-fsz">17px</span>
            <button class="mb-set-pill" onclick="mbFont(2)">A+</button>
          </div>
        </div>
        <div class="mb-set-row">
          <span class="mb-set-lbl">Parallel mode</span>
          <label class="mb-tog-wrap">
            <input type="checkbox" id="mb-para-chk" onchange="mbTogParallel(this.checked)">
            <span class="mb-tog"></span>
          </label>
        </div>
      </div>

      <div id="mb-toast" class="mb-toast"></div>
    `;
    document.body.appendChild(app);
    injectMobileCSS();
  }

  // ── Navigation ───────────────────────────────────────────────
  function mbShow(screen) {
    MS.screen = screen;
    document.querySelectorAll('.mb-screen').forEach(s => s.classList.remove('mb-active'));
    document.getElementById('mb-screen-' + screen)?.classList.add('mb-active');
    // Scroll to top
    const content = document.getElementById('mb-screen-' + screen);
    if (content) content.scrollTop = 0;
  }

  window.mbGoBooks = function() { mbShow('books'); renderBooks(); };
  window.mbGoChapters = function() { mbShow('chapters'); };

  // ── Books screen ─────────────────────────────────────────────
  function renderBooks(filter = '') {
    const list = document.getElementById('mb-book-list');
    if (!list) return;
    const read = typeof getRead === 'function' ? getRead() : {};
    const books = BOOKS.filter(b =>
      b.t === MS.otnt &&
      (!filter || b.ta.includes(filter) || b.name.toLowerCase().includes(filter.toLowerCase()))
    );
    list.innerHTML = books.map(b => {
      const chapRead = (read[b.id] || []).length;
      const pct = Math.round(chapRead / b.ch * 100);
      const badge = chapRead > 0 ? `<span class="mb-bk-pct">${pct}%</span>` : '';
      return `<button class="mb-bk-row" onclick="mbPickBook('${b.id}')">
        <span class="mb-bk-num">${b.n}</span>
        <span class="mb-bk-ta">${b.ta}</span>
        <span class="mb-bk-en">${b.name}</span>
        ${badge}
        <span class="mb-bk-arr">›</span>
      </button>`;
    }).join('');
  }

  window.mbTab = function(tab) {
    MS.otnt = tab;
    document.getElementById('mb-ot')?.classList.toggle('on', tab === 'OT');
    document.getElementById('mb-nt')?.classList.toggle('on', tab === 'NT');
    document.getElementById('mb-bsearch').value = '';
    renderBooks();
  };

  window.mbBookSearch = function(v) { renderBooks(v); };

  window.mbPickBook = function(id) {
    const bk = BOOKS.find(b => b.id === id);
    if (!bk) return;
    MS.selBook = bk;
    // Sync with bible.js S state
    S.book = id; S.bookName = bk.name; S.bookTaName = bk.ta;
    S.bookNum = bk.n; S.totalCh = bk.ch;
    // Update chapter screen
    document.getElementById('mb-ch-title').textContent = bk.ta + ' · ' + bk.name;
    document.getElementById('mb-ch-meta').textContent = bk.t === 'OT' ? 'பழைய ஏற்பாடு' : 'புதிய ஏற்பாடு';
    renderChGrid();
    mbShow('chapters');
  };

  // ── Chapter grid ─────────────────────────────────────────────
  function renderChGrid() {
    const grid = document.getElementById('mb-ch-grid');
    if (!grid || !MS.selBook) return;
    const read = typeof getRead === 'function' ? getRead() : {};
    const readChs = new Set(read[MS.selBook.id] || []);
    const cur = S.ch || 0;
    let html = '';
    for (let i = 1; i <= MS.selBook.ch; i++) {
      const isRead = readChs.has(i);
      const isCur  = i === cur && S.book === MS.selBook.id;
      html += `<button class="mb-ch-cell${isRead?' mb-ch-read':''}${isCur?' mb-ch-cur':''}" onclick="mbPickCh(${i})">${i}</button>`;
    }
    grid.innerHTML = html;
  }

  window.mbPickCh = function(ch) {
    MS.selCh = ch;
    S.ch = ch;
    if (document.getElementById('ch-sel')) {
      document.getElementById('ch-sel').value = ch;
    }
    mbShow('reader');
    mbLoadChapter();
  };

  // ── Reader ───────────────────────────────────────────────────
  function mbLoadChapter() {
    const content = document.getElementById('mb-reader-content');
    const title = document.getElementById('mb-reader-title');
    if (!content) return;
    const bk = MS.selBook || BOOKS.find(b => b.id === S.book);
    if (title && bk) title.textContent = bk.ta + ' ' + S.ch;
    content.innerHTML = `<div class="mb-loading"><div class="mb-spin"></div><p>ஏற்றுகிறது...</p></div>`;
    // Update nav buttons
    const prev = document.getElementById('mb-prev');
    const next = document.getElementById('mb-next');
    if (prev) prev.disabled = S.ch <= 1;
    if (next) next.disabled = S.ch >= S.totalCh;
    // Use bible.js loadCh — it renders into #bcontent, we'll mirror it
    if (typeof loadCh === 'function') {
      loadCh().then(() => {
        syncReaderContent();
      }).catch(() => {
        content.innerHTML = `<div class="mb-error">
          <div style="font-size:28px;margin-bottom:10px">📶</div>
          <p>${(MS.selBook||{}).ta||''} ${S.ch} — இணையம் தேவை</p>
          <button onclick="mbLoadChapter()" class="mb-retry-btn">🔄 மீண்டும் முயற்சி</button>
        </div>`;
      });
    }
  }

  function syncReaderContent() {
    const src = document.getElementById('bcontent');
    const dst = document.getElementById('mb-reader-content');
    if (!src || !dst) return;
    // Clone the verse content into our mobile reader
    dst.innerHTML = src.innerHTML;
    attachVerseHandlers(dst);
    // Update chapter title
    const bk = MS.selBook || BOOKS.find(b => b.id === S.book);
    const titleEl = document.getElementById('mb-reader-title');
    if (titleEl && bk) titleEl.textContent = bk.ta + ' ' + S.ch;
    // Update prev/next state
    const prev = document.getElementById('mb-prev');
    const next = document.getElementById('mb-next');
    if (prev) prev.disabled = S.ch <= 1;
    if (next) next.disabled = S.ch >= S.totalCh;
    // Refresh chapter grid read states
    renderChGrid();
  }

  // Attach long-press / tap handlers to verse items in our reader
  function attachVerseHandlers(container) {
    container.querySelectorAll('.vi').forEach(vi => {
      let holdTimer;
      vi.addEventListener('touchstart', () => {
        holdTimer = setTimeout(() => openVerseFromEl(vi), 600);
      }, { passive: true });
      vi.addEventListener('touchend', () => clearTimeout(holdTimer), { passive: true });
      vi.addEventListener('touchmove', () => clearTimeout(holdTimer), { passive: true });
    });
  }

  function openVerseFromEl(vi) {
    // Extract data from the vi element (bible.js renders onclick="openVModal(...)")
    const onclickAttr = vi.getAttribute('onclick') || '';
    const match = onclickAttr.match(/openVModal\((\d+)/);
    if (match && typeof openVModal === 'function') {
      const idx = parseInt(match[1]);
      openVModal(idx);
      return;
    }
    // Fallback: read text content
    const ta = vi.querySelector('.vtxt')?.textContent || '';
    const num = vi.querySelector('.vnum')?.textContent || '';
    mbOpenVerse({ num, ta, en: '', ref: (S.bookName||'') + ' ' + S.ch + ':' + num, taRef: (S.bookTaName||'') + ' ' + S.ch + ':' + num });
  }

  window.mbOpenVerse = function(v) {
    window._mbVerse = v;
    const isBm = S.bm && S.bm.some(b => b.ref === v.ref);
    document.getElementById('mb-vs-ref').textContent = v.taRef || v.ref || '—';
    document.getElementById('mb-vs-ta').textContent = v.ta || '';
    document.getElementById('mb-vs-en').textContent = v.en ? '"' + v.en + '"' : '';
    document.getElementById('mb-vs-bm-ic').textContent = isBm ? '♥' : '♡';
    document.getElementById('mb-vs-bm-lbl').textContent = isBm ? 'Saved' : 'Save';
    document.getElementById('mb-verse-backdrop').classList.add('on');
    document.getElementById('mb-verse-sheet').classList.add('on');
    document.body.style.overflow = 'hidden';
  };

  window.mbCloseVerse = function() {
    document.getElementById('mb-verse-backdrop').classList.remove('on');
    document.getElementById('mb-verse-sheet').classList.remove('on');
    document.body.style.overflow = '';
  };

  window.mbVAct = function(act) {
    const v = window._mbVerse;
    if (!v) return;
    if (act === 'ta-audio') {
      if (typeof speak === 'function') speak(v.ta || v.en, 'ta');
    } else if (act === 'en-audio') {
      if (typeof speak === 'function') speak(v.en || v.ta, 'en');
    } else if (act === 'save') {
      if (typeof togBM === 'function') togBM(v.ref, v.ta || '', v.en || '', v.taRef || '');
      const isBm = S.bm && S.bm.some(b => b.ref === v.ref);
      document.getElementById('mb-vs-bm-ic').textContent = isBm ? '♥' : '♡';
      document.getElementById('mb-vs-bm-lbl').textContent = isBm ? 'Saved' : 'Save';
      mbToast(isBm ? '♥ Saved!' : '✓ Removed');
    } else if (act === 'copy') {
      const txt = (v.taRef || v.ref) + '\n' + (v.ta || '') + '\n' + (v.en || '');
      navigator.clipboard?.writeText(txt);
      mbToast('📋 Copied!');
    } else if (act === 'share') {
      const txt = (v.taRef || v.ref) + '\n' + (v.ta || '') + '\n' + (v.en || '') + '\nhttps://elimnewjerusalem.github.io/church/bible.html';
      if (navigator.share) navigator.share({ title: 'ENJC', text: txt });
      else { navigator.clipboard?.writeText(txt); mbToast('Copied!'); }
    } else if (act === 'image') {
      try { localStorage.setItem('enjc_ig_verse', JSON.stringify({ ta: v.ta, tref: v.taRef, en: v.en, ref: v.ref })); } catch(e) {}
      window.open('imagegen.html', '_blank');
    }
    if (act !== 'save') mbCloseVerse();
  };

  // ── Chapter nav ──────────────────────────────────────────────
  window.mbPrevCh = function() {
    if (S.ch <= 1) return;
    S.ch--;
    if (document.getElementById('ch-sel')) document.getElementById('ch-sel').value = S.ch;
    mbLoadChapter();
  };

  window.mbNextCh = function() {
    if (S.ch >= S.totalCh) return;
    S.ch++;
    if (document.getElementById('ch-sel')) document.getElementById('ch-sel').value = S.ch;
    mbLoadChapter();
  };

  window.mbPlayAll = function() {
    if (typeof playAll === 'function') playAll();
    document.getElementById('mb-audio-bar')?.classList.add('show');
  };

  window.mbTogPlay = function() {
    if (typeof togPlay === 'function') togPlay();
  };

  window.mbStopAud = function() {
    if (typeof stopAud === 'function') stopAud();
    document.getElementById('mb-audio-bar')?.classList.remove('show');
  };

  // ── Language ─────────────────────────────────────────────────
  window.mbSetLang = function(l) {
    S.lang = l;
    ['ta','en'].forEach(x => {
      document.getElementById('mb-btn-' + x)?.classList.toggle('on', x === l);
      document.getElementById('mb-set-' + x)?.classList.toggle('on', x === l);
    });
    if (typeof setLang === 'function') setLang(l);
    if (MS.screen === 'reader') {
      setTimeout(syncReaderContent, 300);
    }
  };

  // ── Font size ─────────────────────────────────────────────────
  window.mbFont = function(delta) {
    if (typeof chFont === 'function') chFont(delta === 0 ? 0 : delta > 0 ? 1 : -1);
    document.getElementById('mb-set-fsz').textContent = S.fs + 'px';
  };

  // ── Parallel mode ────────────────────────────────────────────
  window.mbTogParallel = function(on) {
    S.showParallel = on;
    if (typeof togParallelNew === 'function') togParallelNew();
    if (MS.screen === 'reader') setTimeout(syncReaderContent, 200);
  };

  // ── Settings sheet ───────────────────────────────────────────
  window.mbOpenSettings = function() {
    document.getElementById('mb-settings-backdrop').classList.add('on');
    document.getElementById('mb-settings-sheet').classList.add('on');
    document.getElementById('mb-set-fsz').textContent = S.fs + 'px';
  };

  window.mbCloseSettings = function() {
    document.getElementById('mb-settings-backdrop').classList.remove('on');
    document.getElementById('mb-settings-sheet').classList.remove('on');
  };

  // ── Toast ────────────────────────────────────────────────────
  window.mbToast = function(msg) {
    const t = document.getElementById('mb-toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove('show'), 2000);
  };

  // Override the global toast on mobile to use our own
  const _origToast = window.toast;
  window.toast = function(msg) {
    if (isMobile()) mbToast(msg);
    else if (_origToast) _origToast(msg);
  };

  // Override openVModal to also show our verse sheet
  const _origOpenVModal = window.openVModal;
  window.openVModal = function(idx) {
    if (_origOpenVModal) _origOpenVModal(idx);
    // After bible.js sets _mv, mirror into mobile sheet
    setTimeout(() => {
      const mv = window._mv;
      if (mv && isMobile()) {
        const v = {
          num: mv.i + 1,
          ta: mv.ta || '',
          en: mv.en || '',
          ref: mv.ref || '',
          taRef: mv.taRef || ''
        };
        mbOpenVerse(v);
      }
    }, 50);
  };

  // ── Swipe verse sheet down to close ─────────────────────────
  (function() {
    const sheet = document.getElementById?.('mb-verse-sheet') ||
      document.querySelector?.('.mb-verse-sheet');
    if (!sheet) return;
    let startY = 0;
    sheet.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
    sheet.addEventListener('touchmove', e => {
      const dy = e.touches[0].clientY - startY;
      if (dy > 0) sheet.style.transform = `translateY(${Math.min(dy, 200)}px)`;
    }, { passive: true });
    sheet.addEventListener('touchend', e => {
      const dy = e.changedTouches[0].clientY - startY;
      sheet.style.transform = '';
      if (dy > 70) mbCloseVerse();
    });
  })();

  // ── CSS ──────────────────────────────────────────────────────
  function injectMobileCSS() {
    const s = document.createElement('style');
    s.textContent = `
/* ══════════════════════════════════════════
   Mobile Bible App Shell
══════════════════════════════════════════ */
#mob-bible-app {
  display: none;
  position: fixed; inset: 0; z-index: 2000;
  flex-direction: column;
  background: #08111f;
  font-family: var(--font-body, 'DM Sans', sans-serif);
  color: #dce8ff;
  overflow: hidden;
}

/* Screens */
.mb-screen {
  display: none; flex-direction: column;
  position: absolute; inset: 0;
  overflow: hidden;
}
.mb-screen.mb-active { display: flex; }

/* Header */
.mb-header {
  display: flex; align-items: center;
  padding: 10px 14px;
  background: #0d1e35;
  border-bottom: 1px solid #1e3a5f;
  flex-shrink: 0; gap: 8px;
  min-height: 52px;
}
.mb-brand { font-size: 14px; font-weight: 700; color: #c9a84c; letter-spacing: .04em; }
.mb-header-title { flex: 1; font-size: 13px; font-weight: 700; color: #c0d4f0; text-align: center; }
.mb-header-btn {
  background: transparent; border: 1px solid #1e3a5f; border-radius: 8px;
  color: #8aa0c0; font-size: 16px; padding: 4px 10px; cursor: pointer;
}
.mb-back {
  font-size: 12px; color: #c9a84c; background: transparent;
  border: none; cursor: pointer; padding: 4px 0; font-weight: 600;
  white-space: nowrap; width: 70px; text-align: left;
  text-decoration: none; display: inline-flex; align-items: center;
}
.mb-lang-row { display: flex; gap: 6px; margin-left: auto; }
.mb-lang {
  padding: 5px 12px; border-radius: 99px;
  background: rgba(255,255,255,.05); border: 1px solid #1e3a5f;
  color: #8aa0c0; font-size: 11px; font-weight: 600; cursor: pointer;
  font-family: var(--font-body);
}
.mb-lang.on { background: #c9a84c; color: #08111f; border-color: #c9a84c; }

/* OT/NT Tabs */
.mb-tabs {
  display: flex; flex-shrink: 0;
  background: #0d1e35; border-bottom: 1px solid #1e3a5f;
}
.mb-tab {
  flex: 1; padding: 10px; font-size: 12px; font-weight: 600;
  color: #8aa0c0; background: transparent; border: none;
  border-bottom: 2px solid transparent; cursor: pointer;
  font-family: var(--font-body); transition: all .15s;
}
.mb-tab.on { color: #c9a84c; border-bottom-color: #c9a84c; }

/* Book search */
.mb-search-row { padding: 10px 12px; background: #0a1628; flex-shrink: 0; }
.mb-search {
  width: 100%; padding: 9px 14px; border-radius: 10px;
  background: #0d1e35; border: 1px solid #1e3a5f;
  color: #dce8ff; font-size: 13px;
  font-family: var(--font-body); outline: none;
}
.mb-search::placeholder { color: #3a5a80; }

/* Book list */
.mb-book-list {
  flex: 1; overflow-y: auto;
  overscroll-behavior: contain;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;
}
.mb-bk-row {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 13px 14px;
  background: transparent; border: none;
  border-bottom: 1px solid rgba(30,58,95,.5);
  color: inherit; cursor: pointer; text-align: left;
  transition: background .1s;
  -webkit-tap-highlight-color: transparent;
}
.mb-bk-row:active { background: #1a2e50; }
.mb-bk-num {
  font-size: 11px; color: #c9a84c; font-weight: 600;
  width: 22px; text-align: right; flex-shrink: 0;
}
.mb-bk-ta {
  font-size: 15px; color: #c0d4f0; font-weight: 500;
  font-family: var(--font-tamil, 'Noto Serif Tamil', serif); flex: 1;
}
.mb-bk-en { font-size: 11px; color: #5a7a9a; white-space: nowrap; }
.mb-bk-pct {
  font-size: 10px; color: #4ade80; background: rgba(74,222,128,.1);
  border: 1px solid rgba(74,222,128,.2); border-radius: 99px;
  padding: 1px 7px; font-weight: 600; flex-shrink: 0;
}
.mb-bk-arr { font-size: 16px; color: #2a4a6a; flex-shrink: 0; }

/* Chapter screen */
.mb-ch-meta {
  padding: 6px 14px; font-size: 11px; color: #5a7a9a;
  background: #0a1628; border-bottom: 1px solid #1e3a5f; flex-shrink: 0;
}
.mb-ch-grid {
  flex: 1; overflow-y: auto; padding: 12px;
  display: grid; grid-template-columns: repeat(6,1fr); gap: 6px;
  align-content: start; overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
.mb-ch-cell {
  aspect-ratio: 1; border-radius: 8px;
  border: 1px solid #1e3a5f; background: rgba(255,255,255,.03);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: #8aa0c0; cursor: pointer;
  font-family: var(--font-body); transition: all .1s;
  -webkit-tap-highlight-color: transparent;
  min-height: 44px;
}
.mb-ch-cell:active { background: #1a2e50; }
.mb-ch-read {
  border-color: #1e5a40; color: #3a8060;
  background: rgba(74,222,128,.05);
}
.mb-ch-cur {
  background: #c9a84c; color: #08111f;
  border-color: #c9a84c; font-weight: 700;
}

/* Reader */
.mb-reader-content {
  flex: 1; overflow-y: auto; padding: 16px 14px 24px;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  font-size: 17px;
}
.mb-reader-content .vi {
  padding: 10px 0 10px 32px; position: relative;
  border-bottom: 1px solid rgba(30,58,95,.35);
}
.mb-reader-content .vnum {
  position: absolute; left: 0; top: 12px;
  font-size: 10px; color: #c9a84c; font-weight: 700; min-width: 24px;
}
.mb-reader-content .vtxt {
  font-family: var(--font-tamil, 'Noto Serif Tamil', serif);
  line-height: 1.75; color: #dce8ff;
}
.mb-reader-content .vi-en .vtxt {
  font-family: var(--font-body); font-style: italic; color: #8aa0c0; font-size: 14px;
}
.mb-loading, .mb-error {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; gap: 10px; color: #8aa0c0; font-size: 14px; text-align: center; padding: 20px;
}
.mb-spin {
  width: 32px; height: 32px; border-radius: 50%;
  border: 3px solid #1e3a5f; border-top-color: #c9a84c;
  animation: mbSpin .7s linear infinite;
}
@keyframes mbSpin { to { transform: rotate(360deg); } }
.mb-retry-btn {
  margin-top: 12px; padding: 10px 24px;
  background: #c9a84c; border: none; border-radius: 8px;
  color: #08111f; font-size: 13px; font-weight: 700; cursor: pointer;
}

/* Reader nav bar */
.mb-reader-nav {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; background: #0d1e35;
  border-top: 1px solid #1e3a5f; flex-shrink: 0;
}
.mb-nav-btn {
  flex: 1; padding: 10px 6px; background: rgba(255,255,255,.04);
  border: 1px solid #1e3a5f; border-radius: 8px;
  color: #8aa0c0; font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: var(--font-body); transition: all .15s;
}
.mb-nav-btn:disabled { opacity: .3; pointer-events: none; }
.mb-nav-btn:active { background: #1a2e50; }
.mb-nav-play {
  padding: 10px 20px; background: #c9a84c; border: none; border-radius: 8px;
  color: #08111f; font-size: 13px; font-weight: 700; cursor: pointer;
}

/* Audio bar */
.mb-audio-bar {
  display: none; align-items: center; gap: 8px;
  padding: 8px 12px; background: #0a1a2e;
  border-top: 1px solid #1e3a5f; flex-shrink: 0;
}
.mb-audio-bar.show { display: flex; }
.mb-aud-play {
  width: 36px; height: 36px; border-radius: 50%;
  background: #1e3a5f; border: none; color: #c9a84c;
  font-size: 14px; cursor: pointer; flex-shrink: 0;
}
.mb-aud-info { flex: 1; min-width: 0; }
.mb-aud-title { font-size: 12px; font-weight: 600; color: #c0d4f0; truncate: ellipsis; white-space: nowrap; overflow: hidden; }
.mb-aud-sub { font-size: 10px; color: #5a7a9a; }
.mb-aud-stop {
  padding: 6px 14px; background: rgba(239,68,68,.1);
  border: 1px solid rgba(239,68,68,.2); border-radius: 6px;
  color: #f87171; font-size: 13px; cursor: pointer;
}

/* Verse action sheet */
.mb-backdrop {
  display: none; position: fixed; inset: 0; z-index: 2100;
  background: rgba(0,0,0,.6);
}
.mb-backdrop.on { display: block; }
.mb-verse-sheet {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 2200;
  background: #0d1e35; border-radius: 18px 18px 0 0;
  border-top: 1px solid #1e3a5f;
  padding: 0 0 calc(env(safe-area-inset-bottom) + 10px);
  transform: translateY(100%); transition: transform .3s cubic-bezier(.4,0,.2,1);
}
.mb-verse-sheet.on { transform: translateY(0); }
.mb-vs-handle {
  width: 36px; height: 4px; border-radius: 99px;
  background: #1e3a5f; margin: 12px auto 10px;
}
.mb-vs-ref {
  padding: 0 16px 6px; font-size: 12px; color: #c9a84c; font-weight: 700;
}
.mb-vs-ta {
  padding: 0 16px 8px; font-size: 15px; color: #dce8ff; line-height: 1.65;
  font-family: var(--font-tamil, 'Noto Serif Tamil', serif);
}
.mb-vs-en {
  padding: 0 16px 8px; font-size: 12px; color: #8aa0c0; font-style: italic; line-height: 1.5;
}
.mb-vs-acts {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 8px; padding: 10px 14px 8px;
  border-top: 1px solid #1e3a5f;
}
.mb-vs-act {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  padding: 10px 6px; background: transparent; border: none; cursor: pointer;
  font-size: 11px; color: #8aa0c0; font-family: var(--font-body);
}
.mb-vs-act-ic {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}

/* Settings sheet */
.mb-settings-sheet {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 2200;
  background: #0d1e35; border-radius: 18px 18px 0 0;
  border-top: 1px solid #1e3a5f;
  padding: 0 0 calc(env(safe-area-inset-bottom) + 16px);
  transform: translateY(100%); transition: transform .3s cubic-bezier(.4,0,.2,1);
}
.mb-settings-sheet.on { transform: translateY(0); }
.mb-set-title {
  padding: 14px 16px 10px; font-size: 13px; font-weight: 700; color: #c9a84c;
}
.mb-set-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-top: 1px solid #1e3a5f;
}
.mb-set-lbl { font-size: 13px; color: #8aa0c0; }
.mb-set-pills { display: flex; gap: 6px; align-items: center; }
.mb-set-pill {
  padding: 6px 14px; border-radius: 99px;
  background: rgba(255,255,255,.05); border: 1px solid #1e3a5f;
  color: #8aa0c0; font-size: 12px; cursor: pointer; font-family: var(--font-body);
}
.mb-set-pill.on { background: #c9a84c; color: #08111f; border-color: #c9a84c; }
.mb-set-fsz { font-size: 12px; color: #c9a84c; min-width: 36px; text-align: center; }
/* Toggle switch */
.mb-tog-wrap { position: relative; display: inline-block; width: 42px; height: 24px; }
.mb-tog-wrap input { opacity: 0; width: 0; height: 0; }
.mb-tog {
  position: absolute; inset: 0; cursor: pointer; background: #1e3a5f;
  border-radius: 99px; transition: background .2s;
}
.mb-tog::before {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%; background: #8aa0c0;
  transition: transform .2s;
}
.mb-tog-wrap input:checked + .mb-tog { background: #c9a84c; }
.mb-tog-wrap input:checked + .mb-tog::before { transform: translateX(18px); background: #08111f; }

/* Toast */
.mb-toast {
  position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px);
  background: rgba(13,30,53,.95); border: 1px solid #1e3a5f; border-radius: 99px;
  padding: 8px 20px; font-size: 12px; color: #c0d4f0; pointer-events: none;
  opacity: 0; transition: opacity .2s, transform .2s; z-index: 9999; white-space: nowrap;
}
.mb-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    `;
    document.head.appendChild(s);
  }

})();

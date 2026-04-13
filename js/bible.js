// ═══════════════════════════════════════════════════════════════
//  ENJC Bible — bible.js v3
//  Full rebuild: Tamil+English, Audio, Image Gen, Bookmarks, UX
// ═══════════════════════════════════════════════════════════════

// ── CONFIG ─────────────────────────────────────────────────────
const CFG = {
  englishAPI: 'https://bible-api.com/',
  tamilAPI1:  'https://bolls.life/get-text/TAMOVR/',
  tamilAPI2:  'https://bolls.life/get-text/TAMBL98/',
  tamilAPI3:  'https://api.getbible.net/v2/tamil/',
  dataPath:   'data/',
  timeout:    8000
};

// ── STATE ───────────────────────────────────────────────────────
const S = {
  lang: 'en',
  book: '', bookName: '', bookNum: 1,
  chapter: 1, totalChapters: 1,
  verses: [],
  fontSize: parseInt(localStorage.getItem('enjc_fs') || '16'),
  highlights: JSON.parse(localStorage.getItem('enjc_hl') || '{}'),
  bookmarks:  JSON.parse(localStorage.getItem('enjc_bm') || '[]'),
  planDone:   JSON.parse(localStorage.getItem('enjc_pd') || '[]'),
  tamilData:  {},
  topicsData: {},
  bibleData:  {}
};

// ── BOOKS ───────────────────────────────────────────────────────
const BOOKS = [
  {id:'genesis',n:1,name:'Genesis',ch:50,t:'OT'},{id:'exodus',n:2,name:'Exodus',ch:40,t:'OT'},
  {id:'leviticus',n:3,name:'Leviticus',ch:27,t:'OT'},{id:'numbers',n:4,name:'Numbers',ch:36,t:'OT'},
  {id:'deuteronomy',n:5,name:'Deuteronomy',ch:34,t:'OT'},{id:'joshua',n:6,name:'Joshua',ch:24,t:'OT'},
  {id:'judges',n:7,name:'Judges',ch:21,t:'OT'},{id:'ruth',n:8,name:'Ruth',ch:4,t:'OT'},
  {id:'1+samuel',n:9,name:'1 Samuel',ch:31,t:'OT'},{id:'2+samuel',n:10,name:'2 Samuel',ch:24,t:'OT'},
  {id:'1+kings',n:11,name:'1 Kings',ch:22,t:'OT'},{id:'2+kings',n:12,name:'2 Kings',ch:25,t:'OT'},
  {id:'1+chronicles',n:13,name:'1 Chronicles',ch:29,t:'OT'},{id:'2+chronicles',n:14,name:'2 Chronicles',ch:36,t:'OT'},
  {id:'ezra',n:15,name:'Ezra',ch:10,t:'OT'},{id:'nehemiah',n:16,name:'Nehemiah',ch:13,t:'OT'},
  {id:'esther',n:17,name:'Esther',ch:10,t:'OT'},{id:'job',n:18,name:'Job',ch:42,t:'OT'},
  {id:'psalms',n:19,name:'Psalms',ch:150,t:'OT'},{id:'proverbs',n:20,name:'Proverbs',ch:31,t:'OT'},
  {id:'ecclesiastes',n:21,name:'Ecclesiastes',ch:12,t:'OT'},{id:'song+of+solomon',n:22,name:'Song of Solomon',ch:8,t:'OT'},
  {id:'isaiah',n:23,name:'Isaiah',ch:66,t:'OT'},{id:'jeremiah',n:24,name:'Jeremiah',ch:52,t:'OT'},
  {id:'lamentations',n:25,name:'Lamentations',ch:5,t:'OT'},{id:'ezekiel',n:26,name:'Ezekiel',ch:48,t:'OT'},
  {id:'daniel',n:27,name:'Daniel',ch:12,t:'OT'},{id:'hosea',n:28,name:'Hosea',ch:14,t:'OT'},
  {id:'joel',n:29,name:'Joel',ch:3,t:'OT'},{id:'amos',n:30,name:'Amos',ch:9,t:'OT'},
  {id:'obadiah',n:31,name:'Obadiah',ch:1,t:'OT'},{id:'jonah',n:32,name:'Jonah',ch:4,t:'OT'},
  {id:'micah',n:33,name:'Micah',ch:7,t:'OT'},{id:'nahum',n:34,name:'Nahum',ch:3,t:'OT'},
  {id:'habakkuk',n:35,name:'Habakkuk',ch:3,t:'OT'},{id:'zephaniah',n:36,name:'Zephaniah',ch:3,t:'OT'},
  {id:'haggai',n:37,name:'Haggai',ch:2,t:'OT'},{id:'zechariah',n:38,name:'Zechariah',ch:14,t:'OT'},
  {id:'malachi',n:39,name:'Malachi',ch:4,t:'OT'},
  {id:'matthew',n:40,name:'Matthew',ch:28,t:'NT'},{id:'mark',n:41,name:'Mark',ch:16,t:'NT'},
  {id:'luke',n:42,name:'Luke',ch:24,t:'NT'},{id:'john',n:43,name:'John',ch:21,t:'NT'},
  {id:'acts',n:44,name:'Acts',ch:28,t:'NT'},{id:'romans',n:45,name:'Romans',ch:16,t:'NT'},
  {id:'1+corinthians',n:46,name:'1 Corinthians',ch:16,t:'NT'},{id:'2+corinthians',n:47,name:'2 Corinthians',ch:13,t:'NT'},
  {id:'galatians',n:48,name:'Galatians',ch:6,t:'NT'},{id:'ephesians',n:49,name:'Ephesians',ch:6,t:'NT'},
  {id:'philippians',n:50,name:'Philippians',ch:4,t:'NT'},{id:'colossians',n:51,name:'Colossians',ch:4,t:'NT'},
  {id:'1+thessalonians',n:52,name:'1 Thessalonians',ch:5,t:'NT'},{id:'2+thessalonians',n:53,name:'2 Thessalonians',ch:3,t:'NT'},
  {id:'1+timothy',n:54,name:'1 Timothy',ch:6,t:'NT'},{id:'2+timothy',n:55,name:'2 Timothy',ch:4,t:'NT'},
  {id:'titus',n:56,name:'Titus',ch:3,t:'NT'},{id:'philemon',n:57,name:'Philemon',ch:1,t:'NT'},
  {id:'hebrews',n:58,name:'Hebrews',ch:13,t:'NT'},{id:'james',n:59,name:'James',ch:5,t:'NT'},
  {id:'1+peter',n:60,name:'1 Peter',ch:5,t:'NT'},{id:'2+peter',n:61,name:'2 Peter',ch:3,t:'NT'},
  {id:'1+john',n:62,name:'1 John',ch:5,t:'NT'},{id:'2+john',n:63,name:'2 John',ch:1,t:'NT'},
  {id:'3+john',n:64,name:'3 John',ch:1,t:'NT'},{id:'jude',n:65,name:'Jude',ch:1,t:'NT'},
  {id:'revelation',n:66,name:'Revelation',ch:22,t:'NT'}
];

// ── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateBooks();
  initFontSize();
  initBmBadge();
  loadData();
  initVoices();
  // Mobile nav toggle
  document.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', closeMenu));
});

async function loadData() {
  try {
    const [bd, td, tb] = await Promise.allSettled([
      fetch(CFG.dataPath + 'bible-data.json').then(r => r.json()),
      fetch(CFG.dataPath + 'bible-topics.json').then(r => r.json()),
      fetch(CFG.dataPath + 'tamil-bible.json').then(r => r.json())
    ]);
    if (bd.status === 'fulfilled') { S.bibleData = bd.value; loadVOTD(); initImageVerses(); renderPlan(); }
    else loadVOTDfallback();
    if (td.status === 'fulfilled') S.topicsData = td.value;
    if (tb.status === 'fulfilled') S.tamilData  = tb.value;
  } catch(e) { loadVOTDfallback(); }
}

// ── NAV ─────────────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById('menu').classList.toggle('open');
  document.getElementById('ham').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('menu').classList.remove('open');
  document.getElementById('ham').classList.remove('open');
}

// ── TOAST ───────────────────────────────────────────────────────
let _tt;
function toast(msg, dur = 2500) {
  let el = document.getElementById('btoast');
  if (!el) { el = Object.assign(document.createElement('div'), {id:'btoast',className:'btoast'}); document.body.appendChild(el); }
  el.innerHTML = msg; el.classList.add('show');
  clearTimeout(_tt); _tt = setTimeout(() => el.classList.remove('show'), dur);
}

// ── VOTD ────────────────────────────────────────────────────────
const VOTD_FALLBACK = [
  {text:"For I know the plans I have for you, declares the Lord — plans for welfare and not for evil, to give you a future and a hope.", ref:"Jeremiah 29:11", ta:"கர்த்தர் சொல்லுகிறார்: என்னால் நினைக்கப்படுகிற நினைவுகளை நான் அறிவேன்; அவைகள் தீமைக்கல்ல, சமாதானத்திற்கான நினைவுகளே.", taref:"எரேமியா 29:11"},
  {text:"Trust in the Lord with all your heart, and do not lean on your own understanding.", ref:"Proverbs 3:5", ta:"உன் சம்பூர்ண இருதயத்தோடே கர்த்தரில் நம்பிக்கைவை; உன் சொந்த அறிவை நம்பாதே.", taref:"நீதிமொழிகள் 3:5"},
  {text:"I can do all things through him who strengthens me.", ref:"Philippians 4:13", ta:"என்னை பலப்படுத்துகிற கிறிஸ்துவினால் எல்லாவற்றையும் செய்யவல்லேன்.", taref:"பிலிப்பியர் 4:13"},
  {text:"The Lord is my shepherd; I shall not want.", ref:"Psalm 23:1", ta:"கர்த்தர் என் மேய்ப்பர்; எனக்கு குறைவுண்டாவதில்லை.", taref:"சங்கீதம் 23:1"},
  {text:"Be strong and courageous. Do not be afraid; for the Lord your God is with you.", ref:"Joshua 1:9", ta:"திடமனதாயிரு, தைரியமாயிரு; கர்த்தராகிய உன் தேவன் நீ போகும் எவ்விடத்திலும் உன்னோடிருக்கிறார்.", taref:"யோசுவா 1:9"},
  {text:"Come to me, all who labour and are heavy laden, and I will give you rest.", ref:"Matthew 11:28", ta:"வருத்தப்பட்டு பாரஞ்சுமக்கிறவர்களே, நீங்கள் எல்லாரும் என்னிடத்தில் வாருங்கள்; நான் உங்களுக்கு இளைப்பாறுதல் தருவேன்.", taref:"மத்தேயு 11:28"},
  {text:"They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles.", ref:"Isaiah 40:31", ta:"கர்த்தருக்கு காத்திருக்கிறவர்களோ புதுப்பெலன் அடைவார்கள்; கழுகுகளைப்போல சிறகடித்து ஏறுவார்கள்.", taref:"ஏசாயா 40:31"}
];

function loadVOTD() {
  const pool = S.bibleData.verseOfDay || VOTD_FALLBACK;
  setVOTD(pool[new Date().getDay() % pool.length]);
}
function loadVOTDfallback() { setVOTD(VOTD_FALLBACK[new Date().getDay() % 7]); }

function setVOTD(v) {
  window._votd = v;
  document.getElementById('votd-en-text').textContent = '\u201c' + v.text + '\u201d';
  document.getElementById('votd-en-ref').textContent  = '\u2014 ' + v.ref;
  if (v.ta) {
    document.getElementById('votd-ta-text').textContent = '\u201c' + v.ta + '\u201d';
    document.getElementById('votd-ta-ref').textContent  = '\u2014 ' + (v.taref || v.ref);
    document.getElementById('votd-ta-row').style.display = 'block';
  }
}

function playVOTD(lang) {
  const v = window._votd; if (!v) return;
  const text = lang === 'ta' ? (v.ta || v.text) : v.text;
  const ref  = lang === 'ta' ? (v.taref || v.ref) : v.ref;
  speakNow(ref + '. ' + text, lang);
}

function shareVOTD() {
  const v = window._votd; if (!v) return;
  const msg = v.ref + '\n' + v.text + '\n\nRead: https://elimnewjerusalem.github.io/church/bible.html';
  if (navigator.share) navigator.share({title:'ENJC Verse of the Day', text:msg});
  else { navigator.clipboard?.writeText(msg); toast('Copied to clipboard!'); }
}

// ── LANG ────────────────────────────────────────────────────────
function setLang(lang) {
  S.lang = lang;
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-ta').classList.toggle('active', lang === 'ta');
  const ti = document.getElementById('tamil-info');
  if (ti) ti.style.display = lang === 'ta' ? 'block' : 'none';
  stopAudio();
  if (S.book) loadChapter();
}

// ── BOOKS ───────────────────────────────────────────────────────
function populateBooks() {
  const sel = document.getElementById('book-select');
  let lastT = '';
  BOOKS.forEach(b => {
    if (b.t !== lastT) {
      const og = document.createElement('optgroup');
      og.label = b.t === 'OT' ? 'Old Testament' : 'New Testament';
      sel.appendChild(og); lastT = b.t;
    }
    const o = document.createElement('option');
    o.value = b.id; o.textContent = b.name;
    sel.lastElementChild.appendChild(o);
  });
}

function onBookChange() {
  const id = document.getElementById('book-select').value; if (!id) return;
  const bk = BOOKS.find(b => b.id === id);
  S.book = id; S.bookName = bk.name; S.bookNum = bk.n;
  S.totalChapters = bk.ch; S.chapter = 1;
  const cs = document.getElementById('chapter-select');
  cs.innerHTML = ''; cs.disabled = false;
  for (let i = 1; i <= bk.ch; i++) {
    const o = document.createElement('option'); o.value = i; o.textContent = 'Chapter ' + i;
    cs.appendChild(o);
  }
  document.getElementById('load-btn').style.display = 'block';
  loadChapter();
}

function onChapterChange() {
  S.chapter = parseInt(document.getElementById('chapter-select').value) || 1;
  loadChapter();
}

// ── LOAD CHAPTER ────────────────────────────────────────────────
async function loadChapter() {
  if (!S.book) return;
  stopAudio();
  setContent('<div class="b-loading"><div class="b-spin"></div><p>Loading ' + (S.lang === 'ta' ? 'Tamil' : 'English') + ' Bible...</p></div>');
  try {
    S.verses = S.lang === 'en' ? await loadEnglish() : await loadTamil();
    if (!S.verses.length) throw new Error('No verses found');
    renderVerses();
    updateChapterUI();
  } catch(e) {
    setContent('<div class="b-error">&#9888; ' + e.message + '<br><small>Please check your internet connection.</small></div>');
  }
}

async function loadEnglish() {
  const url = CFG.englishAPI + S.book + '+' + S.chapter + '?translation=kjv';
  const r = await fetchWithTimeout(url);
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return (d.verses || []).map(v => ({num: v.verse, text: v.text.trim().replace(/\n/g,' ')}));
}

async function loadTamil() {
  // Try embedded first
  const key = S.bookNum + '_' + S.chapter;
  if (S.tamilData[key]) return S.tamilData[key].map(v => ({num:v[0], text:v[1]}));
  // Try APIs in order
  const apis = [
    CFG.tamilAPI1 + S.bookNum + '/' + S.chapter + '/',
    CFG.tamilAPI2 + S.bookNum + '/' + S.chapter + '/',
    CFG.tamilAPI3 + S.bookNum + '/' + S.chapter + '.json'
  ];
  for (const url of apis) {
    try {
      const r = await fetchWithTimeout(url);
      if (!r.ok) continue;
      const d = await r.json();
      if (Array.isArray(d) && d.length) return d.map(v => ({num:v.verse, text:v.text}));
      if (d.verses?.length) return d.verses.map(v => ({num:v.verse_nr, text:v.verse}));
    } catch(e) { continue; }
  }
  throw new Error('Tamil Bible not available for this chapter.\nTry: John 3, Psalms 23, Matthew 5, Romans 8, Philippians 4');
}

async function fetchWithTimeout(url) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), CFG.timeout);
  try { const r = await fetch(url, {signal: ctrl.signal}); clearTimeout(tid); return r; }
  catch(e) { clearTimeout(tid); throw e; }
}

// ── RENDER VERSES ────────────────────────────────────────────────
function renderVerses() {
  const isTa = S.lang === 'ta';
  const hl = S.highlights[S.book + S.chapter] || {};
  const bm = S.bookmarks;
  const html = S.verses.map((v, i) => {
    const ref = S.bookName + ' ' + S.chapter + ':' + v.num;
    const isBm = bm.some(b => b.ref === ref);
    const isHl = !!hl[v.num];
    const st = v.text.replace(/'/g,"\\'").replace(/\n/g,' ');
    const sr = ref.replace(/'/g,"\\'");
    return `<div class="v-item${isHl?' v-hl':''}" id="vi-${i}">
  <span class="v-num" onclick="playVerse(${i})">${v.num}</span>
  <span class="v-text${isTa?' v-ta':''}" style="font-size:${S.fontSize}px" onclick="playVerse(${i})">${v.text}</span>
  <div class="v-acts">
    <button class="v-btn" onclick="playVerse(${i})" title="Listen">&#9654;</button>
    <button class="v-btn${isHl?' v-btn-hl':''}" onclick="toggleHL(${v.num},${i})" title="Highlight">&#9679;</button>
    <button class="v-btn${isBm?' v-btn-bm':''}" id="bm-${i}" onclick="toggleBM('${sr}','${st}',${i})" title="Bookmark">&#9829;</button>
    <button class="v-btn" onclick="copyVerse('${sr}','${st}')" title="Copy">&#128203;</button>
    <button class="v-btn" onclick="shareVerse('${sr}','${st}')" title="Share">&#128279;</button>
  </div>
</div>`;
  }).join('');
  setContent('<div class="v-list">' + html + '</div>');
}

function setContent(html) { document.getElementById('bible-content').innerHTML = html; }

function updateChapterUI() {
  document.getElementById('chapter-bar').style.display = 'flex';
  document.getElementById('ch-title').textContent = S.bookName + ' \u2014 Chapter ' + S.chapter;
  document.getElementById('prev-btn').disabled = S.chapter <= 1;
  document.getElementById('next-btn').disabled = S.chapter >= S.totalChapters;
  document.getElementById('chapter-select').value = S.chapter;
  document.getElementById('audio-bar').style.display = 'flex';
  document.getElementById('aud-status').textContent = 'Tap a verse to listen';
  document.getElementById('aud-title').textContent  = S.bookName + ' ' + S.chapter;
}

function prevChapter() { if (S.chapter > 1) { S.chapter--; loadChapter(); } }
function nextChapter() { if (S.chapter < S.totalChapters) { S.chapter++; loadChapter(); } }

// ── AUDIO ────────────────────────────────────────────────────────
const synth = window.speechSynthesis;
let utt = null, playing = false, playAll = false, playIdx = 0;

function initVoices() {
  if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = () => synth.getVoices();
  synth.getVoices();
}

function getBestVoice(lang) {
  const vv = synth.getVoices();
  if (lang === 'ta') {
    return vv.find(v => v.lang.startsWith('ta') || v.name.toLowerCase().includes('tamil')) || null;
  }
  return vv.find(v => v.lang === 'en-IN') || vv.find(v => v.lang.startsWith('en')) || vv[0] || null;
}

function speakNow(text, lang, onEnd) {
  synth.cancel();
  setTimeout(() => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate   = parseFloat(document.getElementById('spd-sel')?.value || '1');
    u.volume = 1; u.pitch = 1;
    const voice = getBestVoice(lang || S.lang);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    else u.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    u.onstart = () => { playing = true;  updatePlayBtn(); };
    u.onend   = () => { playing = false; updatePlayBtn(); if (onEnd) onEnd(); };
    u.onerror = (e) => {
      playing = false; updatePlayBtn();
      if (e.error !== 'interrupted') {
        document.getElementById('aud-status').textContent = 'Audio error — check device TTS settings';
        if (S.lang === 'ta' && !getBestVoice('ta'))
          toast('Tamil voice not installed. Go to Settings \u2192 TTS \u2192 Install Tamil', 5000);
      }
    };
    utt = u; synth.speak(u); playing = true; updatePlayBtn();
  }, 120);
}

async function playVerse(i) {
  playAll = false; playIdx = i;
  const v = S.verses[i]; if (!v) return;
  highlight_playing(i);
  document.getElementById('aud-title').textContent  = S.bookName + ' ' + S.chapter + ':' + v.num;
  document.getElementById('aud-status').textContent = 'Playing verse ' + v.num + '...';
  speakNow(v.text, S.lang);
}

function playAllChapter() {
  if (!S.verses.length) return;
  playAll = true; playIdx = 0; playSequence();
}

function playSequence() {
  if (!playAll || playIdx >= S.verses.length) { playAll = false; playing = false; updatePlayBtn(); return; }
  const v = S.verses[playIdx];
  highlight_playing(playIdx);
  document.getElementById('aud-status').textContent = 'Verse ' + v.num + ' / ' + S.verses.length;
  const el = document.getElementById('vi-' + playIdx);
  if (el) el.scrollIntoView({behavior:'smooth', block:'center'});
  speakNow(v.text, S.lang, () => { playIdx++; playSequence(); });
}

function highlight_playing(i) {
  document.querySelectorAll('.v-item').forEach(el => el.classList.remove('v-playing'));
  document.getElementById('vi-' + i)?.classList.add('v-playing');
}

function togglePlayPause() {
  if (synth.speaking && !synth.paused) { synth.pause(); playing = false; updatePlayBtn(); document.getElementById('aud-status').textContent = 'Paused'; }
  else if (synth.paused) { synth.resume(); playing = true; updatePlayBtn(); document.getElementById('aud-status').textContent = 'Playing...'; }
  else if (S.verses.length) playAllChapter();
}

function stopAudio() {
  synth.cancel(); playing = false; playAll = false; updatePlayBtn();
  document.querySelectorAll('.v-item').forEach(el => el.classList.remove('v-playing'));
  const s = document.getElementById('aud-status'); if (s) s.textContent = 'Stopped';
}

function updatePlayBtn() {
  document.getElementById('play-icon')?.style  && (document.getElementById('play-icon').style.display  = playing ? 'none'  : 'block');
  document.getElementById('pause-icon')?.style && (document.getElementById('pause-icon').style.display = playing ? 'block' : 'none');
}

function changeSpeed() {
  if (playing) { const i = playIdx; stopAudio(); setTimeout(() => playVerse(i), 150); }
}

// ── VERSE ACTIONS ────────────────────────────────────────────────
function copyVerse(ref, text) {
  navigator.clipboard?.writeText(ref + ' \u2014 ' + text);
  toast('&#128203; Copied: ' + ref);
}

function shareVerse(ref, text) {
  const msg = ref + '\n' + text + '\n\nRead: https://elimnewjerusalem.github.io/church/bible.html';
  if (navigator.share) navigator.share({title:'ENJC Bible', text:msg});
  else { navigator.clipboard?.writeText(msg); toast('Copied to share!'); }
}

// ── HIGHLIGHT ───────────────────────────────────────────────────
function toggleHL(verseNum, idx) {
  const key = S.book + S.chapter;
  if (!S.highlights[key]) S.highlights[key] = {};
  const el = document.getElementById('vi-' + idx);
  const btn = el?.querySelector('.v-btn-hl');
  if (S.highlights[key][verseNum]) {
    delete S.highlights[key][verseNum];
    el?.classList.remove('v-hl');
    btn?.classList.remove('v-btn-hl');
    toast('Highlight removed');
  } else {
    S.highlights[key][verseNum] = 1;
    el?.classList.add('v-hl');
    btn?.classList.add('v-btn-hl');
    toast('&#9679; Verse highlighted');
  }
  localStorage.setItem('enjc_hl', JSON.stringify(S.highlights));
}

// ── BOOKMARK ────────────────────────────────────────────────────
function getBookmarks() { return JSON.parse(localStorage.getItem('enjc_bm') || '[]'); }
function saveBM(bms)    { localStorage.setItem('enjc_bm', JSON.stringify(bms)); S.bookmarks = bms; }

function toggleBM(ref, text, idx) {
  const bms = getBookmarks();
  const fi  = bms.findIndex(b => b.ref === ref);
  const btn = document.getElementById('bm-' + idx);
  if (fi >= 0) { bms.splice(fi,1); btn?.classList.remove('v-btn-bm'); toast('Removed from saved'); }
  else         { bms.unshift({ref, text}); btn?.classList.add('v-btn-bm'); toast('\u2665 Verse saved!'); }
  saveBM(bms); initBmBadge();
}

function initBmBadge() {
  const bms = getBookmarks();
  const el = document.getElementById('btn-bookmarks');
  if (el) el.innerHTML = '\u2665 Saved' + (bms.length ? ' (' + bms.length + ')' : '');
}

function renderBmList() {
  const bms = getBookmarks();
  const el  = document.getElementById('bm-list');
  if (!bms.length) { el.innerHTML = '<div class="b-empty">&#9829; No saved verses yet.<br>Tap &#9829; on any verse to save it.</div>'; return; }
  el.innerHTML = bms.map((b,i) => {
    const sr = b.ref.replace(/'/g,"\\'"); const st = b.text.replace(/'/g,"\\'");
    return `<div class="v-item"><div style="flex:1"><div class="v-tag">${b.ref}</div><span class="v-text" style="font-size:${S.fontSize}px">${b.text}</span></div>
<div class="v-acts" style="opacity:1">
  <button class="v-btn" onclick="copyVerse('${sr}','${st}')">&#128203;</button>
  <button class="v-btn" onclick="shareVerse('${sr}','${st}')">&#128279;</button>
  <button class="v-btn" onclick="removeBM(${i})" style="color:#f87171">&#10005;</button>
</div></div>`;
  }).join('');
}

function removeBM(i) {
  const bms = getBookmarks(); bms.splice(i,1); saveBM(bms);
  renderBmList(); initBmBadge(); toast('Removed');
}

// ── FONT SIZE ────────────────────────────────────────────────────
function initFontSize() { document.getElementById('fsz-val').textContent = S.fontSize + 'px'; }
function changeFont(d)  {
  S.fontSize = d === 0 ? 16 : Math.min(28, Math.max(12, S.fontSize + d * 2));
  localStorage.setItem('enjc_fs', S.fontSize);
  document.getElementById('fsz-val').textContent = S.fontSize + 'px';
  document.querySelectorAll('.v-text').forEach(el => el.style.fontSize = S.fontSize + 'px');
}

// ── PANEL TOGGLE ────────────────────────────────────────────────
function togglePanel(id) {
  ['topics','bookmarks','plan','image'].forEach(p => {
    const el = document.getElementById('panel-' + p);
    const btn = document.getElementById('btn-' + p);
    const open = p === id && !el.classList.contains('open');
    el.classList.toggle('open', open);
    btn?.classList.toggle('active', open);
    if (p === 'bookmarks' && open) renderBmList();
    if (p === 'plan'      && open) renderPlan();
    if (p === 'image'     && open) setTimeout(drawCanvas, 60);
  });
}

// ── TOPIC SEARCH ─────────────────────────────────────────────────
function showTopic(btn, topic) {
  document.querySelectorAll('.t-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const vv = S.topicsData[topic] || [];
  document.getElementById('topic-results').innerHTML = vv.map((v,i) => {
    const sr = v.ref.replace(/'/g,"\\'"); const st = v.text.replace(/'/g,"\\'");
    return `<div class="v-item"><span class="v-num">${i+1}</span><div style="flex:1"><div class="v-tag">${v.ref}</div><span class="v-text" style="font-size:${S.fontSize}px">${v.text}</span></div>
<div class="v-acts" style="opacity:1">
  <button class="v-btn" onclick="copyVerse('${sr}','${st}')">&#128203;</button>
  <button class="v-btn" onclick="shareVerse('${sr}','${st}')">&#128279;</button>
</div></div>`;
  }).join('') || '<div class="b-empty">No verses found for this topic.</div>';
}

// ── READING PLAN ────────────────────────────────────────────────
const PLAN_DATA = [
  {day:'Day 1',chapter:'Psalm 1',label:'The blessed man',book:'psalms',ch:1},
  {day:'Day 2',chapter:'John 1',label:'The Word became flesh',book:'john',ch:1},
  {day:'Day 3',chapter:'Romans 8',label:'No condemnation',book:'romans',ch:8},
  {day:'Day 4',chapter:'Matthew 5',label:'The Beatitudes',book:'matthew',ch:5},
  {day:'Day 5',chapter:'Philippians 4',label:'Rejoice always',book:'philippians',ch:4},
  {day:'Day 6',chapter:'Isaiah 40',label:'Renew your strength',book:'isaiah',ch:40},
  {day:'Day 7',chapter:'Revelation 21',label:'All things new',book:'revelation',ch:21}
];

function getPlanDone() { return JSON.parse(localStorage.getItem('enjc_pd') || '[]'); }
function savePlanDone(d){ localStorage.setItem('enjc_pd', JSON.stringify(d)); }

function renderPlan() {
  const done = getPlanDone(); const count = done.length;
  document.getElementById('plan-pct').textContent  = count + ' / ' + PLAN_DATA.length;
  document.getElementById('plan-fill').style.width = Math.round(count / PLAN_DATA.length * 100) + '%';
  document.getElementById('plan-days').innerHTML = PLAN_DATA.map((p,i) => {
    const isDone = done.includes(i);
    return `<div class="plan-day${isDone?' done':''}" onclick="togglePlanDay(${i})">
  <div class="plan-chk">${isDone?'&#10003;':''}</div>
  <div class="plan-inf"><div class="plan-lbl">${p.day}</div><div class="plan-ch">${p.chapter} <span style="opacity:.55;font-size:.85em">\u2014 ${p.label}</span></div></div>
  <button class="plan-go" onclick="event.stopPropagation();goToPlan(${i})">Read &rarr;</button>
</div>`;
  }).join('');
}

function togglePlanDay(i) {
  const done = getPlanDone(); const idx = done.indexOf(i);
  if (idx >= 0) done.splice(idx,1); else done.push(i);
  savePlanDone(done); renderPlan();
  toast(done.includes(i) ? 'Day ' + (i+1) + ' complete \u2713' : 'Marked incomplete');
}

function goToPlan(i) {
  const p = PLAN_DATA[i]; if (!p) return;
  const bk = BOOKS.find(b => b.id === p.book); if (!bk) return;
  document.getElementById('book-select').value = p.book;
  S.book = p.book; S.bookName = bk.name; S.bookNum = bk.n;
  S.totalChapters = bk.ch; S.chapter = p.ch;
  const cs = document.getElementById('chapter-select');
  cs.innerHTML = ''; cs.disabled = false;
  for (let i = 1; i <= bk.ch; i++) { const o = document.createElement('option'); o.value = i; o.textContent = 'Chapter ' + i; cs.appendChild(o); }
  cs.value = p.ch;
  document.getElementById('load-btn').style.display = 'block';
  // Close panel and load
  document.getElementById('panel-plan').classList.remove('open');
  document.getElementById('btn-plan').classList.remove('active');
  loadChapter();
  window.scrollTo({top: document.getElementById('bible-content').offsetTop - 100, behavior:'smooth'});
}

function resetPlan() { savePlanDone([]); renderPlan(); toast('Plan reset'); }

// ── SEARCH ──────────────────────────────────────────────────────
async function searchBible() {
  const q = document.getElementById('search-input').value.trim(); if (!q) return;
  stopAudio();
  document.getElementById('chapter-bar').style.display = 'none';
  setContent('<div class="b-loading"><div class="b-spin"></div><p>Searching...</p></div>');
  try {
    const r = await fetchWithTimeout(CFG.englishAPI + encodeURIComponent(q) + '?translation=kjv');
    const d = await r.json();
    if (d.error) throw new Error(d.error);
    const vv = d.verses || [];
    setContent('<p style="color:var(--muted);font-size:.85rem;margin-bottom:14px">Results for "' + q + '" (' + vv.length + ')</p><div class="v-list">' +
      vv.map((v,i) => {
        const ref = v.book_name + ' ' + v.chapter + ':' + v.verse;
        const txt = v.text.replace(/\n/g,' ');
        const sr = ref.replace(/'/g,"\\'"); const st = txt.replace(/'/g,"\\'");
        return `<div class="v-item"><span class="v-num">&#9733;</span><div style="flex:1"><div class="v-tag">${ref}</div><span class="v-text">${txt}</span></div>
<div class="v-acts" style="opacity:1"><button class="v-btn" onclick="copyVerse('${sr}','${st}')">&#128203;</button></div></div>`;
      }).join('') + '</div>');
  } catch(e) {
    setContent('<div class="b-error">No results for "' + q + '". Try John 3:16 or a keyword like "faith".</div>');
  }
}

// ── IMAGE GENERATOR ──────────────────────────────────────────────
const IMG_THEMES = {
  dark: {bg:'#080c10', accent:'#f5a623', body:'#e8edf4', ref:'rgba(232,237,244,.5)', line:'#f5a623'},
  navy: {bg:'#0b2545', accent:'#ffffff', body:'rgba(255,255,255,.9)', ref:'rgba(255,255,255,.5)', line:'#f5a623'},
  warm: {bg:'#fdf6ec', accent:'#8b4513', body:'#3d2b1a', ref:'rgba(61,43,26,.5)', line:'#8b4513'},
  purple:{bg:'#1a0b2e', accent:'#c084fc', body:'rgba(240,220,255,.9)', ref:'rgba(240,220,255,.5)', line:'#c084fc'}
};

const IMG_VERSES_DEFAULT = [
  {ref:'John 3:16', text:'For God so loved the world, that He gave His only begotten Son.'},
  {ref:'Philippians 4:13', text:'I can do all things through Christ who strengthens me.'},
  {ref:'Psalm 23:1', text:'The Lord is my shepherd; I shall not want.'},
  {ref:'Isaiah 43:4', text:'Because you are precious in my sight, and honoured, and I love you.'},
  {ref:'Jeremiah 29:11', text:'For I know the plans I have for you — plans for welfare and not for evil.'},
  {ref:'Isaiah 40:31', text:'They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles.'},
  {ref:'Matthew 11:28', text:'Come to me, all who labour and are heavy laden, and I will give you rest.'},
  {ref:'Romans 8:28', text:'For those who love God all things work together for good.'}
];

function initImageVerses() {
  const verses = S.bibleData.imageVerses || IMG_VERSES_DEFAULT;
  const sel = document.getElementById('img-verse-sel'); if (!sel) return;
  sel.innerHTML = '';
  verses.forEach((v,i) => {
    const o = document.createElement('option'); o.value = i;
    o.textContent = v.ref + ' \u2014 ' + v.text.substring(0,35) + '...';
    sel.appendChild(o);
  });
  // Also add current verse option if reading
  const useCurrentEl = document.getElementById('img-use-current');
  if (useCurrentEl) useCurrentEl.style.display = 'block';
}

function useCurrentVerse() {
  if (!S.verses.length) { toast('Select a chapter first'); return; }
  // Use first highlighted verse or first verse
  const hlKey = S.book + S.chapter;
  const hlMap = S.highlights[hlKey] || {};
  const hlNums = Object.keys(hlMap).map(Number);
  const v = hlNums.length ? S.verses.find(v => v.num === hlNums[0]) : S.verses[0];
  if (!v) return;
  window._customVerse = {ref: S.bookName + ' ' + S.chapter + ':' + v.num, text: v.text};
  drawCanvas();
  toast('Using current verse');
}

function drawCanvas() {
  const cv = document.getElementById('verse-canvas'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const theme = document.getElementById('img-theme-sel')?.value || 'dark';
  const t = IMG_THEMES[theme];

  // Get verse
  let v;
  if (window._customVerse) { v = window._customVerse; window._customVerse = null; }
  else {
    const verses = S.bibleData.imageVerses || IMG_VERSES_DEFAULT;
    const idx = parseInt(document.getElementById('img-verse-sel')?.value || '0');
    v = verses[idx] || IMG_VERSES_DEFAULT[0];
  }

  // Background
  ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);

  // Top accent bar
  ctx.fillStyle = t.line; ctx.fillRect(0,0,W,4);

  // Church name
  ctx.fillStyle = t.line; ctx.globalAlpha = .5;
  ctx.font = 'bold 11px system-ui'; ctx.letterSpacing = '3px';
  ctx.fillText('ELIM NEW JERUSALEM CHURCH', 32, 38);
  ctx.letterSpacing = '0px'; ctx.globalAlpha = 1;

  // Divider
  ctx.fillStyle = t.line; ctx.globalAlpha = .3;
  ctx.fillRect(32, 50, 70, 1.5); ctx.globalAlpha = 1;

  // Wrap & draw verse text
  function wrap(text, x, y, maxW, lh, fs, color, style) {
    ctx.font = (style||'normal') + ' ' + fs + 'px Georgia,serif';
    ctx.fillStyle = color;
    let line = '';
    for (const word of text.split(' ')) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line.trim(), x, y); line = word + ' '; y += lh;
      } else line = test;
    }
    ctx.fillText(line.trim(), x, y); return y + lh;
  }

  const endY = wrap('\u201c' + v.text + '\u201d', 32, 80, W-64, 30, 17, t.body, 'italic');

  // Reference
  ctx.font = 'bold 14px system-ui'; ctx.fillStyle = t.accent;
  ctx.fillText('\u2014 ' + v.ref, 32, Math.min(endY + 8, H - 40));

  // Bottom line
  ctx.fillStyle = t.line; ctx.globalAlpha = .25;
  ctx.fillRect(32, H-28, W-64, 1); ctx.globalAlpha = 1;
  ctx.fillStyle = t.line; ctx.font = '10px system-ui';
  ctx.fillText('elimnewjerusalem.github.io/church', 32, H-12);
}

function downloadImg() {
  const cv = document.getElementById('verse-canvas'); if (!cv) return;
  const a = document.createElement('a');
  a.download = 'enjc-verse.jpg';
  a.href = cv.toDataURL('image/jpeg', 0.92);
  a.click(); toast('&#8595; Image downloaded!');
}

// ── KEYBOARD ────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'ArrowRight') nextChapter();
  if (e.key === 'ArrowLeft')  prevChapter();
  if (e.key === ' ')          { e.preventDefault(); togglePlayPause(); }
});

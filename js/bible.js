// ═══════════════════════════════════════════════════════════════
//  ENJC Bible Reader — bible.js
//  All logic separated from HTML
//  Data loaded from: data/bible-data.json, data/bible-topics.json,
//                    data/tamil-bible.json
// ═══════════════════════════════════════════════════════════════

// ── STATE ──────────────────────────────────────────────────────
var currentLang      = "en";
var currentBook      = "";
var currentBookName  = "";
var currentChapter   = 1;
var totalChapters    = 1;
var currentVerses    = [];
var currentFontSize  = parseInt(localStorage.getItem("enjc_fsz") || "16");
var synth            = window.speechSynthesis;
var currentUtterance = null;
var isPlaying        = false;
var currentVerseIdx  = 0;
var playAllMode      = false;
var TAMIL_BIBLE      = {};
var TOPICS_DATA      = {};
var BIBLE_DATA       = {};
var fcbhAudio        = null;
var FCBH_KEY         = ""; // paste your free key from 4.dbt.io here

// ── BOOK LIST ─────────────────────────────────────────────────
var BOOKS = [
  {id:"genesis",num:1,name:"Genesis",chapters:50,t:"Old Testament"},
  {id:"exodus",num:2,name:"Exodus",chapters:40,t:"Old Testament"},
  {id:"leviticus",num:3,name:"Leviticus",chapters:27,t:"Old Testament"},
  {id:"numbers",num:4,name:"Numbers",chapters:36,t:"Old Testament"},
  {id:"deuteronomy",num:5,name:"Deuteronomy",chapters:34,t:"Old Testament"},
  {id:"joshua",num:6,name:"Joshua",chapters:24,t:"Old Testament"},
  {id:"judges",num:7,name:"Judges",chapters:21,t:"Old Testament"},
  {id:"ruth",num:8,name:"Ruth",chapters:4,t:"Old Testament"},
  {id:"1+samuel",num:9,name:"1 Samuel",chapters:31,t:"Old Testament"},
  {id:"2+samuel",num:10,name:"2 Samuel",chapters:24,t:"Old Testament"},
  {id:"1+kings",num:11,name:"1 Kings",chapters:22,t:"Old Testament"},
  {id:"2+kings",num:12,name:"2 Kings",chapters:25,t:"Old Testament"},
  {id:"1+chronicles",num:13,name:"1 Chronicles",chapters:29,t:"Old Testament"},
  {id:"2+chronicles",num:14,name:"2 Chronicles",chapters:36,t:"Old Testament"},
  {id:"ezra",num:15,name:"Ezra",chapters:10,t:"Old Testament"},
  {id:"nehemiah",num:16,name:"Nehemiah",chapters:13,t:"Old Testament"},
  {id:"esther",num:17,name:"Esther",chapters:10,t:"Old Testament"},
  {id:"job",num:18,name:"Job",chapters:42,t:"Old Testament"},
  {id:"psalms",num:19,name:"Psalms",chapters:150,t:"Old Testament"},
  {id:"proverbs",num:20,name:"Proverbs",chapters:31,t:"Old Testament"},
  {id:"ecclesiastes",num:21,name:"Ecclesiastes",chapters:12,t:"Old Testament"},
  {id:"song+of+solomon",num:22,name:"Song of Solomon",chapters:8,t:"Old Testament"},
  {id:"isaiah",num:23,name:"Isaiah",chapters:66,t:"Old Testament"},
  {id:"jeremiah",num:24,name:"Jeremiah",chapters:52,t:"Old Testament"},
  {id:"lamentations",num:25,name:"Lamentations",chapters:5,t:"Old Testament"},
  {id:"ezekiel",num:26,name:"Ezekiel",chapters:48,t:"Old Testament"},
  {id:"daniel",num:27,name:"Daniel",chapters:12,t:"Old Testament"},
  {id:"hosea",num:28,name:"Hosea",chapters:14,t:"Old Testament"},
  {id:"joel",num:29,name:"Joel",chapters:3,t:"Old Testament"},
  {id:"amos",num:30,name:"Amos",chapters:9,t:"Old Testament"},
  {id:"obadiah",num:31,name:"Obadiah",chapters:1,t:"Old Testament"},
  {id:"jonah",num:32,name:"Jonah",chapters:4,t:"Old Testament"},
  {id:"micah",num:33,name:"Micah",chapters:7,t:"Old Testament"},
  {id:"nahum",num:34,name:"Nahum",chapters:3,t:"Old Testament"},
  {id:"habakkuk",num:35,name:"Habakkuk",chapters:3,t:"Old Testament"},
  {id:"zephaniah",num:36,name:"Zephaniah",chapters:3,t:"Old Testament"},
  {id:"haggai",num:37,name:"Haggai",chapters:2,t:"Old Testament"},
  {id:"zechariah",num:38,name:"Zechariah",chapters:14,t:"Old Testament"},
  {id:"malachi",num:39,name:"Malachi",chapters:4,t:"Old Testament"},
  {id:"matthew",num:40,name:"Matthew",chapters:28,t:"New Testament"},
  {id:"mark",num:41,name:"Mark",chapters:16,t:"New Testament"},
  {id:"luke",num:42,name:"Luke",chapters:24,t:"New Testament"},
  {id:"john",num:43,name:"John",chapters:21,t:"New Testament"},
  {id:"acts",num:44,name:"Acts",chapters:28,t:"New Testament"},
  {id:"romans",num:45,name:"Romans",chapters:16,t:"New Testament"},
  {id:"1+corinthians",num:46,name:"1 Corinthians",chapters:16,t:"New Testament"},
  {id:"2+corinthians",num:47,name:"2 Corinthians",chapters:13,t:"New Testament"},
  {id:"galatians",num:48,name:"Galatians",chapters:6,t:"New Testament"},
  {id:"ephesians",num:49,name:"Ephesians",chapters:6,t:"New Testament"},
  {id:"philippians",num:50,name:"Philippians",chapters:4,t:"New Testament"},
  {id:"colossians",num:51,name:"Colossians",chapters:4,t:"New Testament"},
  {id:"1+thessalonians",num:52,name:"1 Thessalonians",chapters:5,t:"New Testament"},
  {id:"2+thessalonians",num:53,name:"2 Thessalonians",chapters:3,t:"New Testament"},
  {id:"1+timothy",num:54,name:"1 Timothy",chapters:6,t:"New Testament"},
  {id:"2+timothy",num:55,name:"2 Timothy",chapters:4,t:"New Testament"},
  {id:"titus",num:56,name:"Titus",chapters:3,t:"New Testament"},
  {id:"philemon",num:57,name:"Philemon",chapters:1,t:"New Testament"},
  {id:"hebrews",num:58,name:"Hebrews",chapters:13,t:"New Testament"},
  {id:"james",num:59,name:"James",chapters:5,t:"New Testament"},
  {id:"1+peter",num:60,name:"1 Peter",chapters:5,t:"New Testament"},
  {id:"2+peter",num:61,name:"2 Peter",chapters:3,t:"New Testament"},
  {id:"1+john",num:62,name:"1 John",chapters:5,t:"New Testament"},
  {id:"2+john",num:63,name:"2 John",chapters:1,t:"New Testament"},
  {id:"3+john",num:64,name:"3 John",chapters:1,t:"New Testament"},
  {id:"jude",num:65,name:"Jude",chapters:1,t:"New Testament"},
  {id:"revelation",num:66,name:"Revelation",chapters:22,t:"New Testament"}
];

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  loadAllData();
  populateBooks();
  initFontSize();
  document.getElementById("fsz-val").textContent = currentFontSize + "px";
});

function loadAllData() {
  // Load Tamil Bible
  fetch("data/tamil-bible.json")
    .then(function(r){ return r.json(); })
    .then(function(d){ TAMIL_BIBLE = d; })
    .catch(function(e){ console.warn("Tamil data:", e); });

  // Load topics
  fetch("data/bible-topics.json")
    .then(function(r){ return r.json(); })
    .then(function(d){ TOPICS_DATA = d; })
    .catch(function(e){ console.warn("Topics:", e); });

  // Load bible data (VOTD, image verses, plan)
  fetch("data/bible-data.json")
    .then(function(r){ return r.json(); })
    .then(function(d){
      BIBLE_DATA = d;
      loadVotd();
      renderPlan();
      initImageVerses();
      initBookmarkBadge();
    })
    .catch(function(e){ console.warn("Bible data:", e); loadVotdFallback(); });
}

// ── NAV ────────────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById("menu").classList.toggle("open");
  document.getElementById("ham").classList.toggle("open");
}
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".menu a").forEach(function(a) {
    a.addEventListener("click", function() {
      document.getElementById("menu").classList.remove("open");
      document.getElementById("ham").classList.remove("open");
    });
  });
});

// ── VERSE OF DAY ───────────────────────────────────────────────
function loadVotd() {
  var pool = (BIBLE_DATA.verseOfDay || []);
  var v = pool[new Date().getDay() % pool.length];
  if (!v) return;
  document.getElementById("votd-text").textContent = "\u201c" + v.text + "\u201d";
  document.getElementById("votd-ref").textContent = "\u2014 " + v.ref;
  window._votdText = v.text;
  window._votdRef  = v.ref;
}

function loadVotdFallback() {
  var fallback = [
    {text:"For I know the plans I have for you, declares the Lord.", ref:"Jeremiah 29:11"},
    {text:"I can do all things through him who strengthens me.", ref:"Philippians 4:13"},
    {text:"The Lord is my shepherd; I shall not want.", ref:"Psalm 23:1"},
    {text:"Be strong and courageous, for the Lord your God is with you.", ref:"Joshua 1:9"},
    {text:"Come to me, all who labour and are heavy laden, and I will give you rest.", ref:"Matthew 11:28"},
    {text:"Trust in the Lord with all your heart.", ref:"Proverbs 3:5"},
    {text:"They who wait for the Lord shall renew their strength.", ref:"Isaiah 40:31"}
  ];
  var v = fallback[new Date().getDay()];
  document.getElementById("votd-text").textContent = "\u201c" + v.text + "\u201d";
  document.getElementById("votd-ref").textContent = "\u2014 " + v.ref;
  window._votdText = v.text;
  window._votdRef  = v.ref;
}

function playVotd() {
  var btn = document.getElementById("votd-play-btn");
  if (synth.speaking) {
    synth.cancel();
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Listen';
    return;
  }
  speakText((window._votdRef || "") + ". " + (window._votdText || ""));
  btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Stop';
  if (currentUtterance) {
    currentUtterance.onend = function() {
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Listen';
    };
  }
}

function shareVotd() {
  var msg = "\u201c" + (window._votdText||"") + "\u201d\n\u2014 " + (window._votdRef||"") +
    "\n\nRead: https://elimnewjerusalem.github.io/church/bible.html";
  if (navigator.share) navigator.share({title:"ENJC Verse of the Day", text:msg});
  else { if (navigator.clipboard) navigator.clipboard.writeText(msg); showToast("Copied!"); }
}

// ── BOOKS ──────────────────────────────────────────────────────
function populateBooks() {
  var sel = document.getElementById("book-select");
  var lastT = "";
  BOOKS.forEach(function(b) {
    if (b.t !== lastT) {
      var og = document.createElement("optgroup");
      og.label = b.t;
      sel.appendChild(og);
      lastT = b.t;
    }
    var opt = document.createElement("option");
    opt.value = b.id;
    opt.textContent = b.name;
    sel.lastElementChild.appendChild(opt);
  });
}

// ── LANGUAGE ───────────────────────────────────────────────────
function setLang(lang) {
  currentLang = lang;
  document.getElementById("btn-en").classList.toggle("active", lang === "en");
  document.getElementById("btn-ta").classList.toggle("active", lang === "ta");
  var info = document.getElementById("tamil-info");
  if (info) info.style.display = lang === "ta" ? "block" : "none";
  stopAudio();
  if (currentBook && currentChapter) loadChapter();
}

// ── BOOK / CHAPTER SELECT ──────────────────────────────────────
function onBookChange() {
  var bookId = document.getElementById("book-select").value;
  if (!bookId) return;
  var book = BOOKS.find(function(b){ return b.id === bookId; });
  currentBook = bookId;
  currentBookName = book.name;
  totalChapters = book.chapters;
  currentChapter = 1;
  var chSel = document.getElementById("chapter-select");
  chSel.innerHTML = "";
  chSel.disabled = false;
  for (var i = 1; i <= book.chapters; i++) {
    var o = document.createElement("option");
    o.value = i; o.textContent = "Chapter " + i;
    chSel.appendChild(o);
  }
  document.getElementById("load-btn").style.display = "block";
  loadChapter();
}

function onChapterChange() {
  currentChapter = parseInt(document.getElementById("chapter-select").value) || 1;
  loadChapter();
}

// ── LOAD CHAPTER ───────────────────────────────────────────────
async function loadChapter() {
  if (!currentBook) return;
  stopAudio();
  showLoading();
  try {
    var verses = [];

    if (currentLang === "en") {
      // English — bible-api.com (KJV, free, CORS)
      var url = "https://bible-api.com/" + currentBook + "+" + currentChapter + "?translation=kjv";
      var res = await fetch(url);
      if (!res.ok) throw new Error("Chapter not found (" + res.status + ")");
      var data = await res.json();
      if (data.error) throw new Error(data.error);
      verses = (data.verses || []).map(function(v) {
        return {num: v.verse, text: v.text.trim().replace(/\n/g, " ")};
      });

    } else {
      // Tamil — embedded data first, then bolls.life API
      var book = BOOKS.find(function(b){ return b.id === currentBook; });
      var bookNum = book ? book.num : 1;
      var key = bookNum + "_" + currentChapter;

      if (TAMIL_BIBLE[key]) {
        // Embedded — instant, offline
        verses = TAMIL_BIBLE[key].map(function(v){ return {num:v[0], text:v[1]}; });
      } else {
        var ok = false;

        // bolls.life TAMOVR (Tamil Old Version)
        if (!ok) {
          try {
            var r1 = await fetch("https://bolls.life/get-text/TAMOVR/" + bookNum + "/" + currentChapter + "/",
              {signal: AbortSignal.timeout(8000)});
            if (r1.ok) {
              var d1 = await r1.json();
              if (Array.isArray(d1) && d1.length) {
                verses = d1.map(function(v){ return {num:v.verse, text:v.text}; });
                ok = true;
              }
            }
          } catch(e1) { console.warn("TAMOVR:", e1.message); }
        }

        // bolls.life TAMBL98 (backup)
        if (!ok) {
          try {
            var r2 = await fetch("https://bolls.life/get-text/TAMBL98/" + bookNum + "/" + currentChapter + "/",
              {signal: AbortSignal.timeout(8000)});
            if (r2.ok) {
              var d2 = await r2.json();
              if (Array.isArray(d2) && d2.length) {
                verses = d2.map(function(v){ return {num:v.verse, text:v.text}; });
                ok = true;
              }
            }
          } catch(e2) { console.warn("TAMBL98:", e2.message); }
        }

        // getbible.net v2 (last fallback)
        if (!ok) {
          try {
            var r3 = await fetch("https://api.getbible.net/v2/tamil/" + bookNum + "/" + currentChapter + ".json",
              {signal: AbortSignal.timeout(8000)});
            if (r3.ok) {
              var d3 = await r3.json();
              if (d3.verses && d3.verses.length) {
                verses = d3.verses.map(function(v){ return {num:v.verse_nr, text:v.verse}; });
                ok = true;
              }
            }
          } catch(e3) { console.warn("getbible:", e3.message); }
        }

        if (!ok) throw new Error(
          "\u0b87\u0ba8\u0bcd\u0ba4 \u0b85\u0ba4\u0bbf\u0b95\u0bbe\u0bb0\u0ba4\u0bcd\u0ba4\u0bc8 \u0b87\u0baa\u0bcd\u0baa\u0bcb\u0ba4\u0bc1 \u0b8f\u0bb1\u0bcd\u0bb1 \u0bae\u0bc1\u0b9f\u0bbf\u0baf\u0bb5\u0bbf\u0bb2\u0bcd\u0bb2\u0bc8.\n(Chapter not available. Check internet.)\nOffline: John 1-6,10-17,20 | Psalms 1,22-23,27,46,51,91,121 | Matt 5-6,11,28"
        );
      }
    }

    if (!verses.length) throw new Error("No verses found.");
    currentVerses = verses;
    renderVerses(verses);
    updateChapterUI();

  } catch(err) {
    showError("Could not load this chapter. Please check your internet connection.<br><small>" + err.message + "</small>");
  }
}

function showLoading() {
  document.getElementById("bible-content").innerHTML =
    '<div class="bible-loading"><div class="loading-spin"></div><p>Loading ' +
    (currentLang === "ta" ? "Tamil" : "English") + ' Bible...</p></div>';
}

function showError(msg) {
  document.getElementById("bible-content").innerHTML = '<div class="bible-error">&#9888; ' + msg + '</div>';
}

function updateChapterUI() {
  document.getElementById("chapter-bar").style.display = "flex";
  document.getElementById("chapter-title").textContent = currentBookName + " \u2014 Chapter " + currentChapter;
  document.getElementById("prev-btn").disabled = currentChapter <= 1;
  document.getElementById("next-btn").disabled = currentChapter >= totalChapters;
  document.getElementById("chapter-select").value = currentChapter;
  document.getElementById("audio-bar").style.display = "flex";
}

function prevChapter() { if (currentChapter > 1) { currentChapter--; loadChapter(); } }
function nextChapter() { if (currentChapter < totalChapters) { currentChapter++; loadChapter(); } }

// ── RENDER VERSES ──────────────────────────────────────────────
function renderVerses(verses) {
  var isTamil = currentLang === "ta";
  var bms = JSON.parse(localStorage.getItem("enjc_bm") || "[]");
  var html = verses.map(function(v, i) {
    var ref = currentBookName + " " + currentChapter + ":" + v.num;
    var isBm = bms.some(function(b){ return b.ref === ref; });
    var safeText = v.text.replace(/'/g, "\\'").replace(/\n/g, " ");
    var safeRef  = ref.replace(/'/g, "\\'");
    return "<div class='verse-item' id='vi-" + i + "'>"
      + "<span class='verse-num' onclick='playVerse(" + i + ")'>" + v.num + "</span>"
      + "<span class='verse-text " + (isTamil ? "tamil" : "") + "' style='font-size:" + currentFontSize + "px' onclick='playVerse(" + i + ")'>" + v.text + "</span>"
      + "<div class='verse-actions'>"
      + "<button class='vact-btn' title='Listen' onclick='playVerse(" + i + ")'>&#9654;</button>"
      + "<button class='vact-btn' title='Copy' onclick=\"copyVerse('" + safeRef + "','" + safeText + "')\">&#128203;</button>"
      + "<button class='vact-btn " + (isBm ? "bm-saved" : "") + "' id='bmbtn-" + i + "' title='Save' onclick=\"toggleBookmark('" + safeRef + "','" + safeText + "'," + i + ")\">&#9829;</button>"
      + "<button class='vact-btn' title='Share' onclick=\"shareVerse('" + safeRef + "','" + safeText + "')\">&#128279;</button>"
      + "</div></div>";
  }).join("");
  document.getElementById("bible-content").innerHTML = "<div class='verse-list'>" + html + "</div>";
}

// ── AUDIO ──────────────────────────────────────────────────────
// ── VOICE DETECTION ───────────────────────────────────────────
// Lists all available voices for debugging
function listVoices() {
  return synth.getVoices();
}

function getTamilVoice() {
  var voices = synth.getVoices();
  // Try exact Tamil voices first
  var exact = [
    "ta-IN", "ta_IN", "ta-LK", "ta",
    "Tamil", "tamil"
  ];
  for (var i = 0; i < exact.length; i++) {
    var v = voices.find(function(v){
      return v.lang === exact[i] || v.name.toLowerCase().includes("tamil");
    });
    if (v) return v;
  }
  // Try any voice starting with "ta"
  var taVoice = voices.find(function(v){ return v.lang.startsWith("ta"); });
  if (taVoice) return taVoice;
  return null;
}

function getEnglishVoice() {
  var voices = synth.getVoices();
  // Prefer Indian English for church context
  return voices.find(function(v){ return v.lang === "en-IN"; }) ||
         voices.find(function(v){ return v.lang === "en-GB"; }) ||
         voices.find(function(v){ return v.lang === "en-US"; }) ||
         voices.find(function(v){ return v.lang.startsWith("en"); }) ||
         voices[0] || null;
}

function speakText(text, onEnd) {
  // Cancel any existing speech
  synth.cancel();
  currentUtterance = null;

  // Small delay to let cancel() complete
  setTimeout(function() {
    var utt = new SpeechSynthesisUtterance(text);
    utt.rate = parseFloat(document.getElementById("speed-select").value) || 1;
    utt.volume = 1;
    utt.pitch = 1;

    if (currentLang === "ta") {
      var taVoice = getTamilVoice();
      if (taVoice) {
        // Tamil voice found — use it
        utt.voice = taVoice;
        utt.lang = taVoice.lang || "ta-IN";
      } else {
        // No Tamil voice — use English voice but show warning
        var enVoice = getEnglishVoice();
        if (enVoice) utt.voice = enVoice;
        utt.lang = "en-IN";
        // Show one-time message about Tamil voice
        if (!window._tamilVoiceWarned) {
          window._tamilVoiceWarned = true;
          showToast("No Tamil voice found — install Tamil TTS in device settings");
          document.getElementById("audio-status").textContent =
            "Tamil voice not installed — using English";
        }
      }
    } else {
      var enVoice = getEnglishVoice();
      if (enVoice) utt.voice = enVoice;
      utt.lang = "en-IN";
    }

    utt.onstart = function() { isPlaying = true; updatePlayBtn(); };
    utt.onend   = function() {
      isPlaying = false; updatePlayBtn();
      if (onEnd) onEnd();
    };
    utt.onerror = function(e) {
      isPlaying = false; updatePlayBtn();
      console.warn("TTS error:", e.error);
      if (e.error !== "interrupted") {
        document.getElementById("audio-status").textContent = "Audio error: " + e.error;
      }
    };

    currentUtterance = utt;
    synth.speak(utt);
    isPlaying = true;
    updatePlayBtn();
  }, 100);
}

async function playVerse(index) {
  playAllMode = false;
  currentVerseIdx = index;
  highlightVerse(index);
  var v = currentVerses[index];
  document.getElementById("audio-title").textContent = currentBookName + " " + currentChapter + ":" + v.num;
  document.getElementById("audio-status").textContent = "Playing...";
  speakText(v.text);
  window.scrollTo({top: 0, behavior: "smooth"});
}

function playAllVerses() {
  if (!currentVerses.length) return;
  playAllMode = true;
  currentVerseIdx = 0;
  playNextInSequence();
}

function playNextInSequence() {
  if (!playAllMode || currentVerseIdx >= currentVerses.length) {
    playAllMode = false; isPlaying = false; updatePlayBtn();
    document.getElementById("audio-status").textContent = "Finished";
    return;
  }
  var v = currentVerses[currentVerseIdx];
  highlightVerse(currentVerseIdx);
  document.getElementById("audio-title").textContent = currentBookName + " " + currentChapter + ":" + v.num;
  document.getElementById("audio-status").textContent = "Verse " + v.num + " of " + currentVerses.length;
  var idx = currentVerseIdx;
  speakText(v.text, function() {
    currentVerseIdx++;
    playNextInSequence();
  });
  var el = document.getElementById("vi-" + currentVerseIdx);
  if (el) el.scrollIntoView({behavior:"smooth", block:"center"});
}

function highlightVerse(index) {
  document.querySelectorAll(".verse-item").forEach(function(el){ el.classList.remove("playing"); });
  var el = document.getElementById("vi-" + index);
  if (el) el.classList.add("playing");
}

function togglePlayPause() {
  if (synth.speaking && !synth.paused) {
    synth.pause(); isPlaying = false; updatePlayBtn();
    document.getElementById("audio-status").textContent = "Paused";
  } else if (synth.paused) {
    synth.resume(); isPlaying = true; updatePlayBtn();
    document.getElementById("audio-status").textContent = "Playing...";
  } else {
    if (currentVerses.length) playAllVerses();
  }
}

function stopAudio() {
  synth.cancel();
  if (fcbhAudio) { fcbhAudio.pause(); fcbhAudio = null; }
  isPlaying = false; playAllMode = false;
  updatePlayBtn();
  document.querySelectorAll(".verse-item").forEach(function(el){ el.classList.remove("playing"); });
  document.getElementById("audio-status").textContent = "Stopped";
}

function changeSpeed() {
  if (currentUtterance && synth.speaking) {
    var idx = currentVerseIdx;
    stopAudio();
    setTimeout(function(){ playVerse(idx); }, 100);
  }
}

function updatePlayBtn() {
  document.getElementById("play-icon").style.display  = isPlaying ? "none" : "block";
  document.getElementById("pause-icon").style.display = isPlaying ? "block" : "none";
}

// Load voices on init — some browsers need a trigger
if (typeof speechSynthesis !== "undefined") {
  speechSynthesis.getVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = function() {
      var voices = speechSynthesis.getVoices();
      var hasTamil = voices.some(function(v){
        return v.lang.startsWith("ta") || v.name.toLowerCase().includes("tamil");
      });
      var statusEl = document.getElementById("audio-status");
      if (statusEl && currentLang === "ta" && !hasTamil) {
        statusEl.textContent = "Tamil voice not installed on this device";
      }
      console.log("Voices loaded:", voices.length,
        "| Tamil available:", hasTamil ? "YES" : "NO — install Tamil TTS");
    };
  }
}

// ── SEARCH ─────────────────────────────────────────────────────
async function searchBible() {
  var query = document.getElementById("search-input").value.trim();
  if (!query) return;
  stopAudio();
  document.getElementById("chapter-bar").style.display = "none";
  document.getElementById("bible-content").innerHTML =
    '<div class="bible-loading"><div class="loading-spin"></div><p>Searching...</p></div>';
  try {
    var url = "https://bible-api.com/" + encodeURIComponent(query) + "?translation=kjv";
    var res = await fetch(url);
    var data = await res.json();
    if (data.error) throw new Error(data.error);
    var verses = data.verses || [];
    var html = verses.map(function(v, i) {
      return "<div class='verse-item' style='margin-bottom:6px'>"
        + "<span class='verse-num'>&#9733;</span>"
        + "<div style='flex:1'><div style='font-size:10px;color:var(--gold);margin-bottom:4px'>" + v.book_name + " " + v.chapter + ":" + v.verse + "</div>"
        + "<span class='verse-text' style='font-size:" + currentFontSize + "px'>" + v.text.replace(/\n/g," ") + "</span></div>"
        + "<div class='verse-actions' style='opacity:1'>"
        + "<button class='vact-btn' onclick=\"copyVerse('" + (v.book_name+" "+v.chapter+":"+v.verse).replace(/'/g,"\\'") + "','" + v.text.replace(/'/g,"\\'").replace(/\n/g," ") + "')\">&#128203;</button>"
        + "</div></div>";
    }).join("");
    document.getElementById("bible-content").innerHTML =
      "<p style='color:var(--muted);font-size:.85rem;margin-bottom:14px'>Results for \"" + query + "\" (" + verses.length + ")</p>"
      + "<div class='verse-list'>" + html + "</div>";
  } catch(e) {
    showError("No results for \"" + query + "\". Try a verse like John 3:16 or a word like faith.");
  }
}

// ── FONT SIZE ──────────────────────────────────────────────────
function initFontSize() {
  document.getElementById("fsz-val").textContent = currentFontSize + "px";
}

function changeFont(dir) {
  currentFontSize = dir === 0 ? 16 : Math.min(26, Math.max(12, currentFontSize + dir * 2));
  localStorage.setItem("enjc_fsz", currentFontSize);
  document.getElementById("fsz-val").textContent = currentFontSize + "px";
  document.querySelectorAll(".verse-text").forEach(function(el){
    el.style.fontSize = currentFontSize + "px";
  });
}

// ── PANEL TOGGLE ───────────────────────────────────────────────
function togglePanel(id) {
  ["topics","bookmarks","plan","image"].forEach(function(p) {
    var el  = document.getElementById("panel-" + p);
    var btn = document.getElementById("btn-" + p);
    if (p === id) {
      var isOpen = el.classList.contains("open");
      el.classList.toggle("open", !isOpen);
      if (btn) btn.classList.toggle("active", !isOpen);
      if (p === "bookmarks" && !isOpen) renderBmList();
      if (p === "plan"      && !isOpen) renderPlan();
      if (p === "image"     && !isOpen) setTimeout(drawVerseCanvas, 50);
    } else {
      el.classList.remove("open");
      if (btn) btn.classList.remove("active");
    }
  });
}

// ── TOAST ──────────────────────────────────────────────────────
var _toastTimer = null;
function showToast(msg) {
  var el = document.getElementById("bible-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "bible-toast";
    el.className = "bible-toast";
    document.body.appendChild(el);
  }
  el.innerHTML = msg;
  el.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function(){ el.classList.remove("show"); }, 2200);
}

// ── COPY / SHARE ───────────────────────────────────────────────
function copyVerse(ref, text) {
  var full = ref + " \u2014 " + text;
  if (navigator.clipboard) navigator.clipboard.writeText(full);
  showToast("Copied: " + ref);
}

function shareVerse(ref, text) {
  var msg = ref + "\n" + text + "\n\nRead: https://elimnewjerusalem.github.io/church/bible.html";
  if (navigator.share) navigator.share({title:"ENJC Bible", text:msg});
  else { if (navigator.clipboard) navigator.clipboard.writeText(msg); showToast("Copied to share!"); }
}

// ── BOOKMARKS ──────────────────────────────────────────────────
function getBookmarks() { return JSON.parse(localStorage.getItem("enjc_bm") || "[]"); }
function saveBookmarks(bms) { localStorage.setItem("enjc_bm", JSON.stringify(bms)); }

function toggleBookmark(ref, text, idx) {
  var bms = getBookmarks();
  var found = bms.findIndex(function(b){ return b.ref === ref; });
  var btn = document.getElementById("bmbtn-" + idx);
  if (found >= 0) {
    bms.splice(found, 1);
    if (btn) btn.classList.remove("bm-saved");
    showToast("Removed from saved");
  } else {
    bms.unshift({ref:ref, text:text});
    if (btn) btn.classList.add("bm-saved");
    showToast("\u2665 Verse saved!");
  }
  saveBookmarks(bms);
  updateBmBadge(bms.length);
}

function updateBmBadge(count) {
  var badge = document.getElementById("btn-bookmarks");
  if (badge) badge.innerHTML = "\u2665 Saved" + (count ? " (" + count + ")" : "");
}

function initBookmarkBadge() {
  updateBmBadge(getBookmarks().length);
}

function renderBmList() {
  var bms = getBookmarks();
  var el = document.getElementById("bm-list");
  if (!bms.length) {
    el.innerHTML = '<div class="bm-empty">No saved verses yet.<br>Tap \u2665 on any verse to save it.</div>';
    return;
  }
  el.innerHTML = bms.map(function(b, i) {
    var sr = b.ref.replace(/'/g,"\\'"), st = b.text.replace(/'/g,"\\'");
    return "<div class='verse-item' style='margin-bottom:6px'>"
      + "<div style='flex:1'><div style='font-size:10px;color:var(--gold);margin-bottom:4px'>" + b.ref + "</div>"
      + "<span class='verse-text' style='font-size:" + currentFontSize + "px'>" + b.text + "</span></div>"
      + "<div class='verse-actions' style='opacity:1'>"
      + "<button class='vact-btn' onclick=\"copyVerse('" + sr + "','" + st + "')\">&#128203;</button>"
      + "<button class='vact-btn' onclick='removeBookmark(" + i + ")' style='color:#f87171'>&#10005;</button>"
      + "</div></div>";
  }).join("");
}

function removeBookmark(i) {
  var bms = getBookmarks();
  bms.splice(i, 1);
  saveBookmarks(bms);
  renderBmList();
  updateBmBadge(bms.length);
  showToast("Removed");
}

// ── TOPIC SEARCH ───────────────────────────────────────────────
function showTopic(btn, topic) {
  document.querySelectorAll(".topic-pill").forEach(function(p){ p.classList.remove("active"); });
  btn.classList.add("active");
  var verses = TOPICS_DATA[topic] || [];
  document.getElementById("topic-results").innerHTML = verses.map(function(v, i) {
    var sr = v.ref.replace(/'/g,"\\'"), st = v.text.replace(/'/g,"\\'");
    return "<div class='verse-item' style='margin-bottom:6px'>"
      + "<span class='verse-num'>" + (i+1) + "</span>"
      + "<div style='flex:1'><div style='font-size:10px;color:var(--gold);margin-bottom:4px'>" + v.ref + "</div>"
      + "<span class='verse-text' style='font-size:" + currentFontSize + "px'>" + v.text + "</span></div>"
      + "<div class='verse-actions' style='opacity:1'>"
      + "<button class='vact-btn' onclick=\"copyVerse('" + sr + "','" + st + "')\">&#128203;</button>"
      + "<button class='vact-btn' onclick=\"shareVerse('" + sr + "','" + st + "')\">&#128279;</button>"
      + "</div></div>";
  }).join("");
}

// ── READING PLAN ───────────────────────────────────────────────
function getPlanDone() { return JSON.parse(localStorage.getItem("enjc_plan7") || "[]"); }
function savePlanDone(d) { localStorage.setItem("enjc_plan7", JSON.stringify(d)); }

function renderPlan() {
  var plan = (BIBLE_DATA.readingPlan || []);
  var done = getPlanDone();
  var total = plan.length || 7;
  var count = done.length;
  document.getElementById("plan-pct").textContent  = count + " / " + total;
  document.getElementById("plan-fill").style.width = Math.round(count / total * 100) + "%";
  document.getElementById("plan-days").innerHTML = plan.map(function(p, i) {
    var isDone = done.includes(i);
    return "<div class='plan-day" + (isDone ? " done" : "") + "' onclick='togglePlanDay(" + i + ")'>"
      + "<div class='plan-check'>" + (isDone ? "&#10003;" : "") + "</div>"
      + "<div class='plan-info-txt'><div class='plan-day-label'>" + p.day + "</div>"
      + "<div class='plan-chapter'>" + p.chapter + " <span style='font-size:.8em;opacity:.6'>\u2014 " + p.label + "</span></div></div>"
      + "</div>";
  }).join("");
}

function togglePlanDay(i) {
  var done = getPlanDone();
  var idx = done.indexOf(i);
  if (idx >= 0) done.splice(idx, 1); else done.push(i);
  savePlanDone(done);
  renderPlan();
  showToast(done.includes(i) ? "Day " + (i+1) + " complete! \u2713" : "Marked incomplete");
}

function resetPlan() { savePlanDone([]); renderPlan(); showToast("Plan reset"); }

// ── VERSE IMAGE GENERATOR ──────────────────────────────────────
var IMG_THEMES = {
  dark: {bg:"#080c10", text:"#f5a623", body:"#e8edf4", ref:"rgba(232,237,244,.45)", line:"#f5a623", logo:"rgba(245,166,35,.4)"},
  navy: {bg:"#0b2545", text:"#ffffff", body:"rgba(255,255,255,.9)", ref:"rgba(255,255,255,.45)", line:"#f5a623", logo:"rgba(255,255,255,.25)"},
  warm: {bg:"#fdf6ec", text:"#8b4513", body:"#3d2b1a", ref:"rgba(61,43,26,.45)", line:"#8b4513", logo:"rgba(139,69,19,.25)"}
};

function initImageVerses() {
  var sel = document.getElementById("img-verse-sel");
  if (!sel || !BIBLE_DATA.imageVerses) return;
  sel.innerHTML = "";
  BIBLE_DATA.imageVerses.forEach(function(v, i) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.textContent = v.ref + " \u2014 " + v.text.substring(0, 30) + "...";
    sel.appendChild(opt);
  });
}

function drawVerseCanvas() {
  var sel = parseInt(document.getElementById("img-verse-sel").value) || 0;
  var styleName = document.getElementById("img-style-sel").value || "dark";
  var verses = BIBLE_DATA.imageVerses || [];
  var v = verses[sel] || {ref:"John 3:16", text:"For God so loved the world."};
  var t = IMG_THEMES[styleName];
  var cv = document.getElementById("verse-canvas");
  if (!cv) return;
  var ctx = cv.getContext("2d");
  var W = cv.width, H = cv.height;

  ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = t.line; ctx.fillRect(0, 0, W, 3);

  ctx.fillStyle = t.logo;
  ctx.font = "bold 11px system-ui";
  ctx.letterSpacing = "3px";
  ctx.fillText("ELIM NEW JERUSALEM CHURCH", 32, 36);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = t.line; ctx.globalAlpha = .3;
  ctx.fillRect(32, 46, 60, 1.5); ctx.globalAlpha = 1;

  function wrapText(text, x, y, maxW, lh, fs, color, style) {
    ctx.font = (style || "normal") + " " + fs + "px Georgia,serif";
    ctx.fillStyle = color;
    var words = text.split(" "), line = "";
    for (var n = 0; n < words.length; n++) {
      var test = line + words[n] + " ";
      if (ctx.measureText(test).width > maxW && n > 0) {
        ctx.fillText(line.trim(), x, y); line = words[n] + " "; y += lh;
      } else line = test;
    }
    ctx.fillText(line.trim(), x, y); return y + lh;
  }

  var endY = wrapText("\u201c" + v.text + "\u201d", 32, 80, W - 64, 30, 17, t.body, "italic");
  ctx.font = "bold 14px system-ui"; ctx.fillStyle = t.text;
  ctx.fillText("\u2014 " + v.ref, 32, endY + 10);
  ctx.fillStyle = t.logo; ctx.globalAlpha = .4;
  ctx.fillRect(32, H - 28, W - 64, 1); ctx.globalAlpha = 1;
  ctx.fillStyle = t.logo; ctx.font = "10px system-ui";
  ctx.fillText("elimnewjerusalem.github.io/church/bible.html", 32, H - 12);
}

function downloadVerseImg() {
  var cv = document.getElementById("verse-canvas");
  var a = document.createElement("a");
  a.download = "enjc-verse.jpg";
  a.href = cv.toDataURL("image/jpeg", 0.95);
  a.click();
  showToast("Image downloaded!");
}

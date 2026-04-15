// ═══════════════════════════════════════════════════════════════
//  ENJC Bible — bible.js  (Final v4)
//  Tamil + English | Audio | Image Gen | Bookmarks | Topics | Plan
// ═══════════════════════════════════════════════════════════════

// ── CONFIG ─────────────────────────────────────────────────────
const C = {
  enAPI:  'https://bible-api.com/',
  taAPI1: 'https://bolls.life/get-text/TAMOVR/',
  taAPI2: 'https://bolls.life/get-text/TAMBL98/',
  taAPI3: 'https://api.getbible.net/v2/tamil/',
  data:   'data/',
  ms:     8000
};

// ── STATE ───────────────────────────────────────────────────────
const S = {
  lang:'en', book:'', bookName:'', bookNum:1,
  ch:1, totalCh:1, verses:[], fs:parseInt(localStorage.getItem('enjc_fs')||'16'),
  hl:JSON.parse(localStorage.getItem('enjc_hl')||'{}'),
  bm:JSON.parse(localStorage.getItem('enjc_bm')||'[]'),
  tamilDB:{}, topics:{}, bibleData:{},
  igSz:'9:16', igBg:'#080c10', igTc:'#f5a623',
  igVerse:null, customVerse:null
};

// ── BOOKS (all 66) ─────────────────────────────────────────────
const BOOKS=[
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

// ── VOTD DATA (fallback — 7 days) ──────────────────────────────
const VOTD=[
  {en:"For I know the plans I have for you — plans for welfare, to give you a future and a hope.",ref:"Jeremiah 29:11",ta:"என்னால் நினைக்கப்படுகிற நினைவுகளை நான் அறிவேன்; அவைகள் சமாதானத்திற்கான நினைவுகளே.",tref:"எரேமியா 29:11"},
  {en:"Trust in the Lord with all your heart, and do not lean on your own understanding.",ref:"Proverbs 3:5",ta:"உன் சம்பூர்ண இருதயத்தோடே கர்த்தரில் நம்பிக்கைவை; உன் சொந்த அறிவை நம்பாதே.",tref:"நீதிமொழிகள் 3:5"},
  {en:"I can do all things through him who strengthens me.",ref:"Philippians 4:13",ta:"என்னை பலப்படுத்துகிற கிறிஸ்துவினால் எல்லாவற்றையும் செய்யவல்லேன்.",tref:"பிலிப்பியர் 4:13"},
  {en:"The Lord is my shepherd; I shall not want.",ref:"Psalm 23:1",ta:"கர்த்தர் என் மேய்ப்பர்; எனக்கு குறைவுண்டாவதில்லை.",tref:"சங்கீதம் 23:1"},
  {en:"Be strong and courageous. Do not be afraid, for the Lord your God is with you.",ref:"Joshua 1:9",ta:"திடமனதாயிரு, தைரியமாயிரு; கர்த்தர் நீ போகும் எவ்விடத்திலும் உன்னோடிருக்கிறார்.",tref:"யோசுவா 1:9"},
  {en:"Come to me, all who labour and are heavy laden, and I will give you rest.",ref:"Matthew 11:28",ta:"வருத்தப்பட்டு பாரஞ்சுமக்கிறவர்களே, என்னிடத்தில் வாருங்கள்; நான் உங்களுக்கு இளைப்பாறுதல் தருவேன்.",tref:"மத்தேயு 11:28"},
  {en:"Those who wait for the Lord shall renew their strength; they shall mount up with wings like eagles.",ref:"Isaiah 40:31",ta:"கர்த்தருக்கு காத்திருக்கிறவர்களோ புதுப்பெலன் அடைவார்கள்; கழுகுகளைப்போல சிறகடித்து ஏறுவார்கள்.",tref:"ஏசாயா 40:31"}
];

// ── TOPICS DATA ─────────────────────────────────────────────────
const TOPICS={
  faith:[{ref:"Hebrews 11:1",text:"Now faith is the substance of things hoped for, the evidence of things not seen."},{ref:"Romans 10:17",text:"Faith comes from hearing, and hearing through the word of Christ."},{ref:"Matthew 17:20",text:"If you have faith like a grain of mustard seed, nothing will be impossible for you."},{ref:"Ephesians 2:8",text:"For by grace you have been saved through faith. It is the gift of God."}],
  prayer:[{ref:"Philippians 4:6",text:"Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God."},{ref:"Matthew 6:9",text:"Pray then like this: Our Father in heaven, hallowed be your name."},{ref:"1 Thessalonians 5:17",text:"Pray without ceasing."},{ref:"James 5:16",text:"The prayer of a righteous person has great power as it is working."}],
  love:[{ref:"John 3:16",text:"For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."},{ref:"1 Corinthians 13:4",text:"Love is patient and kind; love does not envy or boast; it is not arrogant."},{ref:"1 John 4:8",text:"Anyone who does not love does not know God, because God is love."},{ref:"Romans 8:38-39",text:"Neither death nor life, nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus our Lord."}],
  peace:[{ref:"John 14:27",text:"Peace I leave with you; my peace I give to you. Let not your hearts be troubled, neither let them be afraid."},{ref:"Philippians 4:7",text:"The peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus."},{ref:"Isaiah 26:3",text:"You keep him in perfect peace whose mind is stayed on you, because he trusts in you."},{ref:"Romans 5:1",text:"Therefore, since we have been justified by faith, we have peace with God through our Lord Jesus Christ."}],
  healing:[{ref:"Isaiah 53:5",text:"But he was pierced for our transgressions; he was crushed for our iniquities; and by his wounds we are healed."},{ref:"Jeremiah 17:14",text:"Heal me, O Lord, and I shall be healed; save me, and I shall be saved."},{ref:"James 5:14",text:"Is anyone among you sick? Let him call for the elders of the church to pray over him, anointing him with oil in the name of the Lord."},{ref:"Psalm 103:3",text:"Who forgives all your iniquity, who heals all your diseases."}],
  salvation:[{ref:"John 3:16",text:"For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."},{ref:"Romans 10:9",text:"If you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved."},{ref:"Acts 4:12",text:"There is salvation in no one else, for there is no other name under heaven given among men by which we must be saved."},{ref:"Ephesians 2:8",text:"For by grace you have been saved through faith. It is the gift of God."}],
  strength:[{ref:"Philippians 4:13",text:"I can do all things through him who strengthens me."},{ref:"Isaiah 40:31",text:"They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles."},{ref:"Psalm 46:1",text:"God is our refuge and strength, a very present help in trouble."},{ref:"2 Corinthians 12:9",text:"My grace is sufficient for you, for my power is made perfect in weakness."}],
  family:[{ref:"Joshua 24:15",text:"As for me and my house, we will serve the Lord."},{ref:"Proverbs 22:6",text:"Train up a child in the way he should go; even when he is old he will not depart from it."},{ref:"Ephesians 6:1",text:"Children, obey your parents in the Lord, for this is right."},{ref:"Psalm 127:3",text:"Children are a heritage from the Lord, the fruit of the womb a reward."}],
  hope:[{ref:"Jeremiah 29:11",text:"For I know the plans I have for you, declares the Lord — plans for welfare and not for evil, to give you a future and a hope."},{ref:"Romans 15:13",text:"May the God of hope fill you with all joy and peace in believing."},{ref:"Lamentations 3:22-23",text:"The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning."},{ref:"Romans 8:28",text:"For those who love God all things work together for good."}],
  worship:[{ref:"Psalm 95:1",text:"Oh come, let us sing to the Lord; let us make a joyful noise to the rock of our salvation!"},{ref:"John 4:24",text:"God is spirit, and those who worship him must worship in spirit and truth."},{ref:"Romans 12:1",text:"Present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship."},{ref:"Psalm 100:4",text:"Enter his gates with thanksgiving, and his courts with praise!"}]
};

// ── IMAGE VERSES ────────────────────────────────────────────────
const IGVERSES=[
  {ref:"John 3:16",text:"For God so loved the world, that He gave His only begotten Son, that whoever believes in Him shall not perish but have eternal life."},
  {ref:"Philippians 4:13",text:"I can do all things through Christ who strengthens me."},
  {ref:"Psalm 23:1",text:"The Lord is my shepherd; I shall not want."},
  {ref:"Isaiah 43:4",text:"Because you are precious in my sight, and honoured, and I love you."},
  {ref:"Jeremiah 29:11",text:"For I know the plans I have for you — plans for welfare, to give you a future and a hope."},
  {ref:"Isaiah 40:31",text:"They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles."},
  {ref:"Matthew 11:28",text:"Come to me, all who labour and are heavy laden, and I will give you rest."},
  {ref:"Romans 8:28",text:"For those who love God all things work together for good."},
  {ref:"Proverbs 3:5",text:"Trust in the Lord with all your heart, and do not lean on your own understanding."},
  {ref:"John 14:6",text:"I am the way, and the truth, and the life. No one comes to the Father except through me."}
];

// ── PLAN DATA ───────────────────────────────────────────────────
const PLAN=[
  {day:"Day 1",ch:"Psalm 1",lbl:"The blessed man",book:"psalms",n:1},
  {day:"Day 2",ch:"John 1",lbl:"The Word became flesh",book:"john",n:1},
  {day:"Day 3",ch:"Romans 8",lbl:"No condemnation",book:"romans",n:8},
  {day:"Day 4",ch:"Matthew 5",lbl:"The Beatitudes",book:"matthew",n:5},
  {day:"Day 5",ch:"Philippians 4",lbl:"Rejoice always",book:"philippians",n:4},
  {day:"Day 6",ch:"Isaiah 40",lbl:"Renew your strength",book:"isaiah",n:40},
  {day:"Day 7",ch:"Revelation 21",lbl:"All things new",book:"revelation",n:21}
];

// ── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  populateBooks();
  initFsz();
  initBmBadge();
  initVoices();
  loadData();
  document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',closeMenu));
});

async function loadData(){
  const [bd,tb]=await Promise.allSettled([
    fetch(C.data+'bible-data.json').then(r=>r.json()),
    fetch(C.data+'tamil-bible.json').then(r=>r.json())
  ]);
  if(bd.status==='fulfilled'){S.bibleData=bd.value; if(bd.value.imageVerses) initIGVerses(bd.value.imageVerses);}
  else initIGVerses(IGVERSES);
  if(tb.status==='fulfilled') S.tamilDB=tb.value;
  else initIGVerses(IGVERSES);
  loadVOTD();
  renderPlan();
  if(!S.bibleData.imageVerses) initIGVerses(IGVERSES);
}

// ── NAV ─────────────────────────────────────────────────────────
function toggleMenu(){document.getElementById('menu').classList.toggle('open');document.getElementById('ham').classList.toggle('open');}
function closeMenu(){document.getElementById('menu').classList.remove('open');document.getElementById('ham').classList.remove('open');}

// ── TOAST ───────────────────────────────────────────────────────
let _tt;
function toast(msg,dur=2500){
  let el=document.getElementById('btoast');
  if(!el){el=Object.assign(document.createElement('div'),{id:'btoast',className:'btoast'});document.body.appendChild(el);}
  el.innerHTML=msg;el.classList.add('show');
  clearTimeout(_tt);_tt=setTimeout(()=>el.classList.remove('show'),dur);
}

// ── VOTD ────────────────────────────────────────────────────────
let _votdTA=false;
function loadVOTD(){
  const pool=(S.bibleData.verseOfDay||VOTD);
  const v=pool[new Date().getDay()%pool.length];
  window._vd=v;
  document.getElementById('votd-en').textContent='\u201c'+v.en+'\u201d';
  document.getElementById('votd-ref').textContent='\u2014 '+v.ref+(v.tref?' | '+v.tref:'');
  if(v.ta) document.getElementById('votd-ta').textContent='\u201c'+v.ta+'\u201d';
}

function toggleVOTDTamil(){
  const ta=document.getElementById('votd-ta');
  const btn=document.getElementById('votd-ta-toggle');
  _votdTA=!_votdTA;
  ta.style.display=_votdTA?'block':'none';
  btn.innerHTML=_votdTA?'&#127470;&#127475; Hide Tamil':'&#127470;&#127475; Show Tamil';
}

function playVOTD(lang){
  const v=window._vd; if(!v) return;
  speakNow((lang==='ta'?(v.ta||v.en):v.en),lang);
}

function shareVOTD(){
  const v=window._vd; if(!v) return;
  const msg=v.ref+'\n'+v.en+'\n\nRead: https://elimnewjerusalem.github.io/church/bible.html';
  if(navigator.share) navigator.share({title:'ENJC Verse of the Day',text:msg});
  else{navigator.clipboard?.writeText(msg);toast('Copied!');}
}

function copyVOTD(){
  const v=window._vd; if(!v) return;
  navigator.clipboard?.writeText(v.ref+' \u2014 '+v.en);
  toast('&#128203; Copied!');
}

function genVOTDImage(){
  const v=window._vd; if(!v) return;
  S.customVerse={ref:v.ref,text:v.en};
  togPanel('img');
  setTimeout(drawIG,100);
  toast('Verse loaded in Image Generator');
}

// ── BOOKS ───────────────────────────────────────────────────────
function populateBooks(){
  const sel=document.getElementById('book-sel');
  let lt='';
  BOOKS.forEach(b=>{
    if(b.t!==lt){const og=document.createElement('optgroup');og.label=b.t==='OT'?'Old Testament':'New Testament';sel.appendChild(og);lt=b.t;}
    const o=document.createElement('option');o.value=b.id;o.textContent=b.name;sel.lastElementChild.appendChild(o);
  });
}

function setLang(l){
  S.lang=l;
  document.getElementById('btn-en').classList.toggle('on',l==='en');
  document.getElementById('btn-ta').classList.toggle('on',l==='ta');
  document.getElementById('tainfo').style.display=l==='ta'?'block':'none';
  stopAud();
  if(S.book) loadCh();
}

function onBook(){
  const id=document.getElementById('book-sel').value; if(!id) return;
  const bk=BOOKS.find(b=>b.id===id);
  S.book=id;S.bookName=bk.name;S.bookNum=bk.n;S.totalCh=bk.ch;S.ch=1;
  const cs=document.getElementById('ch-sel');
  cs.innerHTML='';cs.disabled=false;
  for(let i=1;i<=bk.ch;i++){const o=document.createElement('option');o.value=i;o.textContent='Chapter '+i;cs.appendChild(o);}
  const gb=document.getElementById('gobtn');gb.style.display='block';
  loadCh();
}

function onCh(){S.ch=parseInt(document.getElementById('ch-sel').value)||1;loadCh();}

// ── LOAD CHAPTER ────────────────────────────────────────────────
async function loadCh(){
  if(!S.book) return;
  stopAud();
  setHTML('<div class="bload"><div class="bspin"></div><p>Loading '+(S.lang==='ta'?'Tamil':'English')+' Bible...</p></div>');
  try{
    S.verses=S.lang==='en'?await loadEN():await loadTA();
    if(!S.verses.length) throw new Error('No verses found');
    renderVerses();updateChUI();
  }catch(e){
    setHTML('<div class="berr">&#9888; '+e.message+'</div>');
  }
}

async function loadEN(){
  const r=await fetchT(C.enAPI+S.book+'+'+S.ch+'?translation=kjv');
  const d=await r.json();
  if(d.error) throw new Error(d.error);
  return (d.verses||[]).map(v=>({num:v.verse,text:v.text.trim().replace(/\n/g,' ')}));
}

async function loadTA(){
  const key=S.bookNum+'_'+S.ch;
  if(S.tamilDB[key]) return S.tamilDB[key].map(v=>({num:v[0],text:v[1]}));
  for(const url of[C.taAPI1+S.bookNum+'/'+S.ch+'/',C.taAPI2+S.bookNum+'/'+S.ch+'/',C.taAPI3+S.bookNum+'/'+S.ch+'.json']){
    try{
      const r=await fetchT(url); if(!r.ok) continue;
      const d=await r.json();
      if(Array.isArray(d)&&d.length) return d.map(v=>({num:v.verse,text:v.text}));
      if(d.verses?.length) return d.verses.map(v=>({num:v.verse_nr,text:v.verse}));
    }catch(e){continue;}
  }
  throw new Error('Tamil Bible not available for this chapter.\nOffline chapters: John 1-6,10-17,20 | Psalms 23 | Matt 5 | Romans 8 | Phil 4');
}

async function fetchT(url){
  const ctrl=new AbortController();
  const tid=setTimeout(()=>ctrl.abort(),C.ms);
  try{const r=await fetch(url,{signal:ctrl.signal});clearTimeout(tid);return r;}
  catch(e){clearTimeout(tid);throw e;}
}

function setHTML(h){document.getElementById('bcontent').innerHTML=h;}

function updateChUI(){
  document.getElementById('chbar').style.display='flex';
  document.getElementById('chtitle').textContent=S.bookName+' \u2014 Chapter '+S.ch;
  document.getElementById('prevb').disabled=S.ch<=1;
  document.getElementById('nextb').disabled=S.ch>=S.totalCh;
  document.getElementById('ch-sel').value=S.ch;
  document.getElementById('abar').style.display='flex';
  document.getElementById('astat').textContent='Tap a verse to listen';
}

function prevCh(){if(S.ch>1){S.ch--;loadCh();}}
function nextCh(){if(S.ch<S.totalCh){S.ch++;loadCh();}}

// ── RENDER VERSES ────────────────────────────────────────────────
function renderVerses(){
  const isTa=S.lang==='ta';
  const hlk=S.book+S.ch;
  const hlm=S.hl[hlk]||{};
  const html=S.verses.map((v,i)=>{
    const ref=S.bookName+' '+S.ch+':'+v.num;
    const isBm=S.bm.some(b=>b.ref===ref);
    const isHl=!!hlm[v.num];
    const st=v.text.replace(/'/g,"\\'").replace(/\n/g,' ');
    const sr=ref.replace(/'/g,"\\'");
    return `<div class="vi${isHl?' vhl':''}" id="vi${i}">
<span class="vn" onclick="playV(${i})">${v.num}</span>
<div class="vb">
<span class="vtxt${isTa?' vta-font':''}" style="font-size:${S.fs}px" onclick="playV(${i})">${v.text}</span>
</div>
<div class="vacts">
<button class="vbt" onclick="playV(${i})" title="Listen">&#9654;</button>
<button class="vbt${isHl?' hl':''}" onclick="togHL(${v.num},${i})" title="Highlight">&#9679;</button>
<button class="vbt${isBm?' bm':''}" id="bmbtn${i}" onclick="togBM('${sr}','${st}',${i})" title="Save">&#9829;</button>
<button class="vbt" onclick="cpV('${sr}','${st}')" title="Copy">&#128203;</button>
<button class="vbt" onclick="shrV('${sr}','${st}')" title="Share">&#128279;</button>
<button class="vbt" onclick="useVerseForImg('${sr}','${st}')" title="Image">&#128247;</button>
</div>
</div>`;
  }).join('');
  setHTML('<div class="vlist">'+html+'</div>');
}

// ── AUDIO ────────────────────────────────────────────────────────
const synth=window.speechSynthesis;
let utt=null,playing=false,playAllM=false,pIdx=0;

function initVoices(){
  if(synth.onvoiceschanged!==undefined) synth.onvoiceschanged=()=>synth.getVoices();
  synth.getVoices();
}

function getBestVoice(lang){
  const vv=synth.getVoices();
  if(lang==='ta'){
    const ta=vv.find(v=>v.lang.startsWith('ta')||v.name.toLowerCase().includes('tamil'));
    if(ta) return ta;
    // No Tamil voice — warn once
    if(!window._taWarn){window._taWarn=true;toast('Tamil voice not installed. Settings \u2192 TTS \u2192 Install Tamil voice',5000);}
    return null;
  }
  return vv.find(v=>v.lang==='en-IN')||vv.find(v=>v.lang.startsWith('en'))||vv[0]||null;
}

function speakNow(text,lang,cb){
  synth.cancel();
  setTimeout(()=>{
    const u=new SpeechSynthesisUtterance(text);
    u.rate=parseFloat(document.getElementById('aspd')?.value||'1');
    u.volume=1;u.pitch=1;
    const voice=getBestVoice(lang||S.lang);
    if(voice){u.voice=voice;u.lang=voice.lang;}
    else u.lang=lang==='ta'?'ta-IN':'en-IN';
    u.onstart=()=>{playing=true;updPBtn();};
    u.onend=()=>{playing=false;updPBtn();if(cb)cb();};
    u.onerror=(e)=>{playing=false;updPBtn();
      if(e.error!=='interrupted'){document.getElementById('astat').textContent='Audio error — check TTS settings';}
    };
    utt=u;synth.speak(u);playing=true;updPBtn();
  },120);
}

function playV(i){
  playAllM=false;pIdx=i;
  const v=S.verses[i];if(!v)return;
  hlPlay(i);
  document.getElementById('atitle').textContent=S.bookName+' '+S.ch+':'+v.num;
  document.getElementById('astat').textContent='Playing verse '+v.num+'...';
  speakNow(v.text,S.lang);
}

function playAll(){
  if(!S.verses.length)return;
  playAllM=true;pIdx=0;seqPlay();
}

function seqPlay(){
  if(!playAllM||pIdx>=S.verses.length){playAllM=false;playing=false;updPBtn();return;}
  const v=S.verses[pIdx];
  hlPlay(pIdx);
  document.getElementById('astat').textContent='Verse '+v.num+' / '+S.verses.length;
  document.getElementById('vi'+pIdx)?.scrollIntoView({behavior:'smooth',block:'center'});
  speakNow(v.text,S.lang,()=>{pIdx++;seqPlay();});
}

function hlPlay(i){
  document.querySelectorAll('.vi').forEach(el=>el.classList.remove('vplay'));
  document.getElementById('vi'+i)?.classList.add('vplay');
}

function togPlay(){
  if(synth.speaking&&!synth.paused){synth.pause();playing=false;updPBtn();document.getElementById('astat').textContent='Paused';}
  else if(synth.paused){synth.resume();playing=true;updPBtn();document.getElementById('astat').textContent='Playing...';}
  else if(S.verses.length) playAll();
}

function stopAud(){
  synth.cancel();playing=false;playAllM=false;updPBtn();
  document.querySelectorAll('.vi').forEach(el=>el.classList.remove('vplay'));
  const s=document.getElementById('astat');if(s)s.textContent='Stopped';
}

function updPBtn(){
  const pi=document.getElementById('plic');const pu=document.getElementById('puic');
  if(pi)pi.style.display=playing?'none':'block';
  if(pu)pu.style.display=playing?'block':'none';
}

function chSpd(){
  if(playing){const i=pIdx;stopAud();setTimeout(()=>playV(i),150);}
}

// ── VERSE ACTIONS ────────────────────────────────────────────────
function cpV(ref,text){
  navigator.clipboard?.writeText(ref+' \u2014 '+text);
  toast('&#128203; Copied: '+ref);
}

function shrV(ref,text){
  const msg=ref+'\n'+text+'\n\nRead: https://elimnewjerusalem.github.io/church/bible.html';
  if(navigator.share)navigator.share({title:'ENJC Bible',text:msg});
  else{navigator.clipboard?.writeText(msg);toast('Copied to share!');}
}

function useVerseForImg(ref,text){
  S.customVerse={ref,text};
  togPanel('img');
  setTimeout(drawIG,100);
  toast('Verse loaded \u2192 Image Generator');
}

// ── HIGHLIGHT ───────────────────────────────────────────────────
function togHL(vnum,i){
  const k=S.book+S.ch;
  if(!S.hl[k])S.hl[k]={};
  const el=document.getElementById('vi'+i);
  const btn=el?.querySelectorAll('.vbt')[1];
  if(S.hl[k][vnum]){
    delete S.hl[k][vnum];
    el?.classList.remove('vhl');
    btn?.classList.remove('hl');
    toast('Highlight removed');
  }else{
    S.hl[k][vnum]=1;
    el?.classList.add('vhl');
    btn?.classList.add('hl');
    toast('&#9679; Highlighted');
  }
  localStorage.setItem('enjc_hl',JSON.stringify(S.hl));
}

// ── BOOKMARKS ────────────────────────────────────────────────────
function getBM(){return JSON.parse(localStorage.getItem('enjc_bm')||'[]');}
function saveBM(bms){localStorage.setItem('enjc_bm',JSON.stringify(bms));S.bm=bms;}

function togBM(ref,text,i){
  const bms=getBM();
  const fi=bms.findIndex(b=>b.ref===ref);
  const btn=document.getElementById('bmbtn'+i);
  if(fi>=0){bms.splice(fi,1);btn?.classList.remove('bm');toast('Removed from saved');}
  else{bms.unshift({ref,text});btn?.classList.add('bm');toast('\u2665 Verse saved!');}
  saveBM(bms);initBmBadge();
}

function initBmBadge(){
  const bms=getBM();
  const el=document.getElementById('qa-bm');
  if(el){const n=el.querySelector('.qal');if(n)n.textContent=bms.length?'Saved ('+bms.length+')':'Saved';}
}

function renderBmList(){
  const bms=getBM();
  const el=document.getElementById('bmlist');
  if(!bms.length){el.innerHTML='<div class="bempty">&#9829; No saved verses yet.<br>Tap &#9829; on any verse to save it.</div>';return;}
  el.innerHTML=bms.map((b,i)=>{
    const sr=b.ref.replace(/'/g,"\\'");const st=b.text.replace(/'/g,"\\'");
    return `<div class="vi" style="margin-bottom:5px">
<div class="vb" style="flex:1"><div class="vtag">${b.ref}</div>
<span class="vtxt" style="font-size:${S.fs}px">${b.text}</span></div>
<div class="vacts" style="opacity:1">
<button class="vbt" onclick="cpV('${sr}','${st}')">&#128203;</button>
<button class="vbt" onclick="shrV('${sr}','${st}')">&#128279;</button>
<button class="vbt" onclick="rmBM(${i})" style="color:#f87171">&#10005;</button>
</div></div>`;
  }).join('');
}

function rmBM(i){const bms=getBM();bms.splice(i,1);saveBM(bms);renderBmList();initBmBadge();toast('Removed');}

// ── FONT SIZE ────────────────────────────────────────────────────
function initFsz(){document.getElementById('fszv').textContent=S.fs+'px';}
function chFont(d){
  S.fs=d===0?16:Math.min(28,Math.max(12,S.fs+d*2));
  localStorage.setItem('enjc_fs',S.fs);
  document.getElementById('fszv').textContent=S.fs+'px';
  document.querySelectorAll('.vtxt').forEach(el=>el.style.fontSize=S.fs+'px');
}

// ── PANEL TOGGLE ────────────────────────────────────────────────
function togPanel(id){
  ['topics','plan','bm','img'].forEach(p=>{
    const el=document.getElementById('panel-'+p);
    const qa=document.getElementById('qa-'+p);
    const open=p===id&&!el.classList.contains('open');
    el.classList.toggle('open',open);
    qa?.classList.toggle('on',open);
    if(p==='bm'&&open)renderBmList();
    if(p==='plan'&&open)renderPlan();
    if(p==='img'&&open)setTimeout(drawIG,80);
  });
}

// ── TOPIC SEARCH ─────────────────────────────────────────────────
function showTopic(btn,topic){
  document.querySelectorAll('.tp').forEach(p=>p.classList.remove('on'));
  btn.classList.add('on');
  const vv=TOPICS[topic]||[];
  document.getElementById('topic-res').innerHTML=vv.map((v,i)=>{
    const sr=v.ref.replace(/'/g,"\\'");const st=v.text.replace(/'/g,"\\'");
    return `<div class="vi" style="margin-bottom:5px">
<span class="vn">${i+1}</span>
<div class="vb"><div class="vtag">${v.ref}</div>
<span class="vtxt" style="font-size:${S.fs}px">${v.text}</span></div>
<div class="vacts" style="opacity:1">
<button class="vbt" onclick="cpV('${sr}','${st}')">&#128203;</button>
<button class="vbt" onclick="shrV('${sr}','${st}')">&#128279;</button>
<button class="vbt" onclick="useVerseForImg('${sr}','${st}')">&#128247;</button>
</div></div>`;
  }).join('')||'<div class="bempty">No verses found.</div>';
}

// ── READING PLAN ─────────────────────────────────────────────────
function getPD(){return JSON.parse(localStorage.getItem('enjc_pd')||'[]');}
function savePD(d){localStorage.setItem('enjc_pd',JSON.stringify(d));}

function renderPlan(){
  const done=getPD();const cnt=done.length;
  document.getElementById('ppct').textContent=cnt+'/'+PLAN.length;
  document.getElementById('pfill').style.width=Math.round(cnt/PLAN.length*100)+'%';
  document.getElementById('pdays').innerHTML=PLAN.map((p,i)=>{
    const isDone=done.includes(i);
    return `<div class="pday${isDone?' done':''}" onclick="togPDay(${i})">
<div class="pchk">${isDone?'&#10003;':''}</div>
<div class="pinfo"><div class="plbl">${p.day}</div>
<div class="pch">${p.ch} <span style="opacity:.5;font-size:.82em">\u2014 ${p.lbl}</span></div></div>
<button class="pgo" onclick="event.stopPropagation();goPlan(${i})">Read &rarr;</button>
</div>`;
  }).join('');
}

function togPDay(i){
  const done=getPD();const idx=done.indexOf(i);
  if(idx>=0)done.splice(idx,1);else done.push(i);
  savePD(done);renderPlan();
  toast(done.includes(i)?'Day '+(i+1)+' complete \u2713':'Marked incomplete');
}

function goPlan(i){
  const p=PLAN[i];if(!p)return;
  const bk=BOOKS.find(b=>b.id===p.book);if(!bk)return;
  document.getElementById('book-sel').value=p.book;
  S.book=p.book;S.bookName=bk.name;S.bookNum=bk.n;S.totalCh=bk.ch;S.ch=p.n;
  const cs=document.getElementById('ch-sel');
  cs.innerHTML='';cs.disabled=false;
  for(let j=1;j<=bk.ch;j++){const o=document.createElement('option');o.value=j;o.textContent='Chapter '+j;cs.appendChild(o);}
  cs.value=p.n;
  document.getElementById('gobtn').style.display='block';
  togPanel('plan');
  loadCh();
  window.scrollTo({top:document.getElementById('bcontent').offsetTop-80,behavior:'smooth'});
}

function resetPlan(){savePD([]);renderPlan();toast('Plan reset');}

// ── SEARCH ──────────────────────────────────────────────────────
async function doSearch(){
  const q=document.getElementById('sinput').value.trim();if(!q)return;
  stopAud();
  document.getElementById('chbar').style.display='none';
  setHTML('<div class="bload"><div class="bspin"></div><p>Searching...</p></div>');
  try{
    const r=await fetchT(C.enAPI+encodeURIComponent(q)+'?translation=kjv');
    const d=await r.json();
    if(d.error)throw new Error(d.error);
    const vv=d.verses||[];
    setHTML('<p style="color:var(--mt);font-size:.85rem;margin-bottom:14px">Results for "'+q+'" ('+vv.length+')</p><div class="vlist">'+
      vv.map(v=>{
        const ref=v.book_name+' '+v.chapter+':'+v.verse;
        const txt=v.text.replace(/\n/g,' ');
        const sr=ref.replace(/'/g,"\\'");const st=txt.replace(/'/g,"\\'");
        return `<div class="vi" style="margin-bottom:5px">
<span class="vn">&#9733;</span>
<div class="vb"><div class="vtag">${ref}</div>
<span class="vtxt">${txt}</span></div>
<div class="vacts" style="opacity:1">
<button class="vbt" onclick="cpV('${sr}','${st}')">&#128203;</button>
<button class="vbt" onclick="useVerseForImg('${sr}','${st}')">&#128247;</button>
</div></div>`;
      }).join('')+'</div>');
  }catch(e){
    setHTML('<div class="berr">No results for "'+q+'". Try John 3:16 or a keyword.</div>');
  }
}

// ── IMAGE GENERATOR ─────────────────────────────────────────────
function initIGVerses(verses){
  const sel=document.getElementById('img-vsel');if(!sel)return;
  sel.innerHTML='';
  verses.forEach((v,i)=>{
    const o=document.createElement('option');o.value=i;
    o.textContent=v.ref+' \u2014 '+v.text.substring(0,32)+'...';
    sel.appendChild(o);
  });
  S.igVerses=verses;
}

function setSz(btn,sz){
  document.querySelectorAll('.szb').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');S.igSz=sz;drawIG();
}

function setBG(el,bg){
  document.querySelectorAll('.bgsw').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');S.igBg=bg;drawIG();
}

function setTC(btn,tc){
  document.querySelectorAll('.tcb').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');S.igTc=tc;drawIG();
}

function useCurrentVerse(){
  if(!S.verses.length){toast('Select a chapter first');return;}
  const hlk=S.book+S.ch;const hlm=S.hl[hlk]||{};
  const nums=Object.keys(hlm).map(Number);
  const v=nums.length?S.verses.find(vv=>vv.num===nums[0]):S.verses[0];
  if(!v)return;
  S.customVerse={ref:S.bookName+' '+S.ch+':'+v.num,text:v.text};
  drawIG();toast('Current verse loaded');
}

function getIGVerse(){
  if(S.customVerse){const v=S.customVerse;S.customVerse=null;return v;}
  const verses=S.igVerses||IGVERSES;
  return verses[parseInt(document.getElementById('img-vsel')?.value||'0')]||IGVERSES[0];
}

const RATIO_MAP={'9:16':[1080,1920],'3:4':[900,1200],'1:1':[1080,1080],'16:9':[1920,1080]};

function drawIG(){
  const cv=document.getElementById('igcv');if(!cv)return;
  const [W,H]=RATIO_MAP[S.igSz]||[1080,1920];
  cv.width=W;cv.height=H;
  const ctx=cv.getContext('2d');
  const bg=S.igBg;const tc=S.igTc;
  const v=getIGVerse();

  // Background
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  // Decorative corner lines
  const co=40;const cl=120;const lw=3;
  ctx.strokeStyle=tc;ctx.globalAlpha=.25;ctx.lineWidth=lw;
  ctx.beginPath();ctx.moveTo(co,co+cl);ctx.lineTo(co,co);ctx.lineTo(co+cl,co);ctx.stroke();
  ctx.beginPath();ctx.moveTo(W-co,H-co-cl);ctx.lineTo(W-co,H-co);ctx.lineTo(W-co-cl,H-co);ctx.stroke();
  ctx.globalAlpha=1;

  // Top accent bar
  ctx.fillStyle=tc;ctx.fillRect(0,0,W,6);

  // Church name
  ctx.fillStyle=tc;ctx.globalAlpha=.55;
  ctx.font='bold '+Math.round(W*0.025)+'px system-ui';
  ctx.letterSpacing=Math.round(W*0.008)+'px';
  ctx.textAlign='center';
  ctx.fillText('ELIM NEW JERUSALEM CHURCH',W/2,H*0.09);
  ctx.letterSpacing='0px';ctx.globalAlpha=1;

  // Divider
  ctx.fillStyle=tc;ctx.globalAlpha=.25;
  ctx.fillRect(W/2-80,H*0.105,160,2);ctx.globalAlpha=1;

  // Verse text — centred word wrap
  const textColor=isLight(bg)?darken(tc):lighten(tc,bg);
  const bodyColor=isLight(bg)?'rgba(0,0,0,0.8)':'rgba(255,255,255,0.88)';
  const maxW=W*0.8;
  const fs=Math.round(W*0.045);
  ctx.font='italic '+fs+'px Georgia,serif';
  ctx.fillStyle=bodyColor;
  ctx.textAlign='center';
  const lines=wrapText(ctx,'\u201c'+v.text+'\u201d',maxW);
  const lineH=fs*1.55;
  const totalH=lines.length*lineH;
  let startY=H/2-totalH/2+fs;
  if(startY<H*0.2)startY=H*0.2;
  lines.forEach((line,i)=>ctx.fillText(line,W/2,startY+i*lineH));

  // Reference
  const refY=startY+lines.length*lineH+Math.round(H*0.04);
  ctx.font='bold '+Math.round(W*0.038)+'px system-ui';
  ctx.fillStyle=tc;
  ctx.fillText('\u2014 '+v.ref,W/2,refY);

  // Bottom bar + URL
  ctx.fillStyle=tc;ctx.globalAlpha=.2;
  ctx.fillRect(0,H-6,W,6);ctx.globalAlpha=1;
  ctx.fillStyle=tc;ctx.globalAlpha=.35;
  ctx.font=Math.round(W*0.02)+'px system-ui';
  ctx.fillText('elimnewjerusalem.github.io/church',W/2,H-Math.round(H*0.025));
  ctx.globalAlpha=1;
}

function wrapText(ctx,text,maxW){
  const words=text.split(' ');const lines=[];let line='';
  for(const word of words){
    const test=line+word+' ';
    if(ctx.measureText(test).width>maxW&&line){lines.push(line.trim());line=word+' ';}
    else line=test;
  }
  if(line.trim())lines.push(line.trim());
  return lines;
}

function isLight(hex){
  const r=parseInt(hex.slice(1,3),16);const g=parseInt(hex.slice(3,5),16);const b=parseInt(hex.slice(5,7),16);
  return(0.299*r+0.587*g+0.114*b)>128;
}

function lighten(hex){
  return hex;
}

function darken(hex){
  const r=Math.max(0,parseInt(hex.slice(1,3),16)-60);
  const g=Math.max(0,parseInt(hex.slice(3,5),16)-60);
  const b=Math.max(0,parseInt(hex.slice(5,7),16)-60);
  return '#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0');
}

function dlIG(fmt){
  const cv=document.getElementById('igcv');if(!cv)return;
  const a=document.createElement('a');
  a.download='enjc-verse.'+fmt;
  a.href=cv.toDataURL(fmt==='png'?'image/png':'image/jpeg',0.93);
  a.click();toast('&#8595; Downloaded as '+fmt.toUpperCase());
}

function shareIG(){
  const cv=document.getElementById('igcv');if(!cv)return;
  cv.toBlob(blob=>{
    if(navigator.share&&navigator.canShare?.({files:[new File([blob],'enjc-verse.jpg',{type:'image/jpeg'})]})){
      navigator.share({title:'ENJC Bible Verse',files:[new File([blob],'enjc-verse.jpg',{type:'image/jpeg'})]});
    }else{dlIG('jpg');toast('Image downloaded — share manually');}
  },'image/jpeg',0.93);
}

// ── KEYBOARD ────────────────────────────────────────────────────
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  if(e.key==='ArrowRight')nextCh();
  if(e.key==='ArrowLeft')prevCh();
  if(e.key===' '){e.preventDefault();togPlay();}
});

import { g, SIZES, ST, FONTS, QUICK_VERSES, PRESETS, GALLERY } from "./imagegen-data.js";

// ── INIT ──────────────────────────────────────────────────────────
// ── THEME TOGGLE ──────────────────────────────────────────────────
export let _studioTheme = localStorage.getItem('enjc_studio_theme') || 'dark';
export function toggleStudioTheme(){
  _studioTheme = _studioTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('enjc_studio_theme', _studioTheme);
  applyStudioTheme(_studioTheme);
}
export function applyStudioTheme(theme){
  const btn = document.getElementById('theme-toggle-btn');
  if(theme === 'light'){
    document.documentElement.setAttribute('data-theme','light');
    if(btn) btn.textContent = '☀';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if(btn) btn.textContent = '🌙';
  }
}

export let _drawPending=false;
export function debounceDraw(){
  if(_drawPending)return;
  _drawPending=true;
  requestAnimationFrame(()=>{_drawPending=false;draw();});
}

export function initStudio(){
  // Apply saved theme on load
  applyStudioTheme(_studioTheme);

  // Preload ENJC logo for canvas header
  window._logoImg = new Image();
  window._logoImg.onload = ()=>debounceDraw();
  window._logoImg.src = 'images/logo/logo.png';

  buildTemplates();
  buildFonts();
  buildTCdots();
  buildPresets();
  buildGallery();
  buildGradPresets();
  buildSzBtns();
  buildQuickTpl();
  buildQuickVerses();
  biRenderBooks();
  readURL();
  loadSavedDesign(); // auto-restore last design
  updateBadges();
  draw();
  syncMobile();
  // Auto-save on any draw
  setInterval(saveDesign, 3000);
}


// ── AUTO-SAVE DESIGN ────────────────────────────────────────────
export function saveDesign(){
  try{
    const state={
      sz:ST.sz, bgMode:ST.bgMode, bgColor:ST.bgColor,
      font:ST.font, taSize:parseInt(g('ta-size')?.value||52),
      enSize:parseInt(g('en-size')?.value||32),
      txColor:ST.txColor, showTa:ST.showTa, showEn:ST.showEn,
      showRef:ST.showRef, showWM:ST.showWM, textGlow:ST.textGlow,
      activeTpl:ST.activeTpl, verseIdx:ST.verseIdx,
      wmName:g('wm-name')?.value||'', wmSub:g('wm-sub')?.value||'',
      gradMode:ST.gradMode||false,
      grad1:ST.grad1||'#1a0a3a', grad2:ST.grad2||'#0a1a3a', gradAngle:ST.gradAngle||135,
      safeZone:ST.safeZone||false,
    };
    localStorage.setItem('enjc_studio_state', JSON.stringify(state));
  }catch(e){}
}

export function loadSavedDesign(){
  try{
    const saved = localStorage.getItem('enjc_studio_state');
    if(!saved){ applyTemplate(TEMPLATES[0], false); return; }
    const s = JSON.parse(saved);

    // Restore size
    if(s.sz){
      ST.sz = s.sz;
      document.querySelectorAll('[data-sz]').forEach(b=>b.classList.toggle('on',b.dataset.sz===s.sz));
    }
    // Restore bg color
    if(s.bgColor) setColorHex(s.bgColor, false);
    // Restore bgMode
    if(s.bgMode) setBG(s.bgMode, false);
    // Restore font
    if(s.font) setFont(s.font);
    // Restore text color
    if(s.txColor) setTC(s.txColor);
    // Restore toggles
    if(s.showTa!==undefined){ ST.showTa=s.showTa; g('tog-ta')?.classList.toggle('on',s.showTa); }
    if(s.showEn!==undefined){ ST.showEn=s.showEn; g('tog-en')?.classList.toggle('on',s.showEn); }
    if(s.showRef!==undefined){ ST.showRef=s.showRef; g('tog-ref')?.classList.toggle('on',s.showRef); }
    if(s.showWM!==undefined){ ST.showWM=s.showWM; g('tog-wm')?.classList.toggle('on',s.showWM); }
    if(s.textGlow!==undefined){ ST.textGlow=s.textGlow; g('tog-glow')?.classList.toggle('on',s.textGlow); }
    // Restore size sliders
    if(s.taSize&&g('ta-size')){ g('ta-size').value=s.taSize; g('ta-size-v').textContent=s.taSize+'px'; }
    if(s.enSize&&g('en-size')){ g('en-size').value=s.enSize; g('en-size-v').textContent=s.enSize+'px'; }
    // Restore watermark text
    if(s.wmName&&g('wm-name')) g('wm-name').value=s.wmName;
    if(s.wmSub&&g('wm-sub'))   g('wm-sub').value=s.wmSub;
    // Restore gradient
    if(s.gradMode!==undefined) ST.gradMode=s.gradMode;
    if(s.grad1) ST.grad1=s.grad1;
    if(s.grad2) ST.grad2=s.grad2;
    if(s.gradAngle) ST.gradAngle=s.gradAngle;
    // Restore safe zone
    if(s.safeZone!==undefined) ST.safeZone=s.safeZone;
    // Restore template highlight
    if(s.activeTpl){
      ST.activeTpl=s.activeTpl;
      document.querySelectorAll('.tpl').forEach(el=>el.classList.toggle('on',el.id==='tpl-'+s.activeTpl));
    }
    // Restore verse
    if(s.verseIdx!==undefined&&QUICK_VERSES[s.verseIdx]){
      ST.verseIdx=s.verseIdx;
      ST.verse=QUICK_VERSES[s.verseIdx];
    }
    toast('🔄 Last design restored',1500);
  }catch(e){ applyTemplate(TEMPLATES[0], false); }
}

// ── URL PARAM (verse passed from bible.html) ──────────────────────
export function readURL(){
  try{
    const stored=localStorage.getItem('enjc_ig_verse');
    if(stored){
      const v=JSON.parse(stored);
      if(v&&v.ta){
        QUICK_VERSES.unshift(v);
        ST.verse=v; ST.verseIdx=0;
        localStorage.removeItem('enjc_ig_verse');
        return;
      }
    }
    const p=new URLSearchParams(location.search);
    if(p.get('ta')){
      const v={ta:decodeURIComponent(p.get('ta')),tref:decodeURIComponent(p.get('tref')||''),
               en:decodeURIComponent(p.get('en')||''),ref:decodeURIComponent(p.get('ref')||'')};
      QUICK_VERSES.unshift(v);
      ST.verse=v; ST.verseIdx=0;
    }
  }catch(e){}
}

// ── TABS ──────────────────────────────────────────────────────────
export function switchTab(el){
  document.querySelectorAll('.lp-tab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  g('tab-'+el.dataset.tab)?.classList.add('on');
}

// ── TEMPLATES ─────────────────────────────────────────────────────
export function buildTemplates(){
  g('tpl-grid').innerHTML=TEMPLATES.map(t=>`
    <div class="tpl${ST.activeTpl===t.id?' on':''}" id="tpl-${t.id}" onclick='applyTemplate(${JSON.stringify(t)})'>
      <div class="tpl-preview" style="background:${t.bg}">
        <div class="tpl-ta" style="color:${t.accent};font-size:9px">வேத வாக்கு</div>
        <div style="width:20px;height:1px;background:${t.accent};margin:4px auto;opacity:.6"></div>
        <div style="font-size:6px;color:rgba(255,255,255,.5)">Bible Verse</div>
      </div>
      <div class="tpl-name" style="color:${t.accent}">${t.name}</div>
    </div>`).join('');
}

export function applyTemplate(t, doToast=true){
  ST.activeTpl=t.id;
  setColorHex(t.bg, false);
  ST.txColor=t.tc||'#fff';
  document.querySelectorAll('.tcd').forEach(d=>d.classList.toggle('on',d.dataset.c===ST.txColor));
  setBG('solid', false);
  document.querySelectorAll('.tpl').forEach(el=>el.classList.toggle('on',el.id==='tpl-'+t.id));
  draw();
  if(doToast) toast('✨ '+t.name);
}

// ── FONTS ─────────────────────────────────────────────────────────
export function buildFonts(){
  g('font-grid').innerHTML=Object.entries(FONTS).map(([k,f])=>`
    <div class="fb${ST.font===k?' on':''}" onclick="setFont('${k}')">
      <div class="fb-name" style="font-family:${f.fam}">${f.label}</div>
      <div class="fb-hint">${f.hint}</div>
    </div>`).join('');
}
export function setFont(k){
  ST.font=k;
  document.querySelectorAll('.fb').forEach((el,i)=>el.classList.toggle('on',Object.keys(FONTS)[i]===k));
  draw();
}

// ── TEXT COLORS ───────────────────────────────────────────────────
export function buildTCdots(){
  g('tc-row').innerHTML=TC_COLORS.map(c=>`
    <div class="tcd${ST.txColor===c?' on':''}" style="background:${c}" data-c="${c}" onclick="setTC('${c}')"></div>`).join('');
}
export function setTC(c){
  ST.txColor=c;
  document.querySelectorAll('.tcd').forEach(d=>d.classList.toggle('on',d.dataset.c===c));
  draw();
}

// ── COLOR PRESETS ─────────────────────────────────────────────────
export function buildPresets(){
  g('preset-dots').innerHTML=PRESETS.map(c=>`
    <div class="pdot" style="background:${c}" onclick="setColorHex('${c}')"></div>`).join('');
}

export function setColorHex(hex, redraw=true){
  ST.bgColor=hex;
  const r=parseInt(hex.slice(1,3),16)||0;
  const gv=parseInt(hex.slice(3,5),16)||0;
  const b=parseInt(hex.slice(5,7),16)||0;
  const ri=g('sl-r'),gi=g('sl-g'),bi=g('sl-b');
  if(ri){ri.value=r;g('sl-rv').textContent=r;}
  if(gi){gi.value=gv;g('sl-gv').textContent=gv;}
  if(bi){bi.value=b;g('sl-bv').textContent=b;}
  const cp=g('col-prev');if(cp)cp.style.background=hex;
  const hv=g('hex-val');if(hv)hv.textContent=hex.toUpperCase();
  document.querySelectorAll('.pdot').forEach(el=>{
    const bg=el.style.backgroundColor;
    const elhex='#'+[...new Array(3)].map((_,i)=>parseInt(bg.split(',')[i]?.replace(/\D/g,'')||0).toString(16).padStart(2,'0')).join('');
    el.classList.toggle('on', elhex.toLowerCase()===hex.toLowerCase());
  
// ── MOBILE SYNC ───────────────────────────────────────────────────
export let _mobActive = null;

export function mobOpen(el, title){
  const panelId = el.dataset.panel;
  if(_mobActive === panelId){ mobClose(); return; }
  _mobActive = panelId;
  // Re-sync mobile content so state reflects latest changes
  if(panelId === 'm-style') syncMobileStyle();
  if(panelId === 'm-bg') {
    syncMobileBG();
  }
  if(panelId === 'm-text')  syncMobileText();
  if(panelId === 'm-verse') {
    // Sync verse display
    const mvd=g('m-verse');
    if(mvd){
      const ta=mvd.querySelector('#mvd-ta');
      const ref=mvd.querySelector('#mvd-ref');
      if(ta)ta.textContent=ST.verse?.ta?.substring(0,90)+(ST.verse?.ta?.length>90?'…':'');
      if(ref)ref.textContent='— '+(ST.verse?.tref||ST.verse?.ref||'');
    }
  }
  // Highlight tab
  document.querySelectorAll('.mob-tab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  // Set title
  const titleEl = g('mob-sheet-title');
  if(titleEl) titleEl.textContent = title;
  // Show correct panel content
  ['m-style','m-bg','m-text','m-verse','m-export'].forEach(id=>{
    const el = g(id);
    if(el) el.style.display = id===panelId ? 'block' : 'none';
  });
  // Open sheet + backdrop
  g('mob-sheet')?.classList.add('on');
  g('mob-backdrop')?.classList.add('on');
  document.body.style.overflow='hidden';
}

export function mobClose(){
  _mobActive = null;
  g('mob-sheet')?.classList.remove('on');
  g('mob-backdrop')?.classList.remove('on');
  document.querySelectorAll('.mob-tab').forEach(t=>t.classList.remove('on'));
  document.body.style.overflow='';
}

// Swipe down sheet to close
(function(){
  let startY=0, isDragging=false;
  document.addEventListener('DOMContentLoaded',()=>{
    const sheet=g('mob-sheet');
    if(!sheet)return;
    sheet.addEventListener('touchstart',e=>{startY=e.touches[0].clientY;isDragging=true;},{passive:true});
    sheet.addEventListener('touchmove',e=>{
      if(!isDragging)return;
      const dy=e.touches[0].clientY-startY;
      if(dy>0)sheet.style.transform=`translateY(${Math.min(dy,200)}px)`;
    },{passive:true});
    sheet.addEventListener('touchend',e=>{
      isDragging=false;
      const dy=e.changedTouches[0].clientY-startY;
      sheet.style.transform='';
      if(dy>80)mobClose();
    });
  });
})();

export function syncMobileStyle(){
  const el=g('m-style');if(!el)return;
  el.querySelectorAll('[onclick*="applyTemplate"]').forEach((btn,i)=>{
    const tId=TEMPLATES[i]?.id;
    if(tId)btn.style.borderColor=ST.activeTpl===tId?'var(--gd)':'var(--bd)';
  });
  // Also sync glow and safe zone toggles
  const toggs=el.querySelectorAll('.tog');
  if(toggs[0])toggs[0].classList.toggle('on',ST.textGlow);
  if(toggs[1])toggs[1].classList.toggle('on',ST.safeZone);
}
export function syncMobileText(){
  const el=g('m-text');if(!el)return;
  // Update toggle states to match current ST
  const toggs=el.querySelectorAll('.tog');
  if(toggs[0])toggs[0].classList.toggle('on',ST.showTa);
  if(toggs[1])toggs[1].classList.toggle('on',ST.showEn);
  if(toggs[2])toggs[2].classList.toggle('on',ST.showRef);
  if(toggs[3])toggs[3].classList.toggle('on',ST.showWM);
  if(toggs[4])toggs[4].classList.toggle('on',ST.textGlow);
  // Update text size values
  const taInput=el.querySelector('input[type="range"][min="28"]');
  const enInput=el.querySelector('input[type="range"][min="16"]');
  if(taInput) taInput.value=parseInt(g('ta-size')?.value||52);
  if(enInput) enInput.value=parseInt(g('en-size')?.value||32);
}
export function syncMobile(){
  // Style
  g('m-style').innerHTML=`
    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Templates</p>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
      ${TEMPLATES.map(t=>`
        <div onclick='applyTemplate(${JSON.stringify(t)})'
          style="border:1.5px solid ${ST.activeTpl===t.id?'var(--gd)':'var(--bd)'};border-radius:8px;overflow:hidden;cursor:pointer;aspect-ratio:3/4">
          <div style="background:${t.bg};height:calc(100% - 22px);display:flex;align-items:center;justify-content:center;padding:6px">
            <div style="font-size:8px;color:${t.accent};text-align:center;font-family:var(--tamil)">வேதம்</div>
          </div>
          <div style="font-size:9px;font-weight:600;text-align:center;padding:3px 4px;background:rgba(0,0,0,.6);color:${t.accent}">${t.name}</div>
        </div>`).join('')}
    </div>
    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin:12px 0 8px">Options</p>
    <div onclick="togOpt(this.querySelector('.tog'),'textGlow')" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd);cursor:pointer"><span style="font-size:12px;color:var(--tx)">Text Glow</span><div class="tog${ST.textGlow?' on':''}" data-key="textGlow"></div></div>
    <div onclick="togOpt(this.querySelector('.tog'),'safeZone')" style="display:flex;justify-content:space-between;padding:8px 0;cursor:pointer"><span style="font-size:12px;color:var(--tx)">Safe Zone Guide</span><div class="tog${ST.safeZone?' on':''}" data-key="safeZone"></div></div>`

  // BG
  g('m-bg').innerHTML=`
    <div style="display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap">
      <button class="bgmode-btn${ST.bgMode==='solid'?' on':''}" onclick="setBG('solid')">🎨 Colour</button>
      <button class="bgmode-btn${ST.bgMode==='gradient'?' on':''}" onclick="setBG('gradient')">🌈 Gradient</button>
      <button class="bgmode-btn${ST.bgMode==='photo'?' on':''}" onclick="setBG('photo')">📷 Photo</button>
      <button class="bgmode-btn${ST.bgMode==='gallery'?' on':''}" onclick="setBG('gallery')">🌄 Gallery</button>
    </div>
    <div id="m-bg-solid" class="m-bg-section" data-mode="solid" style="display:${ST.bgMode==='solid'?'block':'none'}">
      <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Colour Presets</p>
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px">
        ${PRESETS.map(c=>`<div onclick="setColorHex('${c}')" style="width:24px;height:24px;border-radius:4px;background:${c};cursor:pointer;border:2px solid ${ST.bgColor.toLowerCase()===c.toLowerCase()?'var(--gd)':'transparent'};transition:all .18s"></div>`).join('')}
      </div>
    </div>
    <div id="m-bg-gradient" class="m-bg-section" data-mode="gradient" style="display:${ST.bgMode==='gradient'?'block':'none'}">
      <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Gradient</p>
      <div id="m-grad-preview" style="height:56px;border-radius:12px;border:1px solid var(--bd2);margin-bottom:10px;background:linear-gradient(${ST.gradAngle}deg,${ST.grad1},${ST.grad2})"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <div onclick="g('m-grad-c1-inp').click()" style="width:22px;height:22px;border-radius:50%;background:${ST.grad1};border:2px solid var(--bd2);cursor:pointer"></div>
        <span style="font-size:11px;color:var(--tx2);flex:1">Colour 1</span>
        <span style="font-size:10px;color:var(--gd);font-family:monospace">${ST.grad1.toUpperCase()}</span>
        <input type="color" id="m-grad-c1-inp" value="${ST.grad1}" style="opacity:0;width:0;height:0;position:absolute" oninput="onGradColor(1,this.value)">
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <div onclick="g('m-grad-c2-inp').click()" style="width:22px;height:22px;border-radius:50%;background:${ST.grad2};border:2px solid var(--bd2);cursor:pointer"></div>
        <span style="font-size:11px;color:var(--tx2);flex:1">Colour 2</span>
        <span style="font-size:10px;color:var(--gd);font-family:monospace">${ST.grad2.toUpperCase()}</span>
        <input type="color" id="m-grad-c2-inp" value="${ST.grad2}" style="opacity:0;width:0;height:0;position:absolute" oninput="onGradColor(2,this.value)">
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="font-size:11px;color:var(--tx2);flex:1">Direction</span>
        <span style="font-size:10px;color:var(--gd);font-family:monospace">${ST.gradAngle}°</span>
      </div>
      <input type="range" min="0" max="360" value="${ST.gradAngle}" oninput="onGradAngle(this.value)" style="width:100%;-webkit-appearance:none;height:3px;border-radius:99px;background:rgba(255,255,255,.12);outline:none">
    </div>
    <div id="m-bg-photo" class="m-bg-section" data-mode="photo" style="display:${ST.bgMode==='photo'?'block':'none'}">
      <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Upload</p>
      <div style="margin-bottom:12px">
        <div class="photo-drop" onclick="pickPhoto()" style="cursor:pointer">
          <img id="m-photo-thumb" class="photo-thumb" style="display:${ST.userPhoto?'block':'none'}">
          <div style="font-size:26px;margin-bottom:6px">📷</div>
          <div style="font-size:11px;color:var(--gd);font-weight:500">Tap to choose photo</div>
          <div style="font-size:9px;color:var(--tx3);margin-top:3px">Gallery · Camera · Files</div>
        </div>
        <div class="ov-row" style="margin-top:10px">
          <span class="ov-lbl">Overlay</span>
          <input type="range" class="ov-sl" id="m-photo-ov" min="0" max="90" value="${parseInt(g('photo-ov')?.value||55)}" step="5" oninput="setPhotoOverlay(this.value)">
          <span class="ov-val" id="m-photo-ov-v">${parseInt(g('photo-ov')?.value||55)}%</span>
        </div>
      </div>
    </div>
    <div id="m-bg-gallery" class="m-bg-section" data-mode="gallery" style="display:${ST.bgMode==='gallery'?'block':'none'}">
      <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Nature Photos</p>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px">
        ${GALLERY.map((c,i)=>`<div onclick="loadGal(${i})" style="border:1.5px solid ${ST.galIdx===i?'var(--gd)':'var(--bd)'};border-radius:6px;padding:6px 4px;cursor:pointer;text-align:center;background:${ST.galIdx===i?'var(--gdm)':'transparent'};transition:all .15s">
          <div style="font-size:14px">${c.label}</div>
          <div style="font-size:8px;color:var(--tx3)">${c.name}</div>
        </div>`).join('')}
      </div>
      <div class="ov-row" style="margin-top:10px">
        <span class="ov-lbl">Overlay</span>
        <input type="range" class="ov-sl" id="m-gal-ov" min="0" max="80" value="${parseInt(g('gal-ov')?.value||50)}" oninput="g('gal-ov').value=this.value;g('gal-ov-v').textContent=this.value+'%';draw()" style="flex:1;-webkit-appearance:none;height:3px;border-radius:99px;background:rgba(255,255,255,.12);outline:none">
        <span class="ov-val" id="m-gal-ov-v">${parseInt(g('gal-ov')?.value||50)}%</span>
      </div>
    </div>`;

  // Text
  g('m-text').innerHTML=`
    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Font</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:12px">
      ${Object.entries(FONTS).map(([k,f])=>`
        <div onclick="setFont('${k}')" style="border:1.5px solid var(--bd);border-radius:8px;padding:8px 6px;cursor:pointer;text-align:center">
          <div style="font-size:11px;color:var(--tx2);font-family:${f.fam}">${f.label}</div>
          <div style="font-size:8px;color:var(--tx3)">${f.hint}</div>
        </div>`).join('')}
    </div>
    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:6px">Text Colour</p>
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px">
      ${TC_COLORS.map(c=>`<div onclick="setTC('${c}')" style="width:24px;height:24px;border-radius:50%;background:${c};cursor:pointer;border:2px solid transparent"></div>`).join('')}
    </div>
    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Options</p>
    <div onclick="togOpt(this.querySelector('.tog'),'showTa')" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd);cursor:pointer"><span style="font-size:12px;color:var(--tx)">Show Tamil</span><div class="tog${ST.showTa?' on':''}" data-key="showTa"></div></div>
    <div onclick="togOpt(this.querySelector('.tog'),'showEn')" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd);cursor:pointer"><span style="font-size:12px;color:var(--tx)">Show English</span><div class="tog${ST.showEn?' on':''}" data-key="showEn"></div></div>
    <div onclick="togOpt(this.querySelector('.tog'),'showRef')" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd);cursor:pointer"><span style="font-size:12px;color:var(--tx)">Show Reference</span><div class="tog${ST.showRef?' on':''}" data-key="showRef"></div></div>
    <div onclick="togOpt(this.querySelector('.tog'),'showWM')" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd);cursor:pointer"><span style="font-size:12px;color:var(--tx)">ENJC Watermark</span><div class="tog${ST.showWM?' on':''}" data-key="showWM"></div></div>
    <div onclick="togOpt(this.querySelector('.tog'),'textGlow')" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd);cursor:pointer"><span style="font-size:12px;color:var(--tx)">Text Glow</span><div class="tog${ST.textGlow?' on':''}" data-key="textGlow"></div></div>
    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin:12px 0 8px">Text Size</p>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span style="font-size:11px;color:var(--tx2);min-width:50px">Tamil</span>
      <input type="range" min="28" max="200" value="${parseInt(g('ta-size')?.value||52)}" step="2"
        oninput="g('ta-size').value=this.value;g('ta-size-v').textContent=this.value+'px';draw()"
        style="flex:1;-webkit-appearance:none;height:3px;border-radius:99px;background:rgba(255,255,255,.12);outline:none">
      <span style="font-size:11px;color:var(--gd);min-width:32px;text-align:right;font-family:monospace">${parseInt(g('ta-size')?.value||52)}px</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
      <span style="font-size:11px;color:var(--tx2);min-width:50px">English</span>
      <input type="range" min="16" max="150" value="${parseInt(g('en-size')?.value||32)}" step="2"
        oninput="g('en-size').value=this.value;g('en-size-v').textContent=this.value+'px';draw()"
        style="flex:1;-webkit-appearance:none;height:3px;border-radius:99px;background:rgba(255,255,255,.12);outline:none">
      <span style="font-size:11px;color:var(--gd);min-width:32px;text-align:right;font-family:monospace">${parseInt(g('en-size')?.value||32)}px</span>
    </div>`;

  // Verse
  g('m-verse').innerHTML=`
    <div class="vd" style="margin-bottom:10px">
      <div class="vd-ta" id="mvd-ta">${ST.verse?.ta?.substring(0,80)||'Select verse...'}</div>
      <div class="vd-ref" id="mvd-ref">${ST.verse?.tref?'— '+ST.verse.tref:''}</div>
    </div>
    <div style="display:flex;gap:5px;margin-bottom:14px">
      <button class="bgmode-btn" onclick="prevVerse()">← Prev</button>
      <button class="bgmode-btn on" onclick="useVOTD()">⭐ VOTD</button>
      <button class="bgmode-btn" onclick="nextVerse()">Next →</button>
    </div>

    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">📖 Bible Index — all 66 books</p>
    <input class="inp" id="mbi-search" type="search" placeholder="🔍 Book search — Genesis, யோவான்..."
      oninput="mbiSearch(this.value)" style="margin-bottom:8px" autocomplete="off">
    <div style="display:flex;gap:4px;margin-bottom:8px">
      <button class="bgmode-btn on" id="mbi-all" onclick="mbiFilter('all')">All 66</button>
      <button class="bgmode-btn" id="mbi-ot"  onclick="mbiFilter('OT')">OT 39</button>
      <button class="bgmode-btn" id="mbi-nt"  onclick="mbiFilter('NT')">NT 27</button>
    </div>
    <div id="mbi-books" style="max-height:220px;overflow-y:auto;margin-bottom:10px"></div>
    <div id="mbi-ch-area" style="display:none;margin-bottom:10px">
      <button onclick="mbiBackBooks()" class="bgmode-btn" style="margin-bottom:8px;width:auto;padding:5px 12px;font-size:10px">← Books</button>
      <div id="mbi-ch-title" style="font-size:11px;font-weight:600;color:var(--gd);margin-bottom:8px"></div>
      <div id="mbi-ch-grid" style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;max-height:160px;overflow-y:auto"></div>
    </div>
    <div id="mbi-v-area" style="display:none;margin-bottom:10px">
      <button onclick="mbiBackCh()" class="bgmode-btn" style="margin-bottom:8px;width:auto;padding:5px 12px;font-size:10px">← Chapters</button>
      <div id="mbi-v-title" style="font-size:11px;font-weight:600;color:var(--gd);margin-bottom:8px"></div>
      <div id="mbi-v-loading" style="text-align:center;padding:16px;color:var(--tx3);display:none">
        <div style="width:16px;height:16px;border:2px solid var(--bd2);border-top-color:var(--gd);border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 6px"></div>Loading...
      </div>
      <div id="mbi-v-list" style="max-height:220px;overflow-y:auto"></div>
    </div>

    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin:14px 0 8px;padding-top:10px;border-top:1px solid var(--bd)">⭐ Quick Verses</p>
    <div>
      ${QUICK_VERSES.map((v,i)=>`
        <div class="vi" onclick="selVerse(${i})">
          <div class="vi-ref">${v.tref} · ${v.ref}</div>
          <div class="vi-ta">${v.ta.substring(0,70)}${v.ta.length>70?'…':''}</div>
        </div>`).join('')}
    </div>`;

  // Wire mobile bible index after render
  setTimeout(()=>{
    mbiRenderBooks();
  }, 50);

  // Export
  g('m-export').innerHTML=`
    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Download</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:10px">
      <button class="exp-btn e-png" onclick="dlIG('png')">↓ PNG</button>
      <button class="exp-btn e-jpg" onclick="dlIG('jpg')">↓ JPG</button>
      <button class="exp-btn e-webp" onclick="dlIG('webp')">↓ WebP</button>
      <button class="exp-btn e-copy" onclick="copyImg()">📋 Copy</button>
    </div>
    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Share</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:12px">
      <button class="sh sh-wa" onclick="shareWA()">🟢 WhatsApp</button>
      <button class="sh sh-ig" onclick="shareApp('ig')">📸 Instagram</button>
      <button class="sh sh-yt" onclick="shareApp('yt')">▶ YouTube</button>
      <button class="sh sh-nat" onclick="shareNative()">↗ Share</button>
    </div>
    <button onclick="if(confirm('Reset design to default?')){localStorage.removeItem('enjc_studio_state');location.reload();}" style="width:100%;border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:8px;font-size:11px;color:#fca5a5;background:transparent;cursor:pointer;font-family:var(--sans);margin-bottom:10px">↺ Reset Design</button>
    <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">📐 Canvas Size</p>
    <div style="display:flex;flex-direction:column;gap:4px">
      ${Object.entries(SIZES).map(([k,s])=>`
        <button data-sz="${k}" onclick="setSz(this,'${k}')" style="border-radius:8px;padding:8px 10px;font-size:11px;border:1.5px solid ${ST.sz===k?'var(--gd)':'var(--bd)'};background:${ST.sz===k?'var(--gdm)':'transparent'};color:${ST.sz===k?'var(--gd)':'var(--tx2)'};cursor:pointer;font-family:var(--sans);text-align:left;display:flex;justify-content:space-between;transition:all .15s">
          <span>${k} ${s.label}</span><span style="opacity:.5;font-size:9px">${s.hint}</span>
        </button>`).join('')}
    </div>`;
}

// ── MISSING FUNCTIONS ──────────────────────────────────────────────────────────

export function setSz(el, sz){
  ST.sz = sz;
  // Update topbar buttons
  document.querySelectorAll('.tb-sz').forEach(btn=>{
    btn.classList.toggle('on', btn.dataset.sz === sz);
  });
  // Update mobile buttons
  document.querySelectorAll('[data-sz]').forEach(btn=>{
    btn.style.borderColor = btn.dataset.sz === sz ? 'var(--gd)' : 'var(--bd)';
    btn.style.background = btn.dataset.sz === sz ? 'var(--gdm)' : 'transparent';
    btn.style.color = btn.dataset.sz === sz ? 'var(--gd)' : 'var(--tx2)';
  });
  debounceDraw();
}

export function switchTab(el){
  const tab = el.dataset.tab;
  // Update tab buttons
  document.querySelectorAll('.lp-tab').forEach(t=>{
    t.classList.toggle('on', t === el);
  });
  // Show/hide panels
  document.querySelectorAll('.lp-panel').forEach(p=>{
    p.style.display = p.id === `lp-${tab}` ? 'block' : 'none';
  });
}

export function setBG(mode, redraw=true){
  ST.bgMode = mode;
  // Update desktop buttons
  document.querySelectorAll('.bgmode-btn').forEach(btn=>{
    const btnMode = btn.textContent.includes('Colour') ? 'solid' :
                    btn.textContent.includes('Gradient') ? 'gradient' :
                    btn.textContent.includes('Photo') ? 'photo' : 'gallery';
    btn.classList.toggle('on', btnMode === mode);
  });
  // Show/hide sections
  ['solid','gradient','photo','gallery'].forEach(m=>{
    const el = g(`bg-${m}`);
    if(el) el.style.display = m === mode ? 'block' : 'none';
  });
  if(redraw) debounceDraw();
}

export function togOpt(togEl, key){
  const on = togEl.classList.toggle('on');
  ST[key] = on;
  debounceDraw();
}

export function prevVerse(){
  ST.verseIdx = ST.verseIdx > 0 ? ST.verseIdx - 1 : QUICK_VERSES.length - 1;
  ST.verse = QUICK_VERSES[ST.verseIdx];
  debounceDraw();
  syncMobile();
}

export function nextVerse(){
  ST.verseIdx = (ST.verseIdx + 1) % QUICK_VERSES.length;
  ST.verse = QUICK_VERSES[ST.verseIdx];
  debounceDraw();
  syncMobile();
}

export function useVOTD(){
  // Use first verse as VOTD for now
  ST.verseIdx = 0;
  ST.verse = QUICK_VERSES[0];
  debounceDraw();
  syncMobile();
}

export function syncMobileBG(){
  const el = g('m-bg');
  if(!el) return;
  // Rebuild the BG panel HTML with current ST values
  el.innerHTML = `
    <div style="display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap">
      <button class="bgmode-btn${ST.bgMode==='solid'?' on':''}" onclick="setBG('solid')">🎨 Colour</button>
      <button class="bgmode-btn${ST.bgMode==='gradient'?' on':''}" onclick="setBG('gradient')">🌈 Gradient</button>
      <button class="bgmode-btn${ST.bgMode==='photo'?' on':''}" onclick="setBG('photo')">📷 Photo</button>
      <button class="bgmode-btn${ST.bgMode==='gallery'?' on':''}" onclick="setBG('gallery')">🌄 Gallery</button>
    </div>
    <div id="m-bg-solid" class="m-bg-section" data-mode="solid" style="display:${ST.bgMode==='solid'?'block':'none'}">
      <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Colour Presets</p>
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px">
        ${PRESETS.map(c=>`<div onclick="setColorHex('${c}')" style="width:24px;height:24px;border-radius:4px;background:${c};cursor:pointer;border:2px solid ${ST.bgColor.toLowerCase()===c.toLowerCase()?'var(--gd)':'transparent'};transition:all .18s"></div>`).join('')}
      </div>
    </div>
    <div id="m-bg-gradient" class="m-bg-section" data-mode="gradient" style="display:${ST.bgMode==='gradient'?'block':'none'}">
      <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Gradient</p>
      <div id="m-grad-preview" style="height:56px;border-radius:12px;border:1px solid var(--bd2);margin-bottom:10px;background:linear-gradient(${ST.gradAngle}deg,${ST.grad1},${ST.grad2})"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <div onclick="g('m-grad-c1-inp').click()" style="width:22px;height:22px;border-radius:50%;background:${ST.grad1};border:2px solid var(--bd2);cursor:pointer"></div>
        <span style="font-size:11px;color:var(--tx2);flex:1">Colour 1</span>
        <span style="font-size:10px;color:var(--gd);font-family:monospace">${ST.grad1.toUpperCase()}</span>
        <input type="color" id="m-grad-c1-inp" value="${ST.grad1}" style="opacity:0;width:0;height:0;position:absolute" oninput="onGradColor(1,this.value)">
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <div onclick="g('m-grad-c2-inp').click()" style="width:22px;height:22px;border-radius:50%;background:${ST.grad2};border:2px solid var(--bd2);cursor:pointer"></div>
        <span style="font-size:11px;color:var(--tx2);flex:1">Colour 2</span>
        <span style="font-size:10px;color:var(--gd);font-family:monospace">${ST.grad2.toUpperCase()}</span>
        <input type="color" id="m-grad-c2-inp" value="${ST.grad2}" style="opacity:0;width:0;height:0;position:absolute" oninput="onGradColor(2,this.value)">
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="font-size:11px;color:var(--tx2);flex:1">Direction</span>
        <span style="font-size:10px;color:var(--gd);font-family:monospace">${ST.gradAngle}°</span>
      </div>
      <input type="range" min="0" max="360" value="${ST.gradAngle}" oninput="onGradAngle(this.value)" style="width:100%;-webkit-appearance:none;height:3px;border-radius:99px;background:rgba(255,255,255,.12);outline:none">
    </div>
    <div id="m-bg-photo" class="m-bg-section" data-mode="photo" style="display:${ST.bgMode==='photo'?'block':'none'}">
      <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Upload</p>
      <div style="margin-bottom:12px">
        <div class="photo-drop" onclick="pickPhoto()" style="cursor:pointer">
          <img id="m-photo-thumb" class="photo-thumb" style="display:${ST.userPhoto?'block':'none'}">
          <div style="font-size:26px;margin-bottom:6px">📷</div>
          <div style="font-size:11px;color:var(--gd);font-weight:500">Tap to choose photo</div>
          <div style="font-size:9px;color:var(--tx3);margin-top:3px">Gallery · Camera · Files</div>
        </div>
        <div class="ov-row" style="margin-top:10px">
          <span class="ov-lbl">Overlay</span>
          <input type="range" class="ov-sl" id="m-photo-ov" min="0" max="90" value="${parseInt(g('photo-ov')?.value||55)}" step="5" oninput="setPhotoOverlay(this.value)">
          <span class="ov-val" id="m-photo-ov-v">${parseInt(g('photo-ov')?.value||55)}%</span>
        </div>
      </div>
    </div>
    <div id="m-bg-gallery" class="m-bg-section" data-mode="gallery" style="display:${ST.bgMode==='gallery'?'block':'none'}">
      <p style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx3);margin-bottom:8px">Nature Photos</p>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px">
        ${GALLERY.map((c,i)=>`<div onclick="loadGal(${i})" style="border:1.5px solid ${ST.galIdx===i?'var(--gd)':'var(--bd)'};border-radius:6px;padding:6px 4px;cursor:pointer;text-align:center;background:${ST.galIdx===i?'var(--gdm)':'transparent'};transition:all .15s">
          <div style="font-size:14px">${c.label}</div>
          <div style="font-size:8px;color:var(--tx3)">${c.name}</div>
        </div>`).join('')}
      </div>
      <div class="ov-row" style="margin-top:10px">
        <span class="ov-lbl">Overlay</span>
        <input type="range" class="ov-sl" id="m-gal-ov" min="0" max="80" value="${parseInt(g('gal-ov')?.value||50)}" oninput="g('gal-ov').value=this.value;g('gal-ov-v').textContent=this.value+'%';draw()" style="flex:1;-webkit-appearance:none;height:3px;border-radius:99px;background:rgba(255,255,255,.12);outline:none">
        <span class="ov-val" id="m-gal-ov-v">${parseInt(g('gal-ov')?.value||50)}%</span>
      </div>
    </div>`;
}

export function onGradColor(idx, color){
  ST[`grad${idx}`] = color;
  debounceDraw();
  syncMobileBG();
}

export function onGradAngle(angle){
  ST.gradAngle = parseInt(angle);
  debounceDraw();
  syncMobileBG();
}

export function setPhotoOverlay(val){
  g('photo-ov').value = val;
  g('photo-ov-v').textContent = val + '%';
  debounceDraw();
}

export function loadGal(idx){
  ST.galIdx = idx;
  // Assume there's a function to load gallery image
  // For now, just update UI
  syncMobileBG();
  debounceDraw();
}

export function pickPhoto(){
  // Placeholder for photo picker
  alert('Photo picker not implemented yet');
}
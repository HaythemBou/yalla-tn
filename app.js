/* ═══════════════════════════════════════════════════════════════════════
   يلّا — landing page behaviour.

   One night that turns into a dawn. Six chapters. A skyline under the
   page whose windows light with your progress, a star that keeps you
   company, and a strand that becomes the lit map at the end.

   Copy lives in i18n.js. Geometry in tunisia.js / places.js.
   ═══════════════════════════════════════════════════════════════════════ */

/* ?preview=1 is for testing: the page works, records are written, but the public counters are only read. */
const PREVIEW = /preview=1/.test(location.search);
const CONFIG = {
  counterNamespace: 'yalla-3andek-2026',
  counterKey: 'lights-launch',
  counterProviders: [
    (ns, k) => `https://abacus.jasoncameron.dev/hit/${ns}/${k}`,
    (ns, k) => `https://counterapi.com/api/${ns}/${k}/up`,
  ],
  /* a Google Apps Script web app (see record.gs). Empty = records stay in the browser. */
  recordEndpoint: 'https://script.google.com/macros/s/AKfycbw89vxNHT2ACCP69NnCksQ2QCY1xA5GznyhFdHpyYg8L0AP1zKXjAb8YQLfMYkR56V0mQ/exec',
  sealKey: 'seals-launch',

  shareUrl: location.origin + location.pathname,
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[<>&"]/g, c => ({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;' }[c]));
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, u) => a + (b - a) * u;
const fmt = (n) => Number(n).toLocaleString('en-US');
const set = (sel, prop, val) => { const el = $(sel); if (el) el[prop] = val; };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const ease3 = (u) => u < .5 ? 4*u*u*u : 1 - Math.pow(-2*u+2, 3)/2;
const TOUCH = matchMedia('(pointer: coarse)').matches;
const DPR = () => Math.min(devicePixelRatio || 1, TOUCH ? 1.5 : 2);
/* one shared clock: heavy canvases draw at 30 fps on phones, 60 on desktops */
const FRAME_MS = TOUCH ? 33 : 0;
function loop(fn){ let last = 0; const tick = (now) => { if (now - last >= FRAME_MS){ last = now; fn(now); } requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
/* a canvas only draws while it is on screen */
function whenVisible(el, on, off){ if (!('IntersectionObserver' in window)){ on(); return; } new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? on() : off && off()), { threshold: .05 }).observe(el); }

const MARK = `<svg viewBox="-9 -9 118 118" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="yl" x1="10%" y1="0%" x2="70%" y2="100%"><stop offset="0" stop-color="#B4A0FF"/><stop offset="1" stop-color="#6D4AE0"/></linearGradient>
<linearGradient id="yr" x1="90%" y1="0%" x2="30%" y2="100%"><stop offset="0" stop-color="#6D4AE0"/><stop offset="1" stop-color="#4A32A8"/></linearGradient>
<radialGradient id="ys" cx="42%" cy="35%" r="75%"><stop offset="0" stop-color="#FFF8E4"/><stop offset=".55" stop-color="#FFC148"/><stop offset="1" stop-color="#E8A317"/></radialGradient>
<radialGradient id="yf" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFC148" stop-opacity=".34"/><stop offset=".45" stop-color="#FFA92E" stop-opacity=".12"/><stop offset="1" stop-color="#FF9500" stop-opacity="0"/></radialGradient>
<radialGradient id="yv" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#A98CFF" stop-opacity=".3"/><stop offset="1" stop-color="#6D4AE0" stop-opacity="0"/></radialGradient>
</defs>
<circle cx="50" cy="50" r="62" fill="url(#yv)"/>
<path d="M13,57 C11,42 20,27 34,22 C43,19 51,20 58,25 C48,23 38,26 31,34 C24,43 23,54 29,64 C34,72 42,77 51,77 C42,85 26,83 18,73 C15,68 13,63 13,57 Z" fill="url(#yl)"/>
<path d="M87,49 C89,64 80,79 66,84 C57,87 49,86 42,81 C52,83 62,80 69,72 C76,63 77,52 71,42 C66,34 58,29 49,29 C58,21 74,23 82,33 C85,38 87,43 87,49 Z" fill="url(#yr)"/>
<circle cx="47" cy="49" r="30" fill="url(#yf)"/>
<path d="M45.60,35.24 Q46,34 46.40,35.24 L49.37,44.36 L58.96,44.36 Q60.27,44.36 59.21,45.13 L51.45,50.77 L54.41,59.89 Q54.82,61.14 53.76,60.37 L46,54.73 L38.24,60.37 Q37.18,61.14 37.59,59.89 L40.55,50.77 L32.79,45.13 Q31.73,44.36 33.04,44.36 L42.63,44.36 Z" fill="url(#ys)"/>
<path d="M62.39,57.26 Q62.43,56.69 62.73,57.17 L64.93,60.7 L68.96,59.69 Q69.51,59.56 69.15,59.99 L66.47,63.17 L68.68,66.7 Q68.98,67.18 68.45,66.97 L64.6,65.41 L61.93,68.59 Q61.57,69.03 61.6,68.46 L61.9,64.31 L58.04,62.76 Q57.52,62.55 58.07,62.41 L62.1,61.41 Z" fill="url(#ys)"/></svg>`;
set('#brandMark', 'innerHTML', MARK); set('#footMark', 'innerHTML', MARK);
set('#year', 'textContent', new Date().getFullYear());

/* ═══ i18n ═══════════════════════════════════════════════════════════ */
(function resetOnce(){ try { if (localStorage.getItem('yalla.v') !== '16'){ Object.keys(localStorage).filter(k => k.startsWith('yalla.')).forEach(k => localStorage.removeItem(k)); localStorage.setItem('yalla.v', '16'); } } catch(_){} })();
const S = window.STRINGS;
let lang = localStorage.getItem('yalla.lang') || 'ar';
if (!S[lang]) lang = 'ar';
const t = (k) => (S[lang] && S[lang][k]) || S.ar[k] || k;
const glowYalla = (txt) => esc(txt).replace(/(يلّا|يلا|Yalla|yalla)([؟?!.،,]?)/g, (w) => `<span class="yl">${w}</span>`);
function paintStrings(){
  $$('[data-t]').forEach(el => { const v = t(el.dataset.t); el.innerHTML = /يلّا|يلا|Yalla|yalla/.test(v) ? glowYalla(v) : esc(v); });
  $$('[data-tp]').forEach(el => { el.placeholder = t(el.dataset.tp); });
  document.documentElement.lang = lang; document.documentElement.dir = t('dir');
}
function setLang(l){
  if (!S[l]) return;
  lang = l; localStorage.setItem('yalla.lang', l);
  paintStrings();
  $$('#langMenu button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.l === l))); set('#langCur', 'textContent', S[l].short);
  buildThread(); buildQuick(); paintChosen(); buildCardLangs(); buildSwatches(); paintPhotoUI(); chatRestart(); paintScene(true); if (walking && tourI >= 0 && TOUR[tourI]) gsay(tourMid ? TOUR[tourI].mid.say : TOUR[tourI].say);
  if (currentGov) pickGov(currentGov, true);
  if (window.__dnaRebuild) window.__dnaRebuild();
  drawCards();
}
/* one small button with the current language; it opens a short list of the three */
(function langs(){ const box = $('#langs'); if (!box) return;
  const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'langbtn'; btn.id = 'langBtn'; btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg><span id="langCur"></span><i class="car"></i>';
  const menu = document.createElement('div'); menu.className = 'langmenu'; menu.id = 'langMenu'; menu.hidden = true; menu.setAttribute('role', 'listbox');
  ['ar','fr','en'].forEach(l => { const b = document.createElement('button'); b.type = 'button'; b.dataset.l = l; b.setAttribute('role', 'option'); b.innerHTML = `<b>${S[l].short}</b><span>${S[l].label}</span>`; b.setAttribute('aria-pressed', String(l === lang)); b.onclick = () => { setLang(l); close(); }; menu.appendChild(b); });
  const open = () => { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }; const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.onclick = (e) => { e.stopPropagation(); menu.hidden ? open() : close(); }; document.addEventListener('click', (e) => { if (!box.contains(e.target)) close(); }); document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  box.appendChild(btn); box.appendChild(menu); set('#langCur', 'textContent', S[lang].short); })();
(function stick(){ const h = $('#hdr'); if (!h) return; const on = () => h.classList.toggle('stuck', scrollY > 20); addEventListener('scroll', on, { passive:true }); on(); })();

/* ── helpers ─────────────────────────────────────────────────────── */
function hash(str){ let h = 2166136261; for (let i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function seeded(seed){ let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function roundRect(x, rx, ry, w, h, r){ const k = Math.min(r, w/2, h/2); x.beginPath(); x.moveTo(rx+k, ry); x.arcTo(rx+w, ry, rx+w, ry+h, k); x.arcTo(rx+w, ry+h, rx, ry+h, k); x.arcTo(rx, ry+h, rx, ry, k); x.arcTo(rx, ry, rx+w, ry, k); x.closePath(); }
const hex2rgb = (h) => { const v = parseInt(h.replace('#',''), 16); return [(v>>16)&255,(v>>8)&255,v&255]; };
const rgba = (hex, a) => { const [r,g,b] = hex2rgb(hex); return `rgba(${r},${g},${b},${a})`; };
const mix = (a, b, u) => { const A = hex2rgb(a), B = hex2rgb(b); return `rgb(${Math.round(lerp(A[0],B[0],u))},${Math.round(lerp(A[1],B[1],u))},${Math.round(lerp(A[2],B[2],u))})`; };
function fitFont(x, text, maxW, start, floor, weight, fam){ let s = start; x.font = `${weight} ${s}px ${fam}`; while (x.measureText(text).width > maxW && s > floor){ s -= 4; x.font = `${weight} ${s}px ${fam}`; } return s; }
function glowDot(x, cx, cy, r, core, halo, a){ if (!(r > 0)) return; const g = x.createRadialGradient(cx,cy,0,cx,cy,r); g.addColorStop(0, core.replace('A', a)); g.addColorStop(.35, halo.replace('A', (a*.5).toFixed(3))); g.addColorStop(1, halo.replace('A', 0)); x.fillStyle = g; x.beginPath(); x.arc(cx,cy,r,0,6.2832); x.fill(); }

/* progress through the night: 0 at the top, 1 at the bottom */
let prog = 0, dawn = false, scrollProg = 0, chatStep = 0, chatDone = false, chatStarted = false, effect = 0, sceneN = 0; const answers = [];
const progListeners = [];
function onProg(fn){ progListeners.push(fn); }
/* the seven things a person does here. Each one lights a share of the town and grows the star. */
const STEPS = ['seal','name','story','place','day','card','end'];
const STEP_EL = { seal:'#pad', name:'#namebox', story:'#stage', place:'#picker', day:'#day .phone', card:'#card .cardframe', end:'#end .head' };
const done = new Set();
function measureProg(){ const docH = document.documentElement.scrollHeight - innerHeight; scrollProg = docH > 0 ? clamp(scrollY/docH, 0, 1) : 1; prog = Math.max(scrollProg*.3, done.size/STEPS.length); progListeners.forEach(f => f(prog)); }
function markStep(k){ if (done.has(k)) return; done.add(k); if (k === 'seal') document.body.classList.add('sealed'); measureProg(); paintThread(); paintReceipt(); if (window.__dnaRedraw) window.__dnaRedraw(); if (window.__tourPoke) window.__tourPoke(); if (k === 'end'){ paintSealNo(); record('complete'); } }
addEventListener('scroll', measureProg, { passive:true }); addEventListener('resize', measureProg);

/* the receipt: what you did */
function receipt(){ /* the receipt is painted from the steps */ }
function paintReceipt(){ STEPS.forEach((k, i) => { const li = $('#rc'+(i+1)); if (li) li.classList.toggle('done', done.has(k)); }); const st = $('#stamp'); if (st) st.classList.toggle('on', done.size >= 5); }
/* what a person did, kept for the launch: the seal's number, name, place, steps, answers, a word */
let sealNo = +(localStorage.getItem('yalla.no') || 0);
function recordBody(kind, extra){ return Object.assign({ kind, no: sealNo || null, seed: sealSeed || null, name: userName || '', gov: currentGov || '', deleg: currentDeleg || '', lang, steps: [...done].join('|'), effect, answers: answers.join('|'), ua: (navigator.userAgent || '').slice(0, 80), at: new Date().toISOString() }, extra || {}); }
async function record(kind, extra){ const body = recordBody(kind, extra);
  try { const log = JSON.parse(localStorage.getItem('yalla.records') || '[]'); log.push(body); localStorage.setItem('yalla.records', JSON.stringify(log.slice(-50))); } catch(_){}
  if (!CONFIG.recordEndpoint) return false;
  try { await fetch(CONFIG.recordEndpoint, { method:'POST', mode:'no-cors', headers:{ 'Content-Type':'text/plain' }, body: JSON.stringify(body) }); return true; } catch(_){ return false; } }
async function assignSealNo(){ if (sealNo) return sealNo; const wait = $('#sealNoWait'); if (wait) wait.hidden = false;
  for (const build of CONFIG.counterProviders){ try { const ac = new AbortController(); const bail = setTimeout(() => ac.abort(), 4000); const res = await fetch(build(CONFIG.counterNamespace, CONFIG.sealKey).replace('/hit/', PREVIEW ? '/get/' : '/hit/'), { cache:'no-store', signal:ac.signal }); clearTimeout(bail);
    if (!res.ok) continue; const j = await res.json(); const v = j.value ?? j.count ?? (j.data && (j.data.up_count ?? j.data.value)); if (typeof v === 'number' && v > 0){ sealNo = v; break; } } catch(_){} }
  if (!sealNo) sealNo = 100000 + (hash(String(sealSeed)) % 900000);   /* offline: a number from the seed, clearly out of sequence */
  localStorage.setItem('yalla.no', String(sealNo)); if (wait) wait.hidden = true; paintSealNo(); drawCards(); record('seal'); if (window.__tourPoke) window.__tourPoke(); return sealNo; }
function paintSealNo(){ set('#sealNoText','textContent', sealNo ? fmt(sealNo) : ''); set('#themeName','textContent', sealSeed ? t('theme.' + sealTheme()) : ''); const tl = $('#tierLine'); if (tl){ tl.hidden = !tier(); tl.textContent = tier() ? t('tier.' + tier()) : ''; } const sp = $('#supporter'); if (sp){ sp.hidden = !sealNo; set('#supporterNo','textContent', sealNo ? fmt(sealNo) : ''); } if (window.__padRepaint) window.__padRepaint(); }

/* ═══════════════════════════════════════════════════════════════════
   THE SKY — deep night at the top, a dawn at the bottom. The colours
   move with your scroll; the moon crosses; the stars fade as it lightens.
   ═══════════════════════════════════════════════════════════════════ */
const SKY_KEYS = [ /* [top, mid, bottom] at prog 0 · .45 · .8 · 1 */
  ['#05020C', '#120A2E', '#1C0F3E'],
  ['#07041A', '#150C38', '#241448'],
  ['#0A0E33', '#1C2358', '#2E2A64'],
  ['#12224F', '#3A3B7A', '#B4694A'],
];
function skyAt(p){ const stops = [0,.45,.8,1]; let i = 0; while (i < 2 && p > stops[i+1]) i++; const u = clamp((p - stops[i]) / (stops[i+1] - stops[i]), 0, 1); return SKY_KEYS[i].map((c, k) => mix(c, SKY_KEYS[i+1][k], ease3(u))); }
(function sky(){
  const c = $('#sky'); if (!c) return; const x = c.getContext('2d');
  let W = 0, H = 0, stars = [], neb = [], shoot = null, t0 = performance.now(), shower = 0, starsA = null, starsB = null, nebC = null, lastKey = '';
  function build(){ const d = DPR(); W = innerWidth; H = innerHeight; c.width = W*d; c.height = H*d; x.setTransform(d,0,0,d,0,0);
    const n = clamp(Math.round(W*H/5600), 60, 260); neb = []; const hues = ['109,74,224','255,193,72','63,210,192','169,140,255','255,122,92'];
    for (let i = 0; i < 4; i++) neb.push({ x:(.12+.76*((i*37)%100)/100)*W, y:(.10+.70*((i*61)%100)/100)*H, r:(.34+(i%3)*.13)*Math.max(W,H), c:hues[i], a:.05+(i%2)*.02, sp:.012+i*.004, ph:i*1.7 });
    stars = []; for (let i = 0; i < n; i++) stars.push({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.25+.25, p:Math.random()*6.283, s:Math.random()*.55+.18, v:Math.random()<.14 });
    /* two star layers, drawn once; fading between them is the twinkle */
    const mk = () => { const oc = document.createElement('canvas'); oc.width = W*d; oc.height = H*d; const ox = oc.getContext('2d'); ox.setTransform(d,0,0,d,0,0); return [oc, ox]; };
    [starsA, starsB] = [0, 1].map(k => { const [oc, ox] = mk(); ox.globalCompositeOperation = 'lighter';
      for (const st of stars){ const a = (k ? .45 + .55*Math.abs(Math.sin(st.p)) : .45 + .55*Math.abs(Math.cos(st.p))) * .85; ox.fillStyle = st.v ? `rgba(169,140,255,${(a*.9).toFixed(3)})` : `rgba(255,246,224,${a.toFixed(3)})`; ox.beginPath(); ox.arc(st.x,st.y,st.r,0,6.2832); ox.fill(); if (st.r > 1.05){ ox.fillStyle = `rgba(255,220,150,${(a*.12).toFixed(3)})`; ox.beginPath(); ox.arc(st.x,st.y,st.r*5,0,6.2832); ox.fill(); } } return oc; });
    const [nc, nx] = mk(); nebC = nc; nx.globalCompositeOperation = 'lighter';
    for (const nb of neb){ const ng = nx.createRadialGradient(nb.x,nb.y,0,nb.x,nb.y,nb.r); ng.addColorStop(0,`rgba(${nb.c},${nb.a.toFixed(4)})`); ng.addColorStop(.45,`rgba(${nb.c},${(nb.a*.38).toFixed(4)})`); ng.addColorStop(1,`rgba(${nb.c},0)`); nx.fillStyle = ng; nx.beginPath(); nx.arc(nb.x,nb.y,nb.r,0,6.2832); nx.fill(); }
    lastKey = ''; }
  function draw(now){ const time = (now-t0)/1000; const [ct, cm, cb] = skyAt(prog);
    const g = x.createLinearGradient(0,0,0,H); g.addColorStop(0, ct); g.addColorStop(.55, cm); g.addColorStop(1, cb); x.fillStyle = g; x.fillRect(0,0,W,H);
    const light = clamp((prog-.7)/.3, 0, 1);                       // how much the dawn has taken
    x.globalCompositeOperation = 'lighter';
    if (nebC){ const drift = reduced ? 0 : Math.sin(time*.05)*W*.02; x.globalAlpha = (1-light*.7)*(reduced ? 1 : .88+.12*Math.sin(time*.2)); x.drawImage(nebC, drift, 0, W, H); x.globalAlpha = 1; }
    /* a soft band of colour across the sky, slowly breathing */
    if (!reduced || true){ const bx = W*.5 + Math.sin(time*.05)*W*.1, byy = H*.35; const band = x.createRadialGradient(bx, byy, 0, bx, byy, W*.9); band.addColorStop(0, `rgba(120,80,220,${(.10*(1-light)).toFixed(3)})`); band.addColorStop(.5, `rgba(63,210,192,${(.04*(1-light)).toFixed(3)})`); band.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle = band; x.fillRect(0,0,W,H); }
    const starA = 1 - light*.85;
    if (starsA && starA > .02){ const mixv = reduced ? .5 : (Math.sin(time*.9)+1)/2; x.globalAlpha = starA*(1-mixv); x.drawImage(starsA, 0, 0, W, H); x.globalAlpha = starA*mixv; x.drawImage(starsB, 0, 0, W, H); x.globalAlpha = 1; }
    /* the moon: crosses from the top corner down toward the horizon */
    const mx = W*(.86 - prog*.6), my = H*(.14 + prog*.5); const mr = Math.min(W,H)*.026;
    x.globalCompositeOperation = 'source-over';
    x.fillStyle = `rgba(255,244,220,${(.95-light*.5).toFixed(3)})`; x.beginPath(); x.arc(mx,my,mr,0,6.2832); x.fill();
    x.fillStyle = g; x.beginPath(); x.arc(mx+mr*.42,my-mr*.16,mr*.92,0,6.2832); x.fill();
    x.globalCompositeOperation = 'lighter'; const mg = x.createRadialGradient(mx,my,mr*.6,mx,my,mr*6); mg.addColorStop(0,`rgba(255,240,210,${(.10*(1-light)).toFixed(3)})`); mg.addColorStop(1,'rgba(255,240,210,0)'); x.fillStyle = mg; x.beginPath(); x.arc(mx,my,mr*6,0,6.2832); x.fill();
    x.globalCompositeOperation = 'source-over';
    /* dawn: a warm band rises from the bottom as you reach the end */
    if (light > 0){ const dg = x.createLinearGradient(0,H*.45,0,H); dg.addColorStop(0,'rgba(255,158,77,0)'); dg.addColorStop(.6,`rgba(255,158,77,${(.18*light).toFixed(3)})`); dg.addColorStop(1,`rgba(255,200,120,${(.45*light).toFixed(3)})`); x.fillStyle = dg; x.fillRect(0,0,W,H); }
    /* shooting stars — rare, or a shower when someone finds the word */
    if (!reduced){ if (!shoot && shower > 0 && Math.random() < .12){ shoot = { x:Math.random()*W*.7, y:Math.random()*H*.4, l:0, sp:9+Math.random()*5 }; if (shower > 0) shower--; }
      if (shoot){ shoot.l += shoot.sp; const ex = shoot.x+shoot.l, ey = shoot.y+shoot.l*.42, tail = 110; const lg = x.createLinearGradient(ex-tail,ey-tail*.42,ex,ey); lg.addColorStop(0,'rgba(255,246,224,0)'); lg.addColorStop(1,'rgba(255,246,224,.85)');
        x.strokeStyle = lg; x.lineWidth = 1.6; x.lineCap = 'round'; x.beginPath(); x.moveTo(ex-tail,ey-tail*.42); x.lineTo(ex,ey); x.stroke(); if (ex > W+tail || ey > H+tail) shoot = null; } }
  }
  build(); if (reduced){ draw(performance.now()); onProg(() => draw(performance.now())); } else loop(draw);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (reduced) draw(performance.now()); }, 220); });
  window.__shower = (n) => { shower = n; };
})();

/* ═══════════════════════════════════════════════════════════════════
   THE TOWN — a Tunisian skyline under the page. Three depths: hills,
   the old town (dome, minaret, arches), the near roofs (antennas, a
   water tank, a palm, a dish). Every window is dark at the top of the
   page and lights, one by one, as you scroll. At the end the whole
   town is awake and the dawn is behind it.
   ═══════════════════════════════════════════════════════════════════ */
(function town(){
  const c = $('#town'); if (!c) return; const x = c.getContext('2d');
  let W = 0, H = 0, layers = [], windows = [], order = [], t0 = performance.now(), lastLit = -1, birds = [], litC = null, litN = -1, K = 1;
  let rn = seeded(2026);
  function silhouette(x2, w, h, depth){
    /* depth 0 = far hills · 1 = the medina on the left and the sea on the right · 2 = the near shore: a wall, palms, lamps */
    x2.clearRect(0,0,w,h); const wins = []; const sea0 = w*.58;
    if (depth === 0){ x2.fillStyle = '#0C0822'; x2.beginPath(); x2.moveTo(0,h); x2.lineTo(0,h*.6); let px = 0; while (px <= w){ const hh = h*(.5 + .12*Math.sin(px/w*5+.8) + .06*Math.sin(px/w*13)); x2.lineTo(px, hh); px += 24; } x2.lineTo(w,h); x2.closePath(); x2.fill(); return wins; }
    if (depth === 1){
      /* the sea: a flat horizon, the moon's path, a lighthouse at the point */
      x2.fillStyle = '#0A0A24'; x2.fillRect(sea0 - w*.04, h*.66, w, h);
      const lp = x2.createLinearGradient(0, h*.66, 0, h); lp.addColorStop(0,'rgba(255,240,210,.22)'); lp.addColorStop(1,'rgba(255,240,210,0)'); x2.fillStyle = lp; x2.fillRect(w*.86 - 26, h*.66, 52, h*.34);
      /* the medina: low blocks stepping down to the water, with domes and one minaret */
      let px = -10; const base = h*.72;
      while (px < sea0){ const bw = (44 + rn()*60)*K, bh = (34 + rn()*66)*K; const top = base - bh; x2.fillStyle = '#090617'; x2.fillRect(px, top, bw, h - top);
        const kind = rn(); if (kind < .18){ x2.beginPath(); x2.arc(px+bw/2, top, Math.min(bw*.46, 30*K), Math.PI, 0); x2.fill(); }
        const cols = Math.max(1, Math.floor(bw/(30*K))); for (let q = 0; q < cols; q++){ if (rn() < .5) continue; wins.push({ x: px + 10*K + q*(bw-20*K)/cols, y: top + 10*K + rn()*Math.max(0, bh-22*K), w:6*K, h:8*K, warm: rn() < .8, depth }); }
        px += bw + 4 + rn()*10*K; }
      /* the minaret, the tallest thing on the left */
      const mx = w*.22, mw = 13*K, mh = h*.36; x2.fillStyle = '#090617'; x2.fillRect(mx-mw/2, base-mh, mw, mh); x2.fillRect(mx-mw, base-mh-6*K, mw*2, 7*K); x2.beginPath(); x2.arc(mx, base-mh-12*K, 5*K, 0, 6.2832); x2.fill(); wins.push({ x: mx-3*K, y: base-mh+8*K, w:6*K, h:8*K, warm:true, depth });
      /* the lighthouse at the point */
      const lx = w*.86; x2.fillStyle = '#090617'; x2.fillRect(lx-7*K, h*.42, 14*K, h*.26); x2.fillRect(lx-11*K, h*.42, 22*K, 6*K); wins.push({ x: lx-5*K, y: h*.44, w:10*K, h:6*K, warm:true, depth, beam:true });
      return wins; }
    /* near: the shore wall, a few palms, three lamps */
    x2.fillStyle = '#05030E'; x2.fillRect(0, h*.8, w, h); x2.fillRect(0, h*.78, w*.62, 4*K);
    const palm = (pxp, py, sc) => { x2.fillRect(pxp-2.5*sc, py-64*sc, 5*sc, 64*sc); for (let k = 0; k < 7; k++){ const a = -Math.PI/2 + (k-3)*.44; x2.beginPath(); x2.moveTo(pxp, py-64*sc); x2.quadraticCurveTo(pxp+Math.cos(a)*28*sc, py-64*sc+Math.sin(a)*28*sc-12*sc, pxp+Math.cos(a)*50*sc, py-64*sc+Math.sin(a)*50*sc+6*sc); x2.lineTo(pxp+Math.cos(a)*46*sc, py-64*sc+Math.sin(a)*46*sc+13*sc); x2.closePath(); x2.fill(); } };
    palm(w*.07, h*.82, K*1.1); palm(w*.13, h*.83, K*.8); palm(w*.5, h*.82, K);
    return wins;
  }
  function build(){ const d = DPR(); const r = c.getBoundingClientRect(); W = innerWidth; H = r.height; c.width = W*d; c.height = H*d; x.setTransform(d,0,0,d,0,0); K = clamp(H/260, .7, 1.4); rn = seeded(2026);
    layers = []; windows = []; litC = null; litN = -1;
    for (let depth = 0; depth < 3; depth++){ const oc = document.createElement('canvas'); oc.width = W*d; oc.height = H*d; const ox = oc.getContext('2d'); ox.setTransform(d,0,0,d,0,0); const wins = silhouette(ox, W, H, depth); layers.push(oc); windows.push(...wins); }
    order = windows.map((_, i) => i); const rs = seeded(99); for (let i = order.length-1; i > 0; i--){ const j = Math.floor(rs()*(i+1)); [order[i], order[j]] = [order[j], order[i]]; }
    birds = []; for (let i = 0; i < 5; i++) birds.push({ x: W*.3 + i*W*.06, y: H*.18 + (i%2)*10, ph: i });
    lastLit = -1; }
  function draw(now){ const time = (now-t0)/1000; x.clearRect(0,0,W,H);
    const light = clamp((prog-.7)/.3, 0, 1);
    /* a haze between the sky and the town */
    const hz = x.createLinearGradient(0,0,0,H); hz.addColorStop(0,'rgba(6,3,15,0)'); hz.addColorStop(.5,'rgba(6,3,15,.35)'); hz.addColorStop(1,`rgba(${light > 0 ? '40,20,30' : '6,3,15'},.8)`); x.fillStyle = hz; x.fillRect(0,0,W,H);
    const par = [scrollProg*4, scrollProg*10, scrollProg*18];
    layers.forEach((L, i) => { x.drawImage(L, 0, par[i], W, H); });
    /* street lamps on the near roofs' street: warm cones */
    x.save(); x.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++){ const lx = W*(.28 + i*.16), ly = H*.76 + par[2]; const cone = x.createRadialGradient(lx, ly, 0, lx, ly, H*.22); cone.addColorStop(0,`rgba(255,200,110,${(.18 + .22*prog).toFixed(3)})`); cone.addColorStop(1,'rgba(255,200,110,0)'); x.fillStyle = cone; x.beginPath(); x.arc(lx, ly, H*.22, 0, 6.2832); x.fill(); x.fillStyle = 'rgba(255,240,200,.9)'; x.beginPath(); x.arc(lx, ly, 2.5, 0, 6.2832); x.fill(); } x.restore();
    /* windows: dark, then lit in a fixed shuffled order with what you did. The lit layer is
       redrawn only when the count changes; every frame just composites it. */
    const want = Math.round(order.length * clamp(prog*1.06, 0, 1));
    if (want !== litN || !litC){ litN = want; const d = DPR(); if (!litC){ litC = document.createElement('canvas'); } litC.width = W*d; litC.height = H*d; const lx = litC.getContext('2d'); lx.setTransform(d,0,0,d,0,0);
      lx.fillStyle = 'rgba(255,255,255,.05)'; for (let k = litN; k < order.length; k++){ const w = windows[order[k]]; lx.fillRect(w.x, w.y, w.w, w.h); }
      lx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < litN; k++){ const w = windows[order[k]]; const a = (w.depth === 1 ? .5 : .62); lx.fillStyle = w.warm ? `rgba(255,205,120,${a.toFixed(3)})` : `rgba(180,215,255,${(a*.85).toFixed(3)})`; lx.fillRect(w.x, w.y, w.w, w.h);
        const g = lx.createRadialGradient(w.x+w.w/2,w.y+w.h/2,0,w.x+w.w/2,w.y+w.h/2,12*K); g.addColorStop(0, w.warm ? 'rgba(255,190,100,.22)' : 'rgba(160,200,255,.18)'); g.addColorStop(1,'rgba(255,190,100,0)'); lx.fillStyle = g; lx.beginPath(); lx.arc(w.x+w.w/2,w.y+w.h/2,12*K,0,6.2832); lx.fill(); } }
    x.drawImage(litC, 0, par[2]*.5, W, H); x.globalCompositeOperation = 'lighter';
    /* the sea shimmers under the moon; the lighthouse sweeps */
    if (!reduced){ const sx = W*.86, sy = H*.68 + par[1]; for (let i = 0; i < 14; i++){ const yy = sy + i*(H*.3/14); const a = (.05 + .12*Math.sin(time*1.7 + i*1.3)) * (1 - i/16) * (.6 + .4*prog); x.fillStyle = `rgba(255,240,210,${a.toFixed(3)})`; const ww = 8 + i*6; x.fillRect(sx - ww/2 + Math.sin(time*.9+i)*8, yy, ww, 1.5); }
      const la = ((time*.35) % 6.2832); const lx = W*.86, ly = H*.45 + par[1]; const beam = x.createLinearGradient(lx, ly, lx + Math.cos(la)*W*.5, ly + Math.sin(la)*W*.5); beam.addColorStop(0,`rgba(255,240,200,${(.18*(.5+.5*prog)).toFixed(3)})`); beam.addColorStop(1,'rgba(255,240,200,0)'); x.fillStyle = beam; x.beginPath(); x.moveTo(lx, ly); x.arc(lx, ly, W*.5, la-.06, la+.06); x.closePath(); x.fill(); }
    /* the dawn: birds cross when the town is awake */
    if (light > .5 && !reduced){ x.globalCompositeOperation = 'source-over'; x.strokeStyle = `rgba(20,10,30,${((light-.5)*2).toFixed(3)})`; x.lineWidth = 1.6; x.lineCap = 'round';
      for (const b of birds){ const bx = (b.x + time*22) % (W+60) - 30, by = b.y + Math.sin(time*2+b.ph)*4, fl = Math.sin(time*7+b.ph)*4; x.beginPath(); x.moveTo(bx-7, by+fl); x.quadraticCurveTo(bx-3, by-3, bx, by); x.quadraticCurveTo(bx+3, by-3, bx+7, by+fl); x.stroke(); } }
    x.globalCompositeOperation = 'source-over'; }
  build(); if (reduced){ draw(performance.now()); onProg(() => draw(performance.now())); } else loop(draw);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (reduced) draw(performance.now()); }, 220); });
})();


/* ═══════════════════════════════════════════════════════════════════
   THE SEAL — an eight-point Tunisian star, generated once.
   ═══════════════════════════════════════════════════════════════════ */
let sealSeed = +(localStorage.getItem('yalla.seal') || 0);
let userName = localStorage.getItem('yalla.name') || '';

/* The seed picks a family, a fold, a tilt, a second colour and a heart.
   Family 0 · rosette   — petals and rings of circles (the zellige)
   Family 1 · star      — a star polygon {n/k}, drawn in one line
   Family 2 · galaxy    — arms of light, spiralling out
   Family 3 · crescent  — the crescent, and a ring of small stars
   Family 4 · lattice   — squares turned on each other, the doorway pattern  */
/* Six themes, so a girl of 15 and a man of 60 both find theirs: jasmine, zellige, the sea, the desert,
   henna, the sky. A theme fixes the palette and the family of the drawing; the seed does the rest. */
const THEMES = [
  { k:'jasmine', c1:'#FFF6E0', c2:'#7CF2B0', fams:['jasmine','rosette'] },
  { k:'zellige', c1:'#6EC8FF', c2:'#FFF6E0', fams:['mandala','rosette'] },
  { k:'sea',     c1:'#3FD2C0', c2:'#6EC8FF', fams:['waves','crescent'] },
  { k:'desert',  c1:'#FFC148', c2:'#FF7A5C', fams:['rosette','mandala'] },
  { k:'henna',   c1:'#FF8FB8', c2:'#FF7A5C', fams:['bloom','jasmine'] },
  { k:'sky',     c1:'#B9A3FF', c2:'#FFC148', fams:['galaxy','crescent'] },
];
const FAM_ID = { rosette:0, mandala:1, galaxy:2, crescent:3, bloom:4, jasmine:5, waves:6 };
function sealSpec(seed){ const r = seeded(seed); const theme = Math.floor(r()*6); const T = THEMES[theme]; const fam = FAM_ID[T.fams[Math.floor(r()*T.fams.length)]]; const SK = { 7:[2,3], 8:[3], 9:[2,4], 10:[3], 12:[5] }; const sn = [7,8,9,10,12][Math.floor(r()*5)]; const sk = SK[sn][Math.floor(r()*SK[sn].length)];
  return { fam, theme, c1: T.c1, c2: T.c2, fold: [5,6,7,8,9,10,12][Math.floor(r()*7)], tilt: r()*Math.PI, sn, sk, rings: 2 + Math.floor(r()*3), petalK: .4 + r()*.35, arms: [2,3,5,6][Math.floor(r()*4)], twist: .8 + r()*1.4, ticks: 24 + Math.floor(r()*40), tickEvery: 3 + Math.floor(r()*4), hue2: T.c2, petals: 5 + Math.floor(r()*3), dots: r() > .3, heart: Math.floor(r()*3) }; }
const sealTheme = () => sealSpec(sealSeed || 12345).theme;
const tier = () => sealNo > 0 && sealNo <= 10 ? 1 : sealNo > 0 && sealNo <= 20 ? 2 : sealNo > 0 && sealNo <= 100 ? 3 : 0;
const isFounder = () => tier() > 0;
const sealCode = () => 'YL-' + (sealSeed ? (sealSeed >>> 0).toString(36).toUpperCase().padStart(7, '0').slice(-6) : '------');
function drawSeal(x, cx, cy, R, seed, col, alpha, grow, opts){
  const sp = sealSpec(seed); const g = grow == null ? 1 : grow; if (g <= 0) return; opts = opts || {};
  if (!opts.mono) col = sp.c1;
  const [cr, cg, cb] = hex2rgb(col); const [hr, hg, hb] = hex2rgb(opts.mono ? col : sp.hue2);
  const L = [Math.min(255,cr+72), Math.min(255,cg+72), Math.min(255,cb+72)];
  const C = (a, light) => light ? `rgba(${L[0]},${L[1]},${L[2]},${a.toFixed(3)})` : `rgba(${cr},${cg},${cb},${a.toFixed(3)})`;
  const C2 = (a) => `rgba(${hr},${hg},${hb},${a.toFixed(3)})`;
  x.save(); x.translate(cx, cy); x.rotate(sp.tilt); x.lineJoin = 'round'; x.lineCap = 'round'; x.globalCompositeOperation = 'lighter';
  const n = sp.fold;
  /* a soft disc of the two colours under everything, so the drawing sits in light */
  if (g > .2){ const disc = x.createRadialGradient(0,0,0,0,0,R*1.05); disc.addColorStop(0, C(alpha*.16, true)); disc.addColorStop(.6, C2(alpha*.07)); disc.addColorStop(1, C2(0)); x.fillStyle = disc; x.beginPath(); x.arc(0,0,R*1.05,0,6.2832); x.fill(); }
  const GRAD = (a) => { const gr = x.createLinearGradient(-R, -R, R, R); gr.addColorStop(0, C(a, true)); gr.addColorStop(.5, C(a, false)); gr.addColorStop(1, C2(a)); return gr; };
  const star = (rad, inner, rot, pts) => { x.beginPath(); for (let i = 0; i < pts*2; i++){ const a = rot + i*Math.PI/pts; const rr2 = i%2 ? rad*inner : rad; i ? x.lineTo(Math.cos(a)*rr2, Math.sin(a)*rr2) : x.moveTo(Math.cos(a)*rr2, Math.sin(a)*rr2); } x.closePath(); };
  for (let pass = 0; pass < 2; pass++){
    const soft = pass === 0; const A = alpha * (soft ? .3 : 1); x.lineWidth = soft ? R*.05 : R*.014;
    if (sp.fam === 0){ /* rosette */
      if (g > .15){ const pr = R*Math.min(1,(g-.15)/.85); x.strokeStyle = soft ? C(A*.9, false) : GRAD(A*.95);
        for (let i = 0; i < n; i++){ const a = i*6.2832/n, da = Math.PI/n; const tip = [Math.cos(a)*pr, Math.sin(a)*pr]; const b1 = [Math.cos(a-da*.92)*pr*.6, Math.sin(a-da*.92)*pr*.6], b2 = [Math.cos(a+da*.92)*pr*.6, Math.sin(a+da*.92)*pr*.6]; const c1 = [Math.cos(a-da*sp.petalK)*pr*.98, Math.sin(a-da*sp.petalK)*pr*.98], c2 = [Math.cos(a+da*sp.petalK)*pr*.98, Math.sin(a+da*sp.petalK)*pr*.98];
          x.beginPath(); x.moveTo(b1[0],b1[1]); x.quadraticCurveTo(c1[0],c1[1],tip[0],tip[1]); x.quadraticCurveTo(c2[0],c2[1],b2[0],b2[1]); x.stroke(); } }
      for (let k = 0; k < sp.rings; k++){ if (g < .05 + k*.15) continue; const gg = Math.min(1,(g-.05-k*.15)/.4); const rk = R*(.26+k*.12), rc = R*(.1+k*.03); x.strokeStyle = k%2 ? C2(A*.7) : C(A*(.75-k*.12), !soft);
        for (let i = 0; i < n; i++){ const a = i*6.2832/n + (k%2)*Math.PI/n; x.beginPath(); x.arc(Math.cos(a)*rk*gg, Math.sin(a)*rk*gg, rc*gg, 0, 6.2832); x.stroke(); } }
    } else if (sp.fam === 1){ /* mandala: rings of little arcs, each ring turned half a step */
      const rr = R*Math.min(1, g); for (let k = 0; k < 4; k++){ const rk = rr*(.3 + k*.22), m = n + k*2; x.strokeStyle = k%2 ? C2(A*.85) : (soft ? C(A*.9, false) : GRAD(A)); x.lineWidth = soft ? R*.05 : R*.016;
        for (let i = 0; i < m; i++){ const a0 = i*6.2832/m + (k%2)*Math.PI/m; x.beginPath(); x.arc(Math.cos(a0)*rk, Math.sin(a0)*rk, rr*.11, a0 + Math.PI*.5, a0 + Math.PI*1.5); x.stroke(); } }
      if (g > .9){ x.strokeStyle = C(A*.6, !soft); x.lineWidth = soft ? R*.05 : R*.012; x.beginPath(); x.arc(0,0,rr*1.02,0,6.2832); x.stroke(); }
    } else if (sp.fam === 2){ /* galaxy */
      const arms = sp.arms; x.strokeStyle = C(A*.9, !soft); x.lineWidth = soft ? R*.06 : R*.02;
      for (let a0 = 0; a0 < arms; a0++){ x.beginPath(); for (let u = 0; u <= g; u += .02){ const a = a0*6.2832/arms + u*sp.twist*4; const rr = R*u; u ? x.lineTo(Math.cos(a)*rr, Math.sin(a)*rr) : x.moveTo(0,0); } x.stroke(); }
      if (!soft && sp.dots){ x.fillStyle = C2(alpha*.9); for (let a0 = 0; a0 < arms; a0++) for (let u = .2; u <= g; u += .12){ const a = a0*6.2832/arms + u*sp.twist*4 + .25; x.beginPath(); x.arc(Math.cos(a)*R*u, Math.sin(a)*R*u, R*.03, 0, 6.2832); x.fill(); } }
    } else if (sp.fam === 3){ /* crescent and stars */
      const rr = R*Math.min(1, g); x.strokeStyle = C(A, !soft); x.lineWidth = soft ? R*.07 : R*.03;
      x.beginPath(); x.arc(0,0,rr*.72,.75,5.55); x.stroke(); x.beginPath(); x.arc(rr*.22,0,rr*.55,.9,5.4); x.stroke();
      if (g > .5 && !soft){ const m = Math.max(5, n); for (let i = 0; i < m; i++){ const a = i*6.2832/m; glowDot(x, Math.cos(a)*rr*.92, Math.sin(a)*rr*.92, rr*.1, 'rgba(255,248,228,A)', C2(1).replace(/,[\d.]+\)$/, ',A)'), alpha*.9); } }
    } else if (sp.fam === 5){ /* jasmine */
      const rr = R*Math.min(1, g); const P = sp.petals; x.strokeStyle = soft ? C(A*.9, false) : GRAD(A); x.fillStyle = soft ? C(A*.08, false) : C(alpha*.1, true);
      for (let i = 0; i < P; i++){ const a = i*6.2832/P; x.save(); x.rotate(a); x.beginPath(); x.ellipse(rr*.58, 0, rr*.42, rr*.2, 0, 0, 6.2832); x.fill(); x.stroke(); x.restore(); }
      if (g > .5){ x.strokeStyle = C2(A*.8); for (let i = 0; i < P; i++){ const a = i*6.2832/P + Math.PI/P; x.save(); x.rotate(a); x.beginPath(); x.ellipse(rr*.3, 0, rr*.24, rr*.1, 0, 0, 6.2832); x.stroke(); x.restore(); } }
      if (!soft && g > .8){ x.fillStyle = C2(alpha*.9); for (let i = 0; i < P*2; i++){ const a = i*Math.PI/P; x.beginPath(); x.arc(Math.cos(a)*rr*1.02, Math.sin(a)*rr*1.02, R*.022, 0, 6.2832); x.fill(); } }
    } else if (sp.fam === 6){ /* waves */
      const rr = R*Math.min(1, g); x.strokeStyle = soft ? C(A*.85, false) : GRAD(A*.9); x.lineWidth = soft ? R*.05 : R*.016;
      for (let k = 1; k <= 4; k++){ const rk = rr*(.22 + k*.19); x.beginPath(); for (let i = 0; i <= 96; i++){ const a = i/96*6.2832; const w = 1 + .05*Math.sin(a*(4+k) + k); const px = Math.cos(a)*rk*w, py = Math.sin(a)*rk*w; i ? x.lineTo(px,py) : x.moveTo(px,py); } x.closePath(); x.stroke(); }
      if (g > .6){ x.strokeStyle = C2(A*.9); x.lineWidth = soft ? R*.06 : R*.03; x.beginPath(); x.arc(0, 0, rr*.62, 3.6, 5.8); x.stroke(); }
      if (!soft && sp.dots && g > .85){ x.fillStyle = C2(alpha*.9); for (let i = 0; i < 12; i++){ const a = i*6.2832/12 + .2; x.beginPath(); x.arc(Math.cos(a)*rr*1.02, Math.sin(a)*rr*1.02, R*.02, 0, 6.2832); x.fill(); } }
    } else { /* bloom: two rings of overlapping circles */
      const rr = R*Math.min(1, g); x.strokeStyle = soft ? C(A*.85, false) : GRAD(A*.9); x.lineWidth = soft ? R*.05 : R*.014;
      for (let i = 0; i < n; i++){ const a0 = i*6.2832/n; x.beginPath(); x.arc(Math.cos(a0)*rr*.5, Math.sin(a0)*rr*.5, rr*.5, 0, 6.2832); x.stroke(); }
      if (g > .5){ x.strokeStyle = C2(A*.8); for (let i = 0; i < n; i++){ const a0 = i*6.2832/n + Math.PI/n; x.beginPath(); x.arc(Math.cos(a0)*rr*.25, Math.sin(a0)*rr*.25, rr*.25, 0, 6.2832); x.stroke(); } }
    }
    /* the heart, three kinds */
    if (!soft){ const hr = R*.18*Math.min(1, g/.3); const hg = x.createRadialGradient(0,0,0,0,0,hr*1.7); hg.addColorStop(0, C(alpha*.9, true)); hg.addColorStop(1, C(0, false)); x.fillStyle = hg; x.beginPath(); x.arc(0,0,hr*1.7,0,6.2832); x.fill();
      x.fillStyle = C(alpha*.95, true); if (sp.heart === 0){ x.beginPath(); x.arc(0,0,hr*.7,0,6.2832); x.fill(); } else if (sp.heart === 1){ x.beginPath(); x.arc(0,0,hr*.55,0,6.2832); x.fill(); x.strokeStyle = C2(alpha); x.lineWidth = R*.02; x.beginPath(); x.arc(0,0,hr*.9,0,6.2832); x.stroke(); } else { x.beginPath(); x.arc(0,0,hr*.45,0,6.2832); x.fill(); x.strokeStyle = C2(alpha*.9); x.lineWidth = R*.015; for (let k = 1; k <= 2; k++){ x.beginPath(); x.arc(0,0,hr*(.45 + k*.3),0,6.2832); x.stroke(); } } }
    if (sp.dots && g > .9 && !soft && sp.fam !== 2 && sp.fam !== 5 && sp.fam !== 6){ x.fillStyle = C2(alpha); for (let i = 0; i < n; i++){ const a = i*6.2832/n; x.beginPath(); x.arc(Math.cos(a)*R*1.06, Math.sin(a)*R*1.06, R*.02, 0, 6.2832); x.fill(); } }
    /* the ring of ticks: a count and a rhythm nobody else has */
    if (!soft && g > .95){ x.strokeStyle = C(alpha*.55, true); x.lineWidth = R*.012; for (let i = 0; i < sp.ticks; i++){ const a = i*6.2832/sp.ticks; const long = i % sp.tickEvery === 0; const r0 = R*1.14, r1 = R*(long ? 1.24 : 1.19); x.beginPath(); x.moveTo(Math.cos(a)*r0, Math.sin(a)*r0); x.lineTo(Math.cos(a)*r1, Math.sin(a)*r1); x.stroke(); } }
  }
  /* the first hundred: a solid gold ring, and the word on it */
  const tr = opts.founder ? tier() : 0;
  if (tr && g > .95){ x.globalCompositeOperation = 'source-over'; const ringCol = tr === 1 ? '#FFC148' : tr === 2 ? '#FFF6E0' : 'rgba(255,231,168,.7)'; x.strokeStyle = ringCol; x.lineWidth = tr === 1 ? R*.05 : tr === 2 ? R*.035 : R*.02; x.shadowColor = tr === 1 ? 'rgba(255,193,72,.8)' : 'rgba(255,246,224,.5)'; x.shadowBlur = tr === 1 ? R*.2 : R*.1; x.beginPath(); x.arc(0,0,R*1.34,0,6.2832); x.stroke(); x.shadowBlur = 0;
    if (tr === 1){ x.strokeStyle = 'rgba(255,231,168,.7)'; x.lineWidth = R*.012; x.beginPath(); x.arc(0,0,R*1.42,0,6.2832); x.stroke(); x.fillStyle = '#FFC148'; for (let i = 0; i < 12; i++){ const a = i*6.2832/12; x.beginPath(); x.arc(Math.cos(a)*R*1.42, Math.sin(a)*R*1.42, R*.025, 0, 6.2832); x.fill(); } } }
  x.restore();
}

(function pad(){
  const btn = $('#press'), cv = $('#fpCanvas'); if (!btn || !cv) return;
  const x = cv.getContext('2d'); const HOLD = 1400; let holding = false, raf = 0, t0 = 0;
  function paint(p, spin){ x.clearRect(0,0,cv.width,cv.height); if (p <= 0) return;
    x.save(); x.translate(230,230); x.rotate((1-p)*1.2 + (spin || 0)); x.translate(-230,-230);
    drawSeal(x, 230, 230, 150, sealSeed || 12345, '#FFC148', .5 + .5*p, p, { founder: isFounder() }); x.restore(); }
  let idleT0 = performance.now(); function idle(now){ if (btn.classList.contains('done') && !reduced) paint(1, (now-idleT0)/1000*.05); }
  whenVisible(btn, () => { if (!btn._loop){ btn._loop = true; loop(idle); } });
  window.__padRepaint = () => { if (btn.classList.contains('done')) paint(1); };
  function finish(){ holding = false; cancelAnimationFrame(raf); btn.classList.remove('holding'); btn.classList.add('done'); btn.style.setProperty('--p', 1);
    localStorage.setItem('yalla.seal', String(sealSeed)); paint(1);
    $('#made').classList.add('on'); $('#namebox').classList.add('on'); $('#padLabel').hidden = true; $('#padHint').hidden = true; drawCards(); markStep('seal'); assignSealNo();
    setTimeout(() => $('#nameInput') && $('#nameInput').focus({ preventScroll:true }), 400); }
  function loop(now){ if (!holding) return; const p = clamp((now-t0)/HOLD, 0, 1); btn.style.setProperty('--p', p); paint(ease3(p)); if (p >= 1){ finish(); return; } raf = requestAnimationFrame(loop); }
  function start(e){ if (btn.classList.contains('done')) return; e.preventDefault();
    sealSeed = hash(String(Date.now()) + '|' + Math.random() + '|' + (navigator.userAgent||'').length);
    holding = true; t0 = performance.now(); btn.classList.add('holding'); set('#padLabel','textContent', t('hero.holding')); raf = requestAnimationFrame(loop); }
  function stop(){ if (!holding) return; holding = false; cancelAnimationFrame(raf); btn.classList.remove('holding'); btn.style.setProperty('--p', 0); set('#padLabel','textContent', t('hero.press')); paint(0); }
  btn.addEventListener('pointerdown', start); btn.addEventListener('pointerup', stop); btn.addEventListener('pointerleave', stop); btn.addEventListener('pointercancel', stop);
  btn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !holding) start(e); }); btn.addEventListener('keyup', stop);
  if (sealSeed){ btn.classList.add('done'); btn.style.setProperty('--p', 1); paint(1); $('#made').classList.add('on'); $('#namebox').classList.add('on'); $('#padLabel').hidden = true; $('#padHint').hidden = true; done.add('seal'); paintSealNo(); if (!sealNo) assignSealNo(); }
})();
function showGreet(){ if (!userName) return; set('#greetName','textContent', userName); const g = $('#greet'); if (g) g.classList.add('on'); const i = $('#nameInput'); if (i) i.value = userName; }
(function name(){ const f = $('#nameForm'), i = $('#nameInput'); if (!f || !i) return;
  f.addEventListener('submit', (e) => { e.preventDefault(); const v = i.value.trim().slice(0,24); if (!v){ i.focus(); return; } userName = v; localStorage.setItem('yalla.name', v); showGreet(); chatRestart(); drawCards(); markStep('name'); }); showGreet(); if (userName) done.add('name'); })();


/* ═══════════════════════════════════════════════════════════════════
   THE THREAD (in the header) + THE STRAND (on the edge)
   ═══════════════════════════════════════════════════════════════════ */
const CHAPTERS = ['hero','story','map','day','card','end'];
const CHAPTER_STEP = { hero:'seal', story:'story', map:'place', day:'day', card:'card', end:'end' };
let chapterIdx = 0, curStep = 'seal';
function buildThread(){ const nav = $('#thread'); if (!nav) return; $$('.bead', nav).forEach(b => b.remove());
  STEPS.forEach((k, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'bead'; b.dataset.k = k; b.setAttribute('aria-label', k);
    b.innerHTML = '<i></i>'; b.onclick = () => { const el = $(STEP_EL[k]); if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block:'center' }); }; nav.appendChild(b); });
  paintThread(); }
function paintThread(){ const beads = $$('#thread .bead'); const ci = STEPS.indexOf(curStep);
  beads.forEach((b, i) => { b.classList.toggle('on', done.has(STEPS[i])); b.classList.toggle('cur', i === ci); b.setAttribute('aria-current', i === ci ? 'step' : 'false'); });
  const lit = $('#threadLit'); if (lit && beads.length){ const nav = $('#thread'); const r0 = nav.getBoundingClientRect(); const rc = beads[Math.max(0, ci)].getBoundingClientRect(); const rtl = document.documentElement.dir === 'rtl';
    lit.style.width = Math.max(0, (rtl ? r0.right - (rc.left + rc.width/2) : (rc.left + rc.width/2) - r0.left) - 18) + 'px'; } }
function setCurStep(k){ if (k === curStep) return; curStep = k; paintThread(); if (window.__dnaRedraw) window.__dnaRedraw(); }
(function chapterWatch(){ if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ const i = CHAPTERS.indexOf(e.target.id); if (i !== chapterIdx){ chapterIdx = i; if (!walking) setCurStep(CHAPTER_STEP[e.target.id]); if (e.target.id === 'end') markStep('end'); } } }), { rootMargin:'-45% 0px -50% 0px' });
  CHAPTERS.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); }); })();

(function dna(){
  const c = $('#dna'); if (!c) return; const x = c.getContext('2d');
  let W = 0, H = 0, t0 = performance.now(), marks = [], mouse = null, hot = -1;
  function build(){ const d = DPR(); const r = c.getBoundingClientRect(); W = r.width; H = r.height; if (!W) return; c.width = W*d; c.height = H*d; x.setTransform(d,0,0,d,0,0);
    marks = STEPS.map((k, i) => ({ k, f: .1 + i*(.8/(STEPS.length-1)) })); }
  /* the glyphs: seal · name · story · place · day · card · end — a few strokes each */
  function glyph(k, r, on){ x.strokeStyle = on ? '#FFE7A8' : 'rgba(214,200,255,.4)'; x.lineWidth = 1.3; x.lineCap = 'round'; x.beginPath();
    if (k === 'seal'){ for (let i = 0; i < 8; i++){ const a = i*Math.PI/4; const rr = i%2 ? r*.45 : r; i ? x.lineTo(Math.cos(a)*rr, Math.sin(a)*rr) : x.moveTo(Math.cos(a)*rr, Math.sin(a)*rr); } x.closePath(); }
    else if (k === 'name'){ x.arc(0,-r*.35,r*.4,0,6.2832); x.moveTo(-r,r*.9); x.quadraticCurveTo(0,-r*.1,r,r*.9); }
    else if (k === 'story'){ x.rect(-r,-r*.7,r*2,r*1.4); x.moveTo(-r*.3,-r*.35); x.lineTo(r*.4,0); x.lineTo(-r*.3,r*.35); x.closePath(); }
    else if (k === 'place'){ x.arc(0,-r*.2,r*.55,Math.PI*1.15,Math.PI*1.85); x.moveTo(-r*.55,-r*.05); x.lineTo(0,r); x.lineTo(r*.55,-r*.05); }
    else if (k === 'day'){ x.rect(-r*.55,-r,r*1.1,r*2); x.moveTo(-r*.2,r*.7); x.lineTo(r*.2,r*.7); }
    else if (k === 'card'){ x.rect(-r,-r*.65,r*2,r*1.3); x.moveTo(-r*.3,0); x.arc(0,0,r*.3,0,6.2832); }
    else { x.arc(0,r*.2,r*.6,Math.PI,0); x.moveTo(-r,r*.2); x.lineTo(r,r*.2); x.moveTo(0,-r); x.lineTo(0,-r*.7); }
    x.stroke(); }
  function draw(now){ if (!W){ if (!reduced) requestAnimationFrame(draw); return; } const time = (now-t0)/1000; x.clearRect(0,0,W,H);
    const cx = W/2, amp = 20, pitch = 220, spin = reduced ? 0 : time*.14;
    const lastDone = Math.max(-1, ...STEPS.map((k, i) => done.has(k) ? i : -1)); const litY = lastDone < 0 ? 0 : marks[lastDone].f*H;
    const bend = (y) => { if (!mouse) return 0; const dy = y - mouse[1]; const k = Math.exp(-(dy*dy)/(2*90*90)); return (mouse[0] - cx) * .35 * k; };
    x.lineCap = 'round';
    for (let st = 0; st < 2; st++){ x.beginPath(); for (let y = -20; y <= H+20; y += 4){ const ph = (y/pitch)*6.2832 + st*Math.PI + spin; const px = cx + Math.sin(ph)*amp + bend(y); y <= -20 ? x.moveTo(px,y) : x.lineTo(px,y); } x.strokeStyle = 'rgba(169,140,255,.12)'; x.lineWidth = 1.4; x.stroke(); }
    if (litY > 0){ x.save(); x.beginPath(); x.rect(0,0,W,litY); x.clip(); x.globalCompositeOperation = 'lighter';
      for (let st = 0; st < 2; st++){ x.beginPath(); for (let y = -20; y <= litY+20; y += 4){ const ph = (y/pitch)*6.2832 + st*Math.PI + spin; const px = cx + Math.sin(ph)*amp + bend(y); y <= -20 ? x.moveTo(px, y) : x.lineTo(px, y); }
        x.strokeStyle = st ? 'rgba(255,193,72,.85)' : 'rgba(169,140,255,.85)'; x.lineWidth = 2; x.shadowColor = st ? 'rgba(255,193,72,.6)' : 'rgba(169,140,255,.6)'; x.shadowBlur = 8; x.stroke(); x.shadowBlur = 0; }
      for (let y = 0; y <= litY; y += pitch/8){ const ph = (y/pitch)*6.2832 + spin; const b = bend(y); const a = cx+Math.sin(ph)*amp+b, bb = cx+Math.sin(ph+Math.PI)*amp+b; const depth = (Math.cos(ph)+1)/2; x.strokeStyle = `rgba(255,231,168,${(.15+.45*depth).toFixed(3)})`; x.lineWidth = 1; x.beginPath(); x.moveTo(a,y); x.lineTo(bb,y); x.stroke(); }
      x.restore(); }
    marks.forEach((m, i) => { const y = m.f*H, on = done.has(m.k), cur = m.k === curStep, isHot = i === hot; const R = isHot ? 16 : cur ? 14 : 12;
      if (on || cur){ x.save(); x.globalCompositeOperation = 'lighter'; const pr = R + (cur ? 8 + 4*Math.sin(time*2.2) : 4); const g = x.createRadialGradient(cx,y,0,cx,y,pr); g.addColorStop(0,'rgba(255,248,228,.8)'); g.addColorStop(.4,'rgba(255,193,72,.4)'); g.addColorStop(1,'rgba(255,193,72,0)'); x.fillStyle = g; x.beginPath(); x.arc(cx,y,pr,0,6.2832); x.fill(); x.restore(); }
      x.fillStyle = on ? '#1E1440' : 'rgba(6,3,15,.9)'; x.beginPath(); x.arc(cx,y,R,0,6.2832); x.fill(); x.strokeStyle = on ? '#FFE7A8' : cur ? 'rgba(255,231,168,.6)' : 'rgba(214,200,255,.25)'; x.lineWidth = 1.4; x.stroke();
      x.save(); x.translate(cx,y); glyph(m.k, R*.5, on || cur); x.restore(); });
    if (!reduced) requestAnimationFrame(draw); }
  c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); mouse = [e.clientX - r.left, e.clientY - r.top]; hot = -1; marks.forEach((m, i) => { if (Math.abs(m.f*H - mouse[1]) < 18) hot = i; }); c.style.cursor = hot >= 0 ? 'pointer' : 'default'; });
  c.addEventListener('pointerleave', () => { mouse = null; hot = -1; });
  c.addEventListener('click', () => { if (hot >= 0){ const el = $(STEP_EL[marks[hot].k]); if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block:'center' }); } });
  build(); requestAnimationFrame(draw); if (reduced){ draw(performance.now()); onProg(() => draw(performance.now())); }
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); }); addEventListener('load', () => setTimeout(build, 300));
  window.__dnaRebuild = build; window.__dnaRedraw = () => { if (reduced) draw(performance.now()); };
})();


/* the guide's voice, only while walking; a shower of stars for whoever types the word */
let walking = false, secretOn = localStorage.getItem('yalla.secret') === '1';
function starSay(){ }
function starBurst(){ }
set('#guideMark', 'innerHTML', MARK);
(function word(){ let buf = ''; addEventListener('keydown', (e) => { if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; buf = (buf + (e.key||'').toLowerCase()).slice(-5); if (buf === 'yalla' || buf.endsWith('يلا')){ if (window.__shower) window.__shower(10); if (!secretOn){ secretOn = true; localStorage.setItem('yalla.secret','1'); buildSwatches(); } buf = ''; } }); })();


/* ═══════════════════════════════════════════════════════════════════
   THE STORY — three scenes on a sticky stage. The stage draws only
   while it is on screen, and only what changed.
   ═══════════════════════════════════════════════════════════════════ */
let sceneIdx = -1;
function paintScene(force){
  const T = $('#sceneT'), B = $('#sceneB'), C = $('#sceneC'); if (!T) return;
  const k = ['s1','s2','s3','s4','s5'][clamp(sceneIdx, 0, 4)];
  T.textContent = t('story.'+k); B.textContent = t('story.'+k+'b'); C.textContent = t('story.'+k+'c'); const r = $('#reel'); if (r) r.classList.remove('told');
  if (force){ const r = $('#reel'); if (r) r.classList.add('on'); }
}
(function film(){
  const st = $('#stage'), cv = $('#sceneCanvas'); if (!st || !cv) return;
  const x = cv.getContext('2d'); const W = cv.width, H = cv.height; let t0 = performance.now(), p = 0, scene = 0, local = 0, live = false;
  const rn = seeded(77); const bars = []; for (let i = 0; i < 14; i++) bars.push({ w: .3 + rn()*.5, h: 26 + rn()*40, likes: Math.floor(rn()*900) });
  const noise = document.createElement('canvas'); noise.width = 160; noise.height = 120; { const nx = noise.getContext('2d'); const id = nx.createImageData(160,120); for (let i = 0; i < id.data.length; i += 4){ const v = 40 + Math.random()*180; id.data[i] = id.data[i+1] = id.data[i+2] = v; id.data[i+3] = 255; } nx.putImageData(id,0,0); }
  /* the heroes, as shadow puppets: each is a few strokes, never a face */
  function hero(kind, hx, hy, s, flip){ x.save(); x.translate(hx, hy); if (flip) x.scale(-1,1); x.fillStyle = 'rgba(24,10,44,.92)'; x.strokeStyle = 'rgba(24,10,44,.92)'; x.lineCap = 'round'; x.lineWidth = s*.16;
    if (kind === 'sword'){ x.beginPath(); x.arc(0,-s*.75,s*.22,0,6.2832); x.fill(); roundRect(x,-s*.2,-s*.5,s*.4,s*.7,s*.1); x.fill(); x.beginPath(); x.moveTo(-s*.15,-s*.3); x.lineTo(-s*.5,-s*.1); x.moveTo(s*.15,-s*.35); x.lineTo(s*.55,-s*.85); x.moveTo(-s*.1,s*.2); x.lineTo(-s*.25,s*.7); x.moveTo(s*.1,s*.2); x.lineTo(s*.3,s*.7); x.stroke(); x.lineWidth = s*.07; x.beginPath(); x.moveTo(s*.55,-s*.85); x.lineTo(s*.95,-s*1.4); x.stroke(); x.fillRect(s*.42,-s*1.0,s*.26,s*.06); }
    else if (kind === 'ball'){ x.beginPath(); x.arc(0,-s*.75,s*.22,0,6.2832); x.fill(); roundRect(x,-s*.2,-s*.5,s*.4,s*.7,s*.1); x.fill(); x.beginPath(); x.moveTo(-s*.15,-s*.3); x.lineTo(-s*.5,-s*.55); x.moveTo(s*.15,-s*.3); x.lineTo(s*.45,-s*.1); x.moveTo(-s*.1,s*.2); x.lineTo(-s*.2,s*.7); x.moveTo(s*.1,s*.2); x.lineTo(s*.6,s*.35); x.stroke(); x.beginPath(); x.arc(s*.95,s*.2,s*.2,0,6.2832); x.fill(); }
    else if (kind === 'robot'){ roundRect(x,-s*.3,-s*1.05,s*.6,s*.5,s*.08); x.fill(); roundRect(x,-s*.35,-s*.5,s*.7,s*.8,s*.08); x.fill(); x.fillRect(-s*.6,-s*.45,s*.22,s*.55); x.fillRect(s*.38,-s*.45,s*.22,s*.55); x.fillRect(-s*.28,s*.3,s*.2,s*.45); x.fillRect(s*.08,s*.3,s*.2,s*.45); x.fillRect(-s*.03,-s*1.3,s*.06,s*.25); x.beginPath(); x.arc(0,-s*1.32,s*.07,0,6.2832); x.fill(); x.fillStyle = 'rgba(255,230,180,.9)'; x.fillRect(-s*.18,-s*.92,s*.1,s*.1); x.fillRect(s*.08,-s*.92,s*.1,s*.1); }
    else { /* wand */ x.beginPath(); x.arc(0,-s*.78,s*.22,0,6.2832); x.fill(); x.beginPath(); x.moveTo(-s*.22,-s*.5); x.lineTo(s*.22,-s*.5); x.lineTo(s*.42,s*.55); x.lineTo(-s*.42,s*.55); x.closePath(); x.fill(); x.beginPath(); x.moveTo(-s*.15,-s*.3); x.lineTo(-s*.45,s*.05); x.moveTo(s*.15,-s*.35); x.lineTo(s*.5,-s*.8); x.stroke(); x.lineWidth = s*.06; x.beginPath(); x.moveTo(s*.5,-s*.8); x.lineTo(s*.8,-s*1.25); x.stroke(); x.fillStyle = 'rgba(255,255,255,.95)'; for (let i = 0; i < 5; i++){ const a = i*6.2832/5; x.beginPath(); x.arc(s*.8+Math.cos(a)*s*.14, -s*1.25+Math.sin(a)*s*.14, s*.035, 0, 6.2832); x.fill(); } }
    x.restore(); }
  let draw = function(now){ const time = (now-t0)/1000; x.clearRect(0,0,W,H);
    x.save(); const kb = 1 + .06*ease3(local); x.translate(W/2, H/2); x.scale(kb, kb); x.translate(-W/2, -H/2);
    const g = x.createRadialGradient(W*.5,H*.55,0,W*.5,H*.55,W*.7); g.addColorStop(0,'#120A2E'); g.addColorStop(1,'#05020E'); x.fillStyle = g; x.fillRect(0,0,W,H);
    const kind = ['amphi','court','tv','phone','light'][scene];
    if (kind === 'amphi'){
      /* three thousand years: the arches of El Jem under the stars, a mosaic floor; press a stone and the whole mosaic lights, row by row */
      const sk = x.createLinearGradient(0,0,0,H); sk.addColorStop(0,'#08051A'); sk.addColorStop(1,'#2A1A3E'); x.fillStyle = sk; x.fillRect(0,0,W,H);
      x.fillStyle = 'rgba(255,246,224,.7)'; for (let i = 0; i < 40; i++){ x.beginPath(); x.arc(((i*97)%100)/100*W, ((i*53)%100)/100*H*.4, .8+(i%3)*.5, 0, 6.2832); x.fill(); }
      const lit = acted ? ease3(clamp(local*1.3, 0, 1)) : 0;
      x.save(); x.globalCompositeOperation = 'lighter'; const gl = x.createRadialGradient(W*.5, H*.5, 0, W*.5, H*.5, W*.6); gl.addColorStop(0,`rgba(255,200,110,${(.08 + .35*lit).toFixed(3)})`); gl.addColorStop(1,'rgba(255,200,110,0)'); x.fillStyle = gl; x.fillRect(0,0,W,H); x.restore();
      /* two tiers of arches, curving as the amphitheatre does */
      for (let tier = 0; tier < 2; tier++){ const ty = H*(.22 + tier*.2), ah = H*.17; x.fillStyle = tier ? '#160F30' : '#1B1236'; x.fillRect(0, ty, W, ah + 6);
        for (let i = 0; i < 7; i++){ const ax = W*(.07 + i*.145), aw = W*.1; x.fillStyle = '#07040F'; x.beginPath(); x.moveTo(ax, ty+ah); x.lineTo(ax, ty+ah*.45); x.arc(ax+aw/2, ty+ah*.45, aw/2, Math.PI, 0); x.lineTo(ax+aw, ty+ah); x.closePath(); x.fill();
          if (lit > 0){ x.save(); x.globalCompositeOperation = 'lighter'; const ag = x.createRadialGradient(ax+aw/2, ty+ah*.7, 0, ax+aw/2, ty+ah*.7, aw); ag.addColorStop(0,`rgba(255,200,110,${(.35*lit).toFixed(3)})`); ag.addColorStop(1,'rgba(255,200,110,0)'); x.fillStyle = ag; x.beginPath(); x.arc(ax+aw/2, ty+ah*.7, aw, 0, 6.2832); x.fill(); x.restore(); } } }
      /* the mosaic floor: small stones, lighting from the centre outward */
      const fy = H*.64; x.fillStyle = '#100A22'; x.fillRect(0, fy, W, H-fy);
      const cols = 22, rows = 7; for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++){ const sx = q*W/cols + (r%2)*W/cols/2, sy = fy + 8 + r*(H-fy-8)/rows; const d = Math.hypot((sx - W/2)/W, (sy - (fy+H)/2)/H); const on = clamp((lit*1.2 - d*1.6), 0, 1); const hue = (q+r)%3;
        x.fillStyle = on > 0 ? `rgba(${hue ? '255,193,72' : '63,210,192'},${(.15 + .75*on).toFixed(3)})` : 'rgba(255,255,255,.06)'; roundRect(x, sx+2, sy+2, W/cols-4, (H-fy-8)/rows-4, 3); x.fill(); }
      /* the one stone you press, before the act: it breathes */
      if (!acted){ const bx = W/2, by = fy + (H-fy)/2; x.save(); x.globalCompositeOperation = 'lighter'; const bg = x.createRadialGradient(bx,by,0,bx,by,40+8*Math.sin(time*3)); bg.addColorStop(0,'rgba(255,231,168,.8)'); bg.addColorStop(1,'rgba(255,231,168,0)'); x.fillStyle = bg; x.beginPath(); x.arc(bx,by,50,0,6.2832); x.fill(); x.restore(); }
    } else if (kind === 'court'){
      /* 1965: the courtyard of the big house, the door open, everyone gathered around one lamp */
      const sk = x.createLinearGradient(0,0,0,H); sk.addColorStop(0,'#120A2E'); sk.addColorStop(1,'#3A2450'); x.fillStyle = sk; x.fillRect(0,0,W,H);
      x.fillStyle = 'rgba(255,246,224,.6)'; for (let i = 0; i < 30; i++){ x.beginPath(); x.arc(((i*97)%100)/100*W, ((i*53)%100)/100*H*.35, .8+(i%3)*.5, 0, 6.2832); x.fill(); }
      /* the arcade around the courtyard */
      x.fillStyle = '#1B1236'; x.fillRect(0, H*.34, W, H*.36); for (let i = 0; i < 5; i++){ const ax = W*(.1 + i*.2); x.fillStyle = '#0B0720'; x.beginPath(); x.arc(ax, H*.5, W*.07, Math.PI, 0); x.lineTo(ax+W*.07, H*.7); x.lineTo(ax-W*.07, H*.7); x.closePath(); x.fill(); }
      /* the door, open, light pouring out */
      const open = acted ? ease3(clamp(local*1.6, 0, 1)) : 0; x.fillStyle = '#2C6BD6'; x.fillRect(W*.43, H*.4, W*.14, H*.3); x.fillStyle = '#FFE7A8'; x.fillRect(W*.43, H*.4, W*.14*open, H*.3); x.save(); x.globalCompositeOperation = 'lighter'; const dg = x.createRadialGradient(W*.5, H*.62, 0, W*.5, H*.62, W*.5); dg.addColorStop(0,`rgba(255,200,110,${(.55*open).toFixed(3)})`); dg.addColorStop(1,'rgba(255,200,110,0)'); x.fillStyle = dg; x.fillRect(0,0,W,H); x.restore();
      /* the floor tiles */
      x.fillStyle = '#100A22'; x.fillRect(0, H*.7, W, H*.3); x.strokeStyle = 'rgba(255,255,255,.06)'; x.lineWidth = 1; for (let i = 0; i < 9; i++){ x.beginPath(); x.moveTo(W*.5 + (i-4)*W*.06, H*.7); x.lineTo(W*.5 + (i-4)*W*.22, H); x.stroke(); }
      /* the family, seated in a circle around the lamp; the grandmother stands at the door */
      const lamp = [W*.5, H*.62]; x.save(); x.globalCompositeOperation = 'lighter'; const lg2 = x.createRadialGradient(lamp[0], lamp[1]-30, 0, lamp[0], lamp[1]-30, W*.2); lg2.addColorStop(0,'rgba(255,220,150,.8)'); lg2.addColorStop(1,'rgba(255,220,150,0)'); x.fillStyle = lg2; x.beginPath(); x.arc(lamp[0], lamp[1]-30, W*.2, 0, 6.2832); x.fill(); x.restore(); x.fillStyle = '#FFF3D6'; x.beginPath(); x.arc(lamp[0], lamp[1]-30, 5, 0, 6.2832); x.fill(); x.fillStyle = '#07040F'; x.fillRect(lamp[0]-2, lamp[1]-30, 4, 30);
      const seated = [[.2,.68,24],[.32,.72,28],[.68,.72,28],[.8,.68,24],[.5,.76,22]]; seated.forEach(([fx,fy,r], i) => { const fade = clamp(local*3 - i*.3, 0, 1); x.fillStyle = `rgba(7,4,15,${fade.toFixed(2)})`; x.beginPath(); x.arc(W*fx, H*fy - r*1.6, r*.5, 0, 6.2832); x.fill(); x.beginPath(); x.ellipse(W*fx, H*fy, r*1.1, r*.7, 0, Math.PI, 0); x.fill(); });
      x.fillStyle = '#07040F'; x.beginPath(); x.arc(W*.5, H*.5, 16, 0, 6.2832); x.fill(); x.beginPath(); x.moveTo(W*.5-16, H*.7); x.lineTo(W*.5-12, H*.53); x.lineTo(W*.5+12, H*.53); x.lineTo(W*.5+16, H*.7); x.closePath(); x.fill();
    } else if (kind === 'together'){
      /* the same house, tonight: the grandmother at the door, you and the little one on the step. On the act, the hands join and the light pours out. */
      const join = acted ? ease3(clamp(local*1.4, 0, 1)) : 0;
      const sk = x.createLinearGradient(0,0,0,H); sk.addColorStop(0,'#0E0824'); sk.addColorStop(1,'#2A1A3E'); x.fillStyle = sk; x.fillRect(0,0,W,H);
      x.fillStyle = 'rgba(255,246,224,.6)'; for (let i = 0; i < 30; i++){ x.beginPath(); x.arc(((i*97)%100)/100*W, ((i*53)%100)/100*H*.35, .8+(i%3)*.5, 0, 6.2832); x.fill(); }
      x.fillStyle = '#1B1236'; x.fillRect(0, H*.3, W, H*.42); for (let i = 0; i < 5; i++){ const ax = W*(.1 + i*.2); x.fillStyle = '#0B0720'; x.beginPath(); x.arc(ax, H*.48, W*.07, Math.PI, 0); x.lineTo(ax+W*.07, H*.72); x.lineTo(ax-W*.07, H*.72); x.closePath(); x.fill(); }
      x.fillStyle = '#2C6BD6'; x.fillRect(W*.43, H*.4, W*.14, H*.32); x.fillStyle = '#FFE7A8'; x.fillRect(W*.43, H*.4, W*.14*(.15 + .85*join), H*.32);
      x.save(); x.globalCompositeOperation = 'lighter'; const dg = x.createRadialGradient(W*.5, H*.62, 0, W*.5, H*.62, W*.55); dg.addColorStop(0,`rgba(255,200,110,${(.15 + .5*join).toFixed(3)})`); dg.addColorStop(1,'rgba(255,200,110,0)'); x.fillStyle = dg; x.fillRect(0,0,W,H); x.restore();
      x.fillStyle = '#100A22'; x.fillRect(0, H*.72, W, H*.28);
      /* three figures: the elder at the door (left), you (centre), the child (right) — they step toward each other */
      const fig = (fx, hgt, cane, small) => { x.fillStyle = '#07040F'; x.beginPath(); x.arc(fx, H*.72-hgt*.86, hgt*.12, 0, 6.2832); x.fill(); roundRect(x, fx-hgt*.13, H*.72-hgt*.72, hgt*.26, hgt*.72, hgt*.08); x.fill(); if (cane) x.fillRect(fx+hgt*.2, H*.72-hgt*.5, 3, hgt*.5); if (small){ x.fillStyle = '#FFF3D6'; x.beginPath(); x.arc(fx+hgt*.3, H*.72-hgt*.9, 5, 0, 6.2832); x.fill(); } };
      const ex = W*(.26 + .1*join), yx = W*.5, cx2 = W*(.74 - .1*join); fig(ex, 150, true, false); fig(yx, 170, false, false); fig(cx2, 100, false, true);
      /* the hands, joining */
      x.strokeStyle = '#07040F'; x.lineWidth = 10; x.lineCap = 'round'; x.beginPath(); x.moveTo(ex+18, H*.72-70); x.lineTo(ex+18 + (yx-24-ex-18)*join, H*.72-70 - 20*join); x.moveTo(cx2-14, H*.72-50); x.lineTo(cx2-14 - (cx2-14-yx-24)*join, H*.72-50 - 30*join); x.stroke();
      if (join > .9){ x.save(); x.globalCompositeOperation = 'lighter'; [[(ex+yx)/2, H*.72-92],[(cx2+yx)/2, H*.72-82]].forEach(([hx,hy]) => { const hg = x.createRadialGradient(hx,hy,0,hx,hy,40); hg.addColorStop(0,'rgba(255,231,168,.9)'); hg.addColorStop(1,'rgba(255,231,168,0)'); x.fillStyle = hg; x.beginPath(); x.arc(hx,hy,40,0,6.2832); x.fill(); }); x.restore(); }
    } else if (kind === 'tv'){
      /* the television, the channel we waited for */
      const tw = W*.56, th = tw*.75, tx = W/2 - tw/2, ty = H*.12; const on = acted && local > .12; const warm = acted ? clamp((local-.12)/.2, 0, 1) : 0;
      x.save(); x.globalCompositeOperation = 'lighter'; const glow = x.createRadialGradient(W/2, ty+th/2, th*.2, W/2, ty+th/2, W*.62); glow.addColorStop(0,`rgba(255,170,90,${(.42*warm).toFixed(3)})`); glow.addColorStop(.5,`rgba(150,80,220,${(.14*warm).toFixed(3)})`); glow.addColorStop(1,'rgba(150,80,220,0)'); x.fillStyle = glow; x.fillRect(0,0,W,H); x.restore();
      x.fillStyle = '#1A1230'; roundRect(x, tx-22, ty-18, tw+44, th+52, 26); x.fill(); x.strokeStyle = 'rgba(255,255,255,.10)'; x.lineWidth = 2; roundRect(x, tx-22, ty-18, tw+44, th+52, 26); x.stroke();
      x.save(); roundRect(x, tx, ty, tw, th, 18); x.clip();
      if (!acted){ x.fillStyle = '#0B0720'; x.fillRect(tx,ty,tw,th); x.fillStyle = 'rgba(255,255,255,.06)'; x.beginPath(); x.arc(tx+tw/2, ty+th/2, 18, 0, 6.2832); x.fill(); }
      else if (!on){ x.drawImage(noise, (time*97)%20, (time*53)%20, 160-20, 120-20, tx, ty, tw, th); x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(tx,ty,tw,th); }
      else {
        const sg = x.createLinearGradient(tx, ty, tx+tw, ty+th); sg.addColorStop(0,'#FF8A3C'); sg.addColorStop(.55,'#B4479A'); sg.addColorStop(1,'#5B3BD6'); x.fillStyle = sg; x.fillRect(tx,ty,tw,th);
        /* stars, a ringed planet, a rocket */
        x.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 26; i++){ x.beginPath(); x.arc(tx + ((i*97)%100)/100*tw, ty + ((i*53)%100)/100*th*.8, .8+(i%3)*.5, 0, 6.2832); x.fill(); }
        const pxp = tx+tw*.7, pyp = ty+th*.36, pr = th*.15; const pg = x.createRadialGradient(pxp-pr*.3,pyp-pr*.3,pr*.1,pxp,pyp,pr); pg.addColorStop(0,'#FFE7A8'); pg.addColorStop(1,'#FF7A3C'); x.fillStyle = pg; x.beginPath(); x.arc(pxp,pyp,pr,0,6.2832); x.fill();
        x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 4; x.beginPath(); x.ellipse(pxp,pyp,pr*1.7,pr*.45,-.35,0,6.2832); x.stroke();
        const rx = tx + tw*(.15 + ((time*.12)%1)*.8), ry = ty + th*.2 - Math.sin(((time*.12)%1)*Math.PI)*th*.1; x.save(); x.translate(rx,ry); x.rotate(-.5); x.fillStyle = '#FFF'; roundRect(x,-8,-18,16,36,7); x.fill(); x.fillStyle = '#FF5A3C'; x.beginPath(); x.moveTo(-8,10); x.lineTo(-16,22); x.lineTo(-8,18); x.closePath(); x.fill(); x.beginPath(); x.moveTo(8,10); x.lineTo(16,22); x.lineTo(8,18); x.closePath(); x.fill(); x.fillStyle = '#FFC148'; x.beginPath(); x.moveTo(-5,18); x.lineTo(0,30+Math.random()*6); x.lineTo(5,18); x.closePath(); x.fill(); x.restore();
        /* the heroes cross the screen as shadows, one after another */
        const kinds = ['sword','ball','robot','wand']; const cyc = (time*.11)%1; const hs = th*.16;
        kinds.forEach((k, i) => { const u = (cyc + i*.25) % 1; const hx = tx + tw*(1.1 - u*1.2); hero(k, hx, ty+th*.86, hs, false); });
        /* the small planets of the afternoon, each its own colour, orbiting */
        ['#FF5A3C','#3FD2C0','#6EC8FF','#FFC148','#B9A3FF','#7CF2B0'].forEach((cc, i) => { const a = time*.35 + i*6.2832/6; const ox = pxp + Math.cos(a)*pr*2.3, oy = pyp + Math.sin(a)*pr*.9; x.fillStyle = cc; x.beginPath(); x.arc(ox, oy, pr*.16, 0, 6.2832); x.fill(); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1.5; x.beginPath(); x.ellipse(ox, oy, pr*.28, pr*.08, -.5, 0, 6.2832); x.stroke(); });
        /* scanlines and the channel bug: كوكب */
        x.fillStyle = 'rgba(0,0,0,.10)'; for (let yy = ty; yy < ty+th; yy += 4) x.fillRect(tx, yy, tw, 1.4);
        x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.arc(tx+tw*.08, ty+th*.1, 9, 0, 6.2832); x.fill(); x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 2; x.beginPath(); x.ellipse(tx+tw*.08, ty+th*.1, 15, 5, -.4, 0, 6.2832); x.stroke();
        x.font = '900 14px Cairo, sans-serif'; x.fillStyle = 'rgba(255,255,255,.9)'; x.textAlign = 'left'; x.direction = 'rtl'; x.fillText('كوكب', tx+tw*.08+22, ty+th*.1+5);
        /* the colour blocks at the foot of the screen, one for each planet of the afternoon */
        
      }
      x.restore();
      x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 3; x.beginPath(); x.moveTo(W/2, ty-18); x.lineTo(W/2-60, ty-80); x.moveTo(W/2, ty-18); x.lineTo(W/2+60, ty-80); x.stroke();
      x.fillStyle = 'rgba(255,255,255,.12)'; x.fillRect(tx+20, ty+th+34, 40, 12); x.fillRect(tx+tw-60, ty+th+34, 40, 12);
      /* the kids' heads in front of the screen, from behind */
      x.fillStyle = '#07040F'; [[.3,1],[.5,1.15],[.7,.95]].forEach(([fx,sc]) => { x.beginPath(); x.arc(W*fx, H*.98, 46*sc, Math.PI, 0); x.fill(); x.beginPath(); x.arc(W*fx, H*.86, 24*sc, 0, 6.2832); x.fill(); });
      const fl = x.createLinearGradient(0, ty+th+60, 0, H); fl.addColorStop(0,`rgba(255,160,100,${(.16*warm).toFixed(3)})`); fl.addColorStop(1,'rgba(255,160,100,0)'); x.fillStyle = fl; x.fillRect(0, ty+th+60, W, H);
    } else if (kind === 'phone'){
      const pw = W*.26, ph = pw*2.05, px = W/2-pw/2, py = H*.08;
      x.save(); x.globalCompositeOperation = 'lighter'; const glow = x.createRadialGradient(W/2, py+ph*.4, 40, W/2, py+ph*.4, W*.5); glow.addColorStop(0,'rgba(140,170,255,.30)'); glow.addColorStop(1,'rgba(140,170,255,0)'); x.fillStyle = glow; x.fillRect(0,0,W,H); x.restore();
      x.fillStyle = '#0D0B1E'; roundRect(x, px-10, py-10, pw+20, ph+20, 40); x.fill(); x.strokeStyle = 'rgba(255,255,255,.14)'; x.lineWidth = 2; roundRect(x, px-10, py-10, pw+20, ph+20, 40); x.stroke();
      const down = acted ? ease3(clamp(local*1.5, 0, 1)) : 0;
      x.save(); roundRect(x, px, py, pw, ph, 32); x.clip(); x.fillStyle = down > .5 ? '#0D0B1E' : '#E9ECF4'; x.fillRect(px,py,pw,ph); if (down > .5){ x.restore(); x.save(); x.globalCompositeOperation = 'lighter'; const al = x.createRadialGradient(W/2, H*.9, 0, W/2, H*.9, W*.7); al.addColorStop(0,`rgba(255,200,110,${(.5*(down-.5)*2).toFixed(3)})`); al.addColorStop(1,'rgba(255,200,110,0)'); x.fillStyle = al; x.fillRect(0,0,W,H); x.restore(); x.save(); roundRect(x, px, py, pw, ph, 32); x.clip(); }
      const off = (time*90) % (ph+200); let yy = py - off; let i = 0;
      while (yy < py+ph+100){ const b = bars[i % bars.length]; x.fillStyle = 'rgba(0,0,0,.08)'; roundRect(x, px+pw*.08, yy, pw*.84, b.h, 10); x.fill(); x.fillStyle = 'rgba(0,0,0,.14)'; roundRect(x, px+pw*.14, yy+10, pw*b.w*.7, 8, 4); x.fill(); roundRect(x, px+pw*.14, yy+24, pw*.5, 6, 3); x.fill();
        /* a heart, and a number nobody remembers */
        x.fillStyle = 'rgba(255,90,60,.7)'; x.beginPath(); x.arc(px+pw*.8, yy+b.h-10, 3, 0, 6.2832); x.arc(px+pw*.8+5, yy+b.h-10, 3, 0, 6.2832); x.fill(); x.beginPath(); x.moveTo(px+pw*.8-3, yy+b.h-9); x.lineTo(px+pw*.8+2.5, yy+b.h-3); x.lineTo(px+pw*.8+8, yy+b.h-9); x.closePath(); x.fill();
        x.fillStyle = 'rgba(0,0,0,.35)'; x.font = '700 7px Inter, sans-serif'; x.textAlign = 'right'; x.direction = 'ltr'; x.fillText(String(b.likes), px+pw*.76, yy+b.h-7);
        yy += b.h + 14; i++; }
      x.restore();
      /* a thumb, scrolling, scrolling */
      const ty2 = py + ph*.7 + Math.sin(time*3)*22; x.fillStyle = 'rgba(255,220,190,.35)'; x.beginPath(); x.ellipse(px+pw*.85, ty2, 16, 24, .3, 0, 6.2832); x.fill();
      /* the room around is dark; other phones glow in it */
      [[.12,.5],[.88,.42],[.2,.86],[.82,.82]].forEach(([fx,fy], i) => { const gg = x.createRadialGradient(W*fx,H*fy,0,W*fx,H*fy,60); gg.addColorStop(0,'rgba(140,170,255,.28)'); gg.addColorStop(1,'rgba(140,170,255,0)'); x.fillStyle = gg; x.beginPath(); x.arc(W*fx,H*fy,60,0,6.2832); x.fill(); x.fillStyle = '#0D0B1E'; roundRect(x, W*fx-9, H*fy-16, 18, 32, 5); x.fill(); x.fillStyle = 'rgba(200,215,255,.7)'; roundRect(x, W*fx-7, H*fy-13, 14, 26, 3); x.fill(); });
    } else {
      /* the light, and everyone in front of it: the child, the youth, the grown-up, the elder */
      const cx = W/2, cy = H*.42, gr = .5 + .5*Math.sin(time*1.3); const R = (acted ? 60 + local*90 : 18) + gr*(acted ? 10 : 3);
      x.save(); x.globalCompositeOperation = 'lighter';
      const glow = x.createRadialGradient(cx,cy,0,cx,cy,R*3.2); glow.addColorStop(0,'rgba(255,248,228,.95)'); glow.addColorStop(.15,'rgba(255,193,72,.55)'); glow.addColorStop(.5,'rgba(255,150,60,.14)'); glow.addColorStop(1,'rgba(255,150,60,0)'); x.fillStyle = glow; x.beginPath(); x.arc(cx,cy,R*3.2,0,6.2832); x.fill();
      x.fillStyle = '#FFF8E6'; x.beginPath(); x.arc(cx,cy,R*.22,0,6.2832); x.fill();
      for (let i = 0; i < 12; i++){ const a = i*Math.PI/6 + time*.05; const lg = x.createLinearGradient(cx,cy,cx+Math.cos(a)*R*3,cy+Math.sin(a)*R*3); lg.addColorStop(0,'rgba(255,231,168,.35)'); lg.addColorStop(1,'rgba(255,231,168,0)'); x.strokeStyle = lg; x.lineWidth = 2; x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+Math.cos(a)*R*3, cy+Math.sin(a)*R*3); x.stroke(); }
      x.restore();
      x.fillStyle = '#07040F'; x.beginPath(); x.moveTo(0,H); x.lineTo(0,H*.86); x.quadraticCurveTo(W*.5,H*.8,W,H*.86); x.lineTo(W,H); x.closePath(); x.fill();
      const people = [[.16,70,'elder'],[.34,120,'adult'],[.5,100,'youth'],[.64,60,'child'],[.8,110,'adult2']];
      people.forEach(([fx,hgt,kind], i) => { const px = W*fx, py = H*.86 + Math.sin(fx*9)*6; const rise = clamp(local*2 - i*.25, 0, 1); x.fillStyle = '#07040F';
        x.beginPath(); x.arc(px, py-hgt*.85*rise, hgt*.12, 0, 6.2832); x.fill(); roundRect(x, px-hgt*.13, py-hgt*.72*rise, hgt*.26, hgt*.72*rise, hgt*.08); x.fill();
        if (kind === 'elder'){ x.fillRect(px+hgt*.2, py-hgt*.5*rise, 3, hgt*.5*rise); } if (kind === 'child' && rise > .8){ x.fillStyle = '#FFF3D6'; x.beginPath(); x.arc(px+hgt*.35, py-hgt*.9, 6, 0, 6.2832); x.fill(); } });
      /* hands raised: the elder and the child reach toward the light */
      if (local > .5){ x.save(); x.globalCompositeOperation = 'lighter'; const pg = x.createRadialGradient(W*.5, H*.86, 0, W*.5, H*.86, W*.5); pg.addColorStop(0,'rgba(255,193,72,.25)'); pg.addColorStop(1,'rgba(255,193,72,0)'); x.fillStyle = pg; x.fillRect(0,0,W,H); x.restore(); }
    }
    x.restore();
  }
  /* the reel: each scene plays for DUR ms, then the next. Tap the sides, swipe, or use the arrows. Pauses off screen. */
  const DUR = 2600, reel = $('#reel'); let sceneT0 = performance.now(), paused = true, acted = false;
  const HINTS = ['h1','h2','h3','h4','h5'];
  const TAP_AT = [[50, 82], [50, 55], [50, 33], [50, 36], [50, 42]];
  function paintHint(){ const el = $('#sceneHint'); if (el) el.textContent = t('story.' + HINTS[scene]); const tm = $('#tapMark'); if (tm){ tm.style.left = TAP_AT[scene][0] + '%'; tm.style.top = TAP_AT[scene][1] + '%'; } st.classList.toggle('acted', acted); const nb = $('#sceneNextBtn'); if (nb) nb.setAttribute('aria-disabled', String(!(acted && local >= .8))); }
  function act(){ if (acted) return; acted = true; sceneT0 = performance.now(); paintHint(); reel.classList.add('told'); if (reduced){ sceneT0 = performance.now() - DUR - 1; draw(performance.now()); paintHint(); } }
  function go(idx, why){ if (idx >= 5){ markStep('story'); if (why === 'auto') return; } if (idx < 0) idx = 0; scene = idx % 5; sceneIdx = scene; sceneT0 = performance.now(); local = 0; acted = false; paintHint();
    reel.classList.remove('on'); st.classList.add('switching'); setTimeout(() => { paintScene(false); reel.classList.add('on'); st.classList.remove('switching'); }, 160);
    if (why === 'tap') st.classList.remove('fresh'); if (reduced) draw(performance.now()); }
  function tick(now){ if (paused) return; const was = local; local = acted ? clamp((now - sceneT0) / DUR, 0, 1) : 0; if (was < .8 && local >= .8) paintHint();
    [1,2,3,4,5].forEach(i => { const b = $('#fp'+i); if (b) b.style.width = (i-1 < scene ? 100 : i-1 === scene ? local*100 : 0) + '%'; });
    if (local >= 1 && scene === 4) markStep('story'); }
  const origDraw = draw; draw = function(now){ tick(now); origDraw(now); };
  const rtl = () => document.documentElement.dir === 'rtl';
  const nextScene = () => { if (!acted) { act(); return; } if (local < .8){ sceneT0 = performance.now() - DUR - 1; return; } if (scene === 4){ markStep('story'); go(0, 'tap'); } else go(scene + 1, 'tap'); };
  $('#sceneNext').onclick = act; $('#scenePrev').onclick = act;
  st.addEventListener('click', act); st.addEventListener('pointerup', (e) => { if (e.pointerType === 'touch') act(); }, { passive:true }); set('#sceneNextBtn','onclick', nextScene); set('#sceneReplay','onclick', () => { go(0, 'tap'); });
  window.__reelRestart = () => { paused = true; go(0, 'tap'); setLive(true); };
  st.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') act(); });
  let sx0 = null; st.addEventListener('pointerdown', (e) => { sx0 = e.clientX; }, { passive:true }); st.addEventListener('pointerup', (e) => { if (sx0 == null) return; const dx = e.clientX - sx0; sx0 = null; if (Math.abs(dx) > 40 && acted && local >= .8) go(scene + (dx < 0 ? 1 : -1) * (rtl() ? -1 : 1), 'tap'); });
  st.classList.add('fresh'); st.tabIndex = 0;
  let reelLoop = false;
  function setLive(v){ if (v && paused){ paused = false; live = true; sceneT0 = performance.now() - local*DUR; if (!reduced){ if (!reelLoop){ reelLoop = true; loop((now) => { if (live) draw(now); }); } } else draw(performance.now()); } if (!v){ paused = true; live = false; } }
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => setLive(e.isIntersecting)), { threshold:.35 }).observe(st); else setLive(true);
  sceneIdx = 0; paintScene(true); reel.classList.add('on'); paintHint(); draw(performance.now());
})();


/* ═══════════════════════════════════════════════════════════════════
   THE MAP — the engine, unchanged; a passive mode and accessors added
   ═══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════
   THE MAP
   Real ADM1 boundaries, a blue-noise field of unlit points inside them,
   and one point that is yours. Kept from the previous page on purpose —
   it is the part that already worked.
   ═══════════════════════════════════════════════════════════════════ */
const GOVS_GEO = window.TUNISIA;
const GOV_GEO  = window.PLACES.map(p => [p[1], p[2], p[2], p[3], p[4]]);
const DELEGS   = Object.fromEntries(window.PLACES.map(p => [p[1], p[5]]));
const GOV_BY_KEY = Object.fromEntries(window.PLACES.map(p => [p[0], p[1]]));
const govName = (g) => lang === 'ar' ? g[0] : lang === 'fr' ? g[1] : g[2];

const LON0 = 7.3, LON1 = 11.75, LAT0 = 30.0, LAT1 = 37.55;
let _s = 20260913;
const rnd = () => (_s = (_s * 1664525 + 1013904223) % 4294967296) / 4294967296;

const GLOW_SPRITE = (() => { const oc = document.createElement('canvas'); oc.width = oc.height = 64; const o = oc.getContext('2d'); const g = o.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'rgba(255,248,230,1)'); g.addColorStop(.12,'rgba(255,225,150,.9)'); g.addColorStop(.3,'rgba(255,193,72,.35)'); g.addColorStop(.6,'rgba(255,170,60,.08)'); g.addColorStop(1,'rgba(255,170,60,0)'); o.fillStyle = g; o.fillRect(0,0,64,64); return oc; })();
/* the galaxy behind the pulled-back country: a tilted band with a dark dust lane, thousands of
   points in three sizes, a few soft far galaxies. Painted once; faded in with the pull-back. */
function paintGalaxy(g, W, H){ const rg = seeded(777); g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 900; i++){ g.fillStyle = `rgba(255,246,224,${(.15+rg()*.5).toFixed(3)})`; const r = rg() < .1 ? 1.3 : .7; g.beginPath(); g.arc(rg()*W, rg()*H, r, 0, 6.2832); g.fill(); }
  g.translate(W/2, H/2); g.rotate(-.6);
  const band = g.createLinearGradient(0,-H*.26,0,H*.26); band.addColorStop(0,'rgba(120,90,220,0)'); band.addColorStop(.3,'rgba(150,120,255,.14)'); band.addColorStop(.5,'rgba(255,235,210,.26)'); band.addColorStop(.7,'rgba(150,120,255,.14)'); band.addColorStop(1,'rgba(120,90,220,0)'); g.fillStyle = band; g.fillRect(-W*1.2, -H*.26, W*2.4, H*.52);
  for (let i = 0; i < 2600; i++){ const gx = (rg()-.5)*W*2.4; const spread = .5 + .5*Math.cos(gx/(W*1.2)*Math.PI); const gy = (rg()+rg()+rg()-1.5)*H*.2*spread; const a = .15 + rg()*.55; g.fillStyle = `rgba(255,246,224,${a.toFixed(3)})`; const r = rg() < .06 ? 1.4 : .8; g.beginPath(); g.arc(gx, gy, r, 0, 6.2832); g.fill(); }
  g.globalCompositeOperation = 'source-over'; const dust = g.createLinearGradient(0,-H*.04,0,H*.05); dust.addColorStop(0,'rgba(6,3,15,0)'); dust.addColorStop(.5,'rgba(6,3,15,.42)'); dust.addColorStop(1,'rgba(6,3,15,0)'); g.fillStyle = dust; for (let k = 0; k < 6; k++){ g.save(); g.translate(k*W*.36 - W*.9, Math.sin(k*1.7)*H*.02); g.rotate(Math.sin(k)*.08); g.fillRect(-W*.3, -H*.05, W*.6, H*.1); g.restore(); }
  g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++){ const gx = (rg()-.5)*W*1.6, gy = (rg()-.5)*H*1.2; g.save(); g.translate(gx, gy); g.rotate(rg()*3); g.scale(1, .35); const gg = g.createRadialGradient(0,0,0,0,0,40+rg()*30); gg.addColorStop(0,'rgba(255,230,200,.5)'); gg.addColorStop(.4,'rgba(200,170,255,.18)'); gg.addColorStop(1,'rgba(200,170,255,0)'); g.fillStyle = gg; g.beginPath(); g.arc(0,0,70,0,6.2832); g.fill(); g.restore(); }
  g.restore(); }
function makeMap(canvas, tip, opts){
  opts = opts || {}; let dotsHidden = false;
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, shapes = [], slots = [], lit = 0, target = 0;
  let mine = null, mineName = '', minePt = null;
  let hover = -1, t0 = performance.now();
  let litSet = null, zoom = 1, zoomTarget = 1, galaxy = null, unlitC = null, unlitKey = '';         // the ripple's override + the pull-back

  function project(lo, la, w, h){
    const pad = .05;
    const s = Math.min(w * (1 - pad * 2) / (LON1 - LON0), h * (1 - pad * 2) / (LAT1 - LAT0));
    const ox = (w - (LON1 - LON0) * s) / 2, oy = (h - (LAT1 - LAT0) * s) / 2;
    return [ox + (lo - LON0) * s, oy + (LAT1 - la) * s];
  }
  function inRing(r, x, y){
    let hit = false;
    for (let i = 0, j = r.length - 1; i < r.length; j = i++){
      const xi = r[i][0], yi = r[i][1], xj = r[j][0], yj = r[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) hit = !hit;
    }
    return hit;
  }
  const inGov = (g, x, y) => g.rings.some(r => inRing(r, x, y));
  function govAt(x, y){
    for (let i = 0; i < shapes.length; i++) if (inGov(shapes[i], x, y)) return i;
    return -1;
  }
  /* Placing 600 dots by testing each dart against every polygon cost ~1.5 s of
     boot on a laptop and 6 s on a mid phone. The country is rasterised once
     instead; inside() is then a byte lookup. govAt() stays exact for hover. */
  let mask = null, mW = 0, mH = 0;
  function buildMask(){
    mW = Math.ceil(W); mH = Math.ceil(H);
    const m = document.createElement('canvas'); m.width = mW; m.height = mH;
    const g = m.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#fff';
    for (const s of shapes){ g.beginPath(); for (const r of s.rings){ g.moveTo(r[0][0], r[0][1]); for (let k = 1; k < r.length; k++) g.lineTo(r[k][0], r[k][1]); g.closePath(); } g.fill(); }
    mask = g.getImageData(0, 0, mW, mH).data;
  }
  const inside = (x, y) => {
    if (!mask) return govAt(x, y) >= 0;
    const xi = x | 0, yi = y | 0;
    return xi >= 0 && yi >= 0 && xi < mW && yi < mH && mask[(yi * mW + xi) * 4 + 3] > 250;
  };
  const insideBy = (x, y, m) =>
    inside(x, y) && inside(x + m, y) && inside(x - m, y) && inside(x, y + m) && inside(x, y - m);

  function build(){
    const d = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = Math.max(240, r.width); H = Math.max(320, r.height);
    canvas.width = W * d; canvas.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);

    shapes = GOVS_GEO.map(g => ({
      k:g.k, ar:g.ar, fr:g.fr, en:g.en,
      rings: g.r.map(ring => ring.map(c => project(c[0], c[1], W, H))),
    }));
    shapes.forEach(g => {
      let sx = 0, sy = 0, n = 0;
      g.rings[0].forEach(p => { sx += p[0]; sy += p[1]; n++; });
      g.c = [sx / n, sy / n];
    });
    buildMask();

    _s = 20260913;
    slots = [];
    const want = Math.max(240, Math.min(620, Math.round(W * H / 240)));
    let sep = Math.sqrt((W * H * .42) / want) * .92;

    /* Seed every ring individually FIRST. جربة and قرقنة are a rounding
       error of the country's bounding box, so darts thrown at the whole
       map almost never land on them — they used to sit there as empty
       outlines while the mainland filled up, which reads as a bug. */
    const ringPts = (ring, n, margin) => {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const p of ring){
        if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
        if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
      }
      let placed = 0, tries = 0;
      while (placed < n && tries < 4000){
        tries++;
        const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
        if (!inRing(ring, x, y)) continue;
        if (margin && !(inRing(ring, x + margin, y) && inRing(ring, x - margin, y)
                     && inRing(ring, x, y + margin) && inRing(ring, x, y - margin))) continue;
        let ok = true; const s2 = sep * .5;
        for (const p of slots){ if ((p[0]-x)**2 + (p[1]-y)**2 < s2*s2){ ok = false; break; } }
        if (ok){ slots.push([x, y]); placed++; }
      }
    };
    shapes.forEach(g => g.rings.forEach((ring, i) => {
      ringPts(ring, i === 0 ? 4 : 3, i === 0 ? Math.max(1.4, W * .011) : 0.8);
    }));

    let tries = 0;
    while (slots.length < want && tries < 90000){
      tries++;
      const x = rnd() * W, y = rnd() * H;
      if (!insideBy(x, y, Math.max(1.4, W * .011))) continue;
      let ok = true;
      for (const p of slots){ if ((p[0]-x)**2 + (p[1]-y)**2 < sep*sep){ ok = false; break; } }
      if (ok) slots.push([x, y]);
      if (tries % 2200 === 0) sep *= .94;
    }
    for (let i = slots.length - 1; i > 0; i--){
      const j = Math.floor(rnd() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    if (mineName) placeMine();
  }

  function placeMine(){
    const g = GOV_GEO.find(g => g[0] === mineName);
    const c = minePt || (g ? [g[3], g[4]] : null);
    if (c && W) mine = project(c[0], c[1], W, H);
  }

  function govPath(g){
    ctx.beginPath();
    for (const r of g.rings){
      ctx.moveTo(r[0][0], r[0][1]);
      for (let i = 1; i < r.length; i++) ctx.lineTo(r[i][0], r[i][1]);
      ctx.closePath();
    }
  }

  function draw(now){
    const time = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    zoom += (zoomTarget - zoom) * .045;
    /* pulled back: the country shrinks and a field of other lights
       appears around it — a light in a vast world, but not alone */
    if (zoom < .98){
      const far = 1 - zoom;
      const r = seeded(4242);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      if (!galaxy || galaxy.width !== canvas.width){ galaxy = document.createElement('canvas'); galaxy.width = canvas.width; galaxy.height = canvas.height; const gx = galaxy.getContext('2d'); const d = canvas.width / W; gx.setTransform(d,0,0,d,0,0); paintGalaxy(gx, W, H); }
      ctx.globalAlpha = far; ctx.drawImage(galaxy, 0, 0, W, H); ctx.globalAlpha = 1;
      if (false){ /* the old per-frame band, kept off */
      ctx.save(); ctx.translate(W/2, H/2); ctx.rotate(-.55); const mw = ctx.createLinearGradient(0,-H*.22,0,H*.22); mw.addColorStop(0,'rgba(120,90,220,0)'); mw.addColorStop(.35,`rgba(150,120,255,${(far*.16).toFixed(3)})`); mw.addColorStop(.5,`rgba(255,235,210,${(far*.22).toFixed(3)})`); mw.addColorStop(.65,`rgba(150,120,255,${(far*.16).toFixed(3)})`); mw.addColorStop(1,'rgba(120,90,220,0)'); ctx.fillStyle = mw; ctx.fillRect(-W, -H*.22, W*2, H*.44);
      const rg = seeded(777); for (let i = 0; i < 700; i++){ const gx = (rg()-.5)*W*2, gy = (rg()-.5)*H*.3*(1-Math.abs(gx)/(W*1.1))*2; ctx.fillStyle = `rgba(255,246,224,${(far*(.15+rg()*.45)).toFixed(3)})`; ctx.fillRect(gx, gy, .9, .9); }
      for (let i = 0; i < 5; i++){ const gx = (rg()-.5)*W*1.6, gy = (rg()-.5)*H*1.2; const gg = ctx.createRadialGradient(gx,gy,0,gx,gy,14+rg()*18); gg.addColorStop(0,`rgba(255,220,180,${(far*.35).toFixed(3)})`); gg.addColorStop(1,'rgba(255,220,180,0)'); ctx.fillStyle = gg; ctx.save(); ctx.rotate(rg()*3); ctx.scale(1, .4); ctx.beginPath(); ctx.arc(gx, gy/.4, 32, 0, 6.2832); ctx.fill(); ctx.restore(); }
      ctx.restore(); }
      for (let i = 0; i < 260; i++){
        const sx = r() * W, sy = r() * H, s = r();
        const tw = .5 + .5 * Math.sin(time * (1 + s) + i);
        ctx.fillStyle = `rgba(255,246,224,${(far * tw * (.25 + s * .5)).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(sx, sy, .6 + s * 1.6, 0, 6.2832); ctx.fill();
      }
      ctx.restore();
    }
    ctx.save();
    ctx.translate(W/2, H/2); ctx.scale(zoom, zoom); ctx.translate(-W/2, -H/2);

    // a violet pool under the country, so it reads as lit from within
    const glow = ctx.createRadialGradient(W*.5, H*.46, 10, W*.5, H*.46, Math.min(W,H)*.60);
    glow.addColorStop(0,   'rgba(109,74,224,.30)');
    glow.addColorStop(.5,  'rgba(109,74,224,.10)');
    glow.addColorStop(1,   'rgba(109,74,224,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    shapes.forEach((g, i) => {
      govPath(g);
      ctx.fillStyle = i === hover ? 'rgba(255,193,72,.26)' : 'rgba(169,140,255,.10)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(169,140,255,.34)'; ctx.lineWidth = 1; ctx.stroke();
    });
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(214,200,255,.85)';
    shapes.forEach(g => { govPath(g); ctx.stroke(); });

    lit += (target - lit) * .06;
    const n = Math.min(slots.length, Math.round(lit));
    const isLit = (i) => litSet ? litSet.has(i) : i < n;
    const key = (litSet ? 's' + litSet.size : 'n' + n) + '|' + dotsHidden + '|' + canvas.width;
    if (key !== unlitKey){ unlitKey = key; if (!unlitC) unlitC = document.createElement('canvas'); unlitC.width = canvas.width; unlitC.height = canvas.height; const u = unlitC.getContext('2d'); const d = canvas.width / W; u.setTransform(d,0,0,d,0,0); u.fillStyle = 'rgba(214,200,255,.22)';
      for (let i = 0; i < slots.length; i++){ if (isLit(i) || dotsHidden) continue; u.beginPath(); u.arc(slots[i][0], slots[i][1], 1.4, 0, 6.2832); u.fill(); } }
    ctx.drawImage(unlitC, 0, 0, W, H);
    // lit points are additive — that is what makes them read as light
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < slots.length; i++){
      if (!isLit(i) || dotsHidden) continue;
      const p = slots[i];
      const a = .75 + .25 * Math.sin(time * (1 + (i % 7) * .3) + i); const sz = 14 + (i % 5) * 2.5;
      ctx.globalAlpha = a; ctx.drawImage(GLOW_SPRITE, p[0] - sz/2, p[1] - sz/2, sz, sz);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    if (mine){
      const pulse = .7 + .3 * Math.sin(time * 2.4);
      ctx.globalCompositeOperation = 'lighter';
      const mg = ctx.createRadialGradient(mine[0], mine[1], 0, mine[0], mine[1], 34 * pulse);
      mg.addColorStop(0,   'rgba(255,246,220,.95)');
      mg.addColorStop(.32, 'rgba(255,193,72,.45)');
      mg.addColorStop(1,   'rgba(255,149,0,0)');
      ctx.fillStyle = mg;
      ctx.beginPath(); ctx.arc(mine[0], mine[1], 34 * pulse, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#FFF8E6';
      ctx.beginPath(); ctx.arc(mine[0], mine[1], 3.6, 0, 6.2832); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255,193,72,.75)'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(mine[0], mine[1], 13 + 5 * pulse, 0, 6.2832); ctx.stroke();
      if (userName){
        ctx.font = '900 13px Cairo, Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.direction = 'ltr';
        ctx.fillStyle = 'rgba(6,3,15,.75)';
        const w = ctx.measureText(userName).width;
        roundRect(ctx, mine[0] - w/2 - 9, mine[1] - 42, w + 18, 22, 11); ctx.fill();
        ctx.fillStyle = '#FFE7A8';
        ctx.fillText(userName, mine[0], mine[1] - 26);
      }
    }
    ctx.restore();
    /* pulled all the way back: your light is the brightest thing in the galaxy */
    if (zoom < .7 && mine){ const far = 1 - zoom/.7; const sx = W/2 + (mine[0]-W/2)*zoom, sy = H/2 + (mine[1]-H/2)*zoom; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pulse = .85 + .15*Math.sin(time*2.4);
      const R = (30 + far*70)*pulse; const bg = ctx.createRadialGradient(sx,sy,0,sx,sy,R); bg.addColorStop(0,'rgba(255,255,255,.98)'); bg.addColorStop(.18,'rgba(255,240,200,.85)'); bg.addColorStop(.45,'rgba(255,193,72,.35)'); bg.addColorStop(1,'rgba(255,193,72,0)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(sx,sy,R,0,6.2832); ctx.fill();
      for (let i = 0; i < 12; i++){ const a = i*Math.PI/6 + time*.08; const len = R*(1.6 + .5*Math.sin(time*3+i)); const rg2 = ctx.createLinearGradient(sx,sy,sx+Math.cos(a)*len,sy+Math.sin(a)*len); rg2.addColorStop(0,`rgba(255,240,200,${(far*.45).toFixed(3)})`); rg2.addColorStop(1,'rgba(255,240,200,0)'); ctx.strokeStyle = rg2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(sx+Math.cos(a)*len, sy+Math.sin(a)*len); ctx.stroke(); }
      ctx.restore(); }
  }

  /* your house → your neighbours → your معتمدية → your ولاية → the country
     → pulled back into a vast world → and not alone. `cb(stage)` lets the
     page put a word on each stage. */
  async function ripple(cb){
    if (!mine) return;
    const order = slots.map((p, i) => [i, (p[0]-mine[0])**2 + (p[1]-mine[1])**2]).sort((u, v) => u[1] - v[1]).map(u => u[0]);
    const myGov = govAt(mine[0], mine[1]);
    const inGov = order.filter(i => govAt(slots[i][0], slots[i][1]) === myGov);
    const wait = (ms) => new Promise(r => setTimeout(r, reduced ? 80 : ms));
    litSet = new Set();
    await cb(0); await wait(1150);
    order.slice(0, 8).forEach(i => litSet.add(i));   await cb(1); await wait(1150);
    order.slice(0, 40).forEach(i => litSet.add(i));  await cb(2); await wait(1150);
    inGov.forEach(i => litSet.add(i));               await cb(3); await wait(1250);
    slots.forEach((_, i) => litSet.add(i));          await cb(4); await wait(1500);
    zoomTarget = .16;                                await cb(5); await wait(2600);
    await cb(6);                                     await wait(1400);
    zoomTarget = 1;                                  await wait(1400);
    litSet = null;
  }

  function pos(e){
    const r = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return [p.clientX - r.left, p.clientY - r.top];
  }
  if (!opts.passive) canvas.addEventListener('pointermove', (e) => {
    const [x, y] = pos(e);
    hover = govAt(x, y);
    if (hover >= 0){
      const g = shapes[hover];
      tip.textContent = lang === 'ar' ? g.ar : lang === 'fr' ? g.fr : g.en;
      tip.style.left = g.c[0] + 'px'; tip.style.top = g.c[1] + 'px';
      tip.classList.add('on'); canvas.style.cursor = 'pointer';
    } else { tip.classList.remove('on'); canvas.style.cursor = 'default'; }
    if (reduced) draw(performance.now());
  });
  if (!opts.passive) canvas.addEventListener('pointerleave', () => { hover = -1; tip.classList.remove('on'); });
  if (!opts.passive) canvas.addEventListener('click', (e) => {
    const [x, y] = pos(e);
    const i = govAt(x, y);
    if (i >= 0){ const ar = GOV_BY_KEY[shapes[i].k]; if (ar) pickGov(ar); }
  });

  build();
  let mapLive = false; whenVisible(canvas, () => { if (!mapLive){ mapLive = true; if (!reduced) loop((now) => { if (mapLive) draw(now); }); } }, () => { mapLive = false; });
  if (reduced){ lit = target; draw(performance.now()); }
  let rt;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { build(); if (reduced) draw(performance.now()); }, 200);
  });

  return {
    ripple,
    slots(){ return slots; },
    mine(){ return mine; },
    setLitSet(s){ litSet = s; if (reduced) draw(performance.now()); },
    hideDots(v){ dotsHidden = !!v; if (reduced) draw(performance.now()); },
    live(v){ mapLive = !!v; },
    setCount(v){ target = Math.max(1, v); if (reduced){ lit = target; draw(performance.now()); } },
    setMine(arName, lonlat){
      mineName = arName; minePt = lonlat || null;
      if (!arName){ mine = null; return; }
      placeMine();
      if (reduced) draw(performance.now());
    },
  };
}
const tmap = makeMap($('#mapCanvas'), $('#mapTip'));


let currentGov = '', currentDeleg = '';
const govRow = (ar) => GOV_GEO.find(g => g[0] === ar);
const govLabel = (ar, l) => { const g = govRow(ar); return !g ? ar : (l||lang) === 'ar' ? g[0] : (l||lang) === 'fr' ? g[1] : g[2]; };
const delegLabel = (gov, name, l) => { const d = (DELEGS[gov] || []).find(x => x[0] === name); return !d ? name : (l||lang) === 'ar' ? d[0] : d[1]; };
function pickGov(arName, keepDeleg){ currentGov = arName; if (!keepDeleg) currentDeleg = ''; tmap.setMine(arName, null); localStorage.setItem('yalla.gov', arName); paintChosen(); drawCards(); if (window.__rippleEnable) window.__rippleEnable(); }
function pickDeleg(name){ currentDeleg = name; localStorage.setItem('yalla.deleg', name); const d = (DELEGS[currentGov] || []).find(x => x[0] === name); tmap.setMine(currentGov, d ? [d[2], d[3]] : null); paintChosen(); drawCards(); }
function clearPlace(){ currentGov = ''; currentDeleg = ''; localStorage.removeItem('yalla.gov'); localStorage.removeItem('yalla.deleg'); tmap.setMine('', null); paintChosen(); drawCards(); if (window.__rippleEnable) window.__rippleEnable(); const i = $('#placeInput'); if (i){ i.value = ''; i.focus(); } }
function placeLabel(cl){ if (!currentGov) return ''; const gn = govLabel(currentGov, cl); if (!currentDeleg) return gn; return `${delegLabel(currentGov, currentDeleg, cl)} · ${gn}`; }
function paintChosen(){ const box = $('#chosen'); if (!box) return; box.classList.toggle('on', !!currentGov); set('#chosenName','textContent', placeLabel(lang)); const pk = $('#picker'); if (pk) pk.classList.toggle('has', !!currentGov);
  const dl = $('#delegs'); if (dl){ $$('button', dl).forEach(b => b.remove()); const list = currentGov ? (DELEGS[currentGov] || []) : []; dl.hidden = !list.length;
    list.forEach(d => { const b = document.createElement('button'); b.type = 'button'; b.textContent = delegLabel(currentGov, d[0], lang); b.setAttribute('aria-pressed', String(d[0] === currentDeleg)); b.onclick = () => { pickDeleg(d[0]); }; dl.appendChild(b); }); } }

/* the picker: one field that knows every governorate and delegation */
const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[ً-ْ]/g,'').replace(/[-'’]/g,' ').trim();
let PLACE_INDEX = null;
function placeIndex(){ if (PLACE_INDEX) return PLACE_INDEX; const out = [];
  GOV_GEO.forEach(g => out.push({ gov:g[0], deleg:'', keys:[g[0],g[1],g[2]].map(norm), label:{ ar:g[0], fr:g[1], en:g[2] } }));
  Object.entries(DELEGS).forEach(([gov, list]) => list.forEach(d => out.push({ gov, deleg:d[0], keys:[d[0], d[1]].map(norm), label:{ ar:d[0], fr:d[1], en:d[1] } })));
  return (PLACE_INDEX = out); }
function searchPlaces(q){ const n = norm(q); if (!n) return []; const idx = placeIndex(); const starts = [], has = [];
  for (const p of idx){ if (p.keys.some(k => k.startsWith(n))) starts.push(p); else if (p.keys.some(k => k.includes(n))) has.push(p); if (starts.length > 30) break; }
  return [...starts, ...has].slice(0, 7); }
function choosePlace(p){ if (p.deleg){ currentDeleg = p.deleg; pickGov(p.gov, true); pickDeleg(p.deleg); } else pickGov(p.gov); const i = $('#placeInput'); if (i){ i.value = ''; i.blur(); } $('#sugg').hidden = true;
  if (innerWidth < 920) $('.mapbox').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block:'center' }); }
function buildQuick(){ const box = $('#quick'); if (!box) return; $$('button', box).forEach(b => b.remove()); (window.PLACES || []).map(p => p[1]).forEach(ar => { if (!govRow(ar)) return; const b = document.createElement('button'); b.type = 'button'; b.textContent = govLabel(ar); b.onclick = () => choosePlace({ gov:ar, deleg:'' }); box.appendChild(b); }); }
(function picker(){ const input = $('#placeInput'), sugg = $('#sugg'); if (!input) return; let hot = -1, items = [];
  function render(){ sugg.innerHTML = ''; if (!input.value.trim()){ sugg.hidden = true; return; }
    if (!items.length){ sugg.innerHTML = `<div class="none">${esc(t('map.noHit'))}</div>`; sugg.hidden = false; return; }
    items.forEach((p, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role','option'); b.className = i === hot ? 'hot' : ''; const l = p.label[lang] || p.label.ar; b.innerHTML = `<span>${esc(l)}</span><small>${esc(p.deleg ? govLabel(p.gov) : t('map.govWord'))}</small>`; b.onmousedown = (e) => { e.preventDefault(); choosePlace(p); }; sugg.appendChild(b); }); sugg.hidden = false; }
  input.addEventListener('input', () => { items = searchPlaces(input.value); hot = items.length ? 0 : -1; render(); });
  input.addEventListener('focus', () => { if (input.value.trim()){ items = searchPlaces(input.value); render(); } });
  input.addEventListener('blur', () => setTimeout(() => { sugg.hidden = true; }, 120));
  input.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown'){ e.preventDefault(); hot = Math.min(items.length-1, hot+1); render(); } else if (e.key === 'ArrowUp'){ e.preventDefault(); hot = Math.max(0, hot-1); render(); } else if (e.key === 'Enter'){ e.preventDefault(); if (items[hot]) choosePlace(items[hot]); } else if (e.key === 'Escape'){ sugg.hidden = true; } });
  set('#changePlace', 'onclick', clearPlace);
  const saved = localStorage.getItem('yalla.gov'); if (saved && DELEGS[saved]){ currentDeleg = localStorage.getItem('yalla.deleg') || ''; pickGov(saved, true); if (currentDeleg) pickDeleg(currentDeleg); }
})();

(function rippleUI(){
  const btn = $('#rippleBtn'), word = $('#rippleWord'), endEl = $('#rippleEnd'); if (!btn) return;
  const enable = () => { btn.disabled = !currentGov; }; window.__rippleEnable = enable; enable();
  btn.onclick = async () => { btn.disabled = true; endEl.textContent = '';
    $('.mapbox').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block:'center' }); await sleep(reduced ? 50 : 700);
    const say = (k) => { word.classList.remove('on'); setTimeout(() => { word.textContent = t(k); word.classList.add('on'); }, 120); };
    await tmap.ripple(async (stage) => { say('map.r' + stage); });
    endEl.textContent = t('map.end'); btn.disabled = false; set('#rippleBtn span','textContent', t('map.again')); markStep('place'); };
})();

/* the gathering: a number inside a ring of lights, each one shining its own way */
let lightNo = 0;
(function ring(){ const cv = $('#ringCanvas'); if (!cv) return; const x = cv.getContext('2d'); let t0 = performance.now(), n = 0, extra = 0, flash = 0;
  const kinds = seeded(31); const styles = []; for (let i = 0; i < 64; i++) styles.push({ r: 2 + kinds()*2.4, hue: kinds() < .7 ? '255,205,120' : kinds() < .5 ? '169,140,255' : '63,210,192', sp: .6 + kinds()*2, ph: kinds()*6.28, blinky: kinds() < .2 });
  function draw(now){ const time = (now-t0)/1000; x.clearRect(0,0,300,300); const shown = Math.min(64, Math.max(6, Math.round(Math.log2(Math.max(2, n)) * 6))) ;
    x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < shown; i++){ const s = styles[i]; const a = i/shown*6.2832 - Math.PI/2 + (reduced ? 0 : time*.04); const R = 128 + Math.sin(time*s.sp+s.ph)*4; const px = 150+Math.cos(a)*R, py = 150+Math.sin(a)*R;
      let tw = reduced ? 1 : s.blinky ? (Math.sin(time*s.sp*3+s.ph) > .3 ? 1 : .25) : .6 + .4*Math.sin(time*s.sp+s.ph); if (i === shown-1 && flash > 0) tw = 1.5;
      glowDot(x, px, py, s.r*4.5, `rgba(255,248,228,A)`, `rgba(${s.hue},A)`, .9*tw); }
    if (flash > 0) flash -= .02;
    x.globalCompositeOperation = 'source-over'; }
  let ringLive = false; whenVisible(cv, () => { if (!ringLive){ ringLive = true; if (!reduced) loop((now) => { if (ringLive) draw(now); }); } }, () => { ringLive = false; });
  window.__ringSet = (v) => { n = v; if (reduced) draw(performance.now()); };
  window.__ringPlus = () => { n++; extra++; flash = 1; const p = $('#plusOne'); if (p){ p.classList.remove('go'); void p.offsetWidth; p.classList.add('go'); } set('#counterNum','textContent', fmt(n)); set('#gatherLive','textContent', t('map.plus')); setTimeout(() => set('#gatherLive','textContent',''), 2400); };
  if (reduced) draw(performance.now());
})();
(async function counter(){ const numEl = $('#counterNum'); if (!numEl) return; let n = null;
  /* a person is counted once: after the first visit this browser only reads the number */
  const seen = localStorage.getItem('yalla.seen') === '1' || PREVIEW; const build0 = CONFIG.counterProviders[0]; const readOnly = (ns, k) => build0(ns, k).replace('/hit/', '/get/');
  for (const build of (seen ? [readOnly] : CONFIG.counterProviders)){ try { const ac = new AbortController(); const bail = setTimeout(() => ac.abort(), 2500); const res = await fetch(build(CONFIG.counterNamespace, CONFIG.counterKey), { cache:'no-store', signal:ac.signal }); clearTimeout(bail);
    if (!res.ok) continue; const j = await res.json(); const v = j.value ?? j.count ?? (j.data && (j.data.up_count ?? j.data.value)); if (typeof v === 'number' && v > 0){ n = v; break; } } catch(_){} }
  if (n === null){ n = Math.max(1, +(localStorage.getItem('yalla.localVisits')||0)+1); localStorage.setItem('yalla.localVisits', n); }
  localStorage.setItem('yalla.seen', '1'); lightNo = n; tmap.setCount(n); if (window.__ringSet) window.__ringSet(n); drawCards();
  if (reduced){ numEl.textContent = fmt(n); return; }
  const to = n; let cur = Math.max(0, to - Math.min(to, 60)); (function tick(){ cur += Math.max(1, Math.ceil((to-cur)/8)); if (cur >= to){ numEl.textContent = fmt(to); return; } numEl.textContent = fmt(cur); requestAnimationFrame(tick); })();
  /* now and then, one more arrives — the page feels attended */
  (function later(){ setTimeout(() => { if (document.visibilityState === 'visible' && window.__ringPlus){ window.__ringPlus(); lightNo++; tmap.setCount(lightNo); } later(); }, 14000 + Math.random()*22000); })();
})();


/* ═══════════════════════════════════════════════════════════════════
   ONE DAY WITH YALLA — notifications arrive, you decide, it shows
   what happened. Every choice has its own answer; the radar in the
   corner gains a light for every thing you set in motion.
   ═══════════════════════════════════════════════════════════════════ */
chatStep = 0; chatDone = false; chatStarted = false;
const dayScript = () => window.CONTENT.day[lang] || window.CONTENT.day.ar;
set('#phoneMark','innerHTML', MARK);
const radar = (function(){ const cv = $('#radar'); if (!cv) return { add(){}, reset(){} }; const x = cv.getContext('2d'); let dots = [], t0 = performance.now();
  function draw(now){ const time = (now-t0)/1000; x.clearRect(0,0,88,88); x.strokeStyle = 'rgba(63,210,192,.25)'; x.lineWidth = 1; [14,26,38].forEach(r => { x.beginPath(); x.arc(44,44,r,0,6.2832); x.stroke(); });
    const a = reduced ? 0 : time*1.6; const g = x.createConicGradient ? x.createConicGradient(a, 44, 44) : null; if (g){ g.addColorStop(0,'rgba(63,210,192,.55)'); g.addColorStop(.25,'rgba(63,210,192,0)'); g.addColorStop(1,'rgba(63,210,192,0)'); x.fillStyle = g; x.beginPath(); x.moveTo(44,44); x.arc(44,44,40,0,6.2832); x.fill(); }
    x.fillStyle = '#FFE7A8'; x.beginPath(); x.arc(44,44,3,0,6.2832); x.fill();
    dots.forEach(d => { const age = clamp((now-d.at)/600, .05, 1); glowDot(x, 44+d.x, 44+d.y, 9*age, 'rgba(255,248,228,A)', 'rgba(255,193,72,A)', .95); });
    if (!reduced) requestAnimationFrame(draw); }
  requestAnimationFrame(draw); if (reduced) draw(performance.now());
  return { add(){ const a = Math.random()*6.2832, r = 12 + Math.random()*26; dots.push({ x:Math.cos(a)*r, y:Math.sin(a)*r, at: performance.now() }); if (reduced) draw(performance.now()); }, reset(){ dots = []; if (reduced) draw(performance.now()); } }; })();
function chatRestart(){ const log = $('#chatLog'); if (!log || !chatStarted) return; log.innerHTML = ''; chatStep = 0; chatDone = false; answers.length = 0; effect = 0; sceneN = 0; set('#sceneNo','textContent','0'); set('#sceneOf','textContent', String(dayScript().filter(x => x.p).length)); set('#fxNum','textContent','0'); radar.reset(); set('#chatStatus','textContent',''); chatAdvance(); }
/* the log follows the conversation only while the reader is near the bottom; if they scrolled up to read, it leaves them there */
function chatScroll(){ newMsgCheck(); }
const lastSeen = () => { const last = $('#chatLog') && $('#chatLog').lastElementChild; if (!last) return true; const r = last.getBoundingClientRect(); return r.top < innerHeight - 24 && r.bottom > 0; };
async function whenRead(){ while (!lastSeen()) await sleep(250); }
function newMsgCheck(){ const tag = $('#newMsg'); if (!tag) return; const show = chatStarted && !chatDone && !lastSeen() && ($('#chatLog').getBoundingClientRect().top < innerHeight); tag.hidden = !show; }
addEventListener('scroll', () => newMsgCheck(), { passive: true });
(function newMsgTag(){ const tag = $('#newMsg'); if (!tag) return; tag.onclick = () => { const last = $('#chatLog').lastElementChild; if (last) last.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); }; })();
function bubble(kind, text){ const log = $('#chatLog'); const b = document.createElement('div'); b.className = 'bub ' + kind; b.innerHTML = glowYalla(text); log.appendChild(b); chatScroll(log); return b; }
function notifEl(n){ const log = $('#chatLog'); const d = document.createElement('div'); d.className = 'notif' + (n.warn ? ' warn' : '');
  d.innerHTML = `<span class="ic"><svg viewBox="0 0 48 48"><use href="#i-${esc(n.ic||'pin')}"/></svg></span><div class="tx"><span class="at">${esc(n.at)}</span>${n.f ? ` <span class="ft">${esc(n.f)}</span>` : ''}<div class="t">${esc(n.t)}</div><div class="s">${esc(n.s||'')}</div></div>`;
  log.appendChild(d); chatScroll(log); }
function chipsSet(list){ const log = $('#chatLog'); $$('.chiprow', log).forEach(n => n.remove()); const row = document.createElement('div'); row.className = 'chiprow';
  list.forEach(([label, cls, fn], i) => { const c = document.createElement('button'); c.type='button'; c.className = 'chip' + (cls ? ' '+cls : ''); c.textContent = label; c.style.animationDelay = (i*70)+'ms'; c.onclick = () => { row.remove(); fn(); }; row.appendChild(c); });
  log.appendChild(row); chatScroll(log); }
async function yallaSays(lines, kind){ set('#chatStatus','textContent', t('day.typing'));
  for (const ln of lines){ await whenRead(); const ty = bubble('b typing',''); ty.innerHTML = '<i></i><i></i><i></i>'; await sleep(reduced ? 60 : 420 + Math.min(900, ln.length*14)); ty.remove();
    bubble(kind || 'b', ln.replace(' {name}', userName ? ' '+userName : '').replace('{name}', userName || '')); await sleep(reduced ? 40 : 220); }
  set('#chatStatus','textContent',''); }
async function chatAdvance(){ const sc = dayScript(); const step = sc[chatStep]; if (!step) return;
  if (step.b){ await yallaSays(step.b); }
  if (step.p){ sceneN++; set('#sceneNo','textContent', String(sceneN)); let first = true; for (const ln of step.p){ await whenRead(); const pb = bubble('p', ln); if (first){ pb.dataset.cap = t('day.scene') + ' ' + sceneN; first = false; } await sleep(reduced ? 40 : 900); }
    await sleep(reduced ? 40 : 300); await whenRead(); bubble('b q', t('day.what'));
    /* the person chooses; then the grey card (what usually happens), then the gold one (the same choice, with Yalla), the picture, the last words */
    chipsSet(step.c.map(([label, without, withY]) => [label, '', async () => { bubble('u', label); answers.push(label); await sleep(reduced ? 40 : 600); await whenRead();
      const nb = bubble('no', without.join('\n')); nb.dataset.cap = t('day.without'); await sleep(reduced ? 60 : 1500);
      const chunks = []; for (let i = 0; i < withY.length; i += 3) chunks.push(withY.slice(i, i + 3));
      for (const ch of chunks){ await whenRead(); const ty = bubble('b typing',''); ty.innerHTML = '<i></i><i></i><i></i>'; await sleep(reduced ? 40 : 650); ty.remove(); const xb = bubble('x', ch.join('\n')); xb.dataset.cap = t('day.with'); await sleep(reduced ? 40 : 900); }
      await whenRead(); if (step.d){ const cv = document.createElement('canvas'); cv.className = 'demo'; cv.dataset.demo = step.d; cv.width = 640; cv.height = 320; $('#chatLog').appendChild(cv); chatScroll($('#chatLog')); demoLive(cv); if (reduced) drawDemo(cv.getContext('2d'), step.d, 640, 320, DEMO_T0 + 5000); await sleep(reduced ? 40 : 900); }
      await whenRead(); if (step.t){ const tb = bubble('take', step.t.join('\n')); tb.dataset.cap = t('day.part'); }
      effect++; set('#fxNum','textContent', String(effect)); radar.add(); chatStep++;
      await sleep(reduced ? 40 : 500); await whenRead(); const last = !sc.slice(chatStep).some(s => s.p); chipsSet([[t(last ? 'day.finish' : 'day.next'), 'next', () => chatAdvance()]]); }])); return; }
  if (step.end){ chatDone = true; newMsgCheck(); drawCards(); markStep('day'); record('day'); return; }
  chatStep++; await sleep(150); chatAdvance(); }

(function daySkip(){ const b = $('#daySkip'); if (!b) return; b.onclick = () => { done.add('day'); measureProg(); paintThread(); if (window.__tourPoke) window.__tourPoke(); const c = $('#card'); if (c) c.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }; })();
(function chatStart(){ const sec = $('#day .phone') || $('#day'); if (!sec) return; const go = () => { if (chatStarted) return; chatStarted = true; chatRestart(); };
  if (!('IntersectionObserver' in window)){ go(); return; } new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) go(); }), { threshold:.15 }).observe(sec); })();


/* ═══════════════════════════════════════════════════════════════════
   THE DEMOS — six small moving pictures that show what the words say:
   near · road · help · streak · room · effect. Drawn, never screenshots.
   ═══════════════════════════════════════════════════════════════════ */
const DEMO_T0 = performance.now();
function drawDemo(x, kind, W, H, now){
  const time = (now - DEMO_T0) / 1000; const rtl = lang === 'ar'; const F = rtl ? 'Cairo, sans-serif' : 'Inter, sans-serif';
  x.clearRect(0,0,W,H); const g = x.createLinearGradient(0,0,0,H); g.addColorStop(0,'#150C34'); g.addColorStop(1,'#0B0620'); x.fillStyle = g; x.fillRect(0,0,W,H);
  x.textBaseline = 'middle'; x.direction = rtl ? 'rtl' : 'ltr';
  const label = (txt, px, py, size, col, align) => { x.font = `700 ${size}px ${F}`; x.fillStyle = col || '#F4F1FF'; x.textAlign = align || 'center'; x.fillText(txt, px, py); };
  const pill = (txt, px, py, col) => { x.font = `800 13px ${F}`; const w = x.measureText(txt).width + 18; x.fillStyle = col || 'rgba(255,193,72,.18)'; roundRect(x, px - w/2, py - 11, w, 22, 11); x.fill(); label(txt, px, py + 1, 13, '#FFE7A8'); };
  const dot = (px, py, r, core, halo, a) => glowDot(x, px, py, r, core, halo, a == null ? .95 : a);
  const you = (px, py) => { dot(px, py, 26, 'rgba(255,248,228,A)', 'rgba(255,193,72,A)'); const rr = 14 + (time*22 % 30); x.strokeStyle = `rgba(255,193,72,${(1 - (rr-14)/30)*.6})`; x.lineWidth = 1.5; x.beginPath(); x.arc(px, py, rr, 0, 6.2832); x.stroke(); label(t('demo.you'), px, py + 24, 12, '#FFE7A8'); };
  const person = (px, py, col, sc) => { sc = sc || 1; x.fillStyle = col; x.beginPath(); x.arc(px, py - 9*sc, 5*sc, 0, 6.2832); x.fill(); roundRect(x, px - 6*sc, py - 3*sc, 12*sc, 13*sc, 5*sc); x.fill(); };
  const cup = (px, py) => { x.fillStyle = '#FFE7A8'; roundRect(x, px-9, py-7, 16, 14, 4); x.fill(); x.strokeStyle = '#FFE7A8'; x.lineWidth = 2.5; x.beginPath(); x.arc(px+9, py, 5, -1.3, 1.3); x.stroke(); };
  const ball = (px, py) => { x.fillStyle = '#FFF'; x.beginPath(); x.arc(px, py, 9, 0, 6.2832); x.fill(); x.strokeStyle = '#160D30'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(px-9, py); x.lineTo(px+9, py); x.moveTo(px, py-9); x.lineTo(px, py+9); x.stroke(); };
  const check = (px, py, r) => { x.fillStyle = '#3FD2C0'; x.beginPath(); x.arc(px, py, r, 0, 6.2832); x.fill(); x.strokeStyle = '#06030F'; x.lineWidth = r*.28; x.lineCap = 'round'; x.beginPath(); x.moveTo(px-r*.45, py); x.lineTo(px-r*.1, py+r*.35); x.lineTo(px+r*.5, py-r*.35); x.stroke(); };
  const ph = (time % 6) / 6;   /* one six-second loop */
  if (kind === 'near'){
    /* you at the bottom; three things appear around you, each with a distance and how many are going; the last one you start yourself */
    x.strokeStyle = 'rgba(255,255,255,.06)'; x.lineWidth = 1; for (let i = 0; i < 6; i++){ x.beginPath(); x.moveTo(0, i*H/5); x.lineTo(W, i*H/5); x.stroke(); x.beginPath(); x.moveTo(i*W/5, 0); x.lineTo(i*W/5, H); x.stroke(); }
    you(W*.5, H*.78);
    const spots = [[W*.22, H*.36, 'cup', '600 ' + t('demo.m'), '5 ' + t('demo.going')], [W*.78, H*.3, 'ball', '900 ' + t('demo.m'), t('demo.short')], [W*.5, H*.24, 'plus', '', '6 ' + t('demo.going')]];
    spots.forEach(([px, py, ic, d, n], i) => { const on = clamp((ph - .12 - i*.22) / .1, 0, 1); if (on <= 0) return; x.save(); x.globalAlpha = on;
      x.strokeStyle = 'rgba(255,193,72,.35)'; x.setLineDash([4,5]); x.lineWidth = 1.5; x.beginPath(); x.moveTo(W*.5, H*.78); x.lineTo(px, py); x.stroke(); x.setLineDash([]);
      dot(px, py, 36, 'rgba(255,248,228,A)', 'rgba(255,193,72,A)', .8); if (ic === 'cup') cup(px, py); else if (ic === 'ball') ball(px, py); else { x.strokeStyle = '#FFE7A8'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(px-7, py); x.lineTo(px+7, py); x.moveTo(px, py-7); x.lineTo(px, py+7); x.stroke(); }
      if (d) label(d, px, py + 26, 12, 'rgba(244,241,255,.8)'); pill(n, px, py - 30); x.restore(); });
    if (ph > .78){ const k = clamp((ph-.78)/.1, 0, 1); x.globalAlpha = k; for (let i = 0; i < 6; i++){ const a = i/6*6.2832 + time; person(W*.5 + Math.cos(a)*46, H*.24 + Math.sin(a)*22, '#FFE7A8', .9); } x.globalAlpha = 1; }
  } else if (kind === 'road'){
    /* the road ahead; a pothole 200 m on; reports 3 → 4; it goes to the city; fixed */
    x.fillStyle = '#1A1530'; x.beginPath(); x.moveTo(W*.36, H); x.lineTo(W*.46, 0); x.lineTo(W*.54, 0); x.lineTo(W*.64, H); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.4)'; x.setLineDash([10,10]); x.lineWidth = 2; x.beginPath(); x.moveTo(W*.5, H); x.lineTo(W*.5, 0); x.stroke(); x.setLineDash([]);
    x.fillStyle = '#FFE7A8'; roundRect(x, W*.5-11, H*.8, 22, 30, 6); x.fill(); label(t('demo.you'), W*.5, H*.72, 12, '#FFE7A8');
    const hy = H*.3; x.fillStyle = '#07040F'; x.beginPath(); x.ellipse(W*.5, hy, 16, 8, 0, 0, 6.2832); x.fill(); x.strokeStyle = '#FF7A5C'; x.lineWidth = 2; x.stroke(); label('200 ' + t('demo.m'), W*.5, hy - 18, 12, '#FF7A5C');
    const n = ph < .3 ? 3 : 4; pill(n + ' ' + t('demo.reports'), W*.18, H*.3, n === 4 ? 'rgba(63,210,192,.2)' : 'rgba(255,122,92,.18)');
    if (ph > .45){ const k = clamp((ph-.45)/.12, 0, 1); x.globalAlpha = k; x.strokeStyle = 'rgba(63,210,192,.7)'; x.lineWidth = 2; x.beginPath(); x.moveTo(W*.27, H*.3); x.lineTo(W*.74, H*.3); x.stroke();
      x.fillStyle = '#1B1236'; roundRect(x, W*.76, H*.16, 44, 30, 4); x.fill(); x.fillStyle = '#FFE7A8'; for (let i = 0; i < 3; i++) x.fillRect(W*.76 + 6 + i*13, H*.16 + 8, 7, 8); label(t('demo.city'), W*.76 + 22, H*.16 + 44, 11, 'rgba(244,241,255,.8)'); x.globalAlpha = 1; }
    if (ph > .75){ const k = clamp((ph-.75)/.1, 0, 1); x.globalAlpha = k; check(W*.5, hy, 14); pill(t('demo.fixed'), W*.5, hy + 30, 'rgba(63,210,192,.22)'); x.globalAlpha = 1; }
  } else if (kind === 'help'){
    /* you in the middle; three neighbours around; the nearest answers in minutes */
    you(W*.5, H*.5);
    const nb = [[W*.2, H*.3, '150 ' + t('demo.m')], [W*.8, H*.36, '400 ' + t('demo.m')], [W*.72, H*.78, '600 ' + t('demo.m')]];
    nb.forEach(([px, py, d], i) => { const on = clamp((ph - .1 - i*.1)/.1, 0, 1); if (on <= 0) return; x.globalAlpha = on; person(px, py, i ? 'rgba(244,241,255,.6)' : '#3FD2C0', 1.3); label(d, px, py + 24, 11, 'rgba(244,241,255,.7)'); x.globalAlpha = 1; });
    if (ph > .45){ const k = clamp((ph-.45)/.15, 0, 1); x.strokeStyle = 'rgba(63,210,192,.8)'; x.lineWidth = 2.5; x.lineCap = 'round'; x.beginPath(); x.moveTo(W*.2, H*.3); x.lineTo(W*.2 + (W*.5 - W*.2)*k, H*.3 + (H*.5 - H*.3)*k); x.stroke(); }
    if (ph > .62){ pill('4 ' + t('demo.min'), W*.33, H*.24, 'rgba(63,210,192,.22)'); }
    if (ph > .8){ check(W*.2, H*.3 - 26, 10); }
  } else if (kind === 'streak'){
    /* seven days; three done; today pulsing; a reminder; a friend who finished */
    for (let i = 0; i < 7; i++){ const px = W*(.14 + i*.12), py = H*.42; const done = i < 3 || (i === 3 && ph > .55); x.fillStyle = done ? '#FFC148' : 'rgba(255,255,255,.1)'; x.beginPath(); x.arc(px, py, 15, 0, 6.2832); x.fill(); if (done){ x.globalCompositeOperation = 'lighter'; dot(px, py, 26, 'rgba(255,248,228,A)', 'rgba(255,193,72,A)', .5); x.globalCompositeOperation = 'source-over'; }
      if (i === 3 && !done){ x.strokeStyle = `rgba(255,193,72,${(.5 + .5*Math.sin(time*5)).toFixed(2)})`; x.lineWidth = 2; x.beginPath(); x.arc(px, py, 19, 0, 6.2832); x.stroke(); } label(t('demo.day') + ' ' + (i+1), px, py + 30, 11, i === 3 ? '#FFE7A8' : 'rgba(244,241,255,.55)'); }
    if (ph > .2 && ph < .55){ pill(t('demo.remind') + ' · 2 ' + (rtl ? 'سوايع' : 'h'), W*.5, H*.14, 'rgba(255,122,92,.2)'); }
    if (ph > .55){ pill(t('demo.done'), W*.5, H*.14, 'rgba(63,210,192,.22)'); }
    person(W*.86, H*.8, '#3FD2C0', 1.2); label(rtl ? 'سيف كمّل' : 'Seif done', W*.86, H*.8 + 24, 11, 'rgba(244,241,255,.8)'); person(W*.14, H*.8, 'rgba(244,241,255,.6)', 1.2); label(rtl ? 'صحابك' : 'friends', W*.14, H*.8 + 24, 11, 'rgba(244,241,255,.6)');
  } else if (kind === 'room'){
    /* the whole street in one room; one confirmed message */
    x.fillStyle = 'rgba(255,255,255,.05)'; roundRect(x, W*.08, H*.14, W*.84, H*.72, 18); x.fill();
    const rs = seeded(9); for (let i = 0; i < 34; i++){ const px = W*(.14 + rs()*.72), py = H*(.5 + rs()*.3); const on = clamp((ph - i*.01)/.1, 0, 1); x.globalAlpha = on; person(px, py, i % 5 ? 'rgba(244,241,255,.55)' : '#FFE7A8', .8); x.globalAlpha = 1; }
    pill('34 ' + t('demo.people'), W*.5, H*.24);
    if (ph > .5){ const k = clamp((ph-.5)/.12, 0, 1); x.globalAlpha = k; x.fillStyle = 'rgba(63,210,192,.16)'; roundRect(x, W*.2, H*.34, W*.6, 26, 13); x.fill(); label((rtl ? 'الستاغ: ساعتين' : 'power: two hours') + ' · ' + t('demo.confirmed'), W*.5, H*.34 + 13, 12, '#BDF3EC'); check(W*.82, H*.34 + 13, 9); x.globalAlpha = 1; }
  } else if (kind === 'drain'){
    /* a street; the drain blocked; a call goes out; neighbours gather; it clears; the rain runs through */
    x.fillStyle = '#1A1530'; x.fillRect(0, H*.55, W, H*.22); x.strokeStyle = 'rgba(255,255,255,.3)'; x.setLineDash([12,10]); x.lineWidth = 2; x.beginPath(); x.moveTo(0, H*.66); x.lineTo(W, H*.66); x.stroke(); x.setLineDash([]);
    const dx = W*.5, dy = H*.78; x.fillStyle = '#07040F'; roundRect(x, dx-26, dy-8, 52, 16, 4); x.fill(); x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = 1.5; for (let i = -18; i <= 18; i += 9){ x.beginPath(); x.moveTo(dx+i, dy-6); x.lineTo(dx+i, dy+6); x.stroke(); }
    const clear = ph > .62; if (!clear){ const rs = seeded(4); for (let i = 0; i < 9; i++){ x.fillStyle = i%2 ? '#8A7A5A' : '#5E6B4A'; x.beginPath(); x.arc(dx + (rs()-.5)*60, dy - 10 - rs()*14, 4 + rs()*4, 0, 6.2832); x.fill(); } }
    if (ph > .08 && ph < .3){ const k = (ph-.08)/.22; x.strokeStyle = `rgba(255,193,72,${((1-k)*.8).toFixed(2)})`; x.lineWidth = 2; x.beginPath(); x.arc(dx, dy, 14 + k*90, 0, 6.2832); x.stroke(); pill(t('demo.call'), dx, H*.3); }
    const people = [[W*.22, H*.36],[W*.78, H*.4],[W*.32, H*.28],[W*.68, H*.26]]; people.forEach(([px, py], i) => { const on = clamp((ph - .28 - i*.06)/.08, 0, 1); if (on <= 0) return; const k = clamp((ph - .4)/.2, 0, 1); const tx = px + (dx + (i-1.5)*26 - px)*k, ty = py + (dy - 30 - py)*k; x.globalAlpha = on; person(tx, ty, i ? '#FFE7A8' : '#3FD2C0', 1.2); x.globalAlpha = 1; });
    if (clear){ check(dx, dy - 34, 12); const rr = seeded(8); x.strokeStyle = 'rgba(120,180,255,.7)'; x.lineWidth = 1.5; for (let i = 0; i < 30; i++){ const rx = rr()*W, ry = ((rr()*H + time*260) % (H*.55)); x.beginPath(); x.moveTo(rx, ry); x.lineTo(rx - 3, ry + 12); x.stroke(); } x.strokeStyle = 'rgba(120,180,255,.8)'; x.lineWidth = 3; x.beginPath(); x.moveTo(dx - 60, dy - 12); x.quadraticCurveTo(dx, dy - 4, dx, dy + 6); x.stroke(); }
  } else if (kind === 'city'){
    /* you in the middle of a place you do not know; around you, one by one: a pharmacy, a mechanic, a bed, two people you can trust */
    you(W*.5, H*.55); const rr = 20 + (time*60 % 150); x.strokeStyle = `rgba(255,193,72,${((1 - (rr-20)/150)*.5).toFixed(2)})`; x.lineWidth = 1.5; x.beginPath(); x.arc(W*.5, H*.55, rr, 0, 6.2832); x.stroke();
    const spots = [[W*.2, H*.3, 'plus', t('demo.pharm'), '400 ' + t('demo.m')], [W*.8, H*.3, 'wrench', t('demo.mech'), '1.2 ' + t('demo.km')], [W*.5, H*.18, 'house', t('demo.stay'), ''], [W*.18, H*.78, 'person', t('demo.trusted'), ''], [W*.82, H*.78, 'person', t('demo.trusted'), '']];
    spots.forEach(([px, py, ic, lb, d], i) => { const on = clamp((ph - .12 - i*.14)/.1, 0, 1); if (on <= 0) return; x.save(); x.globalAlpha = on; x.strokeStyle = 'rgba(255,193,72,.35)'; x.setLineDash([4,5]); x.lineWidth = 1.5; x.beginPath(); x.moveTo(W*.5, H*.55); x.lineTo(px, py); x.stroke(); x.setLineDash([]);
      dot(px, py, 30, 'rgba(255,248,228,A)', 'rgba(255,193,72,A)', .7); x.strokeStyle = '#FFE7A8'; x.fillStyle = '#FFE7A8'; x.lineWidth = 3; x.lineCap = 'round';
      if (ic === 'plus'){ x.beginPath(); x.moveTo(px-7, py); x.lineTo(px+7, py); x.moveTo(px, py-7); x.lineTo(px, py+7); x.stroke(); }
      else if (ic === 'wrench'){ x.beginPath(); x.moveTo(px-7, py+7); x.lineTo(px+4, py-4); x.stroke(); x.beginPath(); x.arc(px+5, py-5, 5, 0, 6.2832); x.stroke(); }
      else if (ic === 'house'){ x.beginPath(); x.moveTo(px-9, py+2); x.lineTo(px, py-8); x.lineTo(px+9, py+2); x.stroke(); x.fillRect(px-6, py+1, 12, 8); }
      else { person(px, py, '#3FD2C0', 1.3); check(px+9, py-11, 6); }
      label(lb + (d ? ' · ' + d : ''), px, py + 26, 11, 'rgba(244,241,255,.85)'); x.restore(); });
  } else if (kind === 'circle'){
    /* five friends; thirty days that light up one by one; one falls and comes back; the memories behind */
    for (let i = 0; i < 5; i++) person(W*(.3 + i*.1), H*.16, i === 2 ? '#FFE7A8' : 'rgba(244,241,255,.6)', 1.2);
    const n = Math.floor(ph*36); for (let i = 0; i < 30; i++){ const cx = W*(.12 + (i%10)*.084), cy = H*(.42 + Math.floor(i/10)*.17); const done = i < n && !(i === 13 && ph > .4 && ph < .55); x.fillStyle = done ? '#FFC148' : 'rgba(255,255,255,.1)'; roundRect(x, cx-10, cy-10, 20, 20, 5); x.fill(); }
    pill(String(Math.min(30, n)) + ' ' + t('demo.day'), W*.5, H*.9, 'rgba(63,210,192,.22)');
    if (ph > .7){ x.globalAlpha = clamp((ph-.7)/.15, 0, 1)*.5; x.fillStyle = 'rgba(255,255,255,.14)'; roundRect(x, W*.03, H*.3, 40, 30, 4); x.fill(); roundRect(x, W*.9, H*.32, 40, 30, 4); x.fill(); x.globalAlpha = 1; }
  } else if (kind === 'neighbour'){
    /* a house with a faint light; you on the road; the pharmacy; the line lights up; ten minutes */
    const hx = W*.18, hy = H*.5; x.strokeStyle = '#FFE7A8'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(hx-24, hy+4); x.lineTo(hx, hy-20); x.lineTo(hx+24, hy+4); x.stroke(); x.fillStyle = 'rgba(255,231,168,.2)'; x.fillRect(hx-18, hy+2, 36, 26); dot(hx, hy + 14, 10, 'rgba(255,248,228,A)', 'rgba(255,193,72,A)', .35 + .3*Math.sin(time*3));
    const qx = W*.82, qy = H*.5; x.strokeStyle = '#3FD2C0'; x.beginPath(); x.moveTo(qx-8, qy); x.lineTo(qx+8, qy); x.moveTo(qx, qy-8); x.lineTo(qx, qy+8); x.stroke(); label(t('demo.pharm'), qx, qy + 26, 11, 'rgba(244,241,255,.8)');
    if (ph > .1){ const k = clamp((ph-.1)/.15, 0, 1); x.strokeStyle = 'rgba(255,193,72,.6)'; x.setLineDash([4,5]); x.lineWidth = 1.5; x.beginPath(); x.moveTo(hx, hy); x.lineTo(hx + (W*.5 - hx)*k, hy + (H*.8 - hy)*k); x.stroke(); x.setLineDash([]); }
    const k2 = clamp((ph-.3)/.5, 0, 1); const yx = k2 < .5 ? W*.5 + (qx - W*.5)*(k2*2) : qx + (hx - qx)*((k2-.5)*2); const yy = k2 < .5 ? H*.8 + (qy - H*.8)*(k2*2) : qy + (hy + 30 - qy)*((k2-.5)*2); you(yx, yy);
    if (ph > .85){ check(hx, hy - 34, 12); pill('10 ' + t('demo.min'), W*.5, H*.16, 'rgba(63,210,192,.22)'); }
  } else if (kind === 'streak30'){
    /* thirty days lighting one by one; the count 3, 10, 21, 30; three people walking together */
    const n = Math.floor(ph*32); for (let i = 0; i < 30; i++){ const cx = W*(.08 + (i%15)*.06), cy = H*(.3 + Math.floor(i/15)*.16); x.fillStyle = i < n ? '#FFC148' : 'rgba(255,255,255,.1)'; roundRect(x, cx-8, cy-8, 16, 16, 4); x.fill(); }
    const m = Math.min(30, n); pill((m < 3 ? '1' : m < 10 ? '3' : m < 21 ? '10' : m < 30 ? '21' : '30') + ' ' + t('demo.day'), W*.5, H*.12, 'rgba(63,210,192,.22)');
    const wx = (time*40) % (W*1.2) - W*.1; person(wx, H*.8, '#FFE7A8', 1.3); person(wx - 28, H*.8, '#3FD2C0', 1.3); person(wx + 28, H*.8, 'rgba(244,241,255,.6)', 1.3);
  } else if (kind === 'blood'){
    /* the hospital in the middle; a pulse goes out; four people light up and come */
    const cx = W*.5, cy = H*.5; x.fillStyle = '#1B1236'; roundRect(x, cx-26, cy-22, 52, 44, 6); x.fill(); x.strokeStyle = '#FF7A5C'; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx-9, cy); x.lineTo(cx+9, cy); x.moveTo(cx, cy-9); x.lineTo(cx, cy+9); x.stroke(); label(t('demo.hospital'), cx, cy + 36, 11, 'rgba(244,241,255,.8)');
    for (let r = 0; r < 3; r++){ const rr = ((time*70 + r*60) % 180); x.strokeStyle = `rgba(255,122,92,${((1 - rr/180)*.6).toFixed(2)})`; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, 30 + rr, 0, 6.2832); x.stroke(); }
    const ppl = [[W*.15, H*.25],[W*.85, H*.3],[W*.2, H*.8],[W*.8, H*.78]]; ppl.forEach(([px, py], i) => { const on = clamp((ph - .15 - i*.08)/.08, 0, 1); if (on <= 0) return; const k = clamp((ph - .45)/.35, 0, 1); x.globalAlpha = on; person(px + (cx - 40*Math.sign(px-cx) - px)*k, py + (cy + 30*Math.sign(py-cy) - py)*k, '#FF9C85', 1.3); x.globalAlpha = 1; });
    pill('O-', W*.5, H*.14, 'rgba(255,122,92,.22)'); if (ph > .8) pill('4 · 40 ' + t('demo.min'), W*.5, H*.9, 'rgba(63,210,192,.22)');
  } else if (kind === 'effect'){
    /* three bars for you, one number for the street */
    const bars = [[4, t('demo.fixedN')], [9, t('demo.helped')], [3, t('demo.challenges')]]; const k = clamp(ph/.6, 0, 1);
    bars.forEach(([n, lb], i) => { const py = H*(.2 + i*.22); const w = W*.5 * (n/9) * k; x.fillStyle = 'rgba(255,255,255,.08)'; roundRect(x, W*.08, py-8, W*.5, 16, 8); x.fill(); x.fillStyle = i === 1 ? '#3FD2C0' : '#FFC148'; roundRect(x, W*.08, py-8, Math.max(16, w), 16, 8); x.fill(); label(Math.round(n*k) + ' ' + lb, W*.62, py, 13, '#F4F1FF', 'left'); });
    if (rtl){ /* right-to-left reading: the labels sit on the right */ }
    x.textAlign = 'center'; x.font = `900 34px Inter, sans-serif`; x.fillStyle = '#FFE7A8'; x.fillText(String(Math.round(212*k)), W*.5, H*.84); label(t('demo.street'), W*.5, H*.84 + 26, 12, 'rgba(244,241,255,.7)');
  }
}
/* every demo canvas on the page animates while it is on screen */
const demos = new Set();
function demoLive(cv){ if (cv._live) return; cv._live = true; demos.add(cv); }
loop((now) => { demos.forEach(cv => { const r = cv.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; drawDemo(cv.getContext('2d'), cv.dataset.demo, cv.width, cv.height, now); }); });
$$('canvas.demo').forEach(demoLive);
if (reduced) $$('canvas.demo').forEach(cv => drawDemo(cv.getContext('2d'), cv.dataset.demo, cv.width, cv.height, DEMO_T0 + 5000));

/* ═══════════════════════════════════════════════════════════════════
   THE SEAL ON THE PHOTO
   ═══════════════════════════════════════════════════════════════════ */
let photoImg = null, photoMode = 'full', cardLang = null, accent = 0, photoZoom = 1, photoDX = 0, photoDY = 0, showNo = true, placeMode = 'full';
const MARK_IMG = new Image(); MARK_IMG.onload = () => drawCards(); MARK_IMG.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(MARK);
const CL = () => cardLang || lang;
const TT = (k) => (S[CL()] && S[CL()][k]) || S.ar[k] || k;
const ACCENTS = () => secretOn ? [...window.CONTENT.accents, window.CONTENT.secretAccent] : window.CONTENT.accents;
const ACC = () => ACCENTS()[accent] || ACCENTS()[0];
function paintPhotoUI(){ const lbl = $('#photoLabel'), clr = $('#photoClear'); if (lbl) lbl.textContent = photoImg ? t('card.photoChange') : t('card.photo'); if (clr) clr.hidden = !photoImg; const pc = $('#photoCtl'); if (pc) pc.hidden = !photoImg; const cf = $('.cardframe'); if (cf) cf.classList.toggle('grab', !!photoImg); $$('#cardModes button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === photoMode))); }
(function photo(){ const input = $('#photoInput'), btn = $('#photoBtn'), clr = $('#photoClear'); if (!input || !btn) return; btn.onclick = () => input.click();
  input.onchange = () => { const f = input.files && input.files[0]; if (!f || !/^image\//.test(f.type)) return; const fr = new FileReader(); fr.onload = () => { const im = new Image(); im.onload = () => { photoImg = im; paintPhotoUI(); drawCards(); }; im.src = fr.result; }; fr.readAsDataURL(f); };
  if (clr) clr.onclick = () => { photoImg = null; input.value = ''; paintPhotoUI(); drawCards(); };
  $$('#cardModes button').forEach(b => { b.onclick = () => { photoMode = b.dataset.mode; paintPhotoUI(); drawCards(); }; }); paintPhotoUI();
  /* move the photo with a finger, zoom with the slider */
  const zr = $('#photoZoom'); if (zr) zr.oninput = () => { photoZoom = +zr.value; drawCards(); };
  const cf = $('.cardframe'); if (cf){ let drag = null, raf = 0; cf.addEventListener('pointerdown', (e) => { if (!photoImg) return; drag = { x: e.clientX, y: e.clientY, dx: photoDX, dy: photoDY }; cf.setPointerCapture(e.pointerId); e.preventDefault(); });
    cf.addEventListener('pointermove', (e) => { if (!drag) return; const r = cf.getBoundingClientRect(); photoDX = clamp(drag.dx + (e.clientX - drag.x)/r.width, -.8, .8); photoDY = clamp(drag.dy + (e.clientY - drag.y)/r.height, -.8, .8); if (!raf) raf = requestAnimationFrame(() => { raf = 0; drawCards(); }); });
    const up = () => { drag = null; }; cf.addEventListener('pointerup', up); cf.addEventListener('pointercancel', up); }
  const opt = (id, fn) => $$('#' + id + ' button').forEach(b => { b.onclick = () => { $$('#' + id + ' button').forEach(o => o.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); fn(b.dataset.v); drawCards(); }; });
  opt('optNo', (v) => { showNo = v === '1'; }); opt('optPlace', (v) => { placeMode = v; }); })();
function photoCircle(x, cx, cy, r){ if (!photoImg) return false; const iw = photoImg.naturalWidth, ih = photoImg.naturalHeight, side = Math.min(iw,ih)/photoZoom; x.save(); x.beginPath(); x.arc(cx,cy,r,0,6.2832); x.clip(); x.drawImage(photoImg,(iw-side)/2 - photoDX*side*2,(ih-side)/2 - photoDY*side*2,side,side,cx-r,cy-r,r*2,r*2); x.restore(); return true; }
function photoCover(x, rx, ry, w, h){ if (!photoImg) return false; const iw = photoImg.naturalWidth, ih = photoImg.naturalHeight, sc = Math.max(w/iw, h/ih)*photoZoom; x.drawImage(photoImg, rx+(w-iw*sc)/2 + photoDX*w, ry+(h-ih*sc)/2 + photoDY*h, iw*sc, ih*sc); return true; }
function buildCardLangs(){ const box = $('#cardLangs'); if (!box) return; box.innerHTML = ''; ['ar','fr','en'].forEach(l => { const b = document.createElement('button'); b.type='button'; b.textContent = S[l].label; b.setAttribute('aria-pressed', String(CL() === l)); b.onclick = () => { cardLang = l; $$('#cardLangs button').forEach(o => o.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed','true'); drawCards(); }; box.appendChild(b); }); }
function buildSwatches(){ const box = $('#swatches'); if (!box) return; box.innerHTML = ''; ACCENTS().forEach(([k,c], i) => { const b = document.createElement('button'); b.type='button'; b.title = k; b.style.setProperty('--c', c); if (k === 'nejma') b.className = 'secret'; b.setAttribute('aria-pressed', String(i === accent)); b.onclick = () => { accent = i; $$('#swatches button').forEach((o,j) => o.setAttribute('aria-pressed', String(j === i))); drawCards(); }; box.appendChild(b); }); }

function cardSky(x, W, H, col){ const g = x.createLinearGradient(0,0,W*.25,H); g.addColorStop(0,'#16093A'); g.addColorStop(.5,'#0B0522'); g.addColorStop(1,'#06030F'); x.fillStyle = g; x.fillRect(0,0,W,H);
  x.save(); x.globalCompositeOperation = 'lighter'; const nebs = [[.2,.18,.55,'109,74,224',.16],[.85,.62,.6,hex2rgb(col).join(','),.12],[.3,.9,.5,'63,210,192',.07]];
  for (const [fx,fy,fr,c,a] of nebs){ const ng = x.createRadialGradient(W*fx,H*fy,0,W*fx,H*fy,W*fr); ng.addColorStop(0,`rgba(${c},${a})`); ng.addColorStop(1,`rgba(${c},0)`); x.fillStyle = ng; x.fillRect(0,0,W,H); }
  const r = seeded(sealSeed || 7); for (let i = 0; i < Math.round(W*H/4200); i++){ x.fillStyle = `rgba(255,246,224,${(r()*.5+.08).toFixed(3)})`; x.beginPath(); x.arc(r()*W, r()*H, r()*1.6+.35, 0, 6.2832); x.fill(); } x.restore(); }
function grain(x, W, H, a){ const rn = seeded(sealSeed || 3); x.save(); x.globalAlpha = a; for (let i = 0; i < W*H/700; i++){ x.fillStyle = rn() > .5 ? '#fff' : '#000'; x.fillRect(rn()*W, rn()*H, 1.5, 1.5); } x.restore(); }
/* a small lit Tunisia, for the corner of the poster */
function miniMap(x, cx, cy, h, col, a){ const govs = window.TUNISIA; if (!govs) return; const LON0 = 7.3, LON1 = 11.75, LAT0 = 30.0, LAT1 = 37.55; const s = h / (LAT1 - LAT0); const w = (LON1 - LON0) * s;
  const P = (lo, la) => [cx - w/2 + (lo - LON0)*s, cy - h/2 + (LAT1 - la)*s];
  x.save(); x.globalAlpha = a; x.strokeStyle = rgba(col, .9); x.lineWidth = Math.max(1, h*.006); x.fillStyle = rgba(col, .12);
  govs.forEach(g => g.r.forEach(ring => { x.beginPath(); ring.forEach((c, i) => { const [px,py] = P(c[0], c[1]); i ? x.lineTo(px,py) : x.moveTo(px,py); }); x.closePath(); x.fill(); x.stroke(); }));
  const rn = seeded(sealSeed || 5); x.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++){ const lo = LON0 + .8 + rn()*(LON1-LON0-1.6), la = LAT0 + 1.5 + rn()*(LAT1-LAT0-2); const [px,py] = P(lo,la); glowDot(x, px, py, h*.02, 'rgba(255,248,228,A)', `rgba(${hex2rgb(col).join(',')},A)`, .9); }
  x.restore(); }

function drawCard(cv, shape){
  /* One composition, instagrammable: the photo on top, a solid block of your colour below,
     your star sitting on the seam between them. Two lines of type. The handle. Nothing else. */
  const x = cv.getContext('2d'); const W = cv.width, H = cv.height, S_ = (f) => Math.round(W*f);
  const rtl = CL() === 'ar', F = rtl ? 'Cairo, sans-serif' : 'Inter, sans-serif';
  const [, col, colL] = ACC(); const name = userName || ''; const seed = sealSeed || 12345;
  const overlay = shape === 'overlay', circle = !overlay && photoImg && photoMode === 'in';
  x.clearRect(0,0,W,H); x.textBaseline = 'alphabetic';
  const xs = (f) => rtl ? W - S_(f) : S_(f); const alignS = rtl ? 'right' : 'left';
  const seam = H*.6; const blockH = H - seam;
  if (!overlay){
    /* the photo (or the sky) above the seam */
    if (photoImg && !circle){ x.save(); x.beginPath(); x.rect(0,0,W,seam); x.clip(); photoCover(x,0,0,W,seam+S_(.02)); const v = x.createLinearGradient(0,seam*.6,0,seam); v.addColorStop(0,'rgba(6,3,15,0)'); v.addColorStop(1,'rgba(6,3,15,.35)'); x.fillStyle = v; x.fillRect(0,0,W,seam); grain(x, W, seam, .05); x.restore(); }
    else { cardSky(x,W,H,col); }
    /* the block of colour below the seam, with your star's pattern woven in */
    const bg2 = x.createLinearGradient(0, seam, W*.4, H); bg2.addColorStop(0, colL); bg2.addColorStop(.45, col); bg2.addColorStop(1, mix(col, '#160D30', .35)); x.fillStyle = bg2; x.fillRect(0, seam, W, blockH);
    x.save(); x.globalCompositeOperation = 'lighter'; const bl = x.createRadialGradient(rtl ? W*.2 : W*.8, seam + blockH*.55, 0, rtl ? W*.2 : W*.8, seam + blockH*.55, W*.6); bl.addColorStop(0,'rgba(255,255,255,.22)'); bl.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle = bl; x.fillRect(0, seam, W, blockH); x.restore();
    x.save(); x.beginPath(); x.rect(0, seam, W, blockH); x.clip(); x.globalAlpha = .18; const tile = S_(.15); for (let ty = seam + tile*.5; ty < H + tile; ty += tile*1.1) for (let tx = ((Math.round(ty/tile)%2) ? tile*.5 : 0); tx < W + tile; tx += tile) drawSeal(x, tx, ty, tile*.4, seed, '#160D30', .9, 1, { mono:true }); x.restore();
    const sh = x.createLinearGradient(0, seam, 0, seam + S_(.06)); sh.addColorStop(0,'rgba(0,0,0,.35)'); sh.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle = sh; x.fillRect(0, seam, W, S_(.06));
  }
  /* the star on the seam — the hero of the post; in avatar mode your face sits inside it */
  if (circle){ const sr = S_(.27); const sx = W/2, sy = seam; x.save(); x.fillStyle = '#160D30'; x.beginPath(); x.arc(sx, sy, sr*1.5, 0, 6.2832); x.fill(); x.restore(); drawSeal(x, sx, sy, sr, seed, '#FFC148', .9, 1, { founder: isFounder() }); x.fillStyle = '#160D30'; x.beginPath(); x.arc(sx, sy, sr*.6, 0, 6.2832); x.fill(); photoCircle(x, sx, sy, sr*.56); x.strokeStyle = colL; x.lineWidth = Math.max(3, S_(.006)); x.beginPath(); x.arc(sx, sy, sr*.56, 0, 6.2832); x.stroke(); }
  else { const sr = S_(.17); const sx = rtl ? S_(.08) + sr : W - S_(.08) - sr; const sy = seam;
    x.save(); x.fillStyle = overlay ? 'rgba(6,3,15,.55)' : '#160D30'; x.beginPath(); x.arc(sx, sy, sr*1.5, 0, 6.2832); x.fill(); x.restore();
    drawSeal(x, sx, sy, sr*.88, seed, '#FFC148', 1, 1, { founder: isFounder() }); }
  /* the words: two lines, dark on the colour */
  x.textAlign = alignS; x.direction = rtl ? 'rtl' : 'ltr';
  const ink = overlay ? '#FFF8EC' : '#160D30'; let y = seam + S_(circle ? .46 : .26);
  const place = placeMode === 'none' ? '' : placeMode === 'gov' ? (currentGov ? govLabel(currentGov, CL()) : '') : placeLabel(CL());
  x.font = `900 ${S_(.14)}px ${F}`; x.save(); x.shadowColor = 'rgba(255,255,255,.55)'; x.shadowBlur = S_(.04); x.fillStyle = ink; x.fillText(TT('card.line1'), xs(.07), y); x.restore();
  if (place){ y += S_(.085); x.font = `900 ${S_(.062)}px ${F}`; x.fillStyle = ink; x.fillText(`${TT('card.of')} ${place}.`, xs(.07), y); }
  y += S_(.1); x.font = `900 ${S_(.09)}px ${F}`; x.fillStyle = overlay ? colL : 'rgba(22,13,48,.8)'; x.fillText(TT('card.line2'), xs(.07), y);
  if (name){ y += S_(.075); fitFont(x, name, W*.8, S_(.05), S_(.036), 700, F); x.fillStyle = overlay ? '#FFF8EC' : 'rgba(22,13,48,.75)'; x.fillText(name, xs(.07), y); }
  /* the handle, small, at the foot; the founders' ribbon, top corner */
  x.textAlign = 'center'; x.direction = 'ltr'; x.font = `800 ${S_(.034)}px Inter, sans-serif`; x.save(); x.fillStyle = overlay ? '#FFF8EC' : '#160D30'; x.shadowColor = overlay ? 'rgba(0,0,0,.6)' : 'rgba(255,255,255,.5)'; x.shadowBlur = S_(.02); x.fillText('@yalla.3andek', W/2, H - S_(.045)); x.restore();
  if (sealNo && showNo){ const txt = TT('card.noLine').replace('{n}', fmt(sealNo)) + (tier() ? ' · ' + TT('tier.c' + tier()) : ''); x.font = `900 ${S_(.026)}px ${F}`; x.direction = rtl ? 'rtl' : 'ltr'; const tw2 = x.measureText(txt).width + S_(.06); const rh = S_(.05); const rx = rtl ? S_(.05) : W - S_(.05) - tw2; x.save(); x.fillStyle = 'rgba(22,13,48,.85)'; roundRect(x, rx, S_(.05), tw2, rh, rh/2); x.fill(); x.fillStyle = '#FFE7A8'; x.fillText(txt, rx + tw2/2, S_(.05) + rh*.68); x.restore(); }
  /* the brand mark, top inline-start */
  if (MARK_IMG.complete && MARK_IMG.naturalWidth){ const ms = S_(.09); x.drawImage(MARK_IMG, rtl ? W - S_(.05) - ms : S_(.05), S_(.04), ms, ms); }
  x.textAlign = 'center';
}
function drawCards(){ const st = $('#storyCanvas'); if (!st) return; drawCard(st,'story'); drawCard($('#postCanvas'),'post'); drawCard($('#stickerCanvas'),'overlay'); }
/* saving a canvas: share it as a file where that exists (phones), else download, else open it */
let toastT = 0;
function toast(msg){ let el = $('#toast'); if (!el){ el = document.createElement('div'); el.id = 'toast'; el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:70;background:rgba(22,13,48,.96);color:#FFE7A8;font-weight:900;font-size:.9rem;padding:12px 18px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.4),0 0 0 1px rgba(255,231,168,.2);max-width:calc(100vw - 32px);text-align:center;transition:opacity .3s'; document.body.appendChild(el); } el.textContent = msg; el.style.opacity = '1'; clearTimeout(toastT); toastT = setTimeout(() => { el.style.opacity = '0'; }, 3200); }
const isIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
async function canvasBlob(cv){ return new Promise(res => cv.toBlob(res, 'image/png')); }
async function dl(cv, name, text){ const blob = await canvasBlob(cv); if (!blob) return;
  const file = new File([blob], name, { type:'image/png' });
  if (navigator.canShare && navigator.canShare({ files:[file] }) && (isIOS() || /Android/.test(navigator.userAgent))){ try { await navigator.share({ files:[file], text: text || '' }); return; } catch(e){ if (e && e.name === 'AbortError') return; } }
  const url = URL.createObjectURL(blob);
  if (isIOS()){ const w = open(url, '_blank'); if (w) toast(TT('card.opened')); else location.href = url; setTimeout(() => URL.revokeObjectURL(url), 60000); return; }
  const a = document.createElement('a'); a.download = name; a.href = url; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000); toast(TT('card.saved')); }
const shareText = () => `${TT('card.line1')} ${TT('card.line2')}\n${TT('share.text')} ${CONFIG.shareUrl}\n@yalla.3andek`;
const slug = () => (userName || 'yalla').replace(/[^p{L}p{N}]+/gu, '-').toLowerCase();
set('#dlStory','onclick', () => { markStep('card'); record('card', { what:'story' }); dl($('#storyCanvas'), `yalla-${slug()}-story.png`, shareText()); });
set('#dlPost','onclick', () => { markStep('card'); record('card', { what:'post' }); dl($('#postCanvas'), `yalla-${slug()}-post.png`, shareText()); });
set('#dlSticker','onclick', () => { markStep('card'); record('card', { what:'filter' }); dl($('#stickerCanvas'), `yalla-${slug()}-filter.png`, shareText()); });
set('#shareCard','onclick', async () => { markStep('card'); record('card', { what:'share' }); const text = shareText();
  try { const blob = await canvasBlob($('#storyCanvas')); const file = new File([blob],'yalla.png',{ type:'image/png' }); if (navigator.canShare && navigator.canShare({ files:[file] })){ await navigator.share({ files:[file], text }); return; } if (navigator.share){ await navigator.share({ text, url: CONFIG.shareUrl }); return; } } catch(e){ if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(text); toast(TT('card.copied')); } catch(_){ open('https://wa.me/?text=' + encodeURIComponent(text), '_blank'); } });



/* ═══════════════════════════════════════════════════════════════════
   THE END — what you did, a word for the team, where we find you
   ═══════════════════════════════════════════════════════════════════ */
(function team(){ const f = $('#teamForm'); if (!f) return; f.addEventListener('submit', async (e) => { e.preventDefault(); if ($('#gotcha').value) return;
  const text = $('#teamText').value.trim(); if (!text) return; record('word', { word: text.slice(0, 600), email: $('#teamMail').value.trim() }); f.reset(); $('#teamOk').classList.add('on'); }); })();
(function find(){ const f = $('#findForm'); if (!f) return; f.addEventListener('submit', async (e) => { e.preventDefault(); const email = $('#findMail').value.trim(); if (!email) return; record('email', { email }); f.reset(); $('#findOk').classList.add('on'); }); })();
(function share(){ const wa = $('#waShare'); if (wa) wa.href = 'https://wa.me/?text=' + encodeURIComponent(`${t('share.text')} ${CONFIG.shareUrl}`); const cp = $('#copyLink'); if (cp) cp.onclick = async (e) => { e.preventDefault(); try { await navigator.clipboard.writeText(CONFIG.shareUrl); alert(t('foot.copied')); } catch(_){ prompt('', CONFIG.shareUrl); } }; })();
(function reveal(){ if (!('IntersectionObserver' in window) || reduced) return; document.documentElement.classList.add('js-rv');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold:.12, rootMargin:'0px 0px -8% 0px' });
  const watch = () => $$('.rv').forEach(el => io.observe(el)); watch(); addEventListener('load', watch); setTimeout(() => $$('.rv').forEach(el => el.classList.add('in')), 4000); })();

/* ═══════════════════════════════════════════════════════════════════
   THE WALK — press start and the star takes you through, one thing
   at a time. Each step waits for what you must do, thanks you, moves.
   ═══════════════════════════════════════════════════════════════════ */
const TOUR = [
  { k:'seal',  say:'guide.s1', ok:'guide.ok1', wait:() => done.has('seal') },
  { k:'name',  say:'guide.s2', ok:'guide.ok2', wait:() => done.has('name'), focus:'#nameInput', skip:true },
  { k:'story', say:'guide.s3', ok:'guide.ok3', wait:() => done.has('story'), skip:true, enter:() => { if (window.__reelRestart) window.__reelRestart(); } },
  { k:'place', say:'guide.s4', ok:'guide.ok4', wait:() => done.has('place'), skip:true, focus:'#placeInput', mid:{ when:() => !!currentGov, say:'guide.s4b', el:'#rippleBtn' } },
  { k:'day',   say:'guide.s5', ok:'guide.ok5', wait:() => done.has('day'), skip:true },
  { k:'card',  say:'guide.s6', ok:'guide.ok6', wait:() => done.has('card'), skip:true },
  { k:'end',   say:'guide.s7', ok:'guide.ok7', wait:() => done.has('end') && !!sealNo },
];
let tourI = -1, tourMid = false, tourTimer = 0, tourBusy = false, tourPending = false;
const gsay = (key, pulse) => { const el = $('#guideText'); if (!el) return; el.textContent = t(key).replace('{name}', userName || ''); if (pulse){ el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); } };
function scrollToStep(sel){ const el = $(sel); if (!el) return; const top = sel === '#card .cardframe' || sel === '#picker'; el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: top ? 'start' : 'center' }); }
function tourStep(i){ tourBusy = false; tourI = i; tourMid = false; const st = TOUR[i]; if (!st){ return; } curStep = st.k; paintThread(); if (window.__dnaRedraw) window.__dnaRedraw();
  const chip = $('#guideChip'); chip.hidden = !st.skip; chip.textContent = t('guide.skip'); chip.onclick = () => { done.add(st.k); tourNext(false); };
  if (st.wait()){ tourNext(true); return; }
  tourPending = true; const el0 = $(STEP_EL[st.k]); const r0 = el0 ? el0.getBoundingClientRect() : null; if (r0 && r0.top < innerHeight*.7 && r0.bottom > 0){ tourPending = false; gsay(st.say, true); if (st.enter) st.enter(); } else gsay('guide.down', true);
  clearInterval(tourTimer); tourTimer = setInterval(tourPoke, 400); }
function tourPoke(){ if (!walking || tourI < 0) return; const st = TOUR[tourI]; if (!st) return;
  if (tourPending){ const el = $(STEP_EL[st.k]); const r = el ? el.getBoundingClientRect() : null; if (r && r.top < innerHeight*.7 && r.bottom > 0){ tourPending = false; gsay(st.say, true); if (st.enter) st.enter(); } else if (!st.wait()) return; }
  if (st.mid && !tourMid && st.mid.when()){ tourMid = true; gsay(st.mid.say, true); scrollToStep(st.mid.el); }
  if (st.wait()) tourNext(true); }
function tourNext(thank){ if (tourBusy) return; tourBusy = true; clearInterval(tourTimer); const st = TOUR[tourI]; $('#guideChip').hidden = true;
  if (thank && st){ gsay(st.ok, true); starBurst(); }
  const last = tourI >= TOUR.length - 1; if (last) return;
  setTimeout(() => tourStep(tourI + 1), thank ? 2600 : 200); }
window.__tourPoke = () => { if (walking) tourPoke(); };
(function walk(){ const btn = $('#startBtn'), bar = $('#guide'); if (!btn || !bar) return;
  btn.onclick = () => { walking = true; document.body.classList.add('walk'); bar.hidden = false; record('start'); tourStep(0); };
})();

/* ── go ──────────────────────────────────────────────────────────── */
paintStrings(); buildThread(); buildQuick(); paintChosen(); buildCardLangs(); buildSwatches(); paintPhotoUI(); paintSealNo(); paintReceipt(); drawCards(); measureProg();
addEventListener('load', () => { measureProg(); paintThread(); });

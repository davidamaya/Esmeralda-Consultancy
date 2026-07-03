/* Esmeralda Consultancy — shared script */

/* ================= CONFIG — edit these two lines only ================= */
var CONTACT_EMAIL = "hello@esmeralda.example"; // TODO before launch
var CONTACT_PHONE = "";                        // e.g. "(209) 555-0134" — leave "" to hide phone rows

/* ================= config injection ================= */
document.querySelectorAll('.mailtxt').forEach(function(el){ el.textContent = CONTACT_EMAIL; });
document.querySelectorAll('a.maillink').forEach(function(el){ el.href = 'mailto:' + CONTACT_EMAIL; el.textContent = CONTACT_EMAIL; });
document.querySelectorAll('[data-phone-row]').forEach(function(row){
  if (!CONTACT_PHONE){ row.remove(); return; }
  var a = row.querySelector('a.phonelink');
  if (a){ a.href = 'tel:' + CONTACT_PHONE.replace(/[^\d+]/g,''); a.textContent = CONTACT_PHONE; }
});

/* ================= language (persists across pages via ?lang=es) ================= */
var LANG = 'en';
function withLang(href, l){
  var hash = '';
  var h = href.indexOf('#');
  if (h > -1){ hash = href.slice(h); href = href.slice(0, h); }
  var q = href.indexOf('?');
  if (q > -1) href = href.slice(0, q);
  return href + (l === 'es' ? '?lang=es' : '') + hash;
}
function setLang(l){
  LANG = l;
  document.body.classList.toggle('lang-es', l === 'es');
  document.documentElement.lang = l === 'es' ? 'es' : 'en';
  var be = document.getElementById('btn-en'), bs = document.getElementById('btn-es');
  if (be) be.classList.toggle('on', l === 'en');
  if (bs) bs.classList.toggle('on', l === 'es');
  document.querySelectorAll('a.il').forEach(function(a){
    a.setAttribute('href', withLang(a.getAttribute('href'), l));
  });
  if (typeof buildOptions === 'function' && document.getElementById('ntype')) buildOptions();
  if (typeof renderResult === 'function' && window.lastCalc) renderResult(window.lastCalc);
}
(function(){
  var p = new URLSearchParams(location.search);
  setLang(p.get('lang') === 'es' ? 'es' : 'en');
})();

/* ================= deadline calculator (deadlines.html) ================= */
var TYPES = [
  { id:'det',  add:{days:30},  en:'EDD Notice of Determination (UI, SDI, or PFL) — 30 days to appeal',        es:'Aviso de Determinación del EDD (desempleo, SDI o PFL) — 30 días para apelar' },
  { id:'over', add:{days:30},  en:'EDD Notice of Overpayment — 30 days to appeal',                             es:'Aviso de Sobrepago del EDD — 30 días para apelar' },
  { id:'alj',  add:{days:30},  en:"CUIAB judge's decision — 30 days to appeal to the Board",                   es:'Decisión del juez de la CUIAB — 30 días para apelar ante la Junta' },
  { id:'tax',  add:{days:30},  en:'EDD Notice of Assessment — 30 days to petition for reassessment',           es:'Aviso de Liquidación del EDD — 30 días para pedir reevaluación' },
  { id:'crd',  add:{years:3},  en:'Discrimination, harassment, or retaliation — 3 years to file with the CRD', es:'Discriminación, acoso o represalias — 3 años para presentar queja ante el CRD' },
  { id:'rts',  add:{years:1},  en:'CRD right-to-sue notice — 1 year to file a civil suit',                      es:'Aviso de derecho a demandar del CRD — 1 año para presentar demanda civil' }
];
var S = {
  en:{ rolled:' (moved past the weekend)', today:'Due today. File it now.', left1:'1 day left. Move now.',
       leftFew:function(n){return n+' days left. Move now.';}, leftOk:function(n){return 'You have '+n+' days.';},
       past:function(n){return 'This window closed '+(n===1?'1 day':n+' days')+' ago.';},
       pastNote:'Late filings are sometimes excused for good cause. Send us the notice anyway and we\u2019ll tell you straight.',
       dateFrom:'Counted from the date on the notice.' },
  es:{ rolled:' (recorrida por el fin de semana)', today:'Vence hoy. Preséntelo ya.', left1:'Queda 1 día. Actúe ya.',
       leftFew:function(n){return 'Quedan '+n+' días. Actúe ya.';}, leftOk:function(n){return 'Le quedan '+n+' días.';},
       past:function(n){return 'Este plazo cerró hace '+(n===1?'1 día':n+' días')+'.';},
       pastNote:'Una presentación tardía a veces se acepta por causa justificada. Mándenos el aviso de todos modos y le decimos la verdad.',
       dateFrom:'Contado desde la fecha del aviso.' }
};
function buildOptions(){
  var sel = document.getElementById('ntype');
  if (!sel) return;
  var cur = sel.value;
  sel.innerHTML = '';
  TYPES.forEach(function(t){
    var o = document.createElement('option');
    o.value = t.id;
    o.textContent = LANG === 'es' ? t.es : t.en;
    sel.appendChild(o);
  });
  if (cur) sel.value = cur;
}
window.lastCalc = null;
function calcDeadline(){
  var sel = document.getElementById('ntype');
  var dv = document.getElementById('ndate').value;
  if (!dv){ document.getElementById('ndate').focus(); return; }
  var p = dv.split('-');
  var d = new Date(+p[0], +p[1]-1, +p[2]);
  var t = TYPES.find(function(x){ return x.id === sel.value; });
  if (t.add.days) d.setDate(d.getDate() + t.add.days);
  if (t.add.years) d.setFullYear(d.getFullYear() + t.add.years);
  var rolled = false;
  while (d.getDay() === 0 || d.getDay() === 6){ d.setDate(d.getDate() + 1); rolled = true; }
  window.lastCalc = { d:d, rolled:rolled };
  renderResult(window.lastCalc);
}
function renderResult(c){
  var s = S[LANG];
  var box = document.getElementById('result');
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var diff = Math.round((c.d - today) / 86400000);
  var fmt = new Intl.DateTimeFormat(LANG === 'es' ? 'es-MX' : 'en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  document.getElementById('dlDate').textContent = fmt.format(c.d) + (c.rolled ? s.rolled : '');
  var pill = document.getElementById('dlPill'), note = document.getElementById('dlNote');
  box.classList.remove('ok','warn','past');
  if (diff < 0){ box.classList.add('past'); pill.textContent = s.past(-diff); note.textContent = s.pastNote; }
  else if (diff === 0){ box.classList.add('warn'); pill.textContent = s.today; note.textContent = s.dateFrom; }
  else if (diff <= 14){ box.classList.add('warn'); pill.textContent = diff === 1 ? s.left1 : s.leftFew(diff); note.textContent = s.dateFrom; }
  else { box.classList.add('ok'); pill.textContent = s.leftOk(diff); note.textContent = s.dateFrom; }
  box.classList.add('show');
}
buildOptions();

/* ================= contact form (contact.html) ================= */
var SIDE = 'worker';
function setSide(s){
  SIDE = s;
  document.getElementById('pWorker').classList.toggle('on', s === 'worker');
  document.getElementById('pEmployer').classList.toggle('on', s === 'employer');
}
var cform = document.getElementById('cform');
if (cform){
  cform.addEventListener('submit', function(e){
    e.preventDefault();
    var f = e.target;
    var ok = document.getElementById('fOk'), err = document.getElementById('fErr');
    ok.style.display = 'none'; err.style.display = 'none';
    if (!f.name.value || !f.email.value || !f.message.value){ f.reportValidity(); return; }
    fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'Esmeralda Consultancy — new case review request',
        side: SIDE,
        name: f.name.value,
        phone: f.phone.value,
        email: f.email.value,
        message: f.message.value
      })
    }).then(function(r){
      if (!r.ok) throw new Error();
      ok.style.display = 'block';
      f.reset(); setSide('worker');
    }).catch(function(){
      err.style.display = 'block';
    });
  });
}

/* ================= reveal on scroll ================= */
(function(){
  var els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches){
    els.forEach(function(el){ el.classList.add('on'); }); return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('on'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(function(el){ io.observe(el); });
})();

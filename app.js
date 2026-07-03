/* Esmeralda Consultancy shared script */

/* ================= CONFIG: edit these two lines only ================= */
var CONTACT_EMAIL = "hello@esmeralda.example"; // TODO before launch
var CONTACT_PHONE = "";                        // e.g. "(209) 555-0134". Leave "" to hide phone rows

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
  if (typeof renderTriage === 'function') renderTriage();
}

/* ================= statute links ================= */
function lawUIC(n, txt){ return '<a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=UIC&sectionNum=' + n + '." target="_blank" rel="noopener">' + txt + '</a>'; }
function lawGOV(n, txt){ return '<a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=' + n + '." target="_blank" rel="noopener">' + txt + '</a>'; }

/* ================= triage tool (start.html) ================= */
var SCEN = {
  worker: [
    { id:'w1',
      label:{en:'Fired, and the EDD denied my unemployment', es:'Me despidieron y el EDD me negó el desempleo'},
      forum:'EDD · CUIAB',
      title:{en:'A misconduct denial. The most winnable case at the CUIAB.', es:'Una negación por mala conducta. El caso más ganable en la CUIAB.'},
      clock:{en:'30 days from the mailing date on the Notice of Determination (' + lawUIC('1328','Unemp. Ins. Code section 1328') + ').', es:'30 días desde la fecha de envío del Aviso de Determinación (' + lawUIC('1328','Código de Seguro de Desempleo, artículo 1328') + ').'},
      win:{days:30},
      path:{en:['Appeal in writing within the window on your notice.','Keep certifying for benefits every two weeks, no exceptions.','CUIAB hearing before a judge; we prepare you and appear with you.','The decision arrives by mail; if it\u2019s wrong, there are 30 more days to reach the Appeals Board.'],
            es:['Apele por escrito dentro del plazo de su aviso.','Siga certificando sus beneficios cada dos semanas, sin falta.','Audiencia ante un juez de la CUIAB; lo preparamos y comparecemos con usted.','La decisión llega por correo; si está mal, hay 30 días más para apelar ante la Junta.']},
      gather:{en:['The notice, both sides.','Termination letter, texts, or details of the final conversation.','Write-ups or warnings, and who was present at the end.'],
              es:['El aviso, por los dos lados.','Carta de despido, mensajes o detalles de la última conversación.','Reportes o advertencias, y quién estuvo presente al final.']},
      note:{en:'Misconduct means a deliberate breach of a known duty. Not a mistake, not \u201cnot a good fit.\u201d The employer has the burden, and many of these flip at hearing.', es:'Mala conducta significa una falta deliberada a un deber conocido. No un error, ni \u201cno encajaba\u201d. La carga de la prueba es del empleador, y muchos de estos casos se voltean en la audiencia.'} },
    { id:'w2',
      label:{en:'I quit, and the EDD denied me', es:'Renuncié y el EDD me negó'},
      forum:'EDD · CUIAB',
      title:{en:'A voluntary-quit case turns on good cause.', es:'Un caso de renuncia se decide por la causa justificada.'},
      clock:{en:'30 days from the mailing date on the Notice of Determination (' + lawUIC('1328','Unemp. Ins. Code section 1328') + ').', es:'30 días desde la fecha de envío del Aviso de Determinación (' + lawUIC('1328','Código de Seguro de Desempleo, artículo 1328') + ').'},
      win:{days:30},
      path:{en:['Appeal in writing within the window on your notice.','Keep certifying every two weeks while it\u2019s pending.','At the hearing, the question is why you left and what you tried first.','Decision by mail, with 30 more days to the Appeals Board if needed.'],
            es:['Apele por escrito dentro del plazo de su aviso.','Siga certificando cada dos semanas mientras está pendiente.','En la audiencia, la pregunta es por qué se fue y qué intentó antes.','Decisión por correo, con 30 días más para la Junta si hace falta.']},
      gather:{en:['Proof you raised the problem before leaving: complaints, texts, emails.','Documents behind the reason: medical notes, pay cuts, schedule changes, safety issues.','Your resignation message, if you sent one.'],
              es:['Prueba de que planteó el problema antes de irse: quejas, mensajes, correos.','Documentos de la razón: notas médicas, recortes de pago, cambios de horario, problemas de seguridad.','Su mensaje de renuncia, si lo mandó.']},
      note:{en:'These cases turn on whether you gave the employer a real chance to fix the problem before you left. If you did, say so with dates.', es:'Estos casos dependen de si usted le dio al empleador una oportunidad real de arreglar el problema antes de irse. Si lo hizo, dígalo con fechas.'} },
    { id:'w3',
      label:{en:'I got a Notice of Overpayment', es:'Recibí un Aviso de Sobrepago'},
      forum:'EDD · CUIAB',
      title:{en:'Two separate fights: is it real, and must you repay it.', es:'Dos peleas distintas: si es real, y si debe devolverlo.'},
      clock:{en:'30 days from the mailing date on the Notice of Overpayment.', es:'30 días desde la fecha de envío del Aviso de Sobrepago.'},
      win:{days:30},
      path:{en:['Appeal within the window, even if part of it is right.','If the debt is real but not your fault, ask about a waiver.','Fight any false-statement finding hard: it adds penalties and disqualification weeks.','Hearing, then decision by mail.'],
            es:['Apele dentro del plazo, aunque una parte sea correcta.','Si la deuda es real pero no fue su culpa, pregunte por la exención.','Pelee con todo cualquier cargo por declaración falsa: agrega castigos y semanas de descalificación.','Audiencia, y luego decisión por correo.']},
      gather:{en:['The full notice, every page, including the calculation.','Your certification history.','Proof of what you reported and when.'],
              es:['El aviso completo, todas las páginas, incluido el cálculo.','Su historial de certificaciones.','Prueba de qué reportó y cuándo.']},
      note:{en:'If the false-statement box is checked, treat it as serious. That finding, not the dollar amount, is usually the expensive part.', es:'Si viene marcado el cargo por declaración falsa, tómelo en serio. Ese cargo, no la cantidad, suele ser la parte cara.'} },
    { id:'w4',
      label:{en:'My SDI or Paid Family Leave was denied', es:'Me negaron el SDI o el permiso familiar (PFL)'},
      forum:'EDD · CUIAB',
      title:{en:'Disability denials are usually a medical-evidence problem.', es:'Las negaciones de incapacidad casi siempre son un problema de evidencia médica.'},
      clock:{en:'30 days from the mailing date on the disability determination.', es:'30 días desde la fecha de envío de la determinación de incapacidad.'},
      win:{days:30},
      path:{en:['Appeal within the window on your notice.','Get your medical certification tightened up. That\u2019s where these are won.','Hearing before a CUIAB judge, usually by phone.','Decision by mail, with 30 more days to the Appeals Board if needed.'],
            es:['Apele dentro del plazo de su aviso.','Refuerce su certificación médica. Ahí se ganan estos casos.','Audiencia ante un juez de la CUIAB, normalmente por teléfono.','Decisión por correo, con 30 días más para la Junta si hace falta.']},
      gather:{en:['The denial notice.','Your doctor\u2019s certification and contact information.','A plain description of your job duties.'],
              es:['El aviso de negación.','La certificación de su médico y sus datos de contacto.','Una descripción sencilla de sus funciones de trabajo.']},
      note:{en:'The judge needs the medical picture to match the job duties. We make sure it does before anyone testifies.', es:'El juez necesita que el cuadro médico coincida con las funciones del trabajo. Nosotros nos aseguramos de eso antes de que alguien testifique.'} },
    { id:'w5',
      label:{en:'I lost my CUIAB hearing', es:'Perdí mi audiencia en la CUIAB'},
      forum:'EDD · CUIAB',
      title:{en:'Second level: the Appeals Board reviews the record.', es:'Segundo nivel: la Junta de Apelaciones revisa el registro.'},
      clock:{en:'30 days from the mailing date on the judge\u2019s decision (' + lawUIC('1336','Unemp. Ins. Code section 1336') + ').', es:'30 días desde la fecha de envío de la decisión del juez (' + lawUIC('1336','Código de Seguro de Desempleo, artículo 1336') + ').'},
      win:{days:30},
      path:{en:['Appeal to the Appeals Board within 30 days of the judge\u2019s decision.','The Board decides on the record made at your hearing. New evidence rarely comes in.','A written argument pointing at what the judge got wrong does the work.','Beyond the Board is court, with strict deadlines. That\u2019s attorney territory, and we\u2019ll say so.'],
            es:['Apele ante la Junta dentro de los 30 días de la decisión del juez.','La Junta decide con el registro de su audiencia. Casi nunca entra evidencia nueva.','El trabajo lo hace un escrito que señale en qué se equivocó el juez.','Después de la Junta viene el tribunal, con plazos estrictos. Es territorio de abogados, y se lo diremos.']},
      gather:{en:['The written decision.','Your notes on what went wrong or what never got said.','Any exhibit the judge refused or ignored.'],
              es:['La decisión por escrito.','Sus notas de qué salió mal o qué nunca se dijo.','Cualquier prueba que el juez rechazó o ignoró.']},
      note:{en:'If the record from the first hearing is thin, be honest with yourself about the odds. We will be honest with you.', es:'Si el registro de la primera audiencia quedó flojo, sea honesto consigo mismo sobre las probabilidades. Nosotros seremos honestos con usted.'} },
    { id:'w6',
      label:{en:'Discrimination, harassment, or retaliation', es:'Discriminación, acoso o represalias'},
      forum:'CRD · EEOC',
      title:{en:'A civil-rights complaint starts with the CRD.', es:'Una queja de derechos civiles empieza en el CRD.'},
      clock:{en:'3 years from the last discriminatory act to file with the CRD (' + lawGOV('12960','Gov. Code section 12960') + '). After a right-to-sue notice: 1 year to file suit (' + lawGOV('12965','Gov. Code section 12965') + ').', es:'3 años desde el último acto discriminatorio para presentar ante el CRD (' + lawGOV('12960','Código de Gobierno, artículo 12960') + '). Después del aviso de derecho a demandar: 1 año para demandar (' + lawGOV('12965','Código de Gobierno, artículo 12965') + ').'},
      win:{years:3},
      path:{en:['File an intake with the CRD, dual-filed with the EEOC where it applies.','The complaint is drafted, signed, and served; the employer responds.','Investigation, with free mediation offered along the way. Many cases settle here.','If it doesn\u2019t resolve: a right-to-sue notice, then 1 year to file in court.'],
            es:['Presente la queja inicial ante el CRD, registrada también ante la EEOC cuando aplica.','La queja se redacta, se firma y se notifica; el empleador responde.','Investigación, con mediación gratuita en el camino. Muchos casos se arreglan aquí.','Si no se resuelve: un aviso de derecho a demandar, y 1 año para ir al tribunal.']},
      gather:{en:['A dated timeline of every incident. Write it now while it\u2019s fresh.','Texts, emails, photos, saved somewhere the employer can\u2019t reach.','Names of witnesses and any HR complaints you made.'],
              es:['Una cronología con fechas de cada incidente. Escríbala ahora que está fresca.','Mensajes, correos, fotos, guardados donde el empleador no alcance.','Nombres de testigos y las quejas que puso ante Recursos Humanos.']},
      note:{en:'The timeline you write this week is worth more than the one you try to remember next year.', es:'La cronología que escriba esta semana vale más que la que intente recordar el próximo año.'} }
  ],
  employer: [
    { id:'e1',
      label:{en:'A former employee\u2019s claim is going to hearing', es:'El reclamo de un exempleado va a audiencia'},
      forum:'EDD · CUIAB',
      title:{en:'One hearing sets the charge for the life of the claim.', es:'Una audiencia fija el cargo por toda la vida del reclamo.'},
      clock:{en:'The hearing date is printed on the Notice of Hearing, typically at least 10 days out. The prep window is short.', es:'La fecha de la audiencia viene impresa en el aviso, normalmente con al menos 10 días de anticipación. El tiempo de preparación es corto.'},
      win:null,
      path:{en:['Read the hearing packet the day it arrives. Exhibits must reach the judge and the other side before the hearing.','Line up the firsthand witness: the person who was in the room, not HR with a summary.','We prepare testimony and the questions for the other side.','Hearing, then decision by mail, with 30 days to the Appeals Board if it goes wrong.'],
            es:['Lea el paquete de la audiencia el día que llegue. Las pruebas deben llegar al juez y a la otra parte antes de la audiencia.','Consiga al testigo directo: la persona que estuvo presente, no Recursos Humanos con un resumen.','Preparamos el testimonio y las preguntas para la otra parte.','Audiencia, luego decisión por correo, con 30 días para la Junta si sale mal.']},
      gather:{en:['The hearing notice and the full packet.','The supervisor or witness with firsthand knowledge.','The policy involved, with the signed acknowledgment, and the final-incident documents.'],
              es:['El aviso de audiencia y el paquete completo.','El supervisor o testigo con conocimiento directo.','La política aplicable con el acuse firmado, y los documentos del incidente final.']},
      note:{en:'Secondhand statements get dismissed as hearsay. Employers lose winnable hearings by sending the wrong person.', es:'Las declaraciones de oídas el juez las descarta. Los empleadores pierden audiencias ganables por mandar a la persona equivocada.'} },
    { id:'e2',
      label:{en:'My company received a CRD complaint', es:'Mi empresa recibió una queja del CRD'},
      forum:'CRD · EEOC',
      title:{en:'The position statement is the case. Write it once, write it right.', es:'La declaración de posición es el caso. Se escribe una vez, y bien.'},
      clock:{en:'The CRD sets your response date in its letter. It\u2019s short, and extensions are requested, not assumed.', es:'El CRD fija su fecha de respuesta en la carta. Es corta, y las prórrogas se piden, no se dan por hechas.'},
      win:null,
      path:{en:['Calendar the response date from the CRD\u2019s letter and put a litigation hold on records.','Build the position statement on documents and comparators, not adjectives.','Take mediation seriously. It\u2019s free, confidential, and often the cheapest exit.','If it proceeds: investigation, then closure, CRD action, or a right-to-sue.'],
            es:['Anote la fecha de respuesta de la carta del CRD y congele los registros relevantes.','Construya la declaración de posición con documentos y comparaciones, no con adjetivos.','Tome en serio la mediación. Es gratuita, confidencial y muchas veces la salida más barata.','Si sigue: investigación, y luego cierre, acción del CRD o un derecho a demandar.']},
      gather:{en:['The complaint and the CRD\u2019s letter.','The complainant\u2019s full personnel file and the files of comparable employees.','Every document about the decision at issue, before anyone \u201ccleans up\u201d.'],
              es:['La queja y la carta del CRD.','El expediente completo del quejoso y los de empleados comparables.','Todo documento sobre la decisión en cuestión, antes de que alguien \u201climpie\u201d.']},
      note:{en:'Do not touch the complainant\u2019s pay, schedule, or status while this is open. Retaliation is the easiest second claim to prove.', es:'No toque el pago, el horario ni el estatus del quejoso mientras esto esté abierto. Las represalias son la segunda queja más fácil de probar.'} },
    { id:'e3',
      label:{en:'An EDD payroll audit or Notice of Assessment', es:'Una auditoría de nómina o Aviso de Liquidación del EDD'},
      forum:'EDD · CUIAB',
      title:{en:'Classification audits snowball. The sample becomes the rule.', es:'Las auditorías de clasificación crecen como bola de nieve. La muestra se vuelve la regla.'},
      clock:{en:'30 days from the Notice of Assessment to petition for reassessment (' + lawUIC('1222','Unemp. Ins. Code section 1222') + ').', es:'30 días desde el Aviso de Liquidación para pedir la reevaluación (' + lawUIC('1222','Código de Seguro de Desempleo, artículo 1222') + ').'},
      win:{days:30},
      path:{en:['Petition for reassessment within 30 days. This preserves everything.','Assemble the working relationship: contracts, invoices, who controls the how.','The petition goes before a CUIAB judge in the tax setting.','Decision, with a further appeal to the Appeals Board available.'],
            es:['Pida la reevaluación dentro de 30 días. Eso lo preserva todo.','Documente la relación de trabajo: contratos, facturas, quién controla el cómo.','La petición se ve ante un juez de la CUIAB en materia de impuestos.','Decisión, con apelación adicional ante la Junta disponible.']},
      gather:{en:['The assessment and the auditor\u2019s worksheets.','Contracts, invoices, and payment records for the workers at issue.','Anything showing the workers run their own business.'],
              es:['La liquidación y las hojas de trabajo del auditor.','Contratos, facturas y registros de pago de los trabajadores en cuestión.','Todo lo que muestre que los trabajadores tienen su propio negocio.']},
      note:{en:'How one sampled worker is classified becomes the template for everyone like them. Fight the template, not just the number.', es:'La clasificación de un trabajador de la muestra se vuelve la plantilla para todos los parecidos. Pelee la plantilla, no solo la cifra.'} }
  ]
};

var TSTR = {
  en:{ pathH:'Your path', gatherH:'Gather now', dateL:'Date printed on your notice', calc:'Compute my date',
       fileBy:'File by', rolled:' (moved past the weekend)', today:'Due today. File it now.',
       left:function(n){return n===1?'1 day left. Move now.':(n<=14?n+' days left. Move now.':'You have '+n+' days.');},
       past:function(n){return 'This window closed '+(n===1?'1 day':n+' days')+' ago.';},
       pastNote:'Late filings are sometimes excused for good cause. Send us the notice anyway and we\u2019ll tell you straight.',
       cta:'Get a free case review' },
  es:{ pathH:'Su camino', gatherH:'Junte desde ahora', dateL:'Fecha impresa en su aviso', calc:'Calcular mi fecha',
       fileBy:'Presente a más tardar el', rolled:' (recorrida por el fin de semana)', today:'Vence hoy. Preséntelo ya.',
       left:function(n){return n===1?'Queda 1 día. Actúe ya.':(n<=14?'Quedan '+n+' días. Actúe ya.':'Le quedan '+n+' días.');},
       past:function(n){return 'Este plazo cerró hace '+(n===1?'1 día':n+' días')+'.';},
       pastNote:'Una presentación tardía a veces se acepta por causa justificada. Mándenos el aviso de todos modos y le decimos la verdad.',
       cta:'Revisión gratuita de su caso' },
};

var triSide = null, triSit = null, triDate = '';

function pickSide(s){
  triSide = s; triSit = null; triDate = '';
  renderTriage();
}
function pickSit(id){
  triSit = id; triDate = '';
  renderTriage();
  var r = document.getElementById('triResult');
  if (r && r.scrollIntoView) r.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function renderTriage(){
  var root = document.getElementById('triage');
  if (!root) return;
  var t = TSTR[LANG];
  var pw = document.getElementById('sideWorker'), pe = document.getElementById('sideEmployer');
  pw.classList.toggle('on', triSide === 'worker');
  pe.classList.toggle('on', triSide === 'employer');
  var step2 = document.getElementById('step2');
  step2.classList.toggle('show', !!triSide);
  var sits = document.getElementById('sits');
  sits.innerHTML = '';
  if (triSide){
    SCEN[triSide].forEach(function(s){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sit' + (triSit === s.id ? ' on' : '');
      b.textContent = s.label[LANG];
      b.onclick = function(){ pickSit(s.id); };
      sits.appendChild(b);
    });
  }
  var box = document.getElementById('triResult');
  if (!triSide || !triSit){ box.className = 'tri-result'; box.innerHTML = ''; return; }
  var s = SCEN[triSide].find(function(x){ return x.id === triSit; });
  var html = '';
  html += '<div class="forum">' + s.forum + '</div>';
  html += '<h3>' + s.title[LANG] + '</h3>';
  html += '<p class="tri-clock">' + s.clock[LANG] + '</p>';
  if (s.win){
    html += '<div class="tri-date"><div><label class="field" for="triD">' + t.dateL + '</label>' +
            '<input type="date" id="triD" value="' + triDate + '" onchange="triDate=this.value"></div>' +
            '<button class="btn" type="button" onclick="triCalc()">' + t.calc + '</button>' +
            '<div class="dl-out" id="dlOut" style="flex-basis:100%"><div class="small" style="text-transform:uppercase;letter-spacing:.1em;font-weight:700">' + t.fileBy + '</div>' +
            '<div class="dl-date" id="dlDate"></div><div class="dl-pill" id="dlPill"></div><div class="dl-note" id="dlNote"></div></div></div>';
  }
  html += '<div class="tri-h">' + t.pathH + '</div><ol class="tri-path">';
  s.path[LANG].forEach(function(p){ html += '<li>' + p + '</li>'; });
  html += '</ol>';
  html += '<div class="tri-h">' + t.gatherH + '</div><ul class="tri-gather">';
  s.gather[LANG].forEach(function(g){ html += '<li>' + g + '</li>'; });
  html += '</ul>';
  html += '<p class="tri-note">' + s.note[LANG] + '</p>';
  html += '<div class="tri-cta"><a class="btn il" href="' + withLang('index.html#review', LANG) + '">' + t.cta + '</a></div>';
  box.className = 'tri-result show';
  box.innerHTML = html;
  if (triDate) triCalc();
}

function triCalc(){
  var inp = document.getElementById('triD');
  if (!inp || !inp.value){ if (inp) inp.focus(); return; }
  triDate = inp.value;
  var s = SCEN[triSide].find(function(x){ return x.id === triSit; });
  var p = triDate.split('-');
  var d = new Date(+p[0], +p[1]-1, +p[2]);
  if (s.win.days) d.setDate(d.getDate() + s.win.days);
  if (s.win.years) d.setFullYear(d.getFullYear() + s.win.years);
  var rolled = false;
  while (d.getDay() === 0 || d.getDay() === 6){ d.setDate(d.getDate() + 1); rolled = true; }
  var t = TSTR[LANG];
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var diff = Math.round((d - today) / 86400000);
  var fmt = new Intl.DateTimeFormat(LANG === 'es' ? 'es-MX' : 'en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  var out = document.getElementById('dlOut');
  document.getElementById('dlDate').textContent = fmt.format(d) + (rolled ? t.rolled : '');
  var pill = document.getElementById('dlPill'), note = document.getElementById('dlNote');
  out.classList.remove('ok','warn','past');
  if (diff < 0){ out.classList.add('past'); pill.textContent = t.past(-diff); note.textContent = t.pastNote; note.style.display = 'block'; }
  else if (diff === 0){ out.classList.add('warn'); pill.textContent = t.today; note.textContent = ''; note.style.display = 'none'; }
  else { out.classList.add(diff <= 14 ? 'warn' : 'ok'); pill.textContent = t.left(diff); note.textContent = ''; note.style.display = 'none'; }
  out.classList.add('show');
}

/* ================= review form (home) ================= */
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
        _subject: 'Esmeralda Consultancy: new case review request',
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

/* ================= init language, then reveal ================= */
(function(){
  var p = new URLSearchParams(location.search);
  setLang(p.get('lang') === 'es' ? 'es' : 'en');
})();
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

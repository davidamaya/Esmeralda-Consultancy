/* Esmeralda Consultancy shared script */

/* ================= CONFIG: edit these two lines only ================= */
var CONTACT_EMAIL = "hello@esmeralda.example"; // TODO before launch
var CONTACT_PHONE = "";                        // e.g. "(209) 555-0134". Leave "" to hide phone rows

/* ================= config injection ================= */
var MAIL_OK = CONTACT_EMAIL && CONTACT_EMAIL.indexOf('.example') === -1;
document.querySelectorAll('.mailtxt').forEach(function(el){
  if (MAIL_OK){ el.textContent = CONTACT_EMAIL; }
  else { var p = el.closest('p, .c-line'); if (p) p.style.display = 'none'; else el.style.display = 'none'; }
});
document.querySelectorAll('a.maillink').forEach(function(el){
  if (MAIL_OK){ el.href = 'mailto:' + CONTACT_EMAIL; el.textContent = CONTACT_EMAIL; }
  else { var c = el.closest('.c-line'); if (c) c.style.display = 'none'; else el.style.display = 'none'; }
});
document.querySelectorAll('[data-phone-row]').forEach(function(row){
  if (!CONTACT_PHONE){ row.remove(); return; }
  var a = row.querySelector('a.phonelink');
  if (a){ a.href = 'tel:' + CONTACT_PHONE.replace(/[^\d+]/g,''); a.textContent = CONTACT_PHONE; }
});

/* ================= language (persists across pages via ?lang=es) ================= */
var LANG = 'en';
function toggleMenu(b){
  var n = document.querySelector('nav.main');
  var open = n.classList.toggle('open');
  b.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function withLang(href, l){
  var hash = '';
  var h = href.indexOf('#');
  if (h > -1){ hash = href.slice(h); href = href.slice(0, h); }
  var q = '';
  var qi = href.indexOf('?');
  if (qi > -1){ q = href.slice(qi + 1); href = href.slice(0, qi); }
  var parts = q ? q.split('&').filter(function(p){ return p && p.indexOf('lang=') !== 0; }) : [];
  if (l === 'es') parts.push('lang=es');
  return href + (parts.length ? '?' + parts.join('&') : '') + hash;
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
  var nf = document.getElementById('nfilter');
  if (nf) nf.placeholder = l === 'es' ? 'Filtre por n\u00famero o palabra: 1444, sobrepago, audiencia\u2026' : 'Filter by number or word: 1444, overpayment, hearing\u2026';
  var ai = document.getElementById('askIn');
  if (ai) ai.placeholder = l === 'es' ? 'Pruebe 1444, sobrepago, audiencia\u2026' : 'Try 1444, overpayment, hearing\u2026';
  renderAsk();
  if (typeof renderTriage === 'function') renderTriage();
}

/* ================= statute links ================= */
function lawUIC(n, txt){ return '<a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=UIC&sectionNum=' + n + '." target="_blank" rel="noopener">' + txt + '</a>'; }
function lawGOV(n, txt){ return '<a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=' + n + '." target="_blank" rel="noopener">' + txt + '</a>'; }

/* ================= triage tool (start.html) ================= */
var SCEN = {
  worker: [
    { id:'w0',
      label:{en:'I haven\u2019t filed for unemployment yet', es:'Todav\u00eda no solicito el desempleo'},
      forum:'EDD',
      title:{en:'Filing right is cheaper than appealing later.', es:'Solicitar bien sale m\u00e1s barato que apelar despu\u00e9s.'},
      clock:{en:'No deadline yet, but claims aren\u2019t retroactive: benefits generally start the week you file. Every week you wait is a week you don\u2019t get paid.', es:'Todav\u00eda no hay plazo, pero el reclamo no es retroactivo: los beneficios normalmente empiezan la semana en que usted solicita. Cada semana que espera es una semana que no le pagan.'},
      win:null,
      path:{en:['File the claim with the EDD online; it takes about 30 to 60 minutes.','Certify every two weeks from day one, even while the claim is pending.','If the separation is contested, expect an EDD phone interview. How you answer it shapes everything after.','A written determination follows. If it goes wrong, that\u2019s where we come in, and you\u2019ll be ready.'],
            es:['Presente el reclamo en l\u00ednea con el EDD; toma de 30 a 60 minutos.','Certifique cada dos semanas desde el primer d\u00eda, aunque el reclamo est\u00e9 pendiente.','Si la separaci\u00f3n est\u00e1 en disputa, espere una entrevista telef\u00f3nica del EDD. C\u00f3mo la conteste define todo lo que sigue.','Despu\u00e9s llega una determinaci\u00f3n por escrito. Si sale mal, ah\u00ed entramos nosotros, y usted ya estar\u00e1 listo.']},
      gather:{en:['Your work history for the last 18 months: employers, dates, wages.','The story of the separation, told the same way every time.','Your ID and, if it applies, your work authorization documents.'],
              es:['Su historial de trabajo de los \u00faltimos 18 meses: empleadores, fechas, salarios.','La historia de la separaci\u00f3n, contada igual todas las veces.','Su identificaci\u00f3n y, si aplica, sus documentos de autorizaci\u00f3n de trabajo.']},
      note:{en:'Answer the interview plainly and consistently. Claims are lost at filing more often than at hearing.', es:'Conteste la entrevista con claridad y sin cambiar la versi\u00f3n. Los reclamos se pierden m\u00e1s al solicitar que en la audiencia.'} },
    { id:'w1',
      label:{en:'Fired, and the EDD denied my unemployment', es:'Me despidieron y el EDD me negó el desempleo'},
      forum:'EDD · CUIAB',
      title:{en:'A misconduct denial. The most winnable case at the CUIAB.', es:'Una negación por mala conducta. El caso más ganable en la CUIAB.'},
      clock:{en:'You can appeal within 30 days of the mailing date on the Notice of Determination (' + lawUIC('1328','Unemp. Ins. Code section 1328') + ').', es:'Puede apelar dentro de los 30 días desde la fecha de envío del Aviso de Determinación (' + lawUIC('1328','Código de Seguro de Desempleo, artículo 1328') + ').'},
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
      clock:{en:'You can appeal within 30 days of the mailing date on the Notice of Determination (' + lawUIC('1328','Unemp. Ins. Code section 1328') + ').', es:'Puede apelar dentro de los 30 días desde la fecha de envío del Aviso de Determinación (' + lawUIC('1328','Código de Seguro de Desempleo, artículo 1328') + ').'},
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
      clock:{en:'You can appeal within 30 days of the mailing date on the Notice of Overpayment.', es:'Puede apelar dentro de los 30 días desde la fecha de envío del Aviso de Sobrepago.'},
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
      clock:{en:'You can appeal within 30 days of the mailing date on the disability determination.', es:'Puede apelar dentro de los 30 días desde la fecha de envío de la determinación de incapacidad.'},
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
      clock:{en:'You have 30 days from the mailing date on the judge\u2019s decision to reach the Appeals Board (' + lawUIC('1336','Unemp. Ins. Code section 1336') + ').', es:'Tiene 30 días desde la fecha de envío de la decisión del juez para apelar ante la Junta (' + lawUIC('1336','Código de Seguro de Desempleo, artículo 1336') + ').'},
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
      clock:{en:'You have 3 years from the last discriminatory act to file with the CRD (' + lawGOV('12960','Gov. Code section 12960') + '). After a right-to-sue notice, you have 1 year to file suit (' + lawGOV('12965','Gov. Code section 12965') + ').', es:'Tiene 3 años desde el último acto discriminatorio para presentar ante el CRD (' + lawGOV('12960','Código de Gobierno, artículo 12960') + '). Después del aviso de derecho a demandar, tiene 1 año para demandar (' + lawGOV('12965','Código de Gobierno, artículo 12965') + ').'},
      dateLbl:{en:'Date of the last discriminatory act', es:'Fecha del \u00faltimo acto discriminatorio'},
      win:{years:3},
      path:{en:['File an intake with the CRD, dual-filed with the EEOC where it applies.','The complaint is drafted, signed, and served; the employer responds.','Investigation, with free mediation offered along the way. Many cases settle here.','If it doesn\u2019t resolve: a right-to-sue notice, then 1 year to file in court.'],
            es:['Presente la queja inicial ante el CRD, registrada también ante la EEOC cuando aplica.','La queja se redacta, se firma y se notifica; el empleador responde.','Investigación, con mediación gratuita en el camino. Muchos casos se arreglan aquí.','Si no se resuelve: un aviso de derecho a demandar, y 1 año para ir al tribunal.']},
      gather:{en:['A dated timeline of every incident. Write it now while it\u2019s fresh.','Texts, emails, photos, saved somewhere the employer can\u2019t reach.','Names of witnesses and any HR complaints you made.'],
              es:['Una cronología con fechas de cada incidente. Escríbala ahora que está fresca.','Mensajes, correos, fotos, guardados donde el empleador no alcance.','Nombres de testigos y las quejas que puso ante Recursos Humanos.']},
      note:{en:'The timeline you write this week is worth more than the one you try to remember next year.', es:'La cronología que escriba esta semana vale más que la que intente recordar el próximo año.'} }
  ],
  employer: [
    { id:'e0',
      label:{en:'An employee filed for unemployment', es:'Un empleado solicit\u00f3 el desempleo'},
      forum:'EDD',
      title:{en:'Ten days to become a party to your own case.', es:'Diez d\u00edas para ser parte de su propio caso.'},
      clock:{en:'You have 10 days from the mailing date on the DE 1101CZ to respond.', es:'Tiene 10 d\u00edas desde la fecha de env\u00edo del DE 1101CZ para responder.'},
      win:{days:10, trigger:{en:'the mailing date on the DE 1101CZ', es:'la fecha de env\u00edo del DE 1101CZ'}},
      path:{en:['Respond with facts: dates, the final incident, and who was present.','Attach the records that existed before the separation, not ones written after.','A written ruling follows. If it goes against you, it carries its own 30-day appeal right.','If it reaches a hearing, prepare the firsthand witness early.'],
            es:['Responda con hechos: fechas, el incidente final y qui\u00e9n estuvo presente.','Adjunte los documentos que exist\u00edan antes de la separaci\u00f3n, no los escritos despu\u00e9s.','Despu\u00e9s llega una resoluci\u00f3n por escrito. Si sale en su contra, trae su propio plazo de 30 d\u00edas para apelar.','Si llega a audiencia, prepare temprano al testigo directo.']},
      gather:{en:['The DE 1101CZ, both sides.','Termination or resignation records.','Warnings, write-ups, and attendance records.'],
              es:['El DE 1101CZ, por los dos lados.','Los documentos del despido o la renuncia.','Advertencias, reportes y registros de asistencia.']},
      note:{en:'A conclusion is not a response. \u201cMisconduct\u201d is an opinion; dates, warnings, and the final incident are evidence.', es:'Una conclusi\u00f3n no es una respuesta. \u201cMala conducta\u201d es una opini\u00f3n; las fechas, las advertencias y el incidente final son evidencia.'} },
    { id:'e1',
      label:{en:'A former employee\u2019s claim is going to hearing', es:'El reclamo de un exempleado va a audiencia'},
      forum:'EDD · CUIAB',
      title:{en:'One hearing sets the charge for the life of the claim.', es:'Una audiencia fija el cargo por toda la vida del reclamo.'},
      clock:{en:'The hearing date is printed on the Notice of Hearing, usually at least 10 days out.', es:'La fecha de la audiencia viene impresa en el aviso, normalmente con al menos 10 días de anticipación.'},
      win:null,
      path:{en:['Read the hearing packet the day it arrives. Exhibits must reach the judge and the other side before the hearing.','Line up the firsthand witness: the person who was in the room, not HR with a summary.','We prepare testimony and the questions for the other side.','Hearing, then decision by mail, with 30 days to the Appeals Board if it goes wrong.'],
            es:['Lea el paquete de la audiencia el día que llegue. Las pruebas deben llegar al juez y a la otra parte antes de la audiencia.','Consiga al testigo directo: la persona que estuvo presente, no Recursos Humanos con un resumen.','Preparamos el testimonio y las preguntas para la otra parte.','Audiencia, luego decisión por correo, con 30 días para la Junta si sale mal.']},
      gather:{en:['The hearing notice and the full packet.','The supervisor or witness with firsthand knowledge.','The policy involved, with the signed acknowledgment, and the final-incident documents.'],
              es:['El aviso de audiencia y el paquete completo.','El supervisor o testigo con conocimiento directo.','La política aplicable con el acuse firmado, y los documentos del incidente final.']},
      note:{en:'Secondhand statements get dismissed as hearsay. The person who was in the room is the witness; everyone else is paper.', es:'Las declaraciones de oídas el juez las descarta. El testigo es la persona que estuvo presente; los demás son puro papel.'} },
    { id:'e2',
      label:{en:'My company received a CRD complaint', es:'Mi empresa recibió una queja del CRD'},
      forum:'CRD · EEOC',
      title:{en:'The position statement is the case. Write it once, write it right.', es:'La declaración de posición es el caso. Se escribe una vez, y bien.'},
      clock:{en:'The CRD sets your response date in its letter. It\u2019s short, and extensions are requested, not assumed.', es:'El CRD fija su fecha de respuesta en la carta. Es corta, y las prórrogas se piden, no se dan por hechas.'},
      win:null,
      path:{en:['Calendar the response date from the CRD\u2019s letter and put a litigation hold on records.','Build the position statement on documents and comparators, not adjectives.','Take mediation seriously. It\u2019s free, confidential, and often the cheapest exit.','If it proceeds: investigation, then closure, CRD action, or a right-to-sue.'],
            es:['Anote la fecha de respuesta de la carta del CRD y congele los registros relevantes.','Construya la declaración de posición con documentos y comparaciones, no con adjetivos.','Tome en serio la mediación. Es gratuita, confidencial y muchas veces la salida más barata.','Si sigue: investigación, y luego cierre, acción del CRD o un derecho a demandar.']},
      gather:{en:['The complaint and the CRD\u2019s letter.','The complainant\u2019s full personnel file and the files of comparable employees.','Every document about the decision at issue, before anyone \u201ccleans up.\u201d'],
              es:['La queja y la carta del CRD.','El expediente completo del quejoso y los de empleados comparables.','Todo documento sobre la decisión en cuestión, antes de que alguien \u201climpie\u201d.']},
      note:{en:'Do not touch the complainant\u2019s pay, schedule, or status while this is open. Retaliation is the easiest second claim to prove.', es:'No toque el pago, el horario ni el estatus del quejoso mientras esto esté abierto. Las represalias son la segunda queja más fácil de probar.'} },
    { id:'e3',
      label:{en:'An EDD payroll audit or Notice of Assessment', es:'Una auditoría de nómina o Aviso de Liquidación del EDD'},
      forum:'EDD · CUIAB',
      title:{en:'Classification audits snowball. The sample becomes the rule.', es:'Las auditorías de clasificación crecen como bola de nieve. La muestra se vuelve la regla.'},
      clock:{en:'You have 30 days from the Notice of Assessment to petition for reassessment (' + lawUIC('1222','Unemp. Ins. Code section 1222') + ').', es:'Tiene 30 días desde el Aviso de Liquidación para pedir la reevaluación (' + lawUIC('1222','Código de Seguro de Desempleo, artículo 1222') + ').'},
      win:{days:30},
      path:{en:['Petition for reassessment within 30 days. This preserves everything.','Assemble the working relationship: contracts, invoices, who controls the how.','The petition goes before a CUIAB judge in the tax setting.','Decision, with a further appeal to the Appeals Board available.'],
            es:['Pida la reevaluación dentro de 30 días. Eso lo preserva todo.','Documente la relación de trabajo: contratos, facturas, quién controla el cómo.','La petición se ve ante un juez de la CUIAB en materia de impuestos.','Decisión, con apelación adicional ante la Junta disponible.']},
      gather:{en:['The assessment and the auditor\u2019s worksheets.','Contracts, invoices, and payment records for the workers at issue.','Anything showing the workers run their own business.'],
              es:['La liquidación y las hojas de trabajo del auditor.','Contratos, facturas y registros de pago de los trabajadores en cuestión.','Todo lo que muestre que los trabajadores tienen su propio negocio.']},
      note:{en:'How one sampled worker is classified becomes the template for everyone like them. Fight the template, not just the number.', es:'La clasificación de un trabajador de la muestra se vuelve la plantilla para todos los parecidos. Pelee la plantilla, no solo la cifra.'} },
    { id:'e4',
      label:{en:'The benefit charges look wrong', es:'Los cargos de beneficios se ven mal'},
      forum:'EDD',
      title:{en:'Charges you don\u2019t protest become next year\u2019s tax rate.', es:'Los cargos que no protesta se vuelven la tasa del pr\u00f3ximo a\u00f1o.'},
      clock:{en:'You can protest in writing within 60 days of the issue date on the DE 428T, with up to 60 more for good cause.', es:'Puede protestar por escrito dentro de los 60 d\u00edas desde la emisi\u00f3n del DE 428T, con hasta 60 m\u00e1s por causa justificada.'},
      win:{days:60, trigger:{en:'the issue date on the DE 428T', es:'la fecha de emisi\u00f3n del DE 428T'}},
      path:{en:['Match every charged claimant and week against your own records.','Protest in writing: claimant, weeks, amounts, and the reason for each.','A written ruling follows, with its own appeal right.','Fix the root going forward: answer the DE 1101CZ and DE 1545 on time.'],
            es:['Compare cada reclamante y semana cobrada contra sus propios registros.','Proteste por escrito: reclamante, semanas, montos y la raz\u00f3n de cada uno.','Despu\u00e9s llega una resoluci\u00f3n por escrito, con su propio derecho de apelaci\u00f3n.','Corrija la ra\u00edz hacia adelante: conteste el DE 1101CZ y el DE 1545 a tiempo.']},
      gather:{en:['The DE 428T itself.','Your earlier DE 1101CZ and DE 1545 responses, if any.','Payroll records for the people listed.'],
              es:['El DE 428T.','Sus respuestas anteriores al DE 1101CZ y DE 1545, si las hay.','Registros de n\u00f3mina de las personas listadas.']},
      note:{en:'Protests can be denied for old silence. If the EDD asked about the claim earlier and got nothing, address that head-on.', es:'Las protestas pueden negarse por el silencio de antes. Si el EDD pregunt\u00f3 por el reclamo y no recibi\u00f3 nada, expl\u00edquelo de frente.'} }
  ]
};

var TSTR = {
  en:{ pathH:'Your path', gatherH:'Gather now', noteH:'What to know', change:'Change', dateL:'Date printed on your notice', pf1:'My situation: ', pfDate:' The date printed on my notice is ', pfWhat:'\n\nWhat happened: ', 
       fileBy:'File by', rolled:' (moved past the weekend)', today:'Due today. File it now.',
       left:function(n){return n===1?'1 day left. Move now.':(n<=14?n+' days left. Move now.':'You have '+n+' days.');},
       past:function(n){return 'This window closed '+(n===1?'1 day':n+' days')+' ago.';},
       pastNote:'Late filings are sometimes excused for good cause. Send us the notice anyway and we\u2019ll tell you straight.',
       cta:'Get help' },
  es:{ pathH:'Su camino', gatherH:'Junte desde ahora', noteH:'Qu\u00e9 saber', change:'Cambiar', dateL:'Fecha impresa en su aviso', pf1:'Mi situaci\u00f3n: ', pfDate:' La fecha impresa en mi aviso es ', pfWhat:'\n\nLo que pas\u00f3: ', 
       fileBy:'Presente a más tardar el', rolled:' (recorrida por el fin de semana)', today:'Vence hoy. Preséntelo ya.',
       left:function(n){return n===1?'Queda 1 día. Actúe ya.':(n<=14?'Quedan '+n+' días. Actúe ya.':'Le quedan '+n+' días.');},
       past:function(n){return 'Este plazo cerró hace '+(n===1?'1 día':n+' días')+'.';},
       pastNote:'Una presentación tardía a veces se acepta por causa justificada. Mándenos el aviso de todos modos y le decimos la verdad.',
       cta:'Obtenga ayuda' },
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
  if (r && r.scrollIntoView) setTimeout(function(){ r.scrollIntoView({behavior:'smooth', block:'start'}); }, 40);
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
  if (triSide && triSit){
    var sel = SCEN[triSide].find(function(x){ return x.id === triSit; });
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'sit on';
    chip.style.gridColumn = '1 / -1';
    chip.textContent = sel.label[LANG];
    chip.onclick = function(){ triSit = null; triDate = ''; renderTriage(); };
    sits.appendChild(chip);
    var chg = document.createElement('button');
    chg.type = 'button';
    chg.className = 'chg';
    chg.textContent = t.change;
    chg.onclick = function(){ triSit = null; triDate = ''; renderTriage(); };
    sits.appendChild(chg);
  } else if (triSide){
    SCEN[triSide].forEach(function(s){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sit';
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
    html += '<div class="tri-when"><label class="field" for="triD">' + (s.dateLbl ? s.dateLbl[LANG] : t.dateL) + '</label>' +
            '<input type="date" id="triD" value="' + triDate + '" oninput="triDate=this.value;triCalc()" onchange="triDate=this.value;triCalc()">' +
            '<div class="dl-out" id="dlOut"><div class="small" style="font-weight:700">' + t.fileBy + '</div>' +
            '<div class="dl-date" id="dlDate"></div><div class="dl-pill" id="dlPill"></div><div class="dl-note" id="dlNote"></div></div></div>';
  }
  html += '<div class="tri-acc">';
  html += '<details open><summary>' + t.pathH + '</summary><div class="ac"><ol class="tri-path">';
  s.path[LANG].forEach(function(p){ html += '<li>' + p + '</li>'; });
  html += '</ol></div></details>';
  html += '<details><summary>' + t.gatherH + '</summary><div class="ac"><ul class="tri-gather">';
  s.gather[LANG].forEach(function(g){ html += '<li>' + g + '</li>'; });
  html += '</ul></div></details>';
  html += '<details><summary>' + t.noteH + '</summary><div class="ac"><p class="tri-note">' + s.note[LANG] + '</p></div></details>';
  html += '</div>';
  var ctaHref = 'index.html?side=' + triSide + '&sit=' + triSit + (triDate ? '&d=' + triDate : '') + '#review';
  html += '<div class="tri-cta"><a class="btn il" href="' + withLang(ctaHref, LANG) + '">' + t.cta + '</a></div>';
  box.className = 'tri-result show';
  box.innerHTML = html;
  if (triDate) triCalc();
}

function triCalc(){
  var inp = document.getElementById('triD');
  if (!inp || !inp.value) return;
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
  var fs = document.getElementById('fSide');
  if (fs) fs.value = s;
}
var cform = document.getElementById('cform');
if (cform){
  cform.setAttribute('action', 'https://formsubmit.co/' + CONTACT_EMAIL);
  var fNext = document.getElementById('fNext');
  if (fNext) fNext.value = location.origin + location.pathname + '?sent=1#review';
  cform.addEventListener('submit', function(e){
    var f = e.target;
    var err = document.getElementById('fErr');
    if (err) err.style.display = 'none';
    var vn = document.getElementById('fName'), ve = document.getElementById('fEmail'), vm = document.getElementById('fMsg');
    if (!vn.value.trim() || !ve.value.trim() || !vm.value.trim()){ e.preventDefault(); f.reportValidity(); return; }
    if (!MAIL_OK){ e.preventDefault(); if (err) err.style.display = 'block'; return; }
    var b = cform.querySelector('button[type=submit]');
    if (b) b.disabled = true;
  });
  if (location.search.indexOf('sent=1') > -1){
    var fok = document.getElementById('fOk');
    if (fok) fok.style.display = 'block';
    if (history.replaceState) history.replaceState(null, '', location.pathname + '#review');
  }
}

/* ================= attachment name display ================= */
var fFile = document.getElementById('fFile');
if (fFile){
  fFile.addEventListener('change', function(){
    var n = document.getElementById('fFileName');
    if (n) n.textContent = (fFile.files && fFile.files[0]) ? fFile.files[0].name : '';
  });
}

/* ================= ask the library (home) ================= */
var LIB = null;
function loadLib(cb){
  if (LIB) return cb();
  fetch('notices.html').then(function(r){ return r.text(); }).then(function(t){
    var doc = new DOMParser().parseFromString(t, 'text/html');
    LIB = [];
    doc.querySelectorAll('.ncard').forEach(function(c){
      var h4 = c.querySelector('h4'), p = c.querySelector('.nbody p'), ck = c.querySelector('.nclock');
      if (h4) LIB.push({
        text: (c.textContent || '').toUpperCase(),
        titleHTML: h4.innerHTML,
        pHTML: p ? p.innerHTML : '',
        clockHTML: ck ? ck.innerHTML : ''
      });
    });
    cb();
  }).catch(function(){ LIB = []; cb(); });
}
function renderAsk(){
  var inEl = document.getElementById('askIn'), out = document.getElementById('askOut');
  if (!inEl || !out) return;
  var q = inEl.value.trim().toUpperCase();
  if (q.length < 2 || !LIB || !LIB.length){ out.innerHTML = ''; return; }
  var hits = [];
  for (var i = 0; i < LIB.length && hits.length < 3; i++){
    if (LIB[i].text.indexOf(q) > -1) hits.push(LIB[i]);
  }
  var html = '';
  for (var j = 0; j < hits.length; j++){
    html += '<div class="ask-hit"><h4>' + hits[j].titleHTML + '</h4>' +
            (hits[j].pHTML ? '<p>' + hits[j].pHTML + '</p>' : '') +
            (hits[j].clockHTML ? '<p class="nclock">' + hits[j].clockHTML + '</p>' : '') + '</div>';
  }
  out.innerHTML = html;
}
var askIn = document.getElementById('askIn');
if (askIn){
  askIn.addEventListener('input', function(){ loadLib(renderAsk); });
}

/* ================= deep links: pre-select triage from URL ================= */
(function(){
  if (!document.getElementById('triage')) return;
  var p = new URLSearchParams(location.search);
  var side = p.get('side'), sit = p.get('sit');
  if (side === 'worker' || side === 'employer'){
    triSide = side;
    if (sit && SCEN[side].some(function(x){ return x.id === sit; })) triSit = sit;
  }
})();

/* ================= init language, then reveal ================= */
(function(){
  var p = new URLSearchParams(location.search);
  setLang(p.get('lang') === 'es' ? 'es' : 'en');
})();
/* ================= review form prefill (triage handoff) ================= */
(function(){
  if (!document.getElementById('cform')) return;
  var p = new URLSearchParams(location.search);
  var side = p.get('side'), sit = p.get('sit'), d = p.get('d');
  if (side === 'worker' || side === 'employer') setSide(side);
  if ((side === 'worker' || side === 'employer') && sit && SCEN[side]){
    var s = SCEN[side].find(function(x){ return x.id === sit; });
    var box = document.getElementById('fMsg');
    if (s && box && !box.value){
      var t = TSTR[LANG];
      var ds = '';
      if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)){
        var pp = d.split('-');
        var dd = new Date(+pp[0], +pp[1]-1, +pp[2]);
        ds = new Intl.DateTimeFormat(LANG === 'es' ? 'es-MX' : 'en-US', { year:'numeric', month:'long', day:'numeric' }).format(dd);
      }
      box.value = t.pf1 + s.label[LANG] + '.' + (ds ? t.pfDate + ds + '.' : '') + t.pfWhat;
    }
  }
})();

/* ================= notice library filter ================= */
function applyNoticeFilter(){
  var nf = document.getElementById('nfilter');
  if (!nf) return;
  var q = nf.value.trim().toLowerCase();
  var any = false;
  document.querySelectorAll('.ngroup').forEach(function(g){
    var vis = 0;
    g.querySelectorAll('.ncard').forEach(function(c){
      var show = !q || c.textContent.toLowerCase().indexOf(q) > -1;
      c.style.display = show ? '' : 'none';
      c.open = q ? show : false;
      if (show) vis++;
    });
    g.style.display = vis ? '' : 'none';
    if (vis) any = true;
  });
  var e = document.getElementById('nempty');
  if (e) e.style.display = any ? 'none' : 'block';
}

(function(){
  var nf = document.getElementById('nfilter');
  if (!nf) return;
  nf.addEventListener('input', applyNoticeFilter);
  var q = new URLSearchParams(location.search).get('q');
  if (q){ nf.value = q; applyNoticeFilter(); }
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

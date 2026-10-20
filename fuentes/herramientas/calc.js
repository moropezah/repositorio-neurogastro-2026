/* ===================== Calculadoras · Neurogastroenterología 2026 ===================== */
const PAGINA='Calculadoras Neurogastro';
const F4=[[0,'Nunca'],[1,'Rara vez'],[2,'A veces'],[3,'Habitualmente'],[4,'Siempre']];
const Q03=[[0,'Ningún día'],[1,'Varios días'],[2,'Más de la mitad de los días'],[3,'Casi todos los días']];
const Q05=[[0,'0 · ninguno'],[1,'1 · muy leve'],[2,'2 · leve'],[3,'3 · moderado'],[4,'4 · grave'],[5,'5 · muy grave']];
const sum=(v,ks)=>ks.reduce((a,k)=>a+(+v[k]||0),0);
const cls=(x,a,b)=>x<a?'ok':x<b?'mid':'bad';

const CALCS=[
/* ---------- Criterios de Roma V ---------- */
{id:'sii',g:'Criterios de Roma V',t:'SII: criterios y subtipo',d:'Criterios clínicos de Roma V para síndrome de intestino irritable y subtipo por la escala de Bristol (en días con deposiciones anormales y sin fármacos para el hábito).',
 i:[n('dias','Días con dolor o malestar abdominal al mes (promedio)','días','6'),
    c('def','Se relaciona con la defecación (mejora o empeora)'),c('fre','Se asocia a cambio en la frecuencia de las deposiciones'),c('for','Se asocia a cambio en la forma (consistencia) de las deposiciones'),
    c('cont','El dolor es continuo, sin relación con comer ni defecar'),c('ban','Hay banderas rojas (edad de inicio ≥ 45–50, sangrado, anemia, baja de peso, nocturno, antecedente familiar)'),
    n('dur','Pct. de días anormales con Bristol 1–2','%','10'),n('liq','Pct. de días anormales con Bristol 6–7','%','40')],
 f(v){if(!need(v,['dias']))return null;
  const k=(v.def?1:0)+(v.fre?1:0)+(v.for?1:0), ok=v.dias>=3&&k>=2&&!v.cont;
  let sub='—',sc='';
  if(need(v,['dur','liq'])){const H=v.dur>25,L=v.liq>25; sub=H&&L?'SII-M':H?'SII-C':L?'SII-D':'SII-U'; sc='mid';}
  const out=[V('Roma V',ok?'Cumple':'No cumple',ok?'ok':'bad'),V('Asociaciones',k+' de 3',k>=2?'ok':'bad')]; if(ok)out.push(V('Subtipo',sub,sc));
  let t=ok?`Cumple criterios clínicos de SII (≥ 3 días/mes, no continuo, ≥ 2 asociaciones).`:`No cumple: `+[v.dias<3?'menos de 3 días al mes':'',k<2?'menos de 2 asociaciones':'',v.cont?'dolor continuo (pensar en dolor abdominal centralmente mediado, CAPS)':''].filter(Boolean).join(', ')+'.';
  if(v.ban)t+=' <b>Hay banderas rojas: estudiar dirigido antes de rotular SII.</b>';
  t+=' Estudio mínimo: hemograma, PCR, serología de celíaca; calprotectina si hay diarrea. Roma V no recomienda test de aire espirado de rutina.';
  return {vals:out,txt:t}},
 ref:'Roma V, Gastroenterology 2026 (trastornos intestinales).'},

{id:'disp',g:'Criterios de Roma V',t:'Dispepsia: SDP, SDE o superposición',d:'Clasifica la dispepsia según Roma V. El SDP «manda»: con plenitud o saciedad precoz, el dolor posprandial forma parte del SDP.',
 i:[n('ple','Días por semana con plenitud posprandial molesta','días/sem','3'),n('sac','Días por semana con saciedad precoz molesta','días/sem','2'),n('epi','Días por semana con dolor o ardor epigástrico molesto','días/sem','1'),
    c('pos','El dolor epigástrico aparece después de comer'),c('nau','Predominan náuseas o hay vómitos persistentes'),c('ban','Banderas rojas o, en Chile, ≥ 40 años con epigastralgia de más de 15 días')],
 f(v){if(!need(v,['ple','sac','epi']))return null;
  if(v.nau)return {vals:[V('Clasificación','Excluye dispepsia','bad')],txt:'Náusea predominante o vómitos persistentes excluyen dispepsia funcional: evaluar síndrome de náuseas y vómitos crónicos o gastroparesia (vaciamiento gástrico de 4 h).'};
  const sdp=Math.max(v.ple,v.sac)>=2, sde=v.epi>=1;
  let d='No cumple',cl='bad';
  if(sdp&&sde)d=v.pos?'SDP (dolor posprandial incluido)':'SDP + SDE',cl='mid'; else if(sdp)d='SDP',cl='mid'; else if(sde)d='SDE',cl='mid';
  let t={'SDP (dolor posprandial incluido)':'Con plenitud o saciedad, el dolor posprandial forma parte del SDP. 1.ª línea: procinético o IBP 4–8 semanas.','SDP':'1.ª línea: procinético (domperidona, cinitaprida, levosulpirida) o IBP, 4–8 semanas.','SDE':'1.ª línea: IBP en dosis estándar sin escalar. 2.ª línea: tricíclico en dosis baja.','SDP + SDE':'Superposición con dolor no posprandial: tratar el síntoma dominante; IBP cubre ambos en 1.ª línea.','No cumple':'No alcanza la frecuencia de Roma V (SDP ≥ 2 días/semana; SDE ≥ 1 día/semana).'}[d];
  t+=' <i>H. pylori</i> en todos (sin IBP 2 semanas).';
  if(v.ban)t+=' <b>Endoscopía antes de tratar como dispepsia funcional.</b>';
  return {vals:[V('Clasificación',d,cl)],txt:t}},
 ref:'Roma V, Gastroenterology 2026 (trastornos gastroduodenales) · Guía MINSAL cáncer gástrico.'},

{id:'cons',g:'Criterios de Roma V',t:'Constipación crónica',d:'Criterios de Roma V para constipación crónica (C2) y orientación al subtipo.',
 i:[c('puj','Pujo en > 25 % de las defecaciones'),c('dur','Deposiciones duras (Bristol 1–2) en > 25 %'),c('inc','Sensación de evacuación incompleta en > 25 %'),c('obs','Sensación de obstrucción anorrectal en > 25 %'),c('man','Maniobras manuales (digitación, soporte del periné) en > 25 %'),c('fr3','Menos de 3 deposiciones espontáneas por semana'),
    c('suel','Deposiciones sueltas frecuentes sin laxantes'),c('dol','Dolor abdominal ≥ 3 días/mes asociado a la defecación (cumple SII)'),c('opi','Inicio o empeoramiento al iniciar o subir opioides')],
 f(v){const k=['puj','dur','inc','obs','man','fr3'].filter(x=>v[x]).length;
  const ok=k>=2&&!v.suel&&!v.dol;
  let d=!ok?(v.dol&&k>=2?'SII-C':'No cumple'):v.opi?'Constipación por opioides':'Constipación crónica';
  const ev=(v.obs||v.man||v.puj)?'Síntomas evacuatorios: tacto rectal con pujo y manometría anorrectal con test de balón si no responde a laxantes.':'Sin síntomas evacuatorios prominentes: escalera de laxantes; estudio anorrectal si es refractaria.';
  return {vals:[V('Criterios',k+' de 6',k>=2?'ok':'bad'),V('Diagnóstico',d,ok||d==='SII-C'?'mid':'bad')],
   txt:(d==='SII-C'?'El dolor asociado a la defecación desplaza el diagnóstico a SII-C. ':'')+(d==='Constipación por opioides'?'Laxantes desde el inicio; PAMORA si fallan. ':'')+ev}},
 ref:'Roma V, Gastroenterology 2026 · AGA-ACG 2023.'},

/* ---------- Síntomas ---------- */
{id:'gerdq',g:'Esófago',t:'GerdQ',d:'Cuestionario de 6 preguntas sobre los últimos 7 días para probabilidad de ERGE e impacto.',
 i:[s('a','Pirosis (ardor detrás del esternón)',[[0,'0 días'],[1,'1 día'],[2,'2–3 días'],[3,'4–7 días']]),
    s('b','Regurgitación (contenido gástrico a la boca)',[[0,'0 días'],[1,'1 día'],[2,'2–3 días'],[3,'4–7 días']]),
    s('c','Dolor en el centro de la parte superior del abdomen',[[3,'0 días'],[2,'1 día'],[1,'2–3 días'],[0,'4–7 días']]),
    s('d','Náuseas',[[3,'0 días'],[2,'1 día'],[1,'2–3 días'],[0,'4–7 días']]),
    s('e','Dificultad para dormir por pirosis o regurgitación',[[0,'0 días'],[1,'1 día'],[2,'2–3 días'],[3,'4–7 días']]),
    s('f','Medicamentos adicionales para la pirosis (antiácidos)',[[0,'0 días'],[1,'1 día'],[2,'2–3 días'],[3,'4–7 días']])],
 f(v){const t=sum(v,['a','b','c','d','e','f']), imp=(+v.e)+(+v.f);
  return {vals:[V('GerdQ',t,t>=8?'bad':'ok'),V('Impacto',imp>=3?'Alto':'Bajo',imp>=3?'bad':'ok')],
   txt:`${t>=8?'<b>≥ 8: probabilidad alta de ERGE</b> (sensibilidad ~65 %, especificidad ~71 %).':'&lt; 8: probabilidad baja de ERGE; considerar otros diagnósticos.'} Impacto (sueño + medicación de rescate) ${imp}: ${imp>=3?'alto':'bajo'}. No reemplaza la evidencia objetiva de Lyon 2.0 antes de cirugía o tratamiento indefinido.`}},
 ref:'Jones R et al. Aliment Pharmacol Ther 2009;30:1030-8.'},

{id:'rsi',g:'Esófago',t:'Índice de síntomas de reflujo (RSI)',d:'Nueve síntomas laringofaríngeos en el último mes, de 0 (sin problema) a 5 (problema grave).',
 i:[s('a','Ronquera o problemas de la voz',Q05),s('b','Carraspeo',Q05),s('c','Exceso de mucosidad o descarga posterior',Q05),s('d','Dificultad para tragar comida, líquidos o pastillas',Q05),s('e','Tos después de comer o al acostarse',Q05),s('f','Dificultad respiratoria o episodios de ahogo',Q05),s('g','Tos molesta o irritante',Q05),s('h','Sensación de algo pegado o un nudo en la garganta',Q05),s('i','Pirosis, dolor torácico, indigestión o regurgitación',Q05)],
 f(v){const t=sum(v,['a','b','c','d','e','f','g','h','i']);
  return {vals:[V('RSI',t,t>13?'bad':'ok')],txt:`${t>13?'<b>&gt; 13: anormal.</b>':'≤ 13: normal.'} El RSI es inespecífico: no diagnostica reflujo laringofaríngeo. Sin síntomas típicos, la prueba empírica de IBP rinde poco; preferir pH-impedancia sin tratamiento antes de tratar en forma prolongada.`}},
 ref:'Belafsky PC, Postma GN, Koufman JA. J Voice 2002;16:274-7.'},

{id:'eckardt',g:'Esófago',t:'Eckardt (acalasia)',d:'Gravedad sintomática de la acalasia y criterio de falla tras tratamiento.',
 i:[s('dis','Disfagia',[[0,'Ninguna'],[1,'Ocasional'],[2,'Diaria'],[3,'En cada comida']]),s('reg','Regurgitación',[[0,'Ninguna'],[1,'Ocasional'],[2,'Diaria'],[3,'En cada comida']]),
    s('dol','Dolor retroesternal',[[0,'Ninguno'],[1,'Ocasional'],[2,'Diario'],[3,'Varias veces al día']]),s('pes','Pérdida de peso',[[0,'Ninguna'],[1,'< 5 kg'],[2,'5–10 kg'],[3,'> 10 kg']]),
    c('post','Evaluación después de tratamiento (dilatación, POEM o Heller)')],
 f(v){const t=sum(v,['dis','reg','dol','pes']); const e=t<=1?'0':t<=3?'I':t<=6?'II':'III';
  return {vals:[V('Eckardt',t,v.post?(t>3?'bad':'ok'):cls(t,4,7)),V('Estadio',e,v.post?(t>3?'bad':'ok'):cls(t,4,7))],
   txt:v.post?(t>3?'<b>&gt; 3 tras tratamiento: falla terapéutica.</b> Esofagograma cronometrado y manometría; considerar retratamiento.':'≤ 3 tras tratamiento: éxito clínico. Controlar ERGE posoperatoria (sobre todo tras POEM).'):'Gravedad basal; se usa para medir respuesta. Éxito tras tratamiento: ≤ 3.'}},
 ref:'Eckardt VF, Aignherr C, Bernhard G. Gastroenterology 1992;103:1732-8.'},

{id:'ibp',g:'Esófago',t:'Equivalencia de dosis de IBP',d:'Convierte la dosis de IBP a equivalentes de omeprazol según la potencia antisecretora relativa.',
 i:[s('f','IBP',[['ome','Omeprazol'],['eso','Esomeprazol'],['lan','Lansoprazol'],['pan','Pantoprazol'],['rab','Rabeprazol']]),n('mg','Dosis por toma','mg','20'),s('x','Tomas al día',[[1,'1'],[2,'2']])],
 f(v){if(!need(v,['mg']))return null; const k={ome:1,eso:1.6,lan:0.9,pan:0.23,rab:1.82}[v.f]; const oe=v.mg*k*(+v.x);
  return {vals:[V('Equivalente de omeprazol',fmt(oe,0)+' mg/día',oe<20?'mid':'ok')],
   txt:`Potencia relativa: pantoprazol 0,23 · lansoprazol 0,90 · omeprazol 1,00 · esomeprazol 1,60 · rabeprazol 1,82. Dosis estándar ≈ 20–40 mg de omeprazol; dosis doble ≈ 40–80 mg en 2 tomas. Los P-CAB no se comparan por esta escala (inhibición más rápida y sostenida).`}},
 ref:'Kirchheiner J et al. Eur J Clin Pharmacol 2009;65:19-31 · Graham DY, Tansel A. Clin Gastroenterol Hepatol 2018;16:800-8.'},

{id:'gcsi',g:'Estómago',t:'GCSI (gastroparesia)',d:'Índice de síntomas cardinales de gastroparesia en las últimas 2 semanas: tres subescalas de 0 a 5.',
 i:[s('n1','Náuseas',Q05),s('n2','Arcadas',Q05),s('n3','Vómitos',Q05),s('p1','Plenitud estomacal',Q05),s('p2','No poder terminar una comida normal',Q05),s('p3','Sentirse excesivamente lleno después de comer',Q05),s('p4','Pérdida de apetito',Q05),s('b1','Hinchazón',Q05),s('b2','Estómago o abdomen visiblemente más grande',Q05)],
 f(v){const a=sum(v,['n1','n2','n3'])/3,b=sum(v,['p1','p2','p3','p4'])/4,c=sum(v,['b1','b2'])/2,t=(a+b+c)/3;
  return {vals:[V('GCSI total',fmt(t,1),cls(t,2,3)),V('Náuseas/vómitos',fmt(a,1)),V('Plenitud/saciedad',fmt(b,1)),V('Distensión',fmt(c,1))],
   txt:'Promedio de las tres subescalas (0–5). Útil para seguir la respuesta y para orientar el tratamiento por síntoma dominante: náuseas/vómitos (antieméticos, procinéticos) frente a plenitud y saciedad (dieta, procinéticos, neuromoduladores). No diagnostica: requiere vaciamiento gástrico de 4 h.'}},
 ref:'Revicki DA et al. Aliment Pharmacol Ther 2003;18:141-50.'},

{id:'sigstad',g:'Estómago',t:'Sigstad (síndrome de dumping)',d:'Puntaje de síntomas tras comida en pacientes con cirugía gástrica o esofágica.',
 i:[c('a','Shock (+5)'),c('b','Casi desmayo o síncope (+4)'),c('cc','Deseo de acostarse (+4)'),c('d','Falta de aire (+3)'),c('e','Debilidad o agotamiento (+3)'),c('f','Somnolencia o apatía (+3)'),c('g','Palpitaciones (+3)'),c('h','Inquietud (+2)'),c('i','Mareo (+2)'),c('j','Cefalea (+1)'),c('k','Calor, sudoración, palidez o piel húmeda (+1)'),c('l','Náuseas (+1)'),c('m','Plenitud abdominal o meteorismo (+1)'),c('o','Borborigmos (+1)'),c('p','Eructos (−1)'),c('q','Vómitos (−4)')],
 f(v){const w={a:5,b:4,cc:4,d:3,e:3,f:3,g:3,h:2,i:2,j:1,k:1,l:1,m:1,o:1,p:-1,q:-4}; const t=Object.keys(w).reduce((x,k)=>x+(v[k]?w[k]:0),0);
  return {vals:[V('Sigstad',t,t>7?'bad':t>=4?'mid':'ok')],txt:t>7?'<b>&gt; 7: sugiere dumping.</b> Confirmar con prueba de tolerancia oral a glucosa modificada (hipoglicemia tardía o alza del hematocrito ≥ 3 % / pulso ≥ 10 lpm a los 30 min). Tratamiento: comidas pequeñas, sin azúcares simples, líquidos separados; acarbosa (tardío); octreótido en refractarios.':t<4?'&lt; 4: sugiere otro diagnóstico.':'4–7: indeterminado.'}},
 ref:'Sigstad H. Acta Med Scand 1970;188:479-86 · Scarpellini E et al. Nat Rev Endocrinol 2020 (consenso internacional).'},

{id:'ibssss',g:'Intestino',t:'IBS-SSS (gravedad del SII)',d:'Escala de gravedad de síntomas del SII (0–500), la más usada para seguir respuesta.',
 i:[n('dol','Intensidad del dolor abdominal (0–100)','','50'),n('dias','Días con dolor en los últimos 10 días (0–10)','días','5'),n('dis','Intensidad de la distensión (0–100)','','40'),n('hab','Insatisfacción con el hábito intestinal (0–100)','','60'),n('vida','Interferencia con la vida diaria (0–100)','','50')],
 f(v){if(!need(v,['dol','dias','dis','hab','vida']))return null; const t=clamp(v.dol,0,100)+clamp(v.dias,0,10)*10+clamp(v.dis,0,100)+clamp(v.hab,0,100)+clamp(v.vida,0,100);
  return {vals:[V('IBS-SSS',t,t<75?'ok':t<175?'ok':t<300?'mid':'bad')],txt:`${t<75?'&lt; 75: remisión o control':t<175?'75–174: leve':t<300?'175–299: moderado':'≥ 300: grave'}. Respuesta clínicamente significativa: caída ≥ 50 puntos. La gravedad orienta la intensidad del tratamiento: leve (dieta y explicación), moderado (fármaco por síntoma), grave (neuromodulador y terapia cerebro-intestino).`}},
 ref:'Francis CY, Morris J, Whorwell PJ. Aliment Pharmacol Ther 1997;11:395-402.'},

{id:'agachan',g:'Anorrectal',t:'Puntaje de constipación (Agachan-Wexner)',d:'Gravedad de la constipación (0–30) del Cleveland Clinic.',
 i:[s('fr','Frecuencia de deposiciones',[[0,'1–2 veces cada 1–2 días'],[1,'2 veces por semana'],[2,'1 vez por semana'],[3,'Menos de 1 vez por semana'],[4,'Menos de 1 vez al mes']]),
    s('di','Dificultad: esfuerzo doloroso para evacuar',F4),s('co','Sensación de evacuación incompleta',F4),s('do','Dolor abdominal',F4),
    s('ti','Minutos en el baño por intento',[[0,'< 5'],[1,'5–10'],[2,'10–20'],[3,'20–30'],[4,'> 30']]),s('as','Ayuda para evacuar',[[0,'Sin ayuda'],[1,'Laxantes estimulantes'],[2,'Digitación o enema']]),
    s('fa','Intentos fallidos de evacuar en 24 h',[[0,'Nunca'],[1,'1–3'],[2,'3–6'],[3,'6–9'],[4,'> 9']]),s('hi','Duración de la constipación',[[0,'0 años'],[1,'1–5 años'],[2,'5–10 años'],[3,'10–20 años'],[4,'> 20 años']])],
 f(v){const t=sum(v,['fr','di','co','do','ti','as','fa','hi']);
  return {vals:[V('Puntaje',t,t>=15?'bad':'ok')],txt:`${t>=15?'<b>≥ 15: constipación</b>':'&lt; 15'} (0 normal, 30 grave). Digitación o ayuda manual y tiempos largos en el baño orientan a trastorno evacuatorio.`}},
 ref:'Agachan F, Chen T, Pfeifer J, Reissman P, Wexner SD. Dis Colon Rectum 1996;39:681-5.'},

{id:'wexner',g:'Anorrectal',t:'Incontinencia fecal (Wexner)',d:'Cleveland Clinic Florida Fecal Incontinence Score (0–20).',
 i:[s('so','Incontinencia a sólidos',F4),s('li','Incontinencia a líquidos',F4),s('ga','Incontinencia a gases',F4),s('pa','Uso de protector',F4),s('vi','Alteración del estilo de vida',F4)],
 f(v){const t=sum(v,['so','li','ga','pa','vi']);
  return {vals:[V('Wexner',t,cls(t,5,10))],txt:'0 = continencia perfecta; 20 = incontinencia completa. Frecuencias: rara vez &lt; 1/mes, a veces &lt; 1/semana y ≥ 1/mes, habitualmente &lt; 1/día y ≥ 1/semana, siempre ≥ 1/día. Se usa para seguir la respuesta al tratamiento; no hay cortes universales de gravedad.'}},
 ref:'Jorge JM, Wexner SD. Dis Colon Rectum 1993;36:77-97.'},

{id:'vaizey',g:'Anorrectal',t:'Incontinencia fecal (St Mark\'s / Vaizey)',d:'Puntaje de St Mark\'s (0–24): agrega urgencia y uso de antidiarreicos.',
 i:[s('so','Incontinencia a sólidos',[[0,'Nunca'],[1,'Rara vez (≤ 1 en 4 semanas)'],[2,'A veces (> 1 en 4 semanas y < 1/semana)'],[3,'Semanal'],[4,'Diaria']]),
    s('li','Incontinencia a líquidos',[[0,'Nunca'],[1,'Rara vez'],[2,'A veces'],[3,'Semanal'],[4,'Diaria']]),s('ga','Incontinencia a gases',[[0,'Nunca'],[1,'Rara vez'],[2,'A veces'],[3,'Semanal'],[4,'Diaria']]),s('vi','Alteración del estilo de vida',[[0,'Nunca'],[1,'Rara vez'],[2,'A veces'],[3,'Semanal'],[4,'Diaria']]),
    c('pa','Necesita usar protector o tapón (+2)'),c('me','Toma antidiarreicos o constipantes (+2)'),c('ur','No puede diferir la defecación 15 minutos (+4)')],
 f(v){const t=sum(v,['so','li','ga','vi'])+(v.pa?2:0)+(v.me?2:0)+(v.ur?4:0);
  return {vals:[V('St Mark\'s',t,cls(t,6,12))],txt:'0 = continencia perfecta; 24 = incontinencia total. La incapacidad de diferir 15 minutos sugiere incontinencia de urgencia (esfínter externo o reservorio rectal); el escape sin aviso, incontinencia pasiva (esfínter interno). Útil para seguir respuesta a biorretroalimentación o neuromodulación sacra.'}},
 ref:'Vaizey CJ, Carapeti E, Cahill JA, Kamm MA. Gut 1999;44:77-80.'},

/* ---------- Psicosocial ---------- */
{id:'phq9',g:'Comorbilidad psicológica',t:'PHQ-9 (depresión)',d:'Frecuencia de cada síntoma en las últimas 2 semanas.',
 i:[s('a','Poco interés o placer en hacer cosas',Q03),s('b','Sentirse decaído, deprimido o sin esperanza',Q03),s('c','Problemas para dormir o dormir demasiado',Q03),s('d','Cansancio o poca energía',Q03),s('e','Poco apetito o comer en exceso',Q03),s('f','Sentirse mal consigo mismo, un fracaso',Q03),s('g','Dificultad para concentrarse',Q03),s('h','Moverse o hablar muy lento, o estar muy inquieto',Q03),s('i','Pensamientos de que estaría mejor muerto o de hacerse daño',Q03)],
 f(v){const t=sum(v,['a','b','c','d','e','f','g','h','i']); const g=t<5?'Mínima':t<10?'Leve':t<15?'Moderada':t<20?'Moderadamente grave':'Grave';
  return {vals:[V('PHQ-9',t,cls(t,10,15)),V('Depresión',g,cls(t,10,15))],txt:(+v.i>0?'<b>Ítem 9 positivo: evaluar riesgo suicida en esta misma consulta.</b> ':'')+'≥ 10 sugiere depresión clínicamente significativa: considerar un neuromodulador con efecto antidepresivo en dosis plena y derivación a salud mental. En TICI, la comorbilidad psicológica modula la intensidad del tratamiento.'}},
 ref:'Kroenke K, Spitzer RL, Williams JB. J Gen Intern Med 2001;16:606-13.'},

{id:'gad7',g:'Comorbilidad psicológica',t:'GAD-7 (ansiedad)',d:'Frecuencia de cada síntoma en las últimas 2 semanas.',
 i:[s('a','Sentirse nervioso, ansioso o con los nervios de punta',Q03),s('b','No poder dejar de preocuparse o controlar la preocupación',Q03),s('c','Preocuparse demasiado por distintas cosas',Q03),s('d','Dificultad para relajarse',Q03),s('e','Estar tan inquieto que es difícil quedarse quieto',Q03),s('f','Molestarse o irritarse fácilmente',Q03),s('g','Sentir miedo, como si algo terrible fuera a pasar',Q03)],
 f(v){const t=sum(v,['a','b','c','d','e','f','g']); const g=t<5?'Mínima':t<10?'Leve':t<15?'Moderada':'Grave';
  return {vals:[V('GAD-7',t,cls(t,10,15)),V('Ansiedad',g,cls(t,10,15))],txt:'≥ 10: ansiedad probable. En TICI con hipervigilancia o ansiedad específica gastrointestinal: ISRS, terapia cognitivo-conductual o hipnoterapia dirigida al intestino.'}},
 ref:'Spitzer RL, Kroenke K, Williams JB, Löwe B. Arch Intern Med 2006;166:1092-7.'},

{id:'phq15',g:'Comorbilidad psicológica',t:'PHQ-15 (carga somática)',d:'Cuánto le han molestado estos síntomas en las últimas 4 semanas: 0 nada, 1 poco, 2 mucho.',
 i:[['a','Dolor de estómago'],['b','Dolor de espalda'],['cc','Dolor en brazos, piernas o articulaciones'],['d','Molestias menstruales (solo mujeres)'],['e','Dolor de cabeza'],['f','Dolor de pecho'],['g','Mareos'],['h','Desmayos'],['i','Palpitaciones'],['j','Falta de aire'],['k','Dolor o problemas en las relaciones sexuales'],['l','Constipación, deposiciones sueltas o diarrea'],['m','Náuseas, gases o indigestión'],['o','Cansancio o poca energía'],['p','Problemas para dormir']].map(x=>s(x[0],x[1],[[0,'Nada'],[1,'Poco'],[2,'Mucho']])),
 f(v){const t=sum(v,['a','b','cc','d','e','f','g','h','i','j','k','l','m','o','p']); const g=t<5?'Mínima':t<10?'Baja':t<15?'Media':'Alta';
  return {vals:[V('PHQ-15',t,cls(t,10,15)),V('Carga somática',g,cls(t,10,15))],txt:'Carga somática alta (≥ 15) se asocia a TICI múltiples y superpuestos, mayor uso de recursos y peor respuesta a tratamientos dirigidos al órgano: priorizar relación terapéutica, neuromoduladores centrales y terapia cerebro-intestino; evitar estudios repetidos.'}},
 ref:'Kroenke K, Spitzer RL, Williams JB. Psychosom Med 2002;64:258-66.'}
];

const META={
sii:{uso:'r',que:'Si el cuadro cumple criterios clínicos de SII y su subtipo.',cuando:'Primera consulta por dolor y alteración del hábito; antes de elegir el tratamiento por subtipo.',ojo:'El subtipo se calcula en días con deposiciones anormales, sin laxantes ni antidiarreicos; con menos de 4 días anormales al mes es poco fiable. El subtipo cambia en el tiempo.',
 esc:(v,r)=>{const sb=r.vals[2]?r.vals[2].v:'';return {h:['Subtipo','Bristol 1–2','Bristol 6–7','Específico'],rows:[['SII-C','&gt; 25 %','&lt; 25 %','PEG, prucaloprida, linaclotida (donde exista)'],['SII-D','&lt; 25 %','&gt; 25 %','Loperamida, rifaximina, ondansetrón, secuestrantes'],['SII-M','&gt; 25 %','&gt; 25 %','Síntoma dominante del momento'],['SII-U','&lt; 25 %','&lt; 25 %','Por síntoma']],on:['SII-C','SII-D','SII-M','SII-U'].indexOf(sb)}},
 ej:[{l:'SII-D',v:{dias:8,def:true,for:true,dur:5,liq:45}},{l:'SII-C',v:{dias:6,def:true,fre:true,dur:40,liq:10}},{l:'SII-M',v:{dias:10,def:true,fre:true,for:true,dur:30,liq:35}},{l:'Dolor continuo',v:{dias:30,cont:true,def:false}}]},
disp:{uso:'r',que:'Subtipo de dispepsia de Roma V.',cuando:'Dispepsia sin alarma o con endoscopía normal, antes de elegir el primer fármaco.',ojo:'Náusea predominante o vómitos excluyen dispepsia. En Chile, la endoscopía tiene umbral bajo por el cáncer gástrico.',
 esc:(v,r)=>{const d=r.vals[0].v;return {h:['Subtipo','Criterio','1.ª línea'],rows:[['SDP','Plenitud o saciedad ≥ 2 días/semana','Procinético o IBP'],['SDE','Dolor o ardor epigástrico ≥ 1 día/semana','IBP estándar'],['SDP + SDE','Ambos, dolor no posprandial','Síntoma dominante']],on:d.indexOf('SDP + SDE')===0?2:d.indexOf('SDP')===0?0:d==='SDE'?1:-1}},
 ej:[{l:'SDP',v:{ple:4,sac:3,epi:0}},{l:'SDP con dolor posprandial',v:{ple:3,sac:2,epi:3,pos:true}},{l:'SDE',v:{ple:0,sac:1,epi:3}},{l:'Náuseas predominantes',v:{ple:2,sac:2,epi:1,nau:true}}]},
cons:{uso:'r',que:'Si cumple constipación crónica de Roma V y qué orienta al subtipo.',cuando:'Constipación de más de unas semanas antes de escalar laxantes.',ojo:'Si el dolor asociado a la defecación es ≥ 3 días/mes, es SII-C (espectro común).',
 ej:[{l:'Constipación crónica',v:{puj:true,dur:true,fr3:true}},{l:'Evacuatoria',v:{puj:true,obs:true,man:true,inc:true}},{l:'SII-C',v:{dur:true,fr3:true,dol:true}},{l:'Por opioides',v:{dur:true,fr3:true,opi:true}}]},
gerdq:{uso:'s',que:'Probabilidad clínica de ERGE e impacto en la vida diaria.',cuando:'Atención primaria o consulta para orientar la prueba con IBP.',ojo:'Rendimiento modesto; no reemplaza la evidencia objetiva de Lyon 2.0.',
 esc:(v,r)=>({h:['GerdQ','Lectura'],rows:[['0–7','Probabilidad baja de ERGE'],['8–18','Probabilidad alta de ERGE']],on:+r.vals[0].v>=8?1:0}),
 ej:[{l:'ERGE probable',v:{a:'3',b:'2',c:'3',d:'3',e:'2',f:'1'}},{l:'Poco probable',v:{a:'1',b:'0',c:'1',d:'1',e:'0',f:'0'}}]},
rsi:{uso:'s',que:'Carga de síntomas laringofaríngeos.',cuando:'Ronquera, carraspeo o tos crónica derivados por otorrinolaringología.',ojo:'Muy inespecífico; la mayoría de los pacientes con RSI alto no tiene reflujo patológico.',
 esc:(v,r)=>({h:['RSI','Lectura'],rows:[['0–13','Normal'],['&gt; 13','Anormal (inespecífico)']],on:+r.vals[0].v>13?1:0}),
 ej:[{l:'Anormal',v:{a:'4',b:'4',c:'3',d:'1',e:'2',f:'0',g:'3',h:'3',i:'1'}},{l:'Normal',v:{a:'1',b:'2',c:'1',d:'0',e:'1',f:'0',g:'1',h:'1',i:'2'}}]},
eckardt:{uso:'r',que:'Gravedad de síntomas en acalasia.',cuando:'Antes y después de dilatación, POEM o Heller; seguimiento.',ojo:'No mide vaciamiento: complementar con esofagograma cronometrado. El dolor del tipo III responde peor.',
 esc:(v,r)=>{const t=+r.vals[0].v;return {h:['Estadio','Puntaje','Lectura'],rows:[['0','0–1','Remisión'],['I','2–3','Remisión (éxito tras tratamiento)'],['II','4–6','Falla si es postratamiento'],['III','&gt; 6','Falla']],on:t<=1?0:t<=3?1:t<=6?2:3}},
 ej:[{l:'Basal grave',v:{dis:'3',reg:'2',dol:'1',pes:'2'}},{l:'Éxito post-POEM',v:{dis:'1',reg:'1',dol:'0',pes:'0',post:true}},{l:'Falla post-dilatación',v:{dis:'2',reg:'2',dol:'1',pes:'1',post:true}}]},
ibp:{uso:'s',que:'Dosis de IBP en equivalentes de omeprazol.',cuando:'Para saber si un paciente «refractario» recibió realmente dosis doble, o al cambiar de IBP.',ojo:'Basado en pH intragástrico; la respuesta clínica también depende del horario (30–60 min antes de comer) y del genotipo CYP2C19.',
 ej:[{l:'Pantoprazol 40 mg',v:{f:'pan',mg:40,x:'1'}},{l:'Esomeprazol 40 c/12 h',v:{f:'eso',mg:40,x:'2'}},{l:'Omeprazol 20 c/12 h',v:{f:'ome',mg:20,x:'2'}}]},
gcsi:{uso:'s',que:'Síntomas cardinales de gastroparesia por subescala.',cuando:'Basal y seguimiento de gastroparesia; para identificar el síntoma dominante.',ojo:'No diagnostica: la correlación entre síntomas y vaciamiento es pobre.',
 ej:[{l:'Predominio de náuseas',v:{n1:'4',n2:'3',n3:'3',p1:'2',p2:'2',p3:'2',p4:'3',b1:'1',b2:'1'}},{l:'Predominio de saciedad',v:{n1:'1',n2:'0',n3:'0',p1:'4',p2:'4',p3:'4',p4:'3',b1:'3',b2:'2'}}]},
sigstad:{uso:'s',que:'Probabilidad de síndrome de dumping.',cuando:'Síntomas posprandiales tras gastrectomía, bypass gástrico, esofagectomía o funduplicatura.',ojo:'Diferenciar dumping precoz (30 min, vasomotor) de tardío (1–3 h, hipoglicemia).',
 esc:(v,r)=>{const t=+r.vals[0].v;return {h:['Puntaje','Lectura'],rows:[['&lt; 4','Otro diagnóstico'],['4–7','Indeterminado'],['&gt; 7','Sugiere dumping']],on:t<4?0:t<=7?1:2}},
 ej:[{l:'Dumping precoz',v:{b:true,cc:true,g:true,k:true,m:true}},{l:'Poco probable',v:{l:true,m:true,p:true}}]},
ibssss:{uso:'r',que:'Gravedad del SII y respuesta al tratamiento.',cuando:'Basal y en cada control del SII.',ojo:'Si no hay dolor, el ítem de días con dolor vale 0.',
 esc:(v,r)=>{const t=+r.vals[0].v;return {h:['IBS-SSS','Gravedad'],rows:[['&lt; 75','Remisión'],['75–174','Leve'],['175–299','Moderada'],['≥ 300','Grave']],on:t<75?0:t<175?1:t<300?2:3}},
 ej:[{l:'Leve',v:{dol:30,dias:3,dis:30,hab:40,vida:20}},{l:'Moderado',v:{dol:50,dias:5,dis:40,hab:60,vida:50}},{l:'Grave',v:{dol:80,dias:9,dis:70,hab:80,vida:80}}]},
agachan:{uso:'s',que:'Gravedad de la constipación.',cuando:'Basal y seguimiento; pacientes en estudio anorrectal o biorretroalimentación.',ojo:'No distingue tránsito lento de trastorno evacuatorio.',
 esc:(v,r)=>({h:['Puntaje','Lectura'],rows:[['0–14','Bajo el corte'],['15–30','Constipación']],on:+r.vals[0].v>=15?1:0}),
 ej:[{l:'Constipación evacuatoria',v:{fr:'2',di:'3',co:'3',do:'1',ti:'3',as:'2',fa:'2',hi:'3'}},{l:'Leve',v:{fr:'1',di:'1',co:'1',do:'1',ti:'1',as:'0',fa:'0',hi:'1'}}]},
wexner:{uso:'r',que:'Gravedad de la incontinencia fecal.',cuando:'Basal y seguimiento de cualquier tratamiento de incontinencia.',ojo:'No distingue incontinencia pasiva de urgencia: complementar con St Mark\'s.',
 ej:[{l:'Leve',v:{so:'0',li:'1',ga:'2',pa:'1',vi:'1'}},{l:'Grave',v:{so:'3',li:'4',ga:'4',pa:'4',vi:'4'}}]},
vaizey:{uso:'s',que:'Gravedad de la incontinencia con urgencia y uso de antidiarreicos.',cuando:'Ensayos y seguimiento de biorretroalimentación o neuromodulación sacra.',ojo:'Más sensible al cambio que Wexner.',
 ej:[{l:'Urgencia',v:{so:'1',li:'3',ga:'2',vi:'3',pa:true,ur:true}},{l:'Pasiva',v:{so:'1',li:'2',ga:'1',vi:'2',pa:true}}]},
phq9:{uso:'r',que:'Gravedad de síntomas depresivos.',cuando:'TICI moderado o grave, dolor crónico, mala respuesta a tratamiento.',ojo:'Tamizaje, no diagnóstico. Ítem 9 positivo obliga a evaluar riesgo.',
 esc:(v,r)=>{const t=+r.vals[0].v;return {h:['PHQ-9','Gravedad'],rows:[['0–4','Mínima'],['5–9','Leve'],['10–14','Moderada'],['15–19','Moderadamente grave'],['20–27','Grave']],on:t<5?0:t<10?1:t<15?2:t<20?3:4}},
 ej:[{l:'Leve',v:{a:'1',b:'1',c:'2',d:'2',e:'0',f:'0',g:'1',h:'0',i:'0'}},{l:'Moderada',v:{a:'2',b:'2',c:'2',d:'2',e:'1',f:'1',g:'1',h:'1',i:'0'}}]},
gad7:{uso:'r',que:'Gravedad de síntomas ansiosos.',cuando:'TICI con hipervigilancia, evitación de comidas o catastrofismo.',ojo:'No mide la ansiedad específica gastrointestinal (para eso existe la VSI).',
 esc:(v,r)=>{const t=+r.vals[0].v;return {h:['GAD-7','Gravedad'],rows:[['0–4','Mínima'],['5–9','Leve'],['10–14','Moderada'],['15–21','Grave']],on:t<5?0:t<10?1:t<15?2:3}},
 ej:[{l:'Moderada',v:{a:'2',b:'2',c:'2',d:'2',e:'1',f:'2',g:'1'}},{l:'Mínima',v:{a:'1',b:'0',c:'1',d:'0',e:'0',f:'1',g:'0'}}]},
phq15:{uso:'s',que:'Carga de síntomas somáticos.',cuando:'Sospecha de superposición de TICI y trastorno de síntomas somáticos.',ojo:'Incluye síntomas digestivos: en TICI parte del puntaje es el propio trastorno.',
 esc:(v,r)=>{const t=+r.vals[0].v;return {h:['PHQ-15','Carga somática'],rows:[['0–4','Mínima'],['5–9','Baja'],['10–14','Media'],['15–30','Alta']],on:t<5?0:t<10?1:t<15?2:3}},
 ej:[{l:'Alta',v:{a:'2',b:'2',cc:'2',d:'1',e:'2',f:'1',g:'1',h:'0',i:'1',j:'1',k:'0',l:'2',m:'2',o:'2',p:'2'}},{l:'Baja',v:{a:'2',b:'1',cc:'0',d:'0',e:'1',f:'0',g:'0',h:'0',i:'0',j:'0',k:'0',l:'2',m:'1',o:'1',p:'0'}}]}
};

const CURA={titulo:'Cuáles se usan de verdad',buscar:'Buscar calculadora…',unidad:'calculadoras',col:'Calculadora',
 intro:'Clasificación por uso real en la consulta de neurogastroenterología. Los criterios de Roma V y los cuestionarios de seguimiento (IBS-SSS, Eckardt, Wexner) son los que se usan a diario; el resto, en escenarios concretos.',
 r:'Se aplican en casi todo paciente de su escenario: diagnóstico positivo con Roma V, gravedad basal y respuesta, y tamizaje de comorbilidad psicológica.',
 s:'Escenarios concretos: síntomas laringofaríngeos, dumping, equivalencia de IBP, gastroparesia, carga somática.',
 extra:'<h2>Para qué sirven los cuestionarios en un TICI</h2><ul><li><b>Diagnóstico</b>: los criterios de Roma V permiten diagnóstico positivo sin estudios repetidos.</li><li><b>Gravedad</b>: decide la intensidad del tratamiento (leve, moderado, grave).</li><li><b>Respuesta</b>: medir lo mismo antes y después (IBS-SSS ≥ 50 puntos, Eckardt ≤ 3).</li><li><b>Modificadores psicosociales</b>: PHQ-9, GAD-7 y PHQ-15 orientan a neuromoduladores y terapia cerebro-intestino.</li></ul>'};

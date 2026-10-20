/* ===================== Intérpretes de estudios · Neurogastroenterología 2026 ===================== */
const PAGINA='Intérpretes de estudios';
const al=t=>`<div class="alerta">${t}</div>`, nt=t=>`<div class="nota">${t}</div>`;

const CALCS=[
/* ---------- Reflujo ---------- */
{id:'phz',g:'Reflujo',t:'pH-impedancia 24 h (Lyon 2.0)',d:'Ingrese las métricas del informe. El intérprete aplica la jerarquía de Lyon 2.0 y separa el estudio sin tratamiento (diagnóstico) del estudio con IBP (refractariedad).',
 i:[s('cond','Condición del estudio',[['off','Sin tratamiento (IBP suspendido 7 días)'],['on','Con IBP o P-CAB 2 veces al día']]),
    n('tea','Tiempo de exposición ácida (TEA) total','%','5.1'),n('nre','Número de reflujos en 24 h','','62'),n('mnbi','Impedancia basal nocturna media (MNBI)','Ω','1800'),
    n('si','Índice de síntomas (SI)','%',''),n('sap','Probabilidad de asociación sintomática (SAP)','%',''),
    s('endo','Endoscopía (sin IBP 2–4 semanas)',[['nd','No disponible o con IBP'],['0','Normal'],['A','Esofagitis LA A'],['B','Esofagitis LA B'],['C','Esofagitis LA C'],['D','Esofagitis LA D'],['bar','Barrett con biopsia o estenosis péptica']]),
    c('hh','Hernia hiatal'),c('dur','Registro de menos de 16 h o sin marcas de síntomas'),c('post','Muchos reflujos posprandiales precoces no ácidos (sospecha de rumiación o eructo supragástrico)')],
 f(v){if(!need(v,['tea']))return null;
  const on=v.cond==='on', endoC=['B','C','D','bar'].includes(v.endo), asoc=(v.si!==null&&v.si>50)||(v.sap!==null&&v.sap>95), asocKnown=v.si!==null||v.sap!==null;
  let dx,cl,t='';
  if(!on){
   const fav=[], con=[];
   if(v.nre!==null){ if(v.nre>80)fav.push('&gt; 80 reflujos'); else if(v.nre<40)con.push('&lt; 40 reflujos'); }
   if(v.mnbi!==null){ if(v.mnbi<1500)fav.push('MNBI &lt; 1.500 Ω'); else if(v.mnbi>2500)con.push('MNBI &gt; 2.500 Ω'); }
   if(v.hh)fav.push('hernia hiatal');
   if(endoC||v.tea>6){dx='ERGE confirmada';cl='bad';t='Evidencia concluyente: '+(endoC?'endoscopía ('+(v.endo==='bar'?'Barrett o estenosis':'LA '+v.endo)+')':'')+(endoC&&v.tea>6?' y ':'')+(v.tea>6?'TEA &gt; 6 %':'')+'.';
    t+=' Tratamiento: IBP optimizado (o P-CAB en LA C/D); candidato a cirugía o terapia endoscópica si hay respuesta parcial o regurgitación, con manometría previa.';}
   else if(v.tea<4){ if(asoc){dx='Hipersensibilidad al reflujo';cl='mid';t='TEA normal con asociación sintomática positiva (SI &gt; 50 % y/o SAP &gt; 95 %). Tratamiento: neuromodulador en dosis baja ± antisecretor; terapia cerebro-intestino.';}
     else {dx=asocKnown?'Sin ERGE: pirosis funcional':'Sin ERGE';cl='ok';t='TEA &lt; 4 %: evidencia en contra de ERGE. '+(asocKnown?'Asociación negativa: pirosis funcional (con endoscopía y biopsias normales y manometría sin trastorno mayor). Suspender IBP; neuromodulador y terapia cerebro-intestino.':'Si hay síntomas típicos, evaluar asociación sintomática (SI/SAP) para separar hipersensibilidad de pirosis funcional.');}
     if(con.length)t+=' Adyuvantes en contra: '+con.join(', ')+'.'; }
   else {dx=fav.length>con.length?'Zona gris: inclina a ERGE':con.length>fav.length?'Zona gris: inclina en contra':'Zona gris: no concluyente';cl='mid';
     t=`TEA 4–6 %: no decide por sí solo. Adyuvantes a favor: ${fav.length?fav.join(', '):'ninguno'}; en contra: ${con.length?con.join(', '):'ninguno'}. `+(asoc?'La asociación sintomática positiva apoya que el síntoma sea reflujo. ':'')+'Si cambia la conducta (cirugía), repetir con cápsula de 96 h.';}
   if(v.endo==='A')t+=' LA A no es concluyente en Lyon 2.0.';
  } else {
   const refr=(v.tea>4&&v.nre!==null&&v.nre>80)||['B','C','D'].includes(v.endo);
   if(refr){dx='ERGE refractaria accionable';cl='bad';t='Con tratamiento optimizado: TEA &gt; 4 % y &gt; 80 reflujos (o esofagitis LA B–D). Verificar adherencia y horario; P-CAB, alginato, baja de peso; evaluar cirugía o terapia endoscópica.';}
   else if(v.tea<=4&&(v.nre===null||v.nre<=80)){dx='Reflujo controlado con tratamiento';cl='ok';t='El síntoma persistente no se explica por reflujo ácido. '+(asoc?'Asociación positiva (sobre todo con reflujos débilmente ácidos): hipersensibilidad sobreagregada; neuromodulador. ':'Asociación negativa: pirosis funcional sobreagregada; neuromodulador y terapia cerebro-intestino; desescalar el IBP a la dosis que controla la ERGE probada. ')+(v.tea<1&&v.nre!==null&&v.nre<40?'TEA &lt; 1 % y &lt; 40 reflujos apoyan control completo.':'');}
   else {dx='Con tratamiento: no concluyente';cl='mid';t='Solo una de las dos métricas (TEA &gt; 4 % o &gt; 80 reflujos) está alterada: revisar adherencia, horario de la dosis y asociación sintomática.';}
   t+=nt('Este estudio no diagnostica ERGE en quien nunca la tuvo probada: para eso se repite sin tratamiento.');
  }
  if(v.dur)t+=al('Registro corto o sin marcas de síntomas: SI y SAP no son válidos; considerar repetir.');
  if(v.post)t+=nt('Reflujos posprandiales precoces no ácidos: buscar rumiación (manometría con impedancia posprandial con comida real) o eructo supragástrico.');
  return {vals:[V('Conclusión',dx,cl),V('TEA',fmt(v.tea,1)+' %',v.tea>6?'bad':v.tea>=4?'mid':'ok')],txt:t}},
 ref:'Gyawali CP et al. Lyon Consensus 2.0. Gut 2024;73:361-71.'},

{id:'cap',g:'Reflujo',t:'Cápsula inalámbrica de pH 96 h',d:'TEA por día de registro (preferida para diagnosticar ERGE sin tratamiento). Lyon 2.0: concluyente con TEA &gt; 6 % en ≥ 2 días.',
 i:[n('d1','TEA día 1','%','3.2'),n('d2','TEA día 2','%','7.4'),n('d3','TEA día 3','%','6.8'),n('d4','TEA día 4','%','5.0'),c('post','El paciente tiene regurgitación posprandial sin esfuerzo (posible rumiación)')],
 f(v){const d=['d1','d2','d3','d4'].map(k=>v[k]).filter(x=>x!==null&&!Number.isNaN(x)); if(d.length<2)return null;
  const hi=d.filter(x=>x>6).length, lo=d.every(x=>x<4), m=d.reduce((a,b)=>a+b,0)/d.length;
  const dx=hi>=2?'ERGE confirmada':lo?'Sin ERGE':'No concluyente', cl=hi>=2?'bad':lo?'ok':'mid';
  let t=hi>=2?`TEA &gt; 6 % en ${hi} días (≥ 2 días es concluyente).`:lo?'TEA &lt; 4 % todos los días: evidencia en contra de ERGE.':`Días &gt; 6 %: ${hi}. Con 1 día alterado o valores 4–6 %, el resultado no es concluyente: sumar endoscopía y adyuvantes.`;
  if(d.length<4)t+=nt(`Solo ${d.length} días válidos: el rendimiento es menor que con 96 h.`);
  if(v.post)t+=al('La cápsula mide solo pH: no distingue rumiación ni reflujo no ácido. Usar pH-impedancia por catéter o manometría con impedancia posprandial.');
  return {vals:[V('Conclusión',dx,cl),V('Días > 6 %',hi+' de '+d.length,cl),V('TEA promedio',fmt(m,1)+' %')],txt:t}},
 ref:'Gyawali CP et al. Lyon Consensus 2.0. Gut 2024;73:361-71.'},

/* ---------- Motilidad esofágica ---------- */
{id:'hrm',g:'Motilidad esofágica',t:'Manometría de alta resolución (Chicago 4.0)',d:'Lectura jerárquica: primero la relajación de la unión (IRP), luego el cuerpo esofágico. Umbrales de IRP para equipo Medtronic (supino 15, sentado 12 mmHg).',
 i:[n('irp','IRP mediano supino','mmHg','28'),n('irpu','IRP mediano sentado','mmHg','24'),
    n('fal','Degluciones fallidas (DCI < 100)','%','100'),n('deb','Degluciones débiles (DCI 100–450)','%','0'),n('fra','Degluciones fragmentadas','%','0'),
    n('pre','Degluciones prematuras (DL < 4,5 s)','%','0'),n('hip','Degluciones hipercontráctiles (DCI > 8.000)','%','0'),
    n('pan','Presurización panesofágica','%','60'),n('ibp','Presión intrabolo elevada (supino)','%','0'),
    c('sin','Síntomas compatibles (disfagia o dolor torácico no cardíaco)'),c('apo','Prueba de apoyo positiva (esofagograma cronometrado o FLIP con apertura reducida)'),c('opi','Usa opioides')],
 f(v){if(!need(v,['irp','fal']))return null;
  const z=k=>v[k]===null||Number.isNaN(v[k])?0:v[k];
  const hiS=v.irp>15, hiU=v.irpu!==null&&v.irpu>12, inef=z('fal')+z('deb')+z('fra');
  let dx,cl='bad',t='';
  if(hiS&&z('pre')>=20&&z('fal')+z('pre')>=100-1e-9){dx='Acalasia tipo III';t='IRP elevado y ≥ 20 % de contracciones prematuras sin peristalsis normal. Tratamiento de elección: POEM (miotomía larga a medida).';}
  else if(hiS&&z('pre')>=20){dx='Acalasia tipo III probable';t='IRP elevado con ≥ 20 % prematuras. Confirmar ausencia de peristalsis normal; POEM es la opción preferida.';}
  else if(hiS&&z('fal')>=100&&z('pan')>=20){dx='Acalasia tipo II';t='IRP elevado, 100 % fallidas y presurización panesofágica ≥ 20 %. Mejor pronóstico: responde a dilatación neumática, Heller o POEM.';}
  else if(hiS&&z('fal')>=100){dx='Acalasia tipo I';t='IRP elevado, 100 % fallidas, sin presurización. Heller o POEM; dilatación menos eficaz que en el tipo II.';}
  else if(hiS&&hiU&&z('ibp')>=20){
    if(v.sin&&v.apo){dx='EGJOO clínicamente relevante';t='IRP elevado supino y sentado, presión intrabolo elevada ≥ 20 %, síntomas y prueba de apoyo positiva. Descartar causa mecánica (endoscopía, tomografía o endosonografía) antes de tratar.';}
    else {dx='EGJOO no concluyente';cl='mid';t='Patrón manométrico de EGJOO sin '+[v.sin?'':'síntomas',v.apo?'':'prueba de apoyo'].filter(Boolean).join(' ni ')+'. Chicago 4.0 exige ambos: esofagograma cronometrado (columna &gt; 5 cm al minuto 1 o retención de tableta de 12,5 mm) o FLIP.';}}
  else if(hiS){dx='IRP elevado no concluyente';cl='mid';t='IRP supino elevado sin criterios completos (revisar IRP sentado y presión intrabolo). Repetir con maniobras de provocación o usar FLIP/esofagograma.';}
  else if(z('fal')>=100){dx='Contractilidad ausente';t='IRP normal y 100 % fallidas: esclerosis sistémica y conectivopatías. '+(v.irp>=10?'<b>IRP limítrofe (10–15 mmHg)</b>: descartar acalasia tipo I con FLIP o esofagograma. ':'')+'Manejo agresivo del reflujo; evitar fundoplicatura completa.';}
  else if(z('pre')>=20){dx=v.sin?'Espasmo esofágico distal':'Espasmo distal (requiere síntomas)';cl=v.sin?'bad':'mid';t='≥ 20 % prematuras con IRP normal. Buscar ERGE y opioides. Tratamiento: IBP si hay reflujo, relajantes del músculo liso, neuromoduladores; POEM en refractarios seleccionados.';}
  else if(z('hip')>=20){dx=v.sin?'Esófago hipercontráctil':'Hipercontractilidad (requiere síntomas)';cl=v.sin?'bad':'mid';t='≥ 20 % con DCI &gt; 8.000. Puede ser respuesta a obstrucción de salida o reflujo. Tratamiento como espasmo.';}
  else if(inef>70||z('fal')>=50){dx='Motilidad esofágica inefectiva (IEM)';cl='mid';t=`Inefectivas ${fmt(inef,0)} % (fallidas ${fmt(z('fal'),0)} %). El trastorno más frecuente; asociado a ERGE y rara vez explica el síntoma. No contraindica fundoplicatura parcial; la reserva contráctil en degluciones rápidas múltiples ayuda a predecir disfagia posoperatoria.`;}
  else {dx='Motilidad normal';cl='ok';t='Sin trastorno de la motilidad. Si persiste la disfagia: biopsias para EoE, esofagograma o FLIP; pensar en disfagia funcional (Roma V).';}
  if(v.opi)t+=al('Los opioides pueden producir patrones de EGJOO, espasmo o acalasia tipo III: suspender o rotar y repetir antes de intervenir.');
  return {vals:[V('Diagnóstico',dx,cl),V('IRP supino',fmt(v.irp,1)+' mmHg',hiS?'bad':'ok')],txt:t}},
 ref:'Yadlapati R et al. Chicago Classification 4.0. Neurogastroenterol Motil 2021;33:e14058.'},

{id:'flip',g:'Motilidad esofágica',t:'FLIP (panometría)',d:'Apertura de la unión esofagogástrica a 60 mL y patrón de respuesta contráctil.',
 i:[n('di','Índice de distensibilidad de la unión (EGJ-DI)','mm²/mmHg','1.4'),n('dm','Diámetro máximo de la unión','mm','10'),
    s('rc','Respuesta contráctil',[['rac','Contracciones anterógradas repetitivas (normal)'],['lim','Limítrofe (anterógradas no sostenidas)'],['aus','Ausente'],['deb','Débil o desordenada'],['esp','Espástica: retrógradas repetitivas u oclusión sostenida']])],
 f(v){if(!need(v,['di','dm']))return null;
  const ap=(v.di>=2&&v.dm>=16)?'Normal':(v.di<2&&v.dm<12)?'Reducida':'Limítrofe';
  const rc={rac:'normal',lim:'limítrofe',aus:'ausente',deb:'débil o desordenada',esp:'espástica'}[v.rc];
  let t='';
  if(ap==='Reducida'&&(v.rc==='aus'||v.rc==='esp'||v.rc==='deb'))t='Patrón de <b>obstrucción del flujo de salida</b> (compatible con acalasia'+(v.rc==='esp'?', fenotipo espástico como el tipo III':'')+'). Integrar con manometría.';
  else if(ap==='Reducida')t='Apertura reducida con respuesta contráctil preservada: obstrucción de la unión (EGJOO) o acalasia temprana; integrar con manometría y descartar causa mecánica.';
  else if(ap==='Normal'&&v.rc==='rac')t='<b>FLIP normal</b>: alto valor predictivo negativo para trastorno del flujo de salida y trastorno mayor de la peristalsis.';
  else if(ap==='Normal'&&(v.rc==='aus'||v.rc==='deb'))t='Apertura normal con respuesta contráctil ausente o débil: motilidad inefectiva o contractilidad ausente.';
  else if(ap==='Normal'&&v.rc==='esp')t='Apertura normal con respuesta espástica: trastorno espástico (espasmo distal o hipercontractilidad); correlacionar con manometría.';
  else t='Resultado limítrofe: no concluyente por sí solo; integrar con manometría y esofagograma cronometrado.';
  return {vals:[V('Apertura de la unión',ap,ap==='Normal'?'ok':ap==='Reducida'?'bad':'mid'),V('Respuesta contráctil',rc,v.rc==='rac'?'ok':'mid')],txt:t+nt('FLIP se realiza durante la endoscopía con sedación; disponibilidad limitada en Chile.')}},
 ref:'Carlson DA et al. Am J Gastroenterol 2021;116:2357-66 · Yadlapati R et al. NGM 2021 (Chicago 4.0).'},

/* ---------- Estómago ---------- */
{id:'ge',g:'Estómago',t:'Vaciamiento gástrico (cintigrafía 4 h)',d:'Retención de comida sólida estandarizada a 1, 2 y 4 horas.',
 i:[n('r1','Retención a 1 h','%','85'),n('r2','Retención a 2 h','%','66'),n('r4','Retención a 4 h','%','24'),n('gli','Glicemia al inicio del estudio','mg/dL','140'),
    c('far','Sin suspender procinéticos, opioides, anticolinérgicos o agonistas de GLP-1'),c('dur2','Estudio de solo 2 horas')],
 f(v){if(!need(v,['r4'])&&!need(v,['r2']))return null;
  let dx='Normal',cl='ok',gr='—';
  if(v.r4!==null&&v.r4>10){dx='Vaciamiento lento';cl='bad';gr=v.r4<=20?'Grado 1 (leve)':v.r4<=35?'Grado 2 (moderado)':v.r4<=50?'Grado 3 (grave)':'Grado 4 (muy grave)';}
  else if(v.r2!==null&&v.r2>60){dx='Vaciamiento lento';cl='bad';}
  if(v.r1!==null&&v.r1<30){dx=dx==='Normal'?'Vaciamiento rápido':dx+' + fase precoz rápida';cl='mid';}
  let t=dx==='Normal'?'Retención normal (≤ 10 % a las 4 h, ≤ 60 % a las 2 h). Con síntomas: síndrome de náuseas y vómitos crónicos o dispepsia.':dx.indexOf('lento')>=0?'Con síntomas compatibles y sin obstrucción: <b>gastroparesia</b>. La gravedad de la retención correlaciona mal con los síntomas.':'Retención &lt; 30 % a la hora: vaciamiento rápido (dumping, posquirúrgico, diabetes temprana).';
  if(v.gli!==null&&v.gli>275)t+=al('Glicemia &gt; 275 mg/dL: la hiperglicemia enlentece el vaciamiento. Estudio no interpretable: repetir con glicemia controlada.');
  if(v.far)t+=al('Fármacos que alteran el vaciamiento: resultado no interpretable (suspender 48–72 h; agonistas de GLP-1 según vida media).');
  if(v.dur2||v.r4===null)t+=nt('El estudio de 2 h tiene sensibilidad ~57 %: AGA 2025 recomienda 4 h.');
  if((v.gli!==null&&v.gli>275)||v.far){dx='No interpretable';cl='mid';gr='—';}
  return {vals:[V('Resultado',dx,cl),V('Gravedad',gr,cl)],txt:t}},
 ref:'Abell TL et al. Am J Gastroenterol 2008;103:753-63 · AGA 2025 gastroparesia.'},

/* ---------- Intestino ---------- */
{id:'bt',g:'Intestino',t:'Test de aire espirado (H₂ y CH₄)',d:'Interpretación según el consenso norteamericano.',
 i:[s('sus','Sustrato',[['glu','Glucosa 75 g'],['lac','Lactulosa 10 g']]),n('b','H₂ basal','ppm','6'),n('p90','H₂ máximo en los primeros 90 min','ppm','34'),n('ch4','CH₄ máximo en cualquier momento','ppm','4'),
    c('anti','Antibióticos en las últimas 4 semanas'),c('rap','Tránsito rápido conocido o pico muy precoz (< 20 min) con lactulosa')],
 f(v){if(!need(v,['b','p90']))return null;
  const d=v.p90-v.b, sibo=d>=20, imo=v.ch4!==null&&v.ch4>=10;
  const dx=sibo&&imo?'SIBO + IMO':sibo?'SIBO (positivo para H₂)':imo?'IMO (metano)':'Negativo';
  let t=`Alza de H₂ en 90 min: ${fmt(d,0)} ppm (positivo ≥ 20). `+(imo?'CH₄ ≥ 10 ppm: sobrecrecimiento metanogénico intestinal, asociado a constipación. ':'');
  t+=sibo?'Tratamiento: rifaximina 14 días (Chile: 400 mg c/8 h) y corregir la causa (dismotilidad, anatomía). ':'';
  t+=imo?'IMO: rifaximina + neomicina 500 mg c/12 h por 14 días; tratar la constipación. ':'';
  if(v.b>20)t+=al('H₂ basal &gt; 20 ppm: preparación inadecuada (dieta o ayuno). Repetir.');
  if(v.anti)t+=al('Antibióticos recientes: falso negativo posible. Repetir tras 4 semanas.');
  if(v.sus==='lac'&&(v.rap||sibo))t+=nt('Con lactulosa, el tránsito rápido produce falsos positivos (la llegada al colon simula SIBO). La glucosa es más específica.');
  const inv=v.b>20||v.anti;
  return {vals:[V('Resultado',inv?'No interpretable':dx,inv?'mid':sibo||imo?'bad':'ok'),V('Δ H₂ 90 min',fmt(d,0)+' ppm',sibo?'bad':'ok')],txt:t}},
 ref:'Rezaie A et al. North American Consensus. Am J Gastroenterol 2017;112:775-84.'},

{id:'hinton',g:'Intestino',t:'Tránsito colónico (marcadores radiopacos)',d:'Técnica de Hinton: cápsula con marcadores el día 0 y radiografía al día 5. Se hace después de descartar disinergia.',
 i:[n('tot','Marcadores ingeridos','','24'),n('ret','Marcadores retenidos al día 5','','9'),s('pat','Distribución',[['dif','Difusa por el colon'],['rs','Predominio rectosigmoideo'],['nd','No informada']]),c('lax','Usó laxantes durante el estudio')],
 f(v){if(!need(v,['tot','ret']))return null; const p=100*v.ret/v.tot, len=p>20;
  let t=len?'Tránsito lento (&gt; 20 % retenido). ':'Tránsito normal. ';
  if(len&&v.pat==='rs')t+='Retención rectosigmoidea: sugiere trastorno evacuatorio; confirmar con manometría anorrectal y test de balón.';
  else if(len)t+='Difuso: tránsito lento. Hasta dos tercios de los disinérgicos tienen tránsito lento secundario que mejora con biorretroalimentación: confirmar que las pruebas anorrectales son normales antes de rotular inercia colónica.';
  else t+='Con constipación: constipación con tránsito normal (la más frecuente) o trastorno evacuatorio si las pruebas anorrectales son anormales.';
  if(v.lax)t+=al('Laxantes durante el estudio: invalidan el resultado.');
  return {vals:[V('Retenidos',fmt(p,0)+' %',len?'bad':'ok'),V('Tránsito',len?'Lento':'Normal',len?'bad':'ok')],txt:t}},
 ref:'Hinton JM, Lennard-Jones JE, Young AC. Gut 1969;10:842-7 · AGA 2013 constipación.'},

/* ---------- Anorrectal ---------- */
{id:'arm',g:'Anorrectal',t:'Manometría anorrectal (clasificación de Londres)',d:'Ingrese cada hallazgo comparado con los valores normales del equipo, sexo y edad. El intérprete ordena el informe en las cuatro partes de la clasificación de Londres.',
 i:[c('rair','Reflejo rectoanal inhibitorio ausente'),
    s('rep','Presión anal de reposo',[['n','Normal'],['b','Baja'],['a','Alta']]),s('con','Contracción voluntaria (incremento)',[['n','Normal'],['b','Baja'],['x','Ausente']]),
    s('puj','Patrón al pujo',[['n','Normal'],['dis','Relajación anal inadecuada o contracción paradójica (disinergia)'],['pro','Propulsión rectal pobre'],['amb','Propulsión pobre y disinergia']]),
    s('bet','Test de expulsión de balón (50 mL, sentado)',[['n','Expulsa en ≤ 1 min'],['a','No expulsa o > 1 min'],['nd','No realizado']]),
    s('hip','Umbrales sensitivos elevados (primera sensación, deseo, urgencia)',[[0,'Ninguno'],[1,'1'],[2,'2'],[3,'3']]),s('hipr','Umbrales sensitivos bajos',[[0,'Ninguno'],[1,'1'],[2,'2'],[3,'3']])],
 f(v){const L=[];
  if(v.rair)L.push(['Parte 1 · Reflejo rectoanal inhibitorio','<b>Ausente</b>: sugiere enfermedad de Hirschsprung (confirmar con biopsia rectal profunda); descartar artefacto por megarrecto o volumen insuficiente.']);
  const p2=[]; if(v.rep==='b')p2.push('hipotensión anal'); if(v.rep==='a')p2.push('hipertensión anal'); if(v.con==='b')p2.push('hipocontractilidad anal'); if(v.con==='x')p2.push('contracción voluntaria ausente');
  if(p2.length)L.push(['Parte 2 · Tono y contractilidad anal',p2.join(' + ')+'. '+(v.rep==='b'?'Hipotensión: esfínter interno (incontinencia pasiva). ':'')+(v.con!=='n'?'Hipocontractilidad: esfínter externo o neuropatía pudenda (incontinencia de urgencia). Ecografía endoanal. ':'')+(v.rep==='a'?'Hipertensión: fisura, proctalgia, disinergia.':'')]);
  const pa=v.puj!=='n', ba=v.bet==='a';
  let p3='';
  if(pa&&ba)p3='<b>Trastorno de la coordinación rectoanal</b> (patrón anormal + balón alterado): '+(v.puj==='pro'?'propulsión pobre':v.puj==='dis'?'disinergia':'propulsión pobre y disinergia')+'. Roma V: defecación disinérgica definitiva (2 pruebas).';
  else if(pa&&v.puj==='amb')p3='Propulsión pobre y disinergia con balón normal: hallazgo menor.';
  else if(pa)p3=(v.puj==='dis'?'Disinergia aislada':'Propulsión pobre aislada')+' con balón '+(v.bet==='n'?'normal':'no realizado')+': no concluyente (frecuente en sanos por la posición y el pudor). Roma V: 1 prueba = probable.';
  else if(ba)p3='Balón alterado con manometría normal: no concluyente; considerar defecografía.';
  if(p3)L.push(['Parte 3 · Coordinación rectoanal',p3]);
  const s4=+v.hip>=2?'<b>Hiposensibilidad rectal</b> (≥ 2 umbrales elevados): megarrecto, neuropatía, constipación. Biorretroalimentación sensitiva.':+v.hipr>=1?'<b>Hipersensibilidad rectal</b> (≥ 1 umbral bajo): urgencia, SII, proctitis.':+v.hip===1?'Un umbral elevado: hallazgo aislado.':'';
  if(s4)L.push(['Parte 4 · Sensibilidad rectal',s4]);
  const tera=pa||ba?'Biorretroalimentación (5–6 sesiones; éxito 70–80 % en disinergia).':p2.length?'Regularizar consistencia, biorretroalimentación; neuromodulación sacra en refractarios.':'';
  const txt=L.length?'<table>'+L.map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join('')+'</table>'+(tera?'<p><b>Conducta:</b> '+tera+'</p>':''):'Estudio sin alteraciones en las cuatro partes.';
  const mayor=v.rair||(pa&&ba)||(v.rep==='b'&&v.con!=='n')||+v.hip>=2;
  return {vals:[V('Hallazgos',L.length?L.length+' parte(s) alterada(s)':'Normal',L.length?(mayor?'bad':'mid'):'ok')],txt}},
 ref:'Carrington EV et al. IAPWG y clasificación de Londres. Neurogastroenterol Motil 2020;32:e13679 · Roma V 2026.'}
];

const META={
phz:{uso:'r',que:'Si hay ERGE (sin tratamiento) o si una ERGE probada está controlada (con tratamiento), y el fenotipo del síntoma.',cuando:'Pirosis o regurgitación sin respuesta a IBP, antes de cirugía antirreflujo, síntomas atípicos.',ojo:'Primero definir la pregunta: sin tratamiento para diagnosticar, con tratamiento para refractariedad. El PSPW ya no se usa.',
 esc:(v,r)=>({h:['TEA','Lectura sin tratamiento'],rows:[['&lt; 4 %','Normal: en contra de ERGE'],['4–6 %','Zona gris: decidir con adyuvantes'],['&gt; 6 %','ERGE confirmada']],on:v.cond==='on'?-1:v.tea<4?0:v.tea<=6?1:2}),
 ej:[{l:'ERGE confirmada',v:{cond:'off',tea:8.4,nre:96,mnbi:1200,endo:'A'}},{l:'Zona gris a favor',v:{cond:'off',tea:5.1,nre:88,mnbi:1300,hh:true}},{l:'Hipersensibilidad',v:{cond:'off',tea:2.1,nre:45,mnbi:2700,si:65,sap:97,endo:'0'}},{l:'Pirosis funcional',v:{cond:'off',tea:1.2,nre:22,mnbi:3100,si:10,sap:40,endo:'0'}},{l:'Refractaria con IBP',v:{cond:'on',tea:5.8,nre:104,mnbi:1400}},{l:'Controlada con IBP',v:{cond:'on',tea:0.6,nre:30,mnbi:2800,si:20,sap:50}}]},
cap:{uso:'r',que:'Diagnóstico de ERGE con registro prolongado sin tratamiento.',cuando:'Primera opción para diagnosticar ERGE no probada (mejor tolerada que el catéter, más días).',ojo:'Solo mide pH ácido: no sirve para refractariedad, rumiación ni reflujo no ácido.',
 esc:(v,r)=>({h:['Patrón','Lectura'],rows:[['≥ 2 días con TEA &gt; 6 %','ERGE confirmada'],['Todos los días &lt; 4 %','En contra de ERGE'],['Otro','No concluyente']],on:r.vals[0].v==='ERGE confirmada'?0:r.vals[0].v==='Sin ERGE'?1:2}),
 ej:[{l:'ERGE',v:{d1:3.2,d2:7.4,d3:6.8,d4:5.0}},{l:'Normal',v:{d1:1.2,d2:2.0,d3:0.8,d4:1.5}},{l:'No concluyente',v:{d1:4.5,d2:6.4,d3:3.9,d4:5.2}}]},
hrm:{uso:'r',que:'Diagnóstico de los trastornos motores esofágicos con la jerarquía de Chicago 4.0.',cuando:'Disfagia sin causa mecánica ni EoE, dolor torácico no cardíaco, antes de cirugía antirreflujo o POEM.',ojo:'Los umbrales de IRP dependen del equipo (aquí, Medtronic). EGJOO, espasmo, hipercontractilidad e IEM requieren síntomas para ser relevantes.',
 esc:(v,r)=>{const d=r.vals[0].v;const k=['Acalasia tipo I','Acalasia tipo II','Acalasia tipo III','EGJOO','Contractilidad ausente','Espasmo','Hipercontráctil','IEM','Normal'];return {h:['Diagnóstico','IRP','Cuerpo esofágico'],rows:[['Acalasia tipo I','Elevado','100 % fallidas'],['Acalasia tipo II','Elevado','100 % fallidas + presurización ≥ 20 %'],['Acalasia tipo III','Elevado','≥ 20 % prematuras'],['EGJOO','Elevado supino y sentado','Presión intrabolo ≥ 20 %; peristalsis presente'],['Contractilidad ausente','Normal','100 % fallidas'],['Espasmo distal','Normal','≥ 20 % prematuras'],['Esófago hipercontráctil','Normal','≥ 20 % DCI &gt; 8.000'],['IEM','Normal','&gt; 70 % inefectivas o ≥ 50 % fallidas'],['Normal','Normal','Peristalsis normal']],on:d.startsWith('Acalasia tipo III')?2:d.startsWith('Acalasia tipo II')?1:d.startsWith('Acalasia tipo I')?0:d.startsWith('EGJOO')?3:d.startsWith('Contractilidad')?4:d.indexOf('spasmo')>=0?5:d.indexOf('ipercontr')>=0?6:d.indexOf('IEM')>=0?7:d==='Motilidad normal'?8:-1}},
 ej:[{l:'Acalasia II',v:{irp:28,irpu:24,fal:100,pan:60}},{l:'Acalasia I',v:{irp:22,irpu:19,fal:100,pan:0}},{l:'Acalasia III',v:{irp:31,irpu:27,fal:20,pre:80}},{l:'EGJOO no concluyente',v:{irp:19,irpu:16,fal:10,deb:10,ibp:40}},{l:'EGJOO relevante',v:{irp:21,irpu:17,fal:0,deb:20,ibp:50,sin:true,apo:true}},{l:'Contractilidad ausente',v:{irp:11,irpu:8,fal:100}},{l:'Espasmo distal',v:{irp:9,irpu:6,fal:0,pre:40,sin:true}},{l:'IEM',v:{irp:8,irpu:5,fal:30,deb:40,fra:10}},{l:'Normal',v:{irp:9,irpu:6,fal:0,deb:20}}]},
flip:{uso:'s',que:'Distensibilidad de la unión y respuesta contráctil secundaria.',cuando:'Prueba de apoyo en EGJOO o manometría no concluyente; evaluación intraprocedimiento de POEM o dilatación.',ojo:'Cortes de Chicago 4.0 y Carlson 2021; los apuntes del curso usaban otros (se reemplazan).',
 esc:(v,r)=>({h:['Apertura','EGJ-DI','Diámetro máximo'],rows:[['Normal','≥ 2,0 mm²/mmHg','≥ 16 mm'],['Limítrofe','Resto de combinaciones','—'],['Reducida','&lt; 2,0 mm²/mmHg','&lt; 12 mm']],on:['Normal','Limítrofe','Reducida'].indexOf(r.vals[0].v)}),
 ej:[{l:'Acalasia',v:{di:0.9,dm:9,rc:'aus'}},{l:'Normal',v:{di:3.4,dm:19,rc:'rac'}},{l:'Limítrofe',v:{di:2.4,dm:14,rc:'lim'}},{l:'Espástico',v:{di:1.6,dm:11,rc:'esp'}}]},
ge:{uso:'r',que:'Velocidad de vaciamiento de sólidos.',cuando:'Náuseas y vómitos con endoscopía normal; sospecha de gastroparesia antes de procinéticos de largo plazo o G-POEM.',ojo:'Debe durar 4 h, con glicemia &lt; 275 mg/dL y sin fármacos que alteren la motilidad.',
 esc:(v,r)=>({h:['Retención a 4 h','Grado'],rows:[['≤ 10 %','Normal'],['11–20 %','1 · leve'],['21–35 %','2 · moderado'],['36–50 %','3 · grave'],['&gt; 50 %','4 · muy grave']],on:(v.r4===null||r.vals[0].v==='No interpretable')?-1:v.r4<=10?0:v.r4<=20?1:v.r4<=35?2:v.r4<=50?3:4}),
 ej:[{l:'Gastroparesia moderada',v:{r1:85,r2:66,r4:24,gli:140}},{l:'Normal',v:{r1:70,r2:40,r4:6,gli:110}},{l:'Rápido',v:{r1:22,r2:12,r4:2,gli:100}},{l:'Hiperglicemia',v:{r1:90,r2:70,r4:30,gli:320}}]},
bt:{uso:'s',que:'SIBO por hidrógeno e IMO por metano.',cuando:'Sospecha de SIBO con factor de riesgo (cirugía, dismotilidad, esclerodermia); diarrea o distensión en ese contexto.',ojo:'No de rutina en SII. La lactulosa da falsos positivos con tránsito rápido.',
 esc:(v,r)=>({h:['Gas','Criterio','Lectura'],rows:[['H₂','Alza ≥ 20 ppm en ≤ 90 min','SIBO'],['CH₄','≥ 10 ppm en cualquier momento','IMO'],['H₂ basal','&gt; 20 ppm','Mala preparación']],on:r.vals[0].v.indexOf('SIBO')===0?0:r.vals[0].v.indexOf('IMO')===0?1:r.vals[0].v==='No interpretable'?2:-1}),
 ej:[{l:'SIBO',v:{sus:'glu',b:6,p90:34,ch4:3}},{l:'IMO',v:{sus:'lac',b:4,p90:12,ch4:22}},{l:'Negativo',v:{sus:'glu',b:5,p90:9,ch4:2}},{l:'Mala preparación',v:{sus:'lac',b:28,p90:40,ch4:2}}]},
hinton:{uso:'s',que:'Tiempo de tránsito colónico.',cuando:'Constipación refractaria con pruebas anorrectales normales; antes de considerar colectomía.',ojo:'Pedirlo antes de descartar disinergia lleva a diagnosticar falsamente inercia colónica.',
 esc:(v,r)=>({h:['Retenidos al día 5','Lectura'],rows:[['≤ 20 %','Normal'],['&gt; 20 %','Lento']],on:r.vals[1].v==='Lento'?1:0}),
 ej:[{l:'Lento difuso',v:{tot:24,ret:12,pat:'dif'}},{l:'Rectosigmoideo',v:{tot:24,ret:9,pat:'rs'}},{l:'Normal',v:{tot:24,ret:3,pat:'nd'}}]},
arm:{uso:'r',que:'Función esfinteriana, coordinación al pujo, reflejos y sensibilidad rectal.',cuando:'Constipación refractaria o con síntomas evacuatorios; incontinencia fecal; antes de biorretroalimentación.',ojo:'La disinergia aislada en la manometría es frecuente en sanos: el test de balón le da especificidad.',
 ej:[{l:'Disinergia',v:{rep:'n',con:'n',puj:'dis',bet:'a',hip:'0',hipr:'0'}},{l:'Incontinencia',v:{rep:'b',con:'b',puj:'n',bet:'n',hip:'0',hipr:'1'}},{l:'Hiposensibilidad',v:{rep:'n',con:'n',puj:'pro',bet:'a',hip:'2',hipr:'0'}},{l:'Hirschsprung',v:{rair:true,rep:'a',con:'n',puj:'n',bet:'a',hip:'0',hipr:'0'}},{l:'Normal',v:{rep:'n',con:'n',puj:'n',bet:'n',hip:'0',hipr:'0'}}]}
};

const CURA={titulo:'Qué estudio pedir',buscar:'Buscar intérprete…',unidad:'intérpretes',col:'Intérprete',
 intro:'Cada estudio contesta una pregunta distinta. Antes de interpretar, verificar que se pidió el estudio correcto y con la preparación correcta (bloque 16 de la guía).',
 r:'Los que se informan semanalmente en un laboratorio de motilidad.',
 s:'Escenarios específicos o de disponibilidad limitada en Chile.',
 extra:'<h2>Pregunta → estudio</h2><div class="wrap"><table><tr><th>Pregunta</th><th>Estudio</th><th>Condición</th></tr><tr><td>¿Tiene ERGE?</td><td>Cápsula 96 h o pH-impedancia</td><td>Sin tratamiento</td></tr><tr><td>¿Está controlada su ERGE probada?</td><td>pH-impedancia</td><td>Con IBP 2 veces al día</td></tr><tr><td>¿Rumiación o eructo?</td><td>Manometría con impedancia posprandial</td><td>Comida real</td></tr><tr><td>Disfagia sin causa mecánica</td><td>Manometría de alta resolución</td><td>Protocolo Chicago 4.0</td></tr><tr><td>EGJOO o manometría limítrofe</td><td>FLIP o esofagograma cronometrado</td><td>Prueba de apoyo</td></tr><tr><td>Náuseas y vómitos</td><td>Vaciamiento gástrico</td><td>4 h, glicemia &lt; 275</td></tr><tr><td>Constipación refractaria</td><td>Manometría anorrectal + balón → tránsito</td><td>En ese orden</td></tr><tr><td>SIBO con factor de riesgo</td><td>Test de aire espirado</td><td>Sin antibióticos 4 semanas</td></tr></table></div>'};

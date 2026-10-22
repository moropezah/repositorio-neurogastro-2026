/* ===================== Fenotipador terapéutico · Neurogastroenterología 2026 ===================== */
const PAGINA='Fenotipador terapéutico';
const al=t=>`<div class="alerta">${t}</div>`, nt=t=>`<div class="nota">${t}</div>`;
const H3=['Línea','Esquema (dosis)','Respuesta esperada · criterio de falla'];
const esc3=(v,r)=>r&&r.plan?{h:H3,rows:r.plan,on:r.on}:null;

const CALCS=[
{id:'sii',g:'Intestino',t:'SII: tratamiento por fenotipo',d:'Combina subtipo, síntoma dominante, gravedad y lo que ya falló, y propone el siguiente escalón.',
 i:[s('sub','Subtipo (Bristol)',[['D','SII-D'],['C','SII-C'],['M','SII-M'],['U','SII-U']]),s('dom','Síntoma más molesto',[['dol','Dolor'],['dis','Hinchazón o distensión'],['hab','Alteración del hábito']]),
    s('gr','Gravedad (IBS-SSS)',[['l','Leve (75–174)'],['m','Moderada (175–299)'],['g','Grave (≥ 300)']]),
    s('paso','Ya falló',[[0,'Nada aún'],[1,'Explicación, dieta y psyllium'],[2,'+ fármaco dirigido al hábito y antiespasmódico'],[3,'+ neuromodulador en dosis adecuada 8–12 semanas']]),
    c('psi','Ansiedad, depresión o catastrofismo relevantes (GAD-7 o PHQ-9 ≥ 10)'),c('noc','Diarrea nocturna o acuosa persistente'),c('col','Colecistectomía o resección ileal')],
 f(v){const p=+v.paso;let plan,ph='SII-'+v.sub+' · '+{dol:'dolor',dis:'distensión',hab:'hábito'}[v.dom]+' · '+{l:'leve',m:'moderado',g:'grave'}[v.gr];
  const base=v.sub==='D'
    ?['Base','Explicación del eje intestino-cerebro; dieta tradicional NICE o baja en FODMAP en 3 fases guiada; reducir cafeína, alcohol y edulcorantes (sorbitol); ejercicio. Psyllium opcional en dosis baja (3–4 g/día) solo para dar consistencia, no como pilar','4–6 semanas; la FODMAP exige fase de reintroducción']
    :['Base','Explicación del eje intestino-cerebro; dieta baja en FODMAP en 3 fases guiada (o dieta tradicional NICE); psyllium 3,5 → 10 g/día subiendo cada 1–2 semanas; ejercicio','4–6 semanas; la FODMAP exige fase de reintroducción'];
  const neu=v.sub==='C'?['Neuromodulador','Dolor: escitalopram 10 mg o duloxetina 30 → 60 mg (no constipan); distensión: pregabalina 75 mg c/12 h','4–8 semanas; falla: sin cambio en 12 semanas']:['Neuromodulador','Amitriptilina 10 mg noche → 25–50 mg (o nortriptilina); distensión con hipersensibilidad: pregabalina','4–8 semanas; mantener 6–12 meses si responde'];
  const psi=['Terapia cerebro-intestino','Terapia cognitivo-conductual o hipnoterapia dirigida al intestino (también digital); combinar con el neuromodulador','8–12 sesiones; efecto sostenido'];
  if(v.sub==='D')plan=[base,['Hábito y dolor','Loperamida 2 mg preventiva (máx. 16 mg/día) + antiespasmódico (pinaverio 50–100 mg c/8 h, otilonio 40 mg c/8–12 h o trimebutina)','1–2 semanas; la loperamida no mejora el dolor'],['Global','Rifaximina 14 días (Chile: 400 mg c/8 h; 550 mg c/8 h donde exista) · ondansetrón 4 mg/día titulado hasta 8 mg c/8 h · colestiramina 4 g si sospecha de ácidos biliares','Recaída tras rifaximina: repetir hasta 2 veces'],neu,psi];
  else if(v.sub==='C')plan=[base,['Hábito y dolor','PEG 17 g/día + antiespasmódico (pinaverio, otilonio, trimebutina)','PEG mejora frecuencia, no dolor; 2–4 semanas'],['Secretagogo o procinético','Linaclotida 290 µg/día donde exista (no en Chile) · en Chile: prucaloprida 2 mg/día (1 mg en &gt; 65)','4 semanas; si hay síntomas evacuatorios, manometría anorrectal'],neu,psi];
  else plan=[base,['Por síntoma del momento','Antiespasmódico; loperamida o PEG a demanda según el hábito del día','Revisar el subtipo: cambia en el tiempo'],['Global','Rifaximina si predomina la distensión sin constipación','—'],neu,psi];
  let on=Math.min(p+(p>=2&&(v.gr==='g'||v.psi)?1:0),plan.length-1);
  if((v.gr==='g'||v.psi)&&p>=1&&on<3)on=3;
  let t=`<b>Siguiente paso: ${plan[on][0]}.</b> ${plan[on][1]}.`;
  if(v.dom==='dol'&&on<3&&v.gr!=='l')t+=' Con dolor dominante moderado o grave, el neuromodulador puede adelantarse.';
  if(v.dom==='dis')t+=' Distensión visible: buscar disinergia abdominofrénica (respiración diafragmática y biorretroalimentación); tratar la constipación si existe.';
  if(v.gr==='g'||v.psi)t+=' Gravedad alta o comorbilidad psicológica: neuromodulador y terapia cerebro-intestino tempranos, en paralelo con lo dirigido al intestino.';
  if(v.noc)t+=al('Diarrea nocturna o acuosa persistente no es típica de SII: colonoscopía con biopsias escalonadas (colitis microscópica) y estudio de ácidos biliares.');
  if(v.col&&v.sub!=='C')t+=nt('Colecistectomía o íleon: prueba terapéutica con colestiramina 4 g 1–3 veces al día (malabsorción de ácidos biliares).');
  return {vals:[V('Fenotipo',ph,'mid'),V('Escalón',(on+1)+' de '+plan.length,'')],txt:t,plan,on}},
 ref:'Roma V 2026 · ACG 2021 SII (Lacy) · AGA 2022 SII-D y SII-C · Ford, Lancet 2023 (ATLANTIS).'},

{id:'cons',g:'Intestino',t:'Constipación: tránsito o evacuación',d:'Decide si escalar laxantes o estudiar la evacuación, según síntomas, estudios y lo que ya falló.',
 i:[c('eva','Síntomas evacuatorios: pujo prolongado, digitación, sensación de obstrucción o evacuación incompleta'),c('dol','Dolor abdominal ≥ 3 días/mes asociado a la defecación'),c('opi','Usa opioides'),
    s('paso','Ya falló',[[0,'Nada aún'],[1,'Fibra + PEG en dosis plena'],[2,'+ estimulante (bisacodilo o picosulfato)'],[3,'+ prucaloprida 4 semanas']]),
    s('arm','Manometría anorrectal y test de balón',[['nd','No realizados'],['dis','Disinergia (balón > 1 min)'],['nor','Normales']]),s('tr','Tránsito colónico',[['nd','No realizado'],['len','Lento'],['nor','Normal']])],
 f(v){let ph=v.opi?'Por opioides':v.dol?'SII-C':v.arm==='dis'?'Trastorno evacuatorio (disinergia)':v.tr==='len'&&v.arm==='nor'?'Tránsito lento':v.tr==='nor'&&v.arm==='nor'?'Tránsito normal':v.eva?'Sospecha de trastorno evacuatorio':'Constipación crónica sin fenotipar';
  const plan=[['1','Psyllium 3,5 → 10 g/día y PEG 17 g/día (8,5–34 g)','2–4 semanas; meta: Bristol 4 diaria'],['2','+ Bisacodilo o picosulfato 5–10 mg en la noche (diario o de rescate)','Días'],['3','Prucaloprida 2 mg/día (1 mg en &gt; 65 o ClCr &lt; 30)','Sin respuesta a 4 semanas: suspender'],['4','Manometría anorrectal + test de balón → biorretroalimentación si hay disinergia','5–6 sesiones; éxito 70–80 %'],['5','Tránsito colónico si las pruebas anorrectales son normales; tránsito lento puro refractario: centro de referencia (colectomía excepcional)','—']];
  if(v.opi)plan.splice(2,0,['2b','PAMORA (naloxegol, metilnaltrexona) donde existan; en Chile no hay: optimizar PEG y estimulantes o prucaloprida','Contraindicados en obstrucción']);
  let on=+v.paso; if(v.opi&&on>=2)on=on===2?2:on+1;
  if(v.arm==='dis')on=plan.findIndex(r=>r[0]==='4'); else if(v.arm==='nor'&&on>=plan.findIndex(r=>r[0]==='4'))on=plan.length-1;
  if(v.eva&&v.arm==='nd'&&+v.paso>=1)on=Math.max(on,plan.findIndex(r=>r[0]==='4'));
  let t=`<b>Fenotipo: ${ph}.</b> Siguiente: ${plan[on][1]}.`;
  if(v.eva&&v.arm==='nd')t+=' Los síntomas evacuatorios justifican tacto rectal con maniobra de pujo y estudio anorrectal temprano: la disinergia no responde a laxantes.';
  if(v.dol)t+=' Con dolor dominante: agregar antiespasmódico y considerar ISRS o duloxetina (no constipan).';
  if(v.tr==='len'&&v.arm==='nd')t+=al('Tránsito lento sin pruebas anorrectales: hasta dos tercios de los disinérgicos tienen tránsito lento secundario. Estudiar la evacuación antes de concluir inercia colónica.');
  t+=nt('En Chile no hay linaclotida, lubiprostona ni plecanatida: tras PEG y estimulantes, el siguiente escalón real es prucaloprida o el estudio anorrectal.');
  return {vals:[V('Fenotipo',ph,'mid'),V('Escalón',plan[on][0],'')],txt:t,plan,on}},
 ref:'AGA-ACG 2023 (Chang) · Roma V 2026 · Rao SSC, Neurogastroenterol Motil 2016 (disinergia).'},

{id:'erge',g:'Esófago',t:'Reflujo: fenotipos y conducta',d:'Ubica al paciente con síntomas de reflujo en su fenotipo según respuesta a IBP y estudios, y define la conducta.',
 i:[s('sin','Síntoma principal',[['pir','Pirosis'],['reg','Regurgitación'],['ati','Tos, ronquera o globo'],['dol','Dolor torácico (cardíaco descartado)']]),
    s('resp','Respuesta al IBP',[['np','No probado'],['com','Completa'],['par','Parcial con dosis doble 8 semanas'],['nul','Nula con dosis doble 8 semanas']]),
    s('obj','Evidencia objetiva',[['nd','Sin estudios'],['erge','ERGE concluyente (LA B–D, Barrett, estenosis o TEA > 6 % sin IBP)'],['refr','ERGE refractaria con IBP (TEA > 4 % y > 80 reflujos)'],['hip','TEA normal con asociación positiva'],['fun','TEA normal con asociación negativa'],['rum','Rumiación confirmada'],['eru','Eructo supragástrico']]),
    c('cd','Esofagitis LA C/D o Barrett'),c('hh','Hernia hiatal ≥ 3 cm'),c('ob','IMC ≥ 35')],
 f(v){let ph,t,plan,on=0;
  const P=[['1','IBP en dosis estándar 30–60 min antes del desayuno, 8 semanas','2–4 semanas'],['2','Dosis doble (antes de desayuno y cena) o P-CAB (tegoprazán 50 mg/día); alginato al acostarse','8 semanas'],['3','Endoscopía sin IBP (2–4 semanas) + monitorización sin tratamiento (cápsula 96 h o pH-impedancia)','Define el fenotipo'],['4','Según fenotipo: ERGE refractaria → cirugía o endoscopía antirreflujo; hipersensibilidad o funcional → neuromodulador; rumiación o eructo → respiración diafragmática','—']];
  if(v.obj==='nd'){ph=v.resp==='np'?'Síntomas de reflujo sin estudiar':v.resp==='com'?'Respuesta completa a IBP':'Síntomas refractarios a IBP (no es «ERGE refractaria»)';
    on=v.resp==='np'?0:v.resp==='com'?0:v.resp==='par'?1:2; if(v.resp==='par')on=2;
    t=v.resp==='com'?'Desescalar a la dosis mínima eficaz o a demanda a las 4–8 semanas; si no se puede suspender en un paciente joven que tomará IBP por años, documentar ERGE con estudio sin tratamiento.':v.sin==='ati'?'Síntomas extraesofágicos sin síntomas típicos: la prueba empírica con IBP rinde poco; preferir pH-impedancia sin tratamiento antes de tratar en forma prolongada.':'Sin respuesta a dosis doble por 8 semanas: <b>no escalar más</b>. Estudiar fuera de tratamiento.';}
  else if(v.obj==='erge'){ph='ERGE probada';plan=[['1','IBP optimizado; P-CAB en LA C/D','8 semanas'],['2','Mantención: continuo en LA C/D, Barrett o estenosis; a demanda en ERGE no erosiva','Reevaluar a 12 meses'],['3','Cirugía (fundoplicatura parcial), RefluxStop/LINX o terapia endoscópica en regurgitación o dependencia de IBP, con manometría previa','—'],['3b','IMC ≥ 35: bypass gástrico en Y de Roux','—']];
    on=v.resp==='par'||v.resp==='nul'?2:v.resp==='com'?1:0; t='Evidencia concluyente (Lyon 2.0). '+(v.sin==='reg'?'La regurgitación responde peor a antisecretores: considerar cirugía antirreflujo antes. ':'')+(v.hh?'Hernia ≥ 3 cm: favorece la cirugía. ':'');
    if(v.ob){on=3;t+='Con IMC ≥ 35, la fundoplicatura falla más: bypass gástrico.';}}
  else if(v.obj==='refr'){ph='ERGE refractaria accionable';plan=[['1','Verificar adherencia y horario; P-CAB; alginato; baclofeno en regurgitación','4–8 semanas'],['2','Fundoplicatura parcial o completa según motilidad; bypass si IMC ≥ 35; terapia endoscópica en casos seleccionados','—']];on=v.resp==='com'?0:1;t='TEA &gt; 4 % y &gt; 80 reflujos con IBP optimizado.';}
  else if(v.obj==='hip'){ph='Hipersensibilidad al reflujo';plan=[['1','Neuromodulador: amitriptilina 10–25 mg, escitalopram 10 mg o pregabalina','4–8 semanas'],['2','Mantener antisecretor en dosis mínima si hay asociación con reflujo ácido; terapia cerebro-intestino','—'],['3','Cirugía solo en casos muy seleccionados (asociación fuerte y respuesta parcial al IBP)','Resultados inferiores a la ERGE']];on=0;t='TEA normal con asociación sintomática positiva (Roma V).';}
  else if(v.obj==='fun'){ph=v.sin==='dol'?'Dolor torácico funcional':'Pirosis funcional';plan=[['1','Suspender IBP (o dosis mínima); explicación','—'],['2','Neuromodulador: ATC en dosis baja o ISRS','4–8 semanas'],['3','Hipnoterapia dirigida al esófago o terapia cognitivo-conductual','—']];on=1;t='TEA normal con asociación negativa, endoscopía y biopsias normales y sin trastorno motor mayor. La cirugía está contraindicada.';}
  else if(v.obj==='rum'){ph='Síndrome de rumiación';plan=[['1','Explicación y respiración diafragmática durante y después de comer, idealmente con biorretroalimentación','2–4 semanas'],['2','Baclofeno 10 mg c/8 h si no basta','—'],['3','Retirar progresivamente el IBP; buscar trastorno de la conducta alimentaria','—']];on=0;t='Confirmada por manometría con impedancia posprandial.';}
  else {ph='Eructo supragástrico';plan=[['1','Explicación; logopedia; respiración diafragmática','4–8 semanas'],['2','Terapia cognitivo-conductual; baclofeno en refractarios','—']];on=0;t='Aire que entra al esófago y sale de inmediato; no llega al estómago.';}
  if(!plan)plan=P;
  if(v.cd&&v.obj!=='erge')t+=nt('LA C/D o Barrett: ERGE ya probada; tratamiento antisecretor continuo independiente del fenotipo sobreagregado.');
  return {vals:[V('Fenotipo',ph,'mid')],txt:t,plan,on}},
 ref:'Lyon 2.0 (Gut 2024) · ACG 2022 ERGE · Roma V 2026 (trastornos esofágicos).'},

{id:'disp',g:'Estómago',t:'Dispepsia: secuencia terapéutica',d:'SDP, SDE o superposición, con H. pylori, baja de peso y lo que ya falló.',
 i:[s('tipo','Subtipo (Roma V)',[['sdp','SDP'],['sde','SDE'],['amb','SDP + SDE']]),s('hp','H. pylori',[['nd','No estudiado'],['pos','Positivo'],['neg','Negativo o erradicado']]),
    s('paso','Ya falló',[[0,'Nada aún'],[1,'Primera línea 4–8 semanas'],[2,'Neuromodulador 8–12 semanas']]),c('peso','Baja de peso o restricción alimentaria'),c('end','Endoscopía no realizada y ≥ 40 años o banderas rojas')],
 f(v){const sdp=v.tipo!=='sde';
  const plan=[['0','<i>H. pylori</i>: test de aire espirado o antígeno (sin IBP 2 semanas) y erradicación','Reevaluar síntomas a 6–12 meses'],
   ['1',sdp?'Procinético: domperidona 10 mg c/8 h (QT), cinitaprida 1 mg c/8 h o levosulpirida 25 mg c/8 h; o IBP estándar':'IBP en dosis estándar 1 vez al día, sin escalar','4–8 semanas; sin respuesta: suspender'],
   ['2',sdp?(v.peso?'Mirtazapina 7,5–15 mg noche':'Buspirona 10 mg c/8 h antes de comidas o mirtazapina 7,5–15 mg'):'Amitriptilina 10 → 25 mg noche','8–12 semanas'],
   ['3','Terapia cerebro-intestino; si es refractaria: vaciamiento gástrico de 4 h y revisar el diagnóstico','—']];
  let on=v.hp==='neg'?1+(+v.paso):0; on=Math.min(on,3);
  let t=`<b>Siguiente:</b> ${plan[on][1]}.`;
  if(v.end)t=al('Endoscopía primero: en Chile, ≥ 40 años con epigastralgia de más de 15 días o banderas rojas.')+t;
  if(v.peso)t+=' Con baja de peso: apoyo nutricional y mirtazapina como neuromodulador preferido.';
  if(v.tipo==='amb')t+=' Superposición: el SDP manda si el dolor es posprandial.';
  return {vals:[V('Fenotipo',{sdp:'SDP',sde:'SDE',amb:'SDP + SDE'}[v.tipo],'mid'),V('Escalón',plan[on][0],'')],txt:t,plan,on}},
 ref:'Roma V 2026 · ACG-CAG 2017 dispepsia · Maastricht VI.'},

{id:'nv',g:'Estómago',t:'Náuseas y vómitos crónicos',d:'Patrón, consumo de cannabis, fármacos y vaciamiento para llegar al síndrome y su tratamiento.',
 i:[s('pat','Patrón',[['cont','Continuo o casi diario'],['epi','Episodios estereotipados con intervalos sin síntomas']]),c('can','Cannabis ≥ 4 días/semana o ≥ 15 dosis/semana por ≥ 1 año'),c('far','Opioides o agonistas de GLP-1'),c('dm','Diabetes'),
    s('ge','Vaciamiento gástrico de 4 h',[['nd','No realizado'],['len','Lento (> 10 % a 4 h)'],['nor','Normal']]),c('rum','Regurgitación sin esfuerzo, sin náusea, minutos después de comer')],
 f(v){let ph,plan,on=0,t='';
  if(v.rum){ph='Rumiación (no es un síndrome de náuseas y vómitos)';plan=[['1','Respiración diafragmática con biorretroalimentación','2–4 semanas'],['2','Baclofeno','—']];t='Confirmar con manometría con impedancia posprandial.';}
  else if(v.pat==='epi'&&v.can){ph='Hiperémesis por cannabinoides';plan=[['Crisis','Haloperidol 0,05–0,1 mg/kg IV o 2,5–5 mg; capsaicina tópica 0,075 %; hidratación','Ondansetrón y opioides rinden poco'],['Definitivo','Suspensión sostenida del cannabis (≥ 6 meses o 3 ciclos para confirmar)','Apoyo de adicciones'],['Profilaxis','Amitriptilina como en vómitos cíclicos mientras se logra la abstinencia','—']];t='Los baños calientes compulsivos apoyan el diagnóstico pero también ocurren en vómitos cíclicos.';}
  else if(v.pat==='epi'){ph='Síndrome de vómitos cíclicos';plan=[['Aborto','Sumatriptán 20 mg nasal o 6 mg s.c. + ondansetrón 8 mg + lorazepam en el pródromo','Mayor efecto si es precoz'],['Profilaxis','Amitriptilina 25 → 75–100 mg (≈ 1 mg/kg); alternativas topiramato o aprepitant','Meta: ≥ 50 % menos episodios a 3 meses'],['Siempre','Gatillantes (sueño, ayuno, estrés), migraña, ansiedad','—']];on=1;t='Criterio Roma V: ≥ 3 episodios al año y 2 en los últimos 6 meses, con intervalos sin vómitos.';}
  else if(v.far){ph='Náuseas por fármacos';plan=[['1','Suspender o rotar el opioide o el agonista de GLP-1; reevaluar en 2–4 semanas','—'],['2','Si persiste: vaciamiento gástrico de 4 h sin el fármaco','—']];t='Opioides y agonistas de GLP-1 retardan el vaciamiento y producen náuseas: no rotular gastroparesia mientras se usan.';}
  else if(v.ge==='len'){ph='Gastroparesia'+(v.dm?' diabética':'');plan=[['Base','Comidas pequeñas, partículas pequeñas, baja grasa y fibra; líquidos calóricos si no tolera sólidos'+(v.dm?'; control glicémico':''),'—'],['1','Metoclopramida 5–10 mg 3–4 veces al día, ≤ 12 semanas','Evaluar a 4 semanas'],['2','Eritromicina 125–250 mg c/8 h en ciclos; antieméticos (ondansetrón)','Taquifilaxia'],['3','G-POEM en refractarios seleccionados; nutrición yeyunal si hay desnutrición','—']];on=1;}
  else if(v.ge==='nor'){ph='Síndrome de náuseas y vómitos crónicos';plan=[['1','Neuromodulador: mirtazapina 7,5–15 mg u olanzapina 2,5–5 mg noche; ATC en dosis baja','4–8 semanas'],['2','Antieméticos a demanda; terapia cerebro-intestino','—']];t='Vaciamiento normal y sin causa estructural (Roma V).';}
  else {ph='Náuseas y vómitos continuos sin estudiar';plan=[['1','Endoscopía y laboratorio (glicemia, función renal, calcio, tiroides, embarazo); revisar fármacos','—'],['2','Vaciamiento gástrico de 4 h con glicemia &lt; 275 mg/dL y sin fármacos que lo alteren','Separa gastroparesia de síndrome de náuseas y vómitos']];}
  return {vals:[V('Fenotipo',ph,'mid')],txt:t,plan,on}},
 ref:'Roma V 2026 · AGA 2025 gastroparesia · Venkatesan, Neurogastroenterol Motil 2019 (vómitos cíclicos).'},

{id:'diar',g:'Intestino',t:'Diarrea crónica: estudio y tratamiento',d:'Separa la diarrea de origen orgánico tratable (ácidos biliares, colitis microscópica, celíaca, SIBO) del SII-D y la diarrea funcional.',
 i:[c('ban','Banderas rojas (sangre, baja de peso, anemia, inicio ≥ 50 años, fiebre)'),c('noc','Deposiciones nocturnas o acuosas persistentes'),c('dol','Dolor ≥ 3 días/mes asociado a la defecación'),c('col','Colecistectomía, resección ileal o enfermedad ileal'),c('far','AINE, IBP, ISRS o estatinas'),c('cir','Cirugía digestiva previa, esclerodermia o dismotilidad'),
    s('calp','Calprotectina fecal',[['nd','No realizada'],['nor','< 50 µg/g'],['alt','Elevada']]),s('cel','Serología de celíaca',[['nd','No realizada'],['neg','Negativa (con IgA normal)'],['pos','Positiva']])],
 f(v){const L=[];
  if(v.cel==='nd')L.push(['Siempre','Anti-transglutaminasa IgA + IgA total','—']); if(v.cel==='pos')L.push(['Celíaca','Biopsias duodenales y dieta sin gluten','—']);
  if(v.calp==='nd')L.push(['Siempre','Calprotectina fecal y PCR','&gt; 100–150 µg/g: colonoscopía']);
  if(v.ban||v.calp==='alt')L.push(['Prioritario','Colonoscopía con ileoscopía y biopsias','—']);
  if(v.noc||v.far)L.push(['Colitis microscópica','Colonoscopía con biopsias escalonadas (derecho e izquierdo) aunque la mucosa sea normal; suspender fármacos asociados','Budesonida 9 mg/día × 8 semanas si se confirma']);
  if(v.col||v.noc)L.push(['Ácidos biliares','SeHCAT o C4 donde exista; si no, prueba con colestiramina 4 g 1–3 veces al día','Respuesta en días apoya el diagnóstico']);
  if(v.cir)L.push(['SIBO','Test de aire espirado con glucosa','Rifaximina 14 días si es positivo']);
  L.push(v.dol?['SII-D','Loperamida, antiespasmódico, FODMAP; rifaximina; ATC en dosis baja','Ver fenotipador de SII']:['Diarrea funcional','Loperamida preventiva; colestiramina empírica si no hay estudio de ácidos biliares; psyllium para dar consistencia','—']);
  const org=v.ban||v.calp==='alt'||v.cel==='pos';
  const ori=org?'Descartar organicidad':(v.noc||v.far)?'Descartar colitis microscópica':v.col?'Probable malabsorción de ácidos biliares':v.cir?'Descartar SIBO':v.dol?'SII-D probable':'Diarrea funcional probable';
  return {vals:[V('Orientación',ori,org?'bad':'mid'),V('Pasos',L.length,'')],txt:'Ejecutar en el orden de la tabla. La malabsorción de ácidos biliares explica hasta un tercio de los SII-D y diarreas funcionales.',plan:L,on:0}},
 ref:'BSG 2018 diarrea crónica (Arasaradnam) · AGA 2016 colitis microscópica · Roma V 2026.'},

{id:'dolor',g:'Dolor',t:'Dolor abdominal crónico',d:'Distingue SII, dispepsia, CAPS, intestino narcótico y migraña abdominal por la relación del dolor con las funciones digestivas y los opioides.',
 i:[s('rel','Relación del dolor',[['def','Con la defecación'],['com','Con las comidas (epigástrico)'],['nin','Ninguna: continuo o casi continuo'],['epi','Episodios estereotipados de horas a días con intervalos normales']]),
    c('opi','Opioides en dosis estables o crecientes con dolor que empeora'),c('mig','Migraña personal o familiar, palidez, anorexia o fotofobia en los episodios'),c('psi','Comorbilidad psicológica o PHQ-15 alto'),c('ban','Banderas rojas o signos de obstrucción')],
 f(v){let ph,plan,on=0,t='';
  if(v.ban){ph='Estudiar organicidad primero';plan=[['1','Laboratorio, imagen (tomografía) y endoscopía según el cuadro','—']];}
  else if(v.opi){ph='Síndrome de intestino narcótico';plan=[['1','Relación terapéutica y metas; explicar la hiperalgesia por opioides','—'],['2','Neuromodulador: duloxetina 30 → 60 mg o ATC; quetiapina en dosis baja para sueño','2–4 semanas antes del descenso'],['3','Descenso del opioide 10–20 % por semana; clonidina 0,1 mg c/8–12 h desde el 50 % retirado; laxantes','Recaída frecuente: seguimiento estrecho']];on=0;t='El dolor empeora paradójicamente con el opioide.';}
  else if(v.rel==='epi'){ph=v.mig?'Migraña abdominal (Roma V)':'Dolor episódico: considerar migraña abdominal o porfiria, obstrucción intermitente';plan=[['Crisis','Reposo en oscuridad, AINE o triptán, antiemético','—'],['Profilaxis','Propranolol, amitriptilina, topiramato o ciproheptadina (como en migraña)','3 meses']];on=1;t='Diagnóstico nuevo del adulto en Roma V: episodios estereotipados de dolor periumbilical o difuso, de ≥ 1 h, con síntomas vasomotores, anorexia, náuseas o fotofobia.';}
  else if(v.rel==='def'){ph='SII';plan=[['1','Ver fenotipador de SII','—']];t='Dolor ≥ 3 días/mes asociado a la defecación o a cambios de frecuencia o forma.';}
  else if(v.rel==='com'){ph='Dispepsia (SDE o SDP)';plan=[['1','Ver fenotipador de dispepsia','—']];}
  else {ph='Dolor abdominal centralmente mediado (CAPS)';plan=[['1','Relación terapéutica, metas funcionales y no curativas; evitar estudios repetidos y opioides','—'],['2','ATC (amitriptilina 25–50 mg) o IRSN (duloxetina 60 mg)','8–12 semanas'],['3','Aumento: + pregabalina o quetiapina en dosis baja','—'],['4','Terapia cerebro-intestino o manejo multidisciplinario del dolor','—']];on=1;t='Dolor continuo o casi continuo, sin relación con comer ni defecar, con limitación funcional (Roma V).';}
  if(v.psi)t+=' Comorbilidad psicológica o carga somática alta: neuromodulador central y terapia cerebro-intestino tempranos.';
  return {vals:[V('Fenotipo',ph,v.ban?'bad':'mid')],txt:t,plan,on}},
 ref:'Roma V 2026 (dolor centralmente mediado) · Drossman 2018 (neuromoduladores) · Grunkemeier 2007 (intestino narcótico).'}
];

const META={
sii:{uso:'r',que:'Siguiente escalón terapéutico en SII según fenotipo.',cuando:'En cada control de SII.',ojo:'No reemplaza revisar el diagnóstico cuando no hay respuesta (colitis microscópica, ácidos biliares, celíaca).',esc:esc3,
 ej:[{l:'SII-D leve inicial',v:{sub:'D',dom:'hab',gr:'l',paso:'0'}},{l:'SII-D con dolor',v:{sub:'D',dom:'dol',gr:'m',paso:'2'}},{l:'SII-C grave con ansiedad',v:{sub:'C',dom:'dol',gr:'g',paso:'1',psi:true}},{l:'SII-M distensión',v:{sub:'M',dom:'dis',gr:'m',paso:'1'}},{l:'SII-D tras colecistectomía',v:{sub:'D',dom:'hab',gr:'m',paso:'1',col:true}}]},
cons:{uso:'r',que:'Escalón de laxantes o necesidad de estudio anorrectal.',cuando:'Constipación crónica en consulta.',ojo:'La disinergia no responde a laxantes: buscarla temprano si hay síntomas evacuatorios.',esc:esc3,
 ej:[{l:'Inicial',v:{paso:'0',arm:'nd',tr:'nd'}},{l:'Evacuatoria',v:{eva:true,paso:'1',arm:'nd',tr:'nd'}},{l:'Disinergia confirmada',v:{eva:true,paso:'2',arm:'dis',tr:'nd'}},{l:'Refractaria con anorrectal normal',v:{paso:'3',arm:'nor',tr:'nd'}},{l:'Opioides',v:{opi:true,paso:'2',arm:'nd',tr:'nd'}}]},
erge:{uso:'r',que:'Fenotipo de reflujo y conducta.',cuando:'Pirosis o regurgitación, antes de escalar IBP o indicar cirugía.',ojo:'«ERGE refractaria» exige ERGE probada; sin ella son síntomas refractarios.',esc:esc3,
 ej:[{l:'Sin respuesta a IBP',v:{sin:'pir',resp:'nul',obj:'nd'}},{l:'ERGE probada con regurgitación',v:{sin:'reg',resp:'par',obj:'erge',hh:true}},{l:'Hipersensibilidad',v:{sin:'pir',resp:'par',obj:'hip'}},{l:'Pirosis funcional',v:{sin:'pir',resp:'nul',obj:'fun'}},{l:'Rumiación',v:{sin:'reg',resp:'nul',obj:'rum'}},{l:'Refractaria con IBP',v:{sin:'pir',resp:'par',obj:'refr'}}]},
disp:{uso:'r',que:'Siguiente paso en dispepsia funcional.',cuando:'Dispepsia sin alarma o con endoscopía normal.',ojo:'Erradicar H. pylori primero.',esc:esc3,
 ej:[{l:'SDP H. pylori pendiente',v:{tipo:'sdp',hp:'nd',paso:'0'}},{l:'SDP con baja de peso',v:{tipo:'sdp',hp:'neg',paso:'1',peso:true}},{l:'SDE refractario',v:{tipo:'sde',hp:'neg',paso:'1'}},{l:'≥ 40 sin endoscopía',v:{tipo:'sde',hp:'nd',paso:'0',end:true}}]},
nv:{uso:'r',que:'Síndrome de náuseas y vómitos y su tratamiento.',cuando:'Náuseas o vómitos crónicos con endoscopía normal.',ojo:'Descartar rumiación y fármacos antes de rotular.',esc:esc3,
 ej:[{l:'Gastroparesia diabética',v:{pat:'cont',dm:true,ge:'len'}},{l:'Vómitos cíclicos',v:{pat:'epi',ge:'nd'}},{l:'Cannabinoides',v:{pat:'epi',can:true,ge:'nd'}},{l:'SNVC',v:{pat:'cont',ge:'nor'}},{l:'GLP-1',v:{pat:'cont',far:true,ge:'nd'}},{l:'Rumiación',v:{pat:'cont',rum:true,ge:'nd'}}]},
diar:{uso:'r',que:'Qué estudiar y tratar en diarrea crónica.',cuando:'Diarrea de más de 4 semanas.',ojo:'Diarrea nocturna o acuosa persistente no es típica de SII.',esc:esc3,
 ej:[{l:'SII-D típico',v:{dol:true,calp:'nor',cel:'neg'}},{l:'Mujer > 50 con ISRS',v:{noc:true,far:true,calp:'nor',cel:'neg'}},{l:'Poscolecistectomía',v:{col:true,calp:'nor',cel:'neg'}},{l:'Banderas rojas',v:{ban:true,calp:'alt',cel:'nd'}}]},
dolor:{uso:'s',que:'Tipo de dolor abdominal crónico.',cuando:'Dolor abdominal crónico con estudio orgánico razonable negativo.',ojo:'Dolor continuo sin relación con funciones digestivas no es SII.',esc:esc3,
 ej:[{l:'CAPS',v:{rel:'nin',psi:true}},{l:'Intestino narcótico',v:{rel:'nin',opi:true}},{l:'Migraña abdominal',v:{rel:'epi',mig:true}},{l:'SII',v:{rel:'def'}}]}
};

const CURA={titulo:'Cómo usar el fenotipador',buscar:'Buscar fenotipo…',unidad:'fenotipadores',col:'Fenotipador',
 intro:'Cada herramienta ubica al paciente en un fenotipo y marca en la tabla el escalón siguiente, con fármaco, dosis y criterio de falla. Las dosis y la disponibilidad en Chile están en el vademécum.',
 r:'Para la consulta habitual de neurogastroenterología.',s:'Para casos específicos.',
 extra:'<h2>Principios</h2><ul><li><b>Un fármaco por síntoma dominante</b>, con plazo y criterio de falla definidos.</li><li><b>Gravedad y comorbilidad psicológica</b> adelantan neuromoduladores y terapia cerebro-intestino.</li><li><b>Sin respuesta</b>: revisar el diagnóstico antes de escalar (estudio funcional, diagnósticos alternativos).</li></ul>'};

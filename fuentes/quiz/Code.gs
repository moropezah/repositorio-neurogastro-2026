/**
 * Quiz Neurogastroenterología 2026 · conexión con Google Sheets (Apps Script)
 * Hoja: "Quiz Neurogastroenterología 2026 · Progreso" (independiente de los quizzes de hepatología y EII)
 *
 * GET  ?action=load&quizId=…&token=…   → {ok:true, estado:{…}|null}
 * POST {token, action:"save", quizId, estado, respuestas:[…]} → {ok:true}
 *
 * Instrucciones en INSTRUCCIONES.md (misma carpeta).
 */
const SHEET_ID = '1Ack_ldPRZ5gHNLUHOunpiTTaEB2bm7mjaURmuWTZZsE';
const TOKEN = 'neuro-2026';           // debe coincidir con la clave configurada en el quiz
const TROZO = 45000;                  // caracteres por celda (límite de Sheets: 50.000)

function hoja_(nombre, encabezados) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre);
    sh.appendRow(encabezados);
    sh.setFrozenRows(1);
  }
  return sh;
}

function salida_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function leerEstado_(quizId) {
  const sh = hoja_('estado', ['quizId', 'actualizado', 'json']);
  const datos = sh.getDataRange().getValues();
  for (let i = 1; i < datos.length; i++) {
    if (datos[i][0] === quizId) {
      const json = datos[i].slice(2).join('');
      return json ? JSON.parse(json) : null;
    }
  }
  return null;
}

function guardarEstado_(quizId, estado) {
  const sh = hoja_('estado', ['quizId', 'actualizado', 'json']);
  const txt = JSON.stringify(estado || {});
  const trozos = [];
  for (let i = 0; i < txt.length; i += TROZO) trozos.push(txt.slice(i, i + TROZO));
  const fila = [quizId, new Date()].concat(trozos);
  const datos = sh.getDataRange().getValues();
  let r = -1;
  for (let i = 1; i < datos.length; i++) if (datos[i][0] === quizId) { r = i + 1; break; }
  if (r < 0) { sh.appendRow(fila); return; }
  sh.getRange(r, 1, 1, Math.max(sh.getLastColumn(), fila.length)).clearContent();
  sh.getRange(r, 1, 1, fila.length).setValues([fila]);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.token !== TOKEN) return salida_({ ok: false, error: 'token inválido' });
  if (p.action === 'load') {
    try { return salida_({ ok: true, estado: leerEstado_(p.quizId || 'quizNeuro_2026') }); }
    catch (err) { return salida_({ ok: false, error: String(err) }); }
  }
  return salida_({ ok: true, info: 'Quiz Neurogastroenterología 2026' });
}

function doPost(e) {
  let d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) { return salida_({ ok: false, error: 'JSON inválido' }); }
  if (d.token !== TOKEN) return salida_({ ok: false, error: 'token inválido' });
  if (d.action !== 'save') return salida_({ ok: false, error: 'acción desconocida' });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    guardarEstado_(d.quizId || 'quizNeuro_2026', d.estado);
    const rs = d.respuestas || [];
    if (rs.length) {
      const sh = hoja_('respuestas', ['fecha', 'quizId', 'preguntaId', 'tema', 'elegida', 'correcta', 'acierto']);
      sh.getRange(sh.getLastRow() + 1, 1, rs.length, 7).setValues(rs.map(r => [
        r.fecha ? new Date(r.fecha) : new Date(), d.quizId || '', r.preguntaId || '', r.tema || '',
        r.elegida === '' ? '' : r.elegida, r.correcta, String(r.elegida) === String(r.correcta) ? 1 : 0
      ]));
    }
    return salida_({ ok: true });
  } catch (err) {
    return salida_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Ejecutar una vez desde el editor (▶ prepararHoja) para crear las pestañas y un resumen por tema.
 * No es obligatorio: «estado» y «respuestas» también se crean solas con la primera sincronización.
 */
function prepararHoja() {
  hoja_('estado', ['quizId', 'actualizado', 'json']);
  hoja_('respuestas', ['fecha', 'quizId', 'preguntaId', 'tema', 'elegida', 'correcta', 'acierto']);
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let r = ss.getSheetByName('resumen');
  if (!r) r = ss.insertSheet('resumen');
  r.clear();
  r.getRange('A1').setFormula('=IFERROR(QUERY(respuestas!A:G,"select D, count(G), sum(G), avg(G) where B = \'quizNeuro_2026\' and D is not null group by D order by avg(G) label D \'Tema\', count(G) \'Respuestas\', sum(G) \'Aciertos\', avg(G) \'% acierto\'",1),"Sin respuestas todavía")');
  r.getRange('D:D').setNumberFormat('0%');
  r.setFrozenRows(1);
  const s1 = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (s1 && ss.getSheets().length > 1) ss.deleteSheet(s1);
}

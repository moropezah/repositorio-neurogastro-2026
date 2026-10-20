#!/usr/bin/env python3
"""Ensambla guia-2026.html a partir de fuentes/guia/.

Uso (desde la raíz del repositorio):  python3 fuentes/guia/actualizar.py

- bloques.json define el orden, los grupos y qué bloques están escritos.
- Cada bloque escrito vive en bloques/<archivo>.html y empieza con su <h2 id="bN">.
- Un bloque con "archivo": null aparece en el índice como pendiente y con un aviso en el cuerpo.
Solo regenera guia-2026.html; no toca ningún otro módulo.
"""
import json, re, html, pathlib, datetime

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
cfg = json.loads((AQUI / "bloques.json").read_text(encoding="utf-8"))

css = (AQUI / "estilos.css").read_text(encoding="utf-8") + (AQUI / "extra.css").read_text(encoding="utf-8")
pwa_css = (AQUI / "pwa.css").read_text(encoding="utf-8")
js = (AQUI / "guia.js").read_text(encoding="utf-8")


# ---------- Perlas por patología (perlas.txt) ----------
ETQ = {"Definición", "Clínica", "Examen físico", "Criterios", "Estudio", "Manometría", "pH-impedancia", "Fisiopatología", "Tratamiento", "Laboratorio", "Endoscopía"}
def _fmt(t):
    t = html.escape(t, quote=False)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
def leer_perlas():
    por_archivo, actual, p = {}, None, None
    for n, linea in enumerate((AQUI / "perlas.txt").read_text(encoding="utf-8").splitlines(), 1):
        s = linea.strip()
        if not s or (s.startswith("#") and not s.startswith("# b")):
            continue
        if s.startswith("# b"):
            actual = s[2:].strip(); por_archivo.setdefault(actual, []); continue
        if s.startswith("@"):
            h3, _, tit = s[1:].partition("::")
            p = {"h3": h3.strip(), "t": tit.strip(), "f": [], "q": []}; por_archivo[actual].append(p); continue
        if s.startswith("- "):
            p["q"].append(_fmt(s[2:])); continue
        k, sep, v = s.partition(":")
        if sep and k.strip() in ETQ:
            p["f"].append((k.strip(), _fmt(v.strip()))); continue
        raise SystemExit(f"perlas.txt línea {n}: no se entiende «{s[:60]}»")
    return por_archivo
def html_perla(p):
    filas = "".join(f"<dt>{k}</dt><dd>{v}</dd>" for k, v in p["f"])
    q = ("<div class=\"pq\"><b>Lo que preguntan</b><ul>" + "".join(f"<li>{x}</li>" for x in p["q"]) + "</ul></div>") if p["q"] else ""
    return (f'\n<div class="perla"><div class="pt"><span>Perlas</span>{html.escape(p["t"])}</div>'
            + (f"<dl>{filas}</dl>" if filas else "") + q + "</div>\n")
def insertar_perlas(frag, lista):
    for p in reversed(lista):  # en orden inverso para respetar el orden de varias perlas bajo el mismo h3
        m = re.search(r"<h3[^>]*>\s*" + re.escape(html.escape(p["h3"], quote=False)) + r"\s*</h3>", frag)
        if not m:
            m = re.search(r"<h3[^>]*>\s*" + re.escape(p["h3"]) + r"\s*</h3>", frag)
        if not m:
            raise SystemExit(f"Perla «{p['t']}»: no encontré el h3 «{p['h3']}»")
        frag = frag[:m.end()] + html_perla(p) + frag[m.end():]
    return frag
PERLAS = leer_perlas()
nperlas = 0
escritos, total, nfc, npreg = 0, 0, 0, 0
nav, cuerpo = [], []
for g in cfg["grupos"]:
    nav.append(f'  <div class="grp">{html.escape(g["nombre"])}</div>')
    for i, b in enumerate(g["bloques"]):
        total += 1
        clase = "" if i == 0 else ' class="sub"'
        if b["archivo"] and (AQUI / "bloques" / b["archivo"]).exists():
            escritos += 1
            frag = (AQUI / "bloques" / b["archivo"]).read_text(encoding="utf-8")
            if b["archivo"] in PERLAS:
                frag = insertar_perlas(frag, PERLAS[b["archivo"]]); nperlas += len(PERLAS[b["archivo"]])
            if f'id="{b["id"]}"' not in frag:
                raise SystemExit(f'El bloque {b["archivo"]} no contiene id="{b["id"]}"')
            nfc += frag.count('class="fc"')
            for m in re.finditer(r'<script type="application/json" class="qz-data"[^>]*>(.*?)</script>', frag, re.S):
                npreg += len(json.loads(m.group(1)))
            nav.append(f'  <a href="#{b["id"]}"{clase}>{b["num"]} · {html.escape(b["corto"])}</a>')
            cuerpo.append(f'\n<!-- ================= BLOQUE {b["num"]} ================= -->\n' + frag.strip() + "\n")
        else:
            cl = ' class="sub off"' if i else ' class="off"'
            nav.append(f'  <a href="#{b["id"]}"{cl}>{b["num"]} · {html.escape(b["corto"])}</a>')
            cuerpo.append(
                f'\n<!-- ================= BLOQUE {b["num"]} (pendiente) ================= -->\n'
                f'<h2 id="{b["id"]}"><span class="num">{b["num"]}</span>{html.escape(b["titulo"])}</h2>\n'
                f'<div class="pend"><b>Bloque en preparación.</b> Se construirá con Roma V, los cursos de neurogastroenterología '
                f'2025–2026 y las guías vigentes, con el mismo formato de los demás bloques.</div>\n')

nav.append('  <div class="grp">Cierre</div>')
nav.append('  <a href="#fuentes">Fuentes del curso</a>')

hoy = datetime.date.today().isoformat()
doc = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="Dr. Moisés Oropeza">
<title>Módulo 1 · Guía de estudio Neurogastroenterología 2026</title>
<style>
{css}
</style>
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
</head>
<body>
<div id="wrap">
<aside id="nav">
  <div class="brand"><span>Guía de estudio</span><b>Neurogastroenterología 2026</b></div>
  <input id="navsearch" type="search" placeholder="Filtrar secciones…" autocomplete="off">
  <button id="soloperlas" type="button" aria-pressed="false">Solo perlas</button>
  <div id="navlinks">
  <a href="#inicio">Cómo usar esta guía</a>
{chr(10).join(nav)}
  </div>
</aside>

<main>
<header class="hero"><div class="inner">
  <div class="kicker">Postgrado de Gastroenterología · Repaso integrado</div>
  <h1>Neurogastroenterología 2026</h1>
  <p>Clase de repaso de los trastornos de la interacción intestino-cerebro y de la motilidad que llenan la consulta: reflujo,
  dispepsia, intestino irritable, constipación, distensión, gastroparesia, disfagia y piso pélvico. Construida sobre tus guías del
  Curso de Neurogastroenterología para Residentes (alto 2026 y bajo 2025) y el cuaderno de Avances 2026, actualizada a <b>Roma V</b>
  (Gastroenterology, mayo 2026), Lyon 2.0, Chicago 4.0 y las guías ACG y AGA vigentes, con el marco chileno (disponibilidad de
  fármacos y estudios) declarado donde cambia la conducta.</p>
  <div class="meta">
    <div><b>Actualizado</b> · {cfg["actualizado"]}</div>
    <div><b>Nivel</b> · residente de gastroenterología</div>
    <div><b>Marco</b> · Roma V · Lyon 2.0 · Chicago 4.0</div>
    <div><b>{escritos} de {total} bloques</b> · {nperlas} perlas · {nfc} flashcards · {npreg} preguntas</div>
  </div>
  <div class="autor-g">
    <span class="ini-g">MO</span>
    <div>
      <div class="n-g">Dr. Moisés Oropeza</div>
      <div class="r-g">Residente de Gastroenterología, Universidad de los Andes · Clínica Dávila / Clínica Universidad de los Andes — autoría y edición</div>
    </div>
  </div>
</div></header>

<div class="inner">

<h2 id="inicio">Cómo usar esta guía</h2>
<p class="lead">Cada bloque es autosuficiente y sigue la misma estructura, para que se pueda estudiar por separado o repasar en orden.</p>
<div class="cards">
  <div class="card"><h5>Contenido</h5><p>Criterios de Roma V, umbrales de los estudios funcionales y algoritmos con fármaco, dosis, tiempo de prueba y criterio de falla.</p></div>
  <div class="card"><h5>Qué cambió</h5><p>Tabla al inicio de cada bloque con lo nuevo frente a la referencia previa (Roma V frente a Roma IV, Lyon 2.0 frente a 1.0, Chicago 4.0 frente a 3.0, AGA 2025 frente a ACG 2022) y las correcciones a lo que traían los apuntes del curso.</p></div>
  <div class="card"><h5>Perlas</h5><p>Caja ámbar por entidad: definición, criterios, estudio y lo que se pregunta. El botón <b>Solo perlas</b> del índice deja visibles únicamente estas cajas.</p></div>
  <div class="card"><h5>Marcadores</h5><p><b>Idea clave</b> para el examen oral, <b>error frecuente</b>, <b>actualización</b> y <b>Chile</b> cuando la disponibilidad de un fármaco o estudio cambia la conducta.</p></div>
  <div class="card"><h5>Autoevaluación</h5><p>Cada bloque cierra con un caso clínico, flashcards (clic para ver la respuesta) y preguntas con corrección razonada.</p></div>
</div>
<div class="box nue"><div class="t">Sobre la evidencia</div>
<p>Roma V se publicó en el número especial de <i>Gastroenterology</i> de mayo de 2026 (vol. 170, n.º 6). Los criterios citados se transcriben de los capítulos originales.
Roma V recomienda en la práctica sus <b>criterios clínicos</b>: se cumplen los rasgos cualitativos del síntoma, este es molesto y se excluyó razonablemente lo orgánico; la frecuencia puede ser menor y basta una duración de unas 8 semanas. Los umbrales de 3 y 6 meses quedan para investigación.
Los apuntes del curso se respetan, pero cuando un dato quedó superado (Lyon 2.0 retiró el PSPW, Roma V cambió los criterios del vómito cíclico, la disinergia o el SII) el bloque lo corrige de forma explícita.</p></div>
{"".join(cuerpo)}

<!-- ================= FUENTES ================= -->
<h2 id="fuentes">Fuentes del curso</h2>
<p class="lead">Material docente sobre el que se construyó la guía. Las referencias bibliográficas de cada tema están al final de su bloque.</p>
<div class="tw"><table class="sm">
<thead><tr><th style="width:28%">Fuente</th><th>Contenido usado</th></tr></thead>
<tbody>
<tr><td><b>Roma V</b><br><span class="small">Gastroenterology 2026;170(6)</span></td><td>Proceso y criterios clínicos (Drossman, Chang, Tack), trastornos esofágicos (Gyawali), gastroduodenales (Törnblom), intestinales (Corsetti), dolor centralmente mediado (Fukudo), anorrectales (Rao) y microambiente intestinal.</td></tr>
<tr><td><b>Curso de Neurogastroenterología para Residentes · tubo digestivo alto</b><br><span class="small">20 de agosto de 2026 · Guía Neurogastro Alto 2026</span></td><td>ERGE (Cisternas), reflujo refractario (Monrroy), eructos y abelchia (Glasinovic), síntomas laringofaríngeos (Tortorolo), disfagia (Squella), EoE (Reyes), trastornos motores (Defilippi), dispepsia (Aronsohn), gastroparesia (Gran), náuseas y vómitos (von Mühlenbrock) y taller de estudios funcionales.</td></tr>
<tr><td><b>Curso Anual de Neurogastroenterología · tubo digestivo bajo</b><br><span class="small">Agrupación Chilena de Neurogastroenterología, agosto 2025</span></td><td>Fisiología colorrectal (Glasinovic), SII, manejo no farmacológico, diarrea crónica y SII-D, constipación y SII-C, distensión y SIBO, neuromoduladores y dolor crónico, piso pélvico y disinergia, patología anorrectal, dismotilidad del intestino delgado, EII y trastornos defecatorios.</td></tr>
<tr><td><b>Cuaderno Neurogastroenterología y Avances 2026</b></td><td>Capítulo de esófago y neurogastroenterología alta (curso SChGE-Neurogastro y 46.º Curso de Avances).</td></tr>
<tr><td><b>Simposio de Gastroenterología Clínica Dávila 2026</b></td><td>Reflujo refractario (Tortorolo).</td></tr>
<tr><td><b>Guías y consensos</b></td><td>Lyon 2.0, Chicago 4.0, ACG 2022 (ERGE), ACG 2021 (SII), AGA 2022 (SII-C y SII-D), AGA-ACG 2023 (constipación), ACG/CAG 2017 y BSG 2022 (dispepsia), ACG 2022 y AGA 2025 (gastroparesia), ACG 2020 (acalasia y SIBO), ACG 2021 (anorrectal), ACG 2025 (EoE), clasificación de Londres, actualizaciones AGA (eructos y distensión 2023, P-CAB 2024, hiperemesis cannabinoide 2024). Citadas al final de cada bloque.</td></tr>
</tbody></table></div>
<p class="small">Generado con <code>fuentes/guia/actualizar.py</code> el {hoy}.</p>

</div>
</main>
</div>
<a class="volver" href="./">← Repositorio</a>
<script>
{js}
</script>
<style>
{pwa_css}
</style>
<div id="pwa-ui"></div>
<script>
(function(){{
  var SW="sw.js", KEY="pwa-ios-neuro", APP="Neurogastro 2026";
  var standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)&&!/claude\\.ai|claudeusercontent/.test(location.hostname)){{
    window.addEventListener('load',function(){{navigator.serviceWorker.register(SW).catch(function(){{}})}});
  }}
  if(standalone)return;
  var ui=document.getElementById('pwa-ui'),dp=null;
  window.addEventListener('beforeinstallprompt',function(e){{e.preventDefault();dp=e;
    var b=document.createElement('button');b.type='button';b.textContent='Instalar '+APP;
    b.onclick=function(){{dp.prompt();dp.userChoice.finally(function(){{b.remove()}})}};ui.appendChild(b)}});
  var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&/safari/i.test(navigator.userAgent)&&!/crios|fxios/i.test(navigator.userAgent);
  var seen=false;try{{seen=localStorage.getItem(KEY)==='1'}}catch(e){{}}
  if(ios&&!seen){{var d=document.createElement('div');d.id='pwa-ios';
    d.innerHTML='<button class="x" type="button" aria-label="Cerrar">✕</button><b>Instalar '+APP+'</b>Toca <span aria-label="Compartir">Compartir ⬆︎</span> y luego «Agregar a inicio». Funcionará sin conexión.';
    d.querySelector('.x').onclick=function(){{d.remove();try{{localStorage.setItem(KEY,'1')}}catch(e){{}}}};ui.appendChild(d)}}
}})();
</script>
</body>
</html>
"""
(RAIZ / "guia-2026.html").write_text(doc, encoding="utf-8")
print(f"guia-2026.html: {escritos}/{total} bloques, {nperlas} perlas, {nfc} flashcards, {npreg} preguntas, {len(doc)//1024} KB")

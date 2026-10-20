#!/usr/bin/env python3
"""Reescribe las partes fijas de index.html (portada, módulos, fuentes, cabecera) para el repositorio de neurogastroenterología.
Las cifras se calculan desde las fuentes. Ejecutar antes de fuentes/repositorio/actualizar.py.

Uso: python3 fuentes/repositorio/portada.py
"""
import json, pathlib, re

RAIZ = pathlib.Path(__file__).resolve().parents[2]
INDEX = RAIZ / "index.html"
h = INDEX.read_text(encoding="utf-8")

# ---------- cifras ----------
guia = (RAIZ / "guia-2026.html").read_text(encoding="utf-8")
nfc = guia.count('<div class="fc">'); nperl = guia.count('<div class="perla">')
npreg = sum(len(json.loads(m)) for m in re.findall(r'<script type="application/json" class="qz-data" data-b="b\d+">(.*?)</script>', guia, re.S))
nbl = len(json.loads((RAIZ / "fuentes/guia/bloques.json").read_text(encoding="utf-8"))["bloques"]) if "bloques" in json.loads((RAIZ / "fuentes/guia/bloques.json").read_text(encoding="utf-8")) else 16
nrap = (RAIZ / "fuentes/rapida/rapida.html").read_text(encoding="utf-8").count('<details class="ac"')
vad = json.loads((RAIZ / "fuentes/vademecum/farmacos.json").read_text(encoding="utf-8"))
nfar = len(vad["farmacos"]); nnd = sum(1 for f in vad["farmacos"] if "nd" in f["cob"])
def cuenta(p, pat): return len(re.findall(pat, (RAIZ / p).read_text(encoding="utf-8")))
ncalc = cuenta("fuentes/herramientas/calc.js", r"\n\{id:'")
nest = cuenta("fuentes/herramientas/estudios.js", r"\n\{id:'")
nfen = cuenta("fuentes/herramientas/fenotipos.js", r"\n\{id:'")
nquiz = cuenta("quiz/index.html", r'\{id:"[A-Z]{2}\d\d"')
nlam = cuenta("atlas/index.html", r'<section id=')
nhoj = cuenta("pacientes/index.html", r'<article class="hoja"')

def sub(pat, rep, flags=re.S, opcional=False):
    """opcional=True: el reemplazo ya pudo aplicarse en una ejecución anterior (idempotente)."""
    global h
    nuevo, n = re.subn(pat, lambda m: rep, h, count=1, flags=flags)
    assert n == 1 or opcional, pat[:60]
    h = nuevo

sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="Repositorio de estudio de neurogastroenterología 2026: guía Roma V, Chicago 4.0 y Lyon 2.0, consulta rápida, fenotipador terapéutico, intérpretes de estudios, vademécum con disponibilidad en Chile, calculadoras, atlas, material para pacientes y quiz.">')
sub(r'<title>[^<]*</title>', '<title>Repositorio Neurogastroenterología 2026</title>')
sub(r'\.cob\.g88,\.cob\.g68,\.cob\.g69,\.cob\.lrs\{[^}]*\}\n\.cob\.g88x,\.cob\.ver\{[^}]*\}',
    '.cob.bol{background:color-mix(in srgb,var(--verde) 16%,transparent);color:var(--verde)}\n.cob.ver,.cob.off{background:color-mix(in srgb,var(--ambar) 16%,transparent);color:var(--ambar)}', opcional=True)
sub(r'\.cob\.hosp,\.cob\.bol\{', '.cob.hosp{', opcional=True)

sub(r'<header class="top">.*?</header>', '''<header class="top">
  <div class="top-in">
    <a class="brand" href="#inicio"><span class="dot">NG</span><span>Repositorio Neurogastro 2026</span></a>
    <nav class="tabs" id="tabs">
      <a href="#inicio">Inicio</a>
      <a href="guia-2026.html">Guía</a>
      <a href="#rapida">Rápida</a>
      <a href="fenotipos/">Fenotipos</a>
      <a href="estudios/">Estudios</a>
      <a href="#vademecum">Vademécum</a>
      <a href="calc/">Calculadoras</a>
      <a href="atlas/">Atlas</a>
      <a href="pacientes/">Pacientes</a>
      <a href="quiz/">Quiz</a>
      <a href="#fuentes">Fuentes</a>
    </nav>
    <button class="tema" id="tema" title="Cambiar tema" aria-label="Cambiar tema">◐</button>
  </div>
</header>''')

MODS = [
 ("guia-2026.html", "01", f"{nbl} / {nbl} BLOQUES", "Guía de estudio Neurogastroenterología 2026",
  "De Roma V al laboratorio de motilidad: ERGE y Lyon 2.0, TICI esofágicos, eructos y rumiación, disfagia y EoE, Chicago 4.0 y acalasia, dispepsia, gastroparesia y náuseas, SII, diarrea crónica, constipación, distensión y SIBO, pseudoobstrucción, anorrectal, dolor y neuromoduladores. Cada bloque abre con «qué cambió», trae algoritmos con fármaco, dosis y criterio de falla, y cierra con caso, flashcards y preguntas.",
  [f"{nperl} perlas", "Roma V · Chicago 4.0 · Lyon 2.0", "Navegación lateral"]),
 ("#rapida", "02", f"{nrap} TARJETAS", "Consulta rápida",
  "Criterios y cortes para el paciente delante: banderas rojas de Roma V, Lyon 2.0 en una tabla, pirosis refractaria, fenotipos esofágicos, rumiación y eructos, EoE, Chicago 4.0, dispepsia, gastroparesia, SII por subtipo, diarrea crónica, escalera de constipación, SIBO, Ogilvie, anorrectal, neuromoduladores y preparación de estudios.",
  ["Buscador", "Cortes numéricos"]),
 ("fenotipos/", "03", f"{nfen} FENOTIPADORES", "Fenotipador terapéutico",
  "Ubica al paciente en su fenotipo y marca el escalón siguiente con fármaco, dosis y criterio de falla: SII por subtipo y síntoma dominante, constipación (tránsito o evacuación), reflujo (ERGE, hipersensibilidad, funcional, rumiación, eructo), dispepsia, náuseas y vómitos, diarrea crónica y dolor abdominal.",
  ["Escalera marcada", "Ejemplos clínicos", "Sin conexión"]),
 ("estudios/", "04", f"{nest} INTÉRPRETES", "Intérpretes de estudios",
  "Se ingresan los valores del informe y devuelve la conclusión: pH-impedancia (Lyon 2.0, con y sin tratamiento), cápsula de 96 h, manometría esofágica (Chicago 4.0), FLIP, vaciamiento gástrico, test de aire espirado, tránsito colónico y manometría anorrectal (Londres).",
  ["Lyon 2.0", "Chicago 4.0", "Londres"]),
 ("#vademecum", "05", f"{nfar} FÁRMACOS", "Vademécum neurogastroenterológico",
  f"Por fármaco: mecanismo, línea, dosis, ajustes, cuándo esperar respuesta, seguimiento, efectos adversos y disponibilidad en Chile ({nnd} sin registro). Antisecretores y P-CAB, procinéticos y antieméticos, antiespasmódicos, laxantes y secretagogos, antidiarreicos y secuestrantes, neuromoduladores, EoE y fármacos de crisis.",
  ["Disponibilidad en Chile", "Líneas por enfermedad", "Filtros"]),
 ("calc/", "06", f"{ncalc} CALCULADORAS", "Calculadoras",
  "Criterios de Roma V (SII y subtipo, dispepsia, constipación), GerdQ, índice de síntomas de reflujo, Eckardt, equivalencia de IBP, GCSI, Sigstad, IBS-SSS, Agachan-Wexner, Wexner y St Mark's, PHQ-9, GAD-7 y PHQ-15.",
  ["Ficha de uso y escala", "Ejemplos", "Sin conexión"]),
 ("atlas/", "07", f"{nlam} LÁMINAS", "Atlas",
  "Esquemas originales: mecanismos y dianas de los TICI, patrones de Chicago 4.0, algoritmo de Lyon 2.0, FLIP, escala de Bristol, tipos de disinergia y escalera de constipación.",
  ["SVG propios", "Modo oscuro"]),
 ("pacientes/", "08", f"{nhoj} HOJAS", "Material para pacientes",
  "Hojas imprimibles en lenguaje simple: intestino irritable, dieta baja en FODMAP, constipación y postura, respiración diafragmática, reflujo, gastroparesia, neuromoduladores, preparación de exámenes y diario de síntomas con escala de Bristol.",
  ["Imprimir por hoja", "Lenguaje simple"]),
 ("quiz/", "09", f"{nquiz} CASOS", "Quiz Neurogastroenterología",
  f"Banco propio de {nquiz} casos clínicos (8 por bloque), con explicación, por qué no las otras, perla y referencias. Modos estudio y examen cronometrado, flashcards, progreso por tema, exportación a CSV, Anki y PDF, y sincronización con Google Sheets.",
  ["Casos clínicos", "Google Sheets", "Sin conexión"]),
]
mods = "\n".join(f'''    <a class="mod" href="{u}">
      <span class="n">MÓDULO {n} <span class="estado ok">{e}</span></span>
      <h3>{t}</h3>
      <p>{d}</p>
      <span class="tag">{"".join(f"<i>{x}</i>" for x in tags)}</span>
      <span class="go">Abrir →</span>
    </a>''' for u, n, e, t, d, tags in MODS)

sub(r'<section class="vista on" id="v-inicio">.*?</section>', f'''<section class="vista on" id="v-inicio">
  <div class="hero">
    <p class="eyebrow">Postgrado Gastroenterología · Universidad de los Andes</p>
    <h1>Neurogastroenterología:<br><em>repositorio de estudio 2026</em></h1>
    <p class="sub">Guía de repaso de los trastornos de la interacción cerebro-intestino y de la motilidad, con Roma V, Chicago 4.0 y Lyon 2.0; herramientas para decidir el tratamiento por fenotipo e interpretar los estudios funcionales; fármacos con su disponibilidad en Chile, calculadoras, atlas, material para pacientes y un banco de casos propio.</p>
    <div class="meta">
      <span>Actualizado octubre 2026</span>
      <span>Roma V · Chicago 4.0 · Lyon 2.0</span>
      <span>AGA · ACG · ESNM</span>
    </div>
    <div class="autor">
      <span class="ini">MO</span>
      <div class="d">
        <div class="n">Dr. Moisés Oropeza</div>
        <div class="r"><em>Residente de Gastroenterología, Universidad de los Andes</em> · Clínica Dávila / Clínica Universidad de los Andes — compilación y edición del repositorio</div>
      </div>
    </div>
    <div class="cifras">
      <div><b>{nbl}</b><small>bloques temáticos en la guía</small></div>
      <div><b>{nperl}</b><small>perlas de examen por entidad</small></div>
      <div><b>{nfc}</b><small>flashcards</small></div>
      <div><b>{npreg + nquiz}</b><small>preguntas y casos con corrección razonada</small></div>
      <div><b>{nfen + nest + ncalc}</b><small>herramientas: fenotipadores, intérpretes y calculadoras</small></div>
      <div><b>~41 %</b><small>de la población cumple criterios de al menos un TICI (estudio global de la Fundación Roma)</small></div>
    </div>
  </div>

  <p class="eyebrow">Módulos</p>
  <h2 class="sec">Cómo está organizado</h2>
  <p class="lead">Nueve piezas independientes: cada una se actualiza sin tocar las demás.</p>

  <div class="mods">
{mods}
  </div>

  <div class="box clave">
    <div class="t">Cómo usar este repositorio</div>
    <p><strong>Para estudiar un tema:</strong> Módulo 01 y, para repasar, el 09. <strong>Con el paciente delante:</strong> Módulos 02 y 03. <strong>Con un informe de motilidad en la mano:</strong> Módulo 04. <strong>Para indicar un fármaco y saber si existe en Chile:</strong> Módulo 05. <strong>Para explicar y entregar indicaciones:</strong> Módulos 07 y 08.</p>
  </div>
</section>''')

sub(r'<h1 style="font-size:clamp\(1.6rem,4.6vw,2.4rem\)">Vademécum [^<]*</h1>\s*<p class="sub">[^<]*</p>',
    '<h1 style="font-size:clamp(1.6rem,4.6vw,2.4rem)">Vademécum neurogastroenterológico</h1>\n    <p class="sub">Por fármaco: línea de uso, dosis, ajustes, cuándo esperar respuesta, seguimiento, efectos adversos y disponibilidad en Chile. La pestaña «Líneas de tratamiento» resume la secuencia por enfermedad.</p>')
sub(r'<div class="box ojo">\s*<div class="t">(?:Cobertura|Disponibilidad) en Chile</div>.*?</div>', '''<div class="box ojo">
    <div class="t">Disponibilidad en Chile</div>
    <p>Los TICI no tienen garantías GES ni cobertura por Ley Ricarte Soto: casi todo es <strong>costo de bolsillo o según plan</strong>. Etiquetas: <strong>Disponible</strong> (comercializado), <strong>Fuera de ficha</strong> (la indicación descrita no está en el registro, pero tiene respaldo de guías o ensayos), <strong>Hospitalario</strong>, <strong>Verificar disponibilidad</strong> y <strong>Sin registro en Chile</strong>. Según el curso de 2025, <strong>no hay linaclotida ni lubiprostona</strong>; tegoprazán se comercializa desde 2024 y la rifaximina registrada es de 200 mg. Verificar en el ISP antes de prescribir.</p>
  </div>''')

sub(r'<section class="vista" id="v-fuentes">.*?</section>', '''<section class="vista" id="v-fuentes">
  <div class="hero" style="padding-block:34px 20px">
    <p class="eyebrow">Fuentes</p>
    <h1 style="font-size:clamp(1.6rem,4.6vw,2.4rem)">Fuentes, autoría y alcance</h1>
    <p class="sub">De dónde viene cada pieza y cómo se jerarquizó la evidencia.</p>
  </div>
  <div class="box bien">
    <div class="t">Autor del repositorio</div>
    <p><strong>Dr. Moisés Oropeza</strong>, Médico Internista, Residente de Gastroenterología de la Universidad de los Andes (Clínica Dávila / Clínica Universidad de los Andes). Selección de contenidos, redacción y edición. Santiago de Chile, octubre 2026.</p>
  </div>
  <h3 class="sub">Consensos y guías de referencia</h3>
  <ul>
    <li><strong>Roma V</strong> (Gastroenterology, 2026): criterios clínicos y de investigación de los TICI.</li>
    <li><strong>Clasificación de Chicago 4.0</strong> (Neurogastroenterol Motil 2021) y panometría FLIP.</li>
    <li><strong>Consenso de Lyon 2.0</strong> (Gut 2024) para el diagnóstico de ERGE.</li>
    <li>AGA 2025 gastroparesia · AGA-ACG 2023 constipación crónica · ACG 2021 SII · AGA 2022 SII-D y SII-C · ACG 2022 ERGE · ACG 2020 acalasia · AGA-JTF 2020 EoE · Consenso norteamericano de test de aire espirado 2017 · IAPWG y clasificación de Londres 2020.</li>
  </ul>
  <h3 class="sub">Material docente de base</h3>
  <ul>
    <li>Guía de neurogastroenterología del tubo digestivo alto 2026 y cuaderno de avances 2026 del autor, actualizados a Roma V.</li>
    <li>Curso de Neurogastroenterología (tubo digestivo bajo) 2025 y taller de estudios funcionales 2026.</li>
  </ul>
  <h3 class="sub">Jerarquía de evidencia</h3>
  <p>Consensos y guías vigentes, luego ensayos aleatorizados y metaanálisis, luego el material docente. Cuando dos fuentes discrepan, el texto lo dice (por ejemplo, el PSPW retirado en Lyon 2.0 o los cortes de FLIP que reemplazan a los de los apuntes). El contexto chileno (disponibilidad de fármacos, guía MINSAL de cáncer gástrico) se declara donde cambia la conducta. El atlas usa esquemas propios; no reproduce figuras de terceros.</p>
  <div class="foot">
    <p><strong>Repositorio Neurogastroenterología 2026</strong> · Autoría, compilación y edición: <strong>Dr. Moisés Oropeza</strong>, Residente de Gastroenterología, Universidad de los Andes — Clínica Dávila / Clínica Universidad de los Andes. Uso personal de estudio.</p>
  </div>
</section>''')

for a, b in [("'hepato-tema'", "'neuro-tema'"), ("'hepato-vad'", "'neuro-vad'"),
             ('KEY="pwa-ios-hepato", APP="Hepatología 2026"', 'KEY="pwa-ios-neuro", APP="Neurogastro 2026"')]:
    h = h.replace(a, b)
sub(r"var CF=\[\[.*?\]\];", "var CF=[['all','Toda disponibilidad'],['bol','Disponible'],['off','Fuera de ficha'],['hosp','Hospitalario'],['ver','Por verificar'],['nd','Sin registro en Chile']];")
sub(r"if\(st\.c==='ges'\) return f\.cob\.indexOf\('g68'\)>=0\|\|f\.cob\.indexOf\('g69'\)>=0;\n\s*", "", opcional=True)
import re as _re
_mal=[l[:120] for l in h.split("\n") if _re.search(r"hepatolog|hepato-|GES 88", l, _re.I)]
assert not _mal, _mal[:5]
INDEX.write_text(h, encoding="utf-8")
print(f"index.html: portada con {len(MODS)} módulos · guía {nbl} bloques/{nperl} perlas/{nfc} flashcards/{npreg} preguntas · rápida {nrap} · vademécum {nfar} · calc {ncalc} · estudios {nest} · fenotipos {nfen} · atlas {nlam} · pacientes {nhoj} · quiz {nquiz}")

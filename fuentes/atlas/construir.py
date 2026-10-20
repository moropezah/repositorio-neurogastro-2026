#!/usr/bin/env python3
"""Genera atlas/index.html: esquemas originales en SVG (sin imágenes de terceros).

Uso (desde la raíz):  python3 fuentes/atlas/construir.py
"""
import pathlib, html

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parents[1]
SHELL = (AQUI / "shell.html").read_text(encoding="utf-8")

# ---------------------------------------------------------------- Clouse (topografía de presión)
BG, LES, UES, HOT, MID, WARM = "#1d3557", "#d62828", "#e76f51", "#e63946", "#2a9d8f", "#f4a261"
def clouse(nombre, sub, cuerpo, les="relaja", ues=True):
    w, h = 190, 150
    s = [f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{html.escape(nombre)}">',
         '<defs><linearGradient id="gw" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f4d35e"/><stop offset=".5" stop-color="#ee964b"/><stop offset="1" stop-color="#e63946"/></linearGradient></defs>',
         f'<rect x="0" y="0" width="{w}" height="{h}" rx="8" fill="{BG}"/>']
    # esfínter superior
    s.append(f'<rect x="8" y="12" width="{w-16}" height="12" fill="{UES}"/>')
    if ues: s.append(f'<rect x="26" y="12" width="14" height="12" fill="{BG}"/>')
    # esfínter inferior
    if les == "relaja":
        s.append(f'<rect x="8" y="112" width="{w-16}" height="14" fill="{LES}"/><rect x="34" y="112" width="92" height="14" fill="#3d5a80"/>')
    elif les == "hipo":
        s.append(f'<rect x="8" y="114" width="{w-16}" height="8" fill="#9d4edd" opacity=".55"/>')
    else:  # no relaja
        s.append(f'<rect x="8" y="112" width="{w-16}" height="14" fill="{LES}"/>')
    s.extend(cuerpo)
    s.append(f'<text x="{w-10}" y="{h-8}" text-anchor="end" font-size="9" fill="#e9ecef" font-family="Inter,sans-serif">10 s</text>')
    s.append('</svg>')
    return f'<figure class="pan">{"".join(s)}<figcaption><b>{nombre}</b><span>{sub}</span></figcaption></figure>'

def onda(x0=38, y0=26, x1=118, y1=112, g=9, op=1, fill="url(#gw)"):
    return f'<polygon points="{x0},{y0} {x0+g},{y0} {x1+g},{y1} {x1},{y1}" fill="{fill}" opacity="{op}"/>'

PANELES = [
    clouse("Normal", "IRP normal · DCI 450–8.000 · DL ≥ 4,5 s", [onda()]),
    clouse("Acalasia tipo I", "IRP ↑ · 100 % fallidas · sin presurización", [], les="no"),
    clouse("Acalasia tipo II", "IRP ↑ · presurización panesofágica ≥ 20 %", [f'<rect x="34" y="26" width="70" height="86" fill="{MID}" opacity=".85"/>'], les="no"),
    clouse("Acalasia tipo III", "IRP ↑ · ≥ 20 % prematuras (DL < 4,5 s)", [f'<polygon points="40,52 54,52 66,112 52,112" fill="{HOT}"/>'], les="no"),
    clouse("EGJOO", "IRP ↑ supino y sentado · presión intrabolo ↑", [onda(), f'<polygon points="70,64 120,112 34,112 34,96" fill="{MID}" opacity=".7"/>'], les="no"),
    clouse("Espasmo esofágico distal", "IRP normal · ≥ 20 % prematuras", [onda(38, 26, 62, 66), f'<polygon points="62,66 74,66 78,112 66,112" fill="{HOT}"/>']),
    clouse("Esófago hipercontráctil", "IRP normal · ≥ 20 % DCI > 8.000", [onda(36, 26, 112, 112, 18), onda(52, 60, 128, 112, 10, .9, HOT)]),
    clouse("Motilidad inefectiva (IEM)", "> 70 % inefectivas o ≥ 50 % fallidas", [onda(38, 26, 70, 62, 6, .55), onda(92, 86, 118, 112, 6, .55)]),
    clouse("Contractilidad ausente", "IRP normal · 100 % fallidas", [], les="hipo"),
]

# ---------------------------------------------------------------- Bristol
def bristol():
    C, D = "#8c5a2b", "#5e3a1a"
    tipos = [
        ("1", "Trozos duros separados", "".join(f'<circle cx="{x}" cy="{y}" r="6" fill="{C}" stroke="{D}"/>' for x, y in [(20, 30), (38, 22), (52, 34), (70, 26), (86, 34)])),
        ("2", "Salchicha con grumos", f'<g fill="{C}" stroke="{D}">' + "".join(f'<circle cx="{18+i*12}" cy="{28+(i%2)*3}" r="8"/>' for i in range(7)) + "</g>"),
        ("3", "Salchicha con grietas", f'<rect x="12" y="20" width="84" height="16" rx="8" fill="{C}" stroke="{D}"/><path d="M28 21v5M44 35v-5M60 21v6M76 35v-5" stroke="{D}"/>'),
        ("4", "Lisa y blanda, como serpiente", f'<path d="M10 30 C30 14, 50 44, 70 26 S96 30,100 30" stroke="{C}" stroke-width="12" fill="none" stroke-linecap="round"/>'),
        ("5", "Trozos blandos de bordes nítidos", "".join(f'<ellipse cx="{x}" cy="{y}" rx="10" ry="6" fill="{C}" stroke="{D}"/>' for x, y in [(22, 24), (46, 34), (70, 22), (90, 34)])),
        ("6", "Trozos esponjosos de bordes rotos", f'<path d="M12 32 q6-14 14-4 q6-12 14 0 q8-10 12 2 q8-12 14 0 q6-8 12 4 q8-6 12 4 q-30 12 -78 -6z" fill="{C}" opacity=".85"/>'),
        ("7", "Líquida, sin trozos", f'<path d="M8 34 q14-8 28 0 t28 0 t28 0 t14 0 v6 h-98z" fill="{C}" opacity=".6"/>'),
    ]
    filas = []
    for i, (n, t, g) in enumerate(tipos):
        zona = "c" if n in "12" else "d" if n in "67" else "n"
        filas.append(f'<div class="bri {zona}"><svg viewBox="0 0 110 50" aria-hidden="true">{g}</svg><b>Tipo {n}</b><span>{t}</span></div>')
    return "".join(filas)

# ---------------------------------------------------------------- Disinergia (Rao I–IV)
def rao():
    def mini(t, rect, anal, txt):
        r = {"sube": "M10 70 L40 70 L50 30 L100 30 L110 70 L140 70", "plano": "M10 70 L140 70"}[rect]
        a = {"paradoja": "M10 50 L40 50 L50 22 L100 22 L110 50 L140 50", "nosube": "M10 50 L40 50 L50 48 L100 48 L110 50 L140 50"}[anal]
        return (f'<figure class="pan"><svg viewBox="0 0 150 100" role="img" aria-label="Disinergia {t}">'
                f'<rect width="150" height="100" rx="8" fill="var(--panel-2)"/><rect x="40" y="8" width="70" height="84" fill="var(--acento)" opacity=".08"/>'
                f'<text x="75" y="18" text-anchor="middle" font-size="8" fill="var(--fg-3)" font-family="Inter,sans-serif">pujo</text>'
                f'<path d="{r}" fill="none" stroke="var(--marino)" stroke-width="3"/><path d="{a}" fill="none" stroke="var(--acento)" stroke-width="3" stroke-dasharray="5 3"/></svg>'
                f'<figcaption><b>Tipo {t}</b><span>{txt}</span></figcaption></figure>')
    return "".join([
        mini("I", "sube", "paradoja", "Propulsión rectal adecuada · contracción anal paradójica"),
        mini("II", "plano", "paradoja", "Propulsión inadecuada · contracción anal paradójica"),
        mini("III", "sube", "nosube", "Propulsión adecuada · relajación anal ausente o < 20 %"),
        mini("IV", "plano", "nosube", "Propulsión inadecuada · relajación anal ausente o < 20 %"),
    ])

# ---------------------------------------------------------------- FLIP
def flip():
    # x: EGJ-DI 0–5 → 50–330 ; y: diámetro 6–24 mm → 230–20
    X = lambda d: 50 + d * 56
    Y = lambda m: 230 - (m - 6) * (210 / 18)
    s = ['<svg viewBox="0 0 360 270" role="img" aria-label="Clasificación de apertura de la unión con FLIP">',
         f'<rect x="50" y="20" width="280" height="210" fill="var(--ambar)" opacity=".18"/>',
         f'<rect x="{X(2)}" y="20" width="{X(5)-X(2)}" height="{Y(16)-20}" fill="var(--verde)" opacity=".28"/>',
         f'<rect x="50" y="{Y(12)}" width="{X(2)-50}" height="{230-Y(12)}" fill="var(--rojo)" opacity=".28"/>',
         '<line x1="50" y1="230" x2="330" y2="230" stroke="var(--fg-3)"/><line x1="50" y1="20" x2="50" y2="230" stroke="var(--fg-3)"/>']
    for d in range(6):
        s.append(f'<text x="{X(d)}" y="245" text-anchor="middle" font-size="10" fill="var(--fg-2)">{d}</text>')
    for m in (6, 12, 16, 20, 24):
        s.append(f'<text x="44" y="{Y(m)+3}" text-anchor="end" font-size="10" fill="var(--fg-2)">{m}</text>')
    s += [f'<text x="190" y="264" text-anchor="middle" font-size="10" fill="var(--fg-2)">EGJ-DI (mm²/mmHg)</text>',
          f'<text x="14" y="125" font-size="10" fill="var(--fg-2)" transform="rotate(-90 14 125)" text-anchor="middle">Diámetro máximo (mm)</text>',
          f'<text x="{(X(2)+X(5))/2}" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="var(--verde)">Apertura normal</text>',
          f'<text x="{(50+X(2))/2}" y="{Y(9)}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--rojo)">Reducida</text>',
          f'<text x="{X(1.2)}" y="{Y(19)}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ambar)">Limítrofe</text>',
          '</svg>']
    return "".join(s)

# ---------------------------------------------------------------- Lyon 2.0 (flujo)
def caja(x, y, w, h, t, cls="b"):
    lines = t.split("|")
    tx = "".join(f'<tspan x="{x+w/2}" dy="{0 if i==0 else 13}">{html.escape(l)}</tspan>' for i, l in enumerate(lines))
    y0 = y + h / 2 - (len(lines) - 1) * 6.5 + 4
    return f'<g class="nd {cls}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8"/><text x="{x+w/2}" y="{y0}" text-anchor="middle">{tx}</text></g>'
def flecha(x1, y1, x2, y2, t=""):
    lab = f'<text x="{(x1+x2)/2+4}" y="{(y1+y2)/2-3}" class="fl">{html.escape(t)}</text>' if t else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" class="ar" marker-end="url(#pt)"/>{lab}'
def lyon():
    s = ['<svg viewBox="0 0 640 400" role="img" aria-label="Algoritmo diagnóstico de ERGE según Lyon 2.0">',
         '<defs><marker id="pt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--fg-3)"/></marker></defs>',
         caja(220, 10, 200, 40, "Síntomas de reflujo sin|respuesta a IBP o antes de cirugía"),
         flecha(320, 50, 320, 76),
         caja(200, 78, 240, 40, "Endoscopía sin IBP 2–4 semanas"),
         flecha(440, 98, 488, 98),
         caja(490, 72, 140, 52, "ERGE confirmada|LA B–D, Barrett|o estenosis", "si"),
         flecha(320, 118, 320, 150, "normal o LA A"),
         caja(170, 152, 300, 40, "Monitorización sin tratamiento|cápsula 96 h o pH-impedancia 24 h"),
         flecha(470, 172, 488, 172), caja(490, 152, 140, 40, "TEA > 6 %|ERGE confirmada", "si"),
         flecha(320, 192, 320, 226, "TEA 4–6 %"),
         caja(200, 228, 240, 48, "Zona gris: reflujos > 80, MNBI|< 1.500 Ω, hernia → a favor"),
         flecha(170, 172, 112, 226, "TEA < 4 %"),
         caja(10, 228, 180, 40, "Sin ERGE: asociación|sintomática (SI / SAP)"),
         flecha(70, 268, 70, 312, "positiva"), caja(10, 314, 130, 40, "Hipersensibilidad|al reflujo", "md"),
         flecha(150, 268, 220, 312, "negativa"), caja(160, 314, 140, 40, "Pirosis funcional", "md"),
         flecha(440, 252, 488, 252), caja(490, 232, 140, 40, "Repetir con 96 h|o integrar clínica", "gr"),
         '</svg>']
    return "".join(s)

# ---------------------------------------------------------------- Eje cerebro-intestino
def eje():
    nodos = [("Procesamiento central", 320, 50, "Neuromoduladores · terapia cerebro-intestino"),
             ("Hipersensibilidad visceral", 540, 150, "ATC · pregabalina · menta"),
             ("Motilidad", 470, 300, "Procinéticos · laxantes · antidiarreicos"),
             ("Mucosa e inmunidad", 170, 300, "Dieta · secuestrantes · budesonida"),
             ("Microbiota", 100, 150, "FODMAP · rifaximina · probióticos")]
    s = ['<svg viewBox="0 0 640 380" role="img" aria-label="Mecanismos de los TICI y dianas terapéuticas">',
         '<circle cx="320" cy="190" r="62" fill="var(--marino)" opacity=".12" stroke="var(--marino)"/>',
         '<text x="320" y="186" text-anchor="middle" font-family="Source Serif 4,serif" font-size="17" font-weight="700" fill="var(--marino)">TICI</text>',
         '<text x="320" y="204" text-anchor="middle" font-size="10" fill="var(--fg-2)">eje intestino-cerebro</text>']
    for t, x, y, tr in nodos:
        s.append(f'<line x1="320" y1="190" x2="{x}" y2="{y}" stroke="var(--line-2)" stroke-width="2" stroke-dasharray="4 4"/>')
    for t, x, y, tr in nodos:
        s.append(f'<g><rect x="{x-92}" y="{y-24}" width="184" height="48" rx="10" fill="var(--panel)" stroke="var(--acento)"/>'
                 f'<text x="{x}" y="{y-4}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--fg)">{t}</text>'
                 f'<text x="{x}" y="{y+12}" text-anchor="middle" font-size="9.5" fill="var(--fg-3)">{tr}</text></g>')
    s.append('</svg>')
    return "".join(s)

# ---------------------------------------------------------------- Escalera de constipación
def escalera():
    pasos = [("Fibra soluble + agua · revisar fármacos · tacto rectal", "var(--verde)"),
             ("PEG 17 g/día (fuerte)", "var(--verde)"),
             ("Bisacodilo o picosulfato (fuerte)", "var(--marino-2)"),
             ("Prucaloprida 2 mg (fuerte)", "var(--marino-2)"),
             ("Manometría anorrectal + balón → biorretroalimentación", "var(--acento)"),
             ("Tránsito colónico → centro de referencia", "var(--rojo)")]
    s = ['<svg viewBox="0 0 640 300" role="img" aria-label="Escalera terapéutica en constipación crónica">']
    for i, (t, c) in enumerate(pasos):
        x, y, w = 20 + i * 40, 250 - i * 44, 600 - i * 80
        s.append(f'<rect x="{x}" y="{y}" width="{w}" height="38" rx="6" fill="{c}" opacity=".16" stroke="{c}"/>'
                 f'<text x="{x+12}" y="{y+24}" font-size="12" font-weight="600" fill="var(--fg)">{i+1}. {html.escape(t)}</text>')
    s.append('</svg>')
    return "".join(s)

SEC = [
 ("eje", "Mecanismos y dianas", "Un TICI resulta de la combinación variable de cinco mecanismos; cada uno tiene su diana terapéutica. El tratamiento se elige por el síntoma dominante y el mecanismo que lo explica.", f'<div class="fig ancho">{eje()}</div>'),
 ("chicago", "Chicago 4.0: patrones de topografía de presión", "Esquemas didácticos (no son trazados reales). Eje vertical: esfínter superior arriba, unión esofagogástrica abajo; eje horizontal: tiempo tras una deglución. Amarillo a rojo: contracción; verde: presurización del bolo; azul: reposo.", '<div class="pans">' + "".join(PANELES) + "</div>"),
 ("lyon", "Lyon 2.0: diagnóstico de ERGE", "Jerarquía de la evidencia: la endoscopía sin tratamiento y la monitorización ambulatoria sin tratamiento deciden; la clínica y la respuesta a IBP no confirman.", f'<div class="fig ancho">{lyon()}</div>'),
 ("flip", "FLIP: apertura de la unión", "Cortes de Chicago 4.0. La respuesta contráctil (anterógrada, ausente, desordenada o espástica) se informa aparte.", f'<div class="fig medio">{flip()}</div>'),
 ("bristol", "Escala de Bristol y subtipos de SII", "Bristol 1–2 cuenta como constipación y 6–7 como diarrea al subtipificar el SII (regla del 25 % en días con deposiciones anormales).", f'<div class="bris">{bristol()}</div><div class="ley"><span><i style="background:var(--ambar)"></i>Bristol 1–2: constipación</span><span><i style="background:var(--verde)"></i>3–5: normal</span><span><i style="background:var(--marino-2)"></i>6–7: diarrea</span></div>'),
 ("rao", "Disinergia defecatoria: tipos de Rao", "Línea continua: presión rectal (propulsión); línea discontinua: presión anal. La franja marca el pujo. Sirve para explicar el patrón en la biorretroalimentación.", '<div class="pans">' + rao() + "</div>"),
 ("escalera", "Constipación crónica: escalera terapéutica", "AGA-ACG 2023, adaptada a la disponibilidad en Chile (sin linaclotida, lubiprostona ni plecanatida).", f'<div class="fig ancho">{escalera()}</div>'),
]

def main():
    idx = "".join(f'<a href="#{i}">{t}</a>' for i, t, _, _ in SEC)
    cuerpo = "".join(f'<section id="{i}"><h2>{t}</h2><p class="desc">{d}</p>{f}</section>' for i, t, d, f in SEC)
    out = SHELL.replace("{{INDICE}}", idx).replace("{{CUERPO}}", cuerpo).replace("{{N}}", str(len(SEC)))
    d = RAIZ / "atlas"; d.mkdir(exist_ok=True)
    (d / "index.html").write_text(out, encoding="utf-8")
    print(f"atlas/index.html: {len(SEC)} láminas, {len(PANELES)} patrones de Chicago")

if __name__ == "__main__":
    main()

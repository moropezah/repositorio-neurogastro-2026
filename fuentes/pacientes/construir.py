#!/usr/bin/env python3
"""Genera pacientes/index.html (hojas imprimibles) usando el armazón del atlas.

Uso (desde la raíz):  python3 fuentes/pacientes/construir.py
"""
import pathlib, re

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parents[1]
shell = (RAIZ / "fuentes/atlas/shell.html").read_text(encoding="utf-8")
hojas = (AQUI / "hojas.html").read_text(encoding="utf-8")

CSS = """
.hoja{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:22px 24px;margin:22px 0;max-width:900px;position:relative}
.hoja h2{margin:0 0 8px;border:0;padding:0;font-size:1.4rem}
.hoja h3{font-family:var(--ff-s);font-size:1.05rem;margin:16px 0 6px;color:var(--marino)}
.hoja .lead{font-size:1rem;color:var(--fg-2);max-width:74ch}
.hoja ul,.hoja ol{color:var(--fg-2);padding-left:22px}.hoja li{margin-bottom:6px}.hoja li b,.hoja p b{color:var(--fg)}
.hoja .imp{position:absolute;top:18px;right:18px;border:1px solid var(--line-2);background:var(--bg);color:var(--fg-2);border-radius:99px;padding:5px 12px;font:600 .78rem var(--ff-b);cursor:pointer}
.alarma{border-left:3px solid var(--rojo);background:color-mix(in srgb,var(--rojo) 7%,var(--panel));padding:10px 14px;border-radius:0 10px 10px 0;margin:14px 0 0;font-size:.92rem;color:var(--fg-2)}
.tw{overflow-x:auto;margin:12px 0;border:1px solid var(--line);border-radius:10px}
.tw table{border-collapse:collapse;width:100%;font-size:.86rem;min-width:520px}
.tw th,.tw td{border-bottom:1px solid var(--line);padding:7px 10px;text-align:left;vertical-align:top}
.tw th{background:var(--panel-2);font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;color:var(--fg-2)}
.fases{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:12px 0}
.fases div{border:1px solid var(--line);border-top:3px solid var(--acento);border-radius:10px;padding:10px 12px;font-size:.88rem;color:var(--fg-2);display:flex;flex-direction:column;gap:2px}
.fases b{font-family:var(--ff-s);color:var(--fg);font-size:1rem}.fases span{font-size:.75rem;color:var(--acento);font-weight:700}
.dos{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px}
.dos svg{width:100%;max-width:260px;height:auto;display:block}
ol.pasos li{margin-bottom:8px}
.brmini{display:flex;flex-wrap:wrap;gap:6px;font-size:.78rem;color:var(--fg-2)}.brmini span{border:1px solid var(--line);border-radius:99px;padding:3px 9px}.brmini b{color:var(--acento)}
table.diario td{height:30px}
@media print{
  .top,.idx,.aviso,.imp,main>h1,main>.desc{display:none!important}
  body{background:#fff;color:#000;font-size:12pt}
  .hoja{border:0;padding:0;margin:0;max-width:none;break-after:page}
  body.solo .hoja{display:none}body.solo .hoja.on{display:block}
  .tw{overflow:visible}.tw table{min-width:0}
}
"""

def main():
    out = shell.replace("<title>Atlas · Neurogastroenterología 2026</title>", "<title>Material para pacientes · Neurogastroenterología 2026</title>")
    out = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="Hojas imprimibles para pacientes: intestino irritable, dieta baja en FODMAP, constipación, respiración diafragmática, reflujo, gastroparesia, neuromoduladores, preparación de exámenes y diario de síntomas.">', out)
    out = out.replace("<span>Atlas · Neurogastro 2026</span>", "<span>Pacientes · Neurogastro 2026</span>")
    out = out.replace("</style>", CSS + "</style>", 1)
    out = out.replace("<h1>Atlas de neurogastroenterología</h1>", "<h1>Material para pacientes</h1>")
    out = out.replace('<p class="desc">{{N}} láminas con esquemas originales para estudiar y para explicar al paciente. No reproducen figuras de las guías ni trazados de pacientes.</p>',
                      '<p class="desc">{{N}} hojas en lenguaje simple para entregar en la consulta. Cada una se imprime por separado con su botón, o todas juntas con la impresión del navegador.</p>')
    i = out.index('<div class="aviso">'); j = out.index("</div>", i) + 6
    out = out[:i] + '<div class="aviso">Contenido general de educación. Ajuste dosis, plazos y suspensión de fármacos a cada paciente antes de entregarlas.</div>' + out[j:]
    titulos = re.findall(r'<article class="hoja" id="([^"]+)">\s*<h2>([^<]+)</h2>', hojas)
    cuerpo = re.sub(r'(<article class="hoja" id="[^"]+">)', r'\1<button type="button" class="imp">Imprimir esta hoja</button>', hojas)
    idx = "".join(f'<a href="#{i}">{t.split(":")[0]}</a>' for i, t in titulos)
    js = """<script>
document.querySelectorAll('.hoja .imp').forEach(function(b){b.onclick=function(){var h=b.closest('.hoja');document.body.classList.add('solo');h.classList.add('on');
  window.print();setTimeout(function(){document.body.classList.remove('solo');h.classList.remove('on')},500)}});
</script>
</body>"""
    out = out.replace("{{INDICE}}", idx).replace("{{CUERPO}}", cuerpo).replace("{{N}}", str(len(titulos))).replace("</body>", js, 1)
    d = RAIZ / "pacientes"; d.mkdir(exist_ok=True)
    (d / "index.html").write_text(out, encoding="utf-8")
    print(f"pacientes/index.html: {len(titulos)} hojas")

if __name__ == "__main__":
    main()

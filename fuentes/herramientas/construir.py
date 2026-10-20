#!/usr/bin/env python3
"""Genera calc/, estudios/ y fenotipos/ a partir de una plantilla común.

Uso (desde la raíz):  python3 fuentes/herramientas/construir.py

- plantilla.html: interfaz (barra lateral, ficha, ejemplos, escala, curaduría).
- calc.js, estudios.js, fenotipos.js: definen PAGINA, CALCS, META y CURA.
- Valida con Node: sintaxis, ids únicos y que cada ejemplo produzca un resultado.
"""
import pathlib, subprocess, json, sys, re

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parents[1]
PAGS = {
    "calc": dict(titulo="Calculadoras · Neurogastroenterología 2026", marca="Calculadoras · Neurogastro 2026",
                 desc="Calculadoras de neurogastroenterología: criterios de Roma V, GerdQ, Eckardt, IBS-SSS, GCSI, Wexner, St Mark's, PHQ-9, GAD-7 y más."),
    "estudios": dict(titulo="Intérpretes de estudios · Neurogastroenterología 2026", marca="Intérpretes de estudios · Neurogastro 2026",
                     desc="Intérpretes de pH-impedancia (Lyon 2.0), cápsula de pH, manometría esofágica (Chicago 4.0), FLIP, vaciamiento gástrico, test de aire espirado, manometría anorrectal (Londres) y tránsito colónico."),
    "fenotipos": dict(titulo="Fenotipador terapéutico · Neurogastroenterología 2026", marca="Fenotipador terapéutico · Neurogastro 2026",
                      desc="Decisión terapéutica por fenotipo: SII, constipación, reflujo, dispepsia, náuseas y vómitos, diarrea crónica y dolor abdominal."),
}
CSS_EXTRA = """
.lin{margin-top:14px;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.lin h4{margin:0;padding:8px 12px;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fg-3);background:var(--panel-2)}
.interp ol{margin:8px 0 0;padding-left:20px}.interp li{margin-bottom:6px}
.interp .alerta{border-left:3px solid var(--rojo);padding:6px 10px;background:color-mix(in srgb,var(--rojo) 7%,transparent);margin:8px 0;border-radius:0 8px 8px 0}
.interp .nota{border-left:3px solid var(--ambar);padding:6px 10px;background:color-mix(in srgb,var(--ambar) 7%,transparent);margin:8px 0;border-radius:0 8px 8px 0}
"""

VALIDA = r"""
const fs=require('fs'); const src=fs.readFileSync(process.argv[2],'utf8');
const ctx={}; const fn=new Function(src+';return {CALCS,META,CURA,PAGINA};'); const {CALCS,META,CURA,PAGINA}=fn();
const ids=new Set(); let nej=0, errs=[];
for(const c of CALCS){ if(ids.has(c.id)) errs.push('id repetido '+c.id); ids.add(c.id);
  const m=META[c.id]; if(!m){errs.push('sin META '+c.id); continue;}
  for(const k of ['que','cuando','ojo']) if(!m[k]) errs.push(c.id+': falta '+k);
  for(const e of (m.ej||[])){ nej++;
    const v={}; for(const f of c.i){ const x=e.v[f.id];
      if(f.t==='n') v[f.id]=(x===undefined||x==='')?null:parseFloat(x);
      else if(f.t==='c') v[f.id]=!!x;
      else if(f.t==='s') v[f.id]=(x===undefined)?String(f.o[0][0]):String(x);
      else v[f.id]=x===undefined?'':String(x); }
    for(const k of Object.keys(e.v)) if(!c.i.some(f=>f.id===k)) errs.push(c.id+' «'+e.l+'»: campo desconocido '+k);
    let r; try{ r=c.f(v);}catch(err){ errs.push(c.id+' «'+e.l+'»: '+err.message); continue; }
    if(!r||!r.vals||!r.vals.length){ errs.push(c.id+' «'+e.l+'»: sin resultado'); continue; }
    if(m.esc){ try{ const s=m.esc(v,r); if(s&&s.rows.some(row=>row.length!==s.h.length)) errs.push(c.id+': fila de escala con columnas distintas'); }catch(err){ errs.push(c.id+' esc: '+err.message);} }
  }
  if(!(m.ej||[]).length) errs.push(c.id+': sin ejemplos');
}
console.log(JSON.stringify({n:CALCS.length,nej,errs}));
"""

def main():
    tpl = (AQUI / "plantilla.html").read_text(encoding="utf-8")
    val = AQUI / ".valida.js"; val.write_text(VALIDA, encoding="utf-8")
    total = 0
    for pag, cfg in PAGS.items():
        datos = (AQUI / f"{pag}.js").read_text(encoding="utf-8")
        util = tpl[tpl.index("<script>", tpl.index("<body")) + 8: tpl.index("{{DATOS}}")]
        tmp = AQUI / f".{pag}.tmp.js"; tmp.write_text(util + datos, encoding="utf-8")
        out = subprocess.run(["node", str(val), str(tmp)], capture_output=True, text=True)
        tmp.unlink()
        if out.returncode != 0:
            sys.exit(f"{pag}.js: error de sintaxis o ejecución\n{out.stderr[-2000:]}")
        res = json.loads(out.stdout)
        if res["errs"]:
            sys.exit(f"{pag}.js:\n  " + "\n  ".join(res["errs"]))
        html = (tpl.replace("{{TITULO}}", cfg["titulo"]).replace("{{MARCA}}", cfg["marca"])
                   .replace("{{DESC}}", cfg["desc"]).replace("{{CSS}}", CSS_EXTRA).replace("{{DATOS}}", datos))
        d = RAIZ / pag; d.mkdir(exist_ok=True)
        (d / "index.html").write_text(html, encoding="utf-8")
        print(f"{pag}/index.html: {res['n']} herramientas, {res['nej']} ejemplos validados")
        total += res["n"]
    val.unlink()

if __name__ == "__main__":
    main()

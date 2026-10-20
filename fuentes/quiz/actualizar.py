#!/usr/bin/env python3
"""Ensambla quiz/index.html (Módulo 09) desde la plantilla y el banco de preguntas.

  fuentes/quiz/plantilla.html   · motor del quiz (estudio, examen, flashcards, progreso, temario, siglas, exportar)
  fuentes/quiz/banco/*.js       · preguntas, un archivo por grupo de bloques (const Q1..Q4 = [...])
  fuentes/quiz/config.json      · URL del Apps Script y clave (opcional; también se configura desde la app)

Valida cada pregunta con Node (ids únicos, respuesta correcta en rango, "por qué no" para cada distractor).
Uso: python3 fuentes/quiz/actualizar.py
"""
import json, pathlib, subprocess, sys

RAIZ = pathlib.Path(__file__).resolve().parents[2]
F = RAIZ / "fuentes/quiz"

TMAP = {
    "Roma V y TICI": [1, "ES"], "ERGE y Lyon 2.0": [2, "ES"], "TICI esofágicos": [3, "ES"], "Eructos y rumiación": [4, "ES"],
    "Disfagia y EoE": [5, "ES"], "Chicago 4.0 y acalasia": [6, "ES"], "Dispepsia": [7, "GD"], "Gastroparesia y náuseas": [8, "GD"],
    "SII": [9, "IN"], "Diarrea crónica": [10, "IN"], "Constipación": [11, "IN"], "Distensión y SIBO": [12, "IN"],
    "CIPO y Ogilvie": [13, "IN"], "Anorrectal": [14, "AR"], "Dolor y neuromoduladores": [15, "AR"], "Laboratorio funcional": [16, "AR"],
}

SIG = [
    ["ATC", "Antidepresivo tricíclico"], ["CAPS", "Dolor abdominal centralmente mediado"], ["CH₄", "Metano"],
    ["CIPO", "Pseudoobstrucción intestinal crónica"], ["DCI", "Integral contráctil distal"], ["DL", "Latencia distal"],
    ["EGJ-DI", "Índice de distensibilidad de la unión esofagogástrica"], ["EGJOO", "Obstrucción del flujo de salida de la unión esofagogástrica"],
    ["EoE", "Esofagitis eosinofílica"], ["ERGE", "Enfermedad por reflujo gastroesofágico"], ["EREFS", "Edema, anillos, exudados, surcos y estenosis (escala endoscópica de EoE)"],
    ["FLIP", "Sonda de imagen luminal funcional"], ["FODMAP", "Oligo-, di-, monosacáridos y polioles fermentables"],
    ["G-POEM", "Miotomía pilórica endoscópica peroral"], ["H₂", "Hidrógeno"], ["IBP", "Inhibidor de la bomba de protones"],
    ["IEM", "Motilidad esofágica inefectiva"], ["IMO", "Sobrecrecimiento metanogénico intestinal"], ["IRP", "Presión de relajación integrada"],
    ["IRSN", "Inhibidor de la recaptación de serotonina y noradrenalina"], ["ISRS", "Inhibidor selectivo de la recaptación de serotonina"],
    ["LA", "Clasificación de Los Ángeles de esofagitis"], ["MNBI", "Impedancia basal nocturna media"],
    ["PAMORA", "Antagonista periférico de receptores μ"], ["P-CAB", "Bloqueador ácido competitivo de potasio"],
    ["PEG", "Polietilenglicol"], ["POEM", "Miotomía endoscópica peroral"], ["R-CPD", "Disfunción retrógrada del cricofaríngeo (incapacidad para eructar)"],
    ["SAP", "Probabilidad de asociación sintomática"], ["SDE", "Síndrome de dolor epigástrico"], ["SDP", "Síndrome de distrés posprandial"],
    ["SeHCAT", "Test de retención de ácido selenohomocólico marcado"], ["SI", "Índice de síntomas"], ["SIBO", "Sobrecrecimiento bacteriano del intestino delgado"],
    ["SII (C, D, M, U)", "Síndrome de intestino irritable (con constipación, diarrea, mixto, no clasificado)"],
    ["SNVC", "Síndrome de náuseas y vómitos crónicos"], ["TCC", "Terapia cognitivo-conductual"], ["TEA", "Tiempo de exposición ácida"],
    ["TICI", "Trastornos de la interacción cerebro-intestino"],
]

VALIDA = r"""
const fs=require('fs');const files=process.argv.slice(1);let src=files.map(f=>fs.readFileSync(f,'utf8')).join('\n');
const QS=[...src.matchAll(/const (Q\d+)\s*=/g)].map(m=>m[1]);src+='\nmodule.exports=['+QS.map(x=>'...'+x).join(',')+'];';const m={exports:{}};new Function('module',src)(m);
const T=JSON.parse(process.env.TMAP);const ids=new Set();const err=[];
for(const q of m.exports){
  if(ids.has(q.id))err.push('id repetido '+q.id);ids.add(q.id);
  for(const k of ['id','b','t','n','md','q','o','c','e','w','p','r'])if(q[k]===undefined)err.push(q.id+': falta '+k);
  if(!['ES','GD','IN','AR'].includes(q.b))err.push(q.id+': bloque '+q.b);
  if(!['R','F','S'].includes(q.n))err.push(q.id+': nivel '+q.n);
  if(!['E','X'].includes(q.md))err.push(q.id+': modo '+q.md);
  if(!T[q.t])err.push(q.id+': tema desconocido '+q.t);else if(T[q.t][1]!==q.b)err.push(q.id+': grupo no coincide con el tema');
  if(!(q.c>=0&&q.c<q.o.length))err.push(q.id+': c fuera de rango');
  const wk=Object.keys(q.w).map(Number);
  if(wk.includes(q.c))err.push(q.id+': w explica la correcta');
  for(let i=0;i<q.o.length;i++)if(i!==q.c&&!wk.includes(i))err.push(q.id+': falta w['+i+']');
}
const by={};m.exports.forEach(q=>{by[q.t]=(by[q.t]||0)+1});
console.log(JSON.stringify({n:m.exports.length,err,by,E:m.exports.filter(q=>q.md==='E').length}));
"""


def main():
    banco = sorted((F / "banco").glob("*.js"))
    import os
    r = subprocess.run(["node", "-e", VALIDA, *map(str, banco)], capture_output=True, text=True,
                       env={**os.environ, "TMAP": json.dumps(TMAP, ensure_ascii=False)})
    if r.returncode:
        sys.exit(r.stderr)
    info = json.loads(r.stdout)
    if info["err"]:
        sys.exit("Errores en el banco:\n  " + "\n  ".join(info["err"]))

    cfg = {"api": "", "token": "neuro-2026"}
    if (F / "config.json").exists():
        cfg.update(json.loads((F / "config.json").read_text(encoding="utf-8")))

    html = (F / "plantilla.html").read_text(encoding="utf-8")
    datos = "\n".join(p.read_text(encoding="utf-8") for p in banco)
    html = html.replace("<!-- BANCO -->", "<script>\n" + datos + "\n</script>", 1)
    html = html.replace("__N__", str(info["n"]))
    html = html.replace("__API__", cfg["api"]).replace("__TOKEN__", cfg["token"])
    html = html.replace("__TMAP__", json.dumps(TMAP, ensure_ascii=False))
    html = html.replace("__SIG__", json.dumps(SIG, ensure_ascii=False))
    for ph in ("__N__", "__API__", "__TOKEN__", "__TMAP__", "__SIG__", "<!-- BANCO -->"):
        assert ph not in html, ph

    out = RAIZ / "quiz/index.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"quiz/index.html: {info['n']} casos ({info['E']} estudio, {info['n']-info['E']} examen) · "
          f"{len(info['by'])} temas · {len(html)//1024} KB · nube: {'configurada' if cfg['api'] else 'sin configurar'}")


if __name__ == "__main__":
    main()

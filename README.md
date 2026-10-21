# Repositorio Neurogastroenterología 2026

Repositorio de estudio de neurogastroenterología y motilidad para el postgrado de Gastroenterología de la Universidad de los Andes (Clínica Dávila / Clínica Universidad de los Andes). Autoría, compilación y edición: **Dr. Moisés Oropeza**.

Sitio estático (HTML, CSS y JavaScript sin dependencias), instalable como aplicación (PWA) y usable sin conexión.

## Módulos

| # | Módulo | Ruta | Contenido |
|---|---|---|---|
| 01 | Guía de estudio | `guia-2026.html` | 16 bloques: Roma V, ERGE y Lyon 2.0, TICI esofágicos, eructos y rumiación, disfagia y EoE, Chicago 4.0 y acalasia, dispepsia, gastroparesia y náuseas, SII, diarrea crónica, constipación, distensión y SIBO, CIPO y Ogilvie, anorrectal, dolor y neuromoduladores, laboratorio funcional. Perlas, flashcards y preguntas por bloque. |
| 02 | Consulta rápida | `index.html#rapida` | Tarjetas con criterios, cortes y conductas. |
| 03 | Fenotipador terapéutico | `fenotipos/` | Escalón terapéutico por fenotipo: SII, constipación, reflujo, dispepsia, náuseas y vómitos, diarrea crónica, dolor abdominal. |
| 04 | Intérpretes de estudios | `estudios/` | pH-impedancia (Lyon 2.0), cápsula 96 h, manometría esofágica (Chicago 4.0), FLIP, vaciamiento gástrico, test de aire espirado, tránsito colónico, manometría anorrectal (Londres). |
| 05 | Vademécum | `index.html#vademecum` | Ficha breve por fármaco (dosis, cinética, qué vigilar, con qué combinar, disponibilidad en Chile); pestañas de cinética, combinaciones y líneas por enfermedad. |
| 06 | Calculadoras | `calc/` | Criterios de Roma V, GerdQ, RSI, Eckardt, equivalencia de IBP, GCSI, Sigstad, IBS-SSS, Agachan-Wexner, Wexner, St Mark's, PHQ-9, GAD-7, PHQ-15. |
| 07 | Atlas | `atlas/` | Esquemas SVG propios (Chicago 4.0, Lyon 2.0, FLIP, Bristol, disinergia, mecanismos). |
| 08 | Pacientes | `pacientes/` | Hojas imprimibles en lenguaje simple. |
| 09 | Quiz | `quiz/` | Banco de casos clínicos con modos estudio y examen, flashcards, progreso y sincronización con Google Sheets. |

## Cómo se actualiza

Todo se edita en `fuentes/` y se regenera con un script por módulo (desde la raíz):

```bash
python3 fuentes/guia/actualizar.py          # guía (bloques/*.html, bloques.json, perlas.txt)
python3 fuentes/herramientas/construir.py   # calc/, estudios/, fenotipos/ (valida cada ejemplo con Node)
python3 fuentes/atlas/construir.py          # atlas/
python3 fuentes/pacientes/construir.py      # pacientes/
python3 fuentes/quiz/actualizar.py          # quiz/ (valida el banco con Node)
python3 fuentes/repositorio/actualizar.py   # consulta rápida y vademécum dentro de index.html
python3 fuentes/repositorio/portada.py      # portada, módulos y cifras de index.html
```

Al publicar cambios, subir la versión de `CACHE` en `sw.js` para que los dispositivos instalados descarguen la nueva versión.

## Quiz y Google Sheets

El progreso se guarda en el navegador y se sincroniza con una hoja propia (*Quiz Neurogastroenterología 2026 · Progreso*) mediante el Apps Script de `fuentes/quiz/Code.gs`. Pasos de activación en `fuentes/quiz/INSTRUCCIONES.md`.

## Fuentes y alcance

Roma V (Gastroenterology 2026), Chicago 4.0 (Neurogastroenterol Motil 2021), Lyon 2.0 (Gut 2024) y guías AGA, ACG y ESNM vigentes, sobre la base del material docente del autor (Guía de tubo digestivo alto 2026, Curso de tubo digestivo bajo 2025). La disponibilidad de fármacos en Chile se indica a octubre de 2026 y debe verificarse en el ISP. Uso personal de estudio; no reemplaza el juicio clínico ni la ficha técnica de cada fármaco.

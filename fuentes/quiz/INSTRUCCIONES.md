# Quiz Neurogastroenterología 2026 · conexión con Google Sheets

El progreso se guarda siempre en el navegador. Para sincronizarlo entre dispositivos, este quiz usa **la misma implementación de Apps Script que el quiz de hepatología** (`config.json`), con un identificador propio: `quizNeuro_2026`. El script guarda una fila por `quizId` en la hoja **estado** y agrega la columna `quizId` en **respuestas**, así que los dos quizzes no se mezclan.

No hay que hacer nada para activarla: funciona desde que se publica.

## Usar una hoja independiente (opcional)

1. Cree una hoja nueva en Google Sheets y copie su ID (lo que va entre `/d/` y `/edit` en la URL).
2. **Extensiones → Apps Script**. Pegue el contenido de `fuentes/quiz/Code.gs`, cambie `SHEET_ID` por el de la hoja nueva y, si quiere, `TOKEN` por una clave propia (por ejemplo `neuro-2026`). Guarde.
3. **Implementar → Nueva implementación** → tipo **Aplicación web**; ejecutar como **Yo**; acceso **Cualquier usuario**. Autorice y copie la URL que termina en `/exec`.
4. Escriba la URL y la clave en `fuentes/quiz/config.json`:

```json
{"api": "https://script.google.com/macros/s/…/exec", "token": "neuro-2026"}
```

5. Ejecute `python3 fuentes/quiz/actualizar.py`.

También puede configurarse sin regenerar: en el quiz → **Progreso** → **Conexión con Google Sheets**.

## Qué guarda

- Hoja **estado**: el progreso completo (una fila por quiz, JSON partido en celdas de 45.000 caracteres).
- Hoja **respuestas**: una fila por respuesta (fecha, quiz, pregunta, tema, opción elegida, correcta, acierto).

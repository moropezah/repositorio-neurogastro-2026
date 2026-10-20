# Quiz Neurogastroenterología 2026 · conexión con Google Sheets

El progreso se guarda siempre en el navegador. Para sincronizarlo entre dispositivos se usa una hoja propia, separada de las de hepatología y EII:

**Hoja:** [Quiz Neurogastroenterología 2026 · Progreso](https://docs.google.com/spreadsheets/d/1Ack_ldPRZ5gHNLUHOunpiTTaEB2bm7mjaURmuWTZZsE/edit)

## Activar la conexión (una sola vez, ~3 minutos)

1. Abra la hoja → **Extensiones → Apps Script**.
2. Borre el contenido de `Código.gs` y pegue el de `fuentes/quiz/Code.gs` (ya trae el ID de la hoja y la clave `neuro-2026`). Guarde.
3. Opcional: elija la función **prepararHoja** en la barra superior y presione **▶ Ejecutar**. Crea las pestañas `estado`, `respuestas` y `resumen` (aciertos por tema, ordenados del más débil al más fuerte).
4. **Implementar → Nueva implementación** → tipo **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**.
5. Autorice los permisos (cuenta propia; si aparece «Google no verificó esta app», **Configuración avanzada → Ir a…**) y copie la **URL de la aplicación web** (termina en `/exec`).
6. Escriba la URL en `fuentes/quiz/config.json` y ejecute `python3 fuentes/quiz/actualizar.py`:

```json
{"api": "https://script.google.com/macros/s/…/exec", "token": "neuro-2026"}
```

También puede configurarse sin regenerar: en el quiz → **Progreso** → **Conexión con Google Sheets** → pegar la URL y la clave → **Guardar y reconectar**.

Si cambia el código de `Code.gs`, use **Implementar → Gestionar implementaciones → editar → Nueva versión** para conservar la misma URL.

## Qué guarda

- Pestaña **estado**: el progreso completo (una fila por quiz, JSON partido en celdas de 45.000 caracteres).
- Pestaña **respuestas**: una fila por respuesta (fecha, quiz, pregunta, tema, opción elegida, correcta, acierto).
- Pestaña **resumen**: total de respuestas, aciertos y porcentaje por tema.

Si cambia la clave, cámbiela en `Code.gs` (`TOKEN`) y en `config.json`.

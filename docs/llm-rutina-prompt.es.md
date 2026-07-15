# Cómo crear una Rutina con un LLM

Esta guía convierte un programa de entrenamiento que solo existe en tu cabeza (o en las
notas de un entrenador) en un archivo `rutina.json`. Rellenas una lista de verificación
breve, pegas un prompt listo en **cualquier** chat LLM (ChatGPT, Claude, Gemini, lo que
tengas a mano) e importas la respuesta en la aplicación.

No se requieren conocimientos de JSON. Sin cuenta, sin clave API — funciona en una
ventana de chat de navegador normal.

Todos los datos de referencia están en el repositorio público
[github.com/bthos/gym-routine-basic-fit](https://github.com/bthos/gym-routine-basic-fit).
La plantilla de prompt indica al LLM dónde leerlos — **no** necesitas copiar tú mismo
el esquema ni los archivos de equipamiento.

| Dato | URL |
|------|-----|
| Esquema (fuente de verdad) | [rutina.schema.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/schema/rutina.schema.json) |
| Catálogo de equipamiento | [equipment.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/equipment.json) |
| Lista de gimnasios | [gyms.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/gyms.json) |
| Ejemplo de referencia | [phase1-monday.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/examples/phase1-monday.json) |

> **¿LLM sin acceso web?** Descarga esos cuatro archivos del repositorio y adjúntalos
> manualmente al chat. El prompt ya nombra cada archivo.

## Cómo funciona

```
1. Rellena la lista de verificación (texto simple, más abajo)
2. Copia la plantilla de prompt, pega tu lista de verificación en REQUEST
3. Pega todo en cualquier chat LLM
4. Copia la respuesta JSON del LLM
5. Importa en la PWA (pegar o subir .json)
      ✓ pasa  → listo
      ✗ falla → copia los errores de validación de vuelta al LLM, pídele que corrija
                y vuelva a generar el JSON completo, vuelve al paso 5
```

El bucle de corrección del paso 5 es el mecanismo de fiabilidad. Los mensajes de error
están escritos para pegarlos directamente en el chat.

Validación local sin la app: `npm run validate-rutina -- ruta/a/rutina.json`

---

## Paso 1 — Rellena la lista de verificación

Copia este bloque, rellena cada línea (texto simple, sin JSON) y tenlo disponible para
pegarlo en la sección `REQUEST` del Paso 2.

```text
1. Para quién es / nombre del programa:
2. Objetivo principal en esta fase:
3. Días por semana:
4. Presupuesto de duración de sesión:
5. Lesiones / movimientos a evitar (escribe "ninguna" si no hay):
6. Gimnasio objetivo (nombre o id — ver gyms.json en DATA SOURCES):
7. Idioma para el texto de salida:
8. Exportación de progreso previo (opcional — pega el Markdown de la pantalla de exportación de la PWA, o deja en blanco):
```

| # | Campo | Ejemplo | Requerido |
|---|-------|---------|-----------|
| 1 | Para quién es / nombre del programa | "Elena — Fase 2" | sí |
| 2 | Objetivo principal en esta fase | "Hipertrofia, más volumen" | sí |
| 3 | Días por semana | 4 | sí |
| 4 | Presupuesto de duración de sesión | "45-60 min" | sí |
| 5 | Lesiones / movimientos a evitar | "Evitar press militar por hombro derecho" | no — escribe "ninguna" si no hay |
| 6 | Gimnasio objetivo | "Avda. Andalucía, Centro Comercial Alameda, Málaga" | sí — el LLM filtra equipamiento por el id de este gimnasio |
| 7 | Idioma para el texto de salida | "Español" | sí |
| 8 | Exportación de progreso previo | Markdown pegado de la pantalla de exportación de la PWA | no — omite si es la primera fase |

## Paso 2 — Copia la plantilla de prompt

Esta es la plantilla completa, lista para pegar en un chat LLM. Rellena el único
marcador entre corchetes (`<<< ... >>>`) con tu lista de verificación del Paso 1.

````text
{{PROMPT_TEMPLATE}}
````

Incluir "devuelve solo JSON, nada más" tanto al principio (`ROLE`) como al final
(`OUTPUT`) es deliberado — es la instrucción de mayor impacto para obtener una salida
parseable de un LLM ajustado para chat.

## Paso 3 — Importa en la aplicación

1. Copia la respuesta JSON del LLM (sin vallas de markdown).
2. Abre la pantalla **Importar** de la PWA y pégala, o sube un archivo `.json`.
3. Pulsa **Importar**. La app valida contra el mismo esquema y catálogo de equipamiento.

Si la validación falla, copia la lista de errores de la app y pégala de vuelta en el
chat del LLM como siguiente mensaje. Pídele que corrija y vuelva a generar el JSON
completo. Repite hasta que la importación funcione.

**Opcional — validar en tu ordenador:**

```bash
npm run validate-rutina -- ruta/a/tu-rutina.json
```

| Resultado | Ejemplo de salida | Qué hacer |
|---|---|---|
| Éxito | `✓ Valid rutina: 4 days, 22 exercises` | Importar en la app |
| Error de esquema | `days[1].label: required` | Pegar todo el bloque de error de vuelta al LLM |
| Error de ID de equipamiento | `days[2].exercises[0].equipmentId "g3-xx" not found in data/equipment.json` | Igual — pegar literalmente |

---

## Ejemplo práctico (un turno completo)

**1 — Lista de verificación completada:**

```text
1. Para quién es / nombre del programa: Nombre — Fase 2
2. Objetivo principal en esta fase: Hipertrofia, más volumen muscular
3. Días por semana: 4
4. Presupuesto de duración de sesión: 45-60 min
5. Lesiones / movimientos a evitar: ninguna
6. Gimnasio objetivo: Avda. Andalucía, Centro Comercial Alameda (id 3)
7. Idioma para el texto de salida: Español
8. Exportación de progreso previo (opcional): (ninguna todavía, primera vez usando esto)
```

**2 — Prompt enviado (checklist en REQUEST; el LLM lee esquema y equipamiento desde URLs):**

```text
### ROLE
You are a strength & conditioning coach. Output ONLY JSON...
### DATA SOURCES
https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/schema/rutina.schema.json
...
### REQUEST
1. Para quién es / nombre del programa: Nombre — Fase 2
...
### OUTPUT
Return the JSON object now. Nothing else.
```

**3 — Salida esperada del LLM (se muestra un día; una respuesta real cubre los 4 días
solicitados):**

```json
{
  "schemaVersion": 1,
  "program": {
    "name": "Nombre — Fase 2",
    "phaseName": "Hipertrofia",
    "phaseNumber": 2,
    "gymId": 3,
    "durationWeeks": 12,
    "lastUpdated": "2026-07-13"
  },
  "phaseInfo": {
    "objective": "Máximo volumen muscular con técnica controlada",
    "intensityPercent": "70-75%",
    "restSeconds": "45-60",
    "frequencyPerWeek": 4
  },
  "days": [
    {
      "label": "Lunes",
      "exercises": [
        {
          "name": "Prensa de Pecho",
          "muscleGroups": ["pectoralis-major"],
          "equipmentId": "g3-s10",
          "sets": 4,
          "reps": "12-15",
          "restSeconds": 45,
          "intensity": "RIR 1-2",
          "technique": ["Espalda pegada al respaldo", "Bajar controlado, empujar explosivo"]
        }
      ]
    }
  ],
  "rules": ["Hidratación - 2-3 litros de agua al día"],
  "notes": []
}
```

**4 — Importar** en la PWA, o ejecutar `npm run validate-rutina -- data/rutina-nombre-fase2-draft.json`.

---

## Solución de problemas

- **El LLM no puede obtener URLs.** Adjunta manualmente los cuatro archivos de DATA
  SOURCES, o pega su contenido en el chat. Los nombres de archivo coinciden con los del prompt.
- **El LLM añadió una introducción o envolvió el JSON en una valla de markdown.**
  Reenvía con: "Output ONLY the JSON object, no markdown fence, no explanation."
- **La respuesta se cortó a la mitad del JSON (programas muy largos).** Pide al LLM
  que "continúe desde donde paró, siguiendo generando solo JSON".
- **ID de equipamiento no encontrado.** El LLM debe elegir ids de `equipment.json` cuyo
  array `gyms` incluya tu id de gimnasio — no ids inventados. Pega el error del
  validador y pídele que relea el catálogo.
- **¿No sabes el id de tu gimnasio?** El LLM lee `gyms.json`; también puedes abrirlo
  en el repositorio enlazado arriba.

---

## Actualizar tu programa

Una vez que hay un programa cargado, puedes reemplazarlo o eliminarlo desde la pestaña **Programa**:

1. Ve a la pestaña **Programa** y desplázate hasta el final de la vista general.
2. Pulsa **Reemplazar programa** para ir a la pantalla de importación y pegar un nuevo rutina.json.
3. O pulsa **Eliminar programa** para borrar el programa activo y volver al estado inicial.

El historial de sesiones se conserva al eliminar — los registros se mantienen pero ya no estarán vinculados a un programa.

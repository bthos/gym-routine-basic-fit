# Cómo crear una Rutina con un LLM

Esta guía convierte un programa de entrenamiento que solo existe en tu cabeza (o en las
notas de un entrenador) en un archivo `rutina.json` — el formato de datos que define el
esquema de rutina del proyecto. Para ello, rellena una lista de verificación breve, pega
el prompt ensamblado en **cualquier** chat LLM (ChatGPT, Claude, Gemini, lo que tengas a
mano, en cualquier dispositivo) y valida el resultado con un script local.

No se requieren conocimientos de JSON. Sin cuenta, sin clave API — funciona en una
ventana de chat de navegador normal.

- **Esquema (fuente de verdad):** `data/schema/rutina.schema.json`
- **Validador:** `scripts/validate-rutina.js`, ejecutar con `npm run validate-rutina -- <ruta>`
- **Ejemplo de referencia:** `data/examples/` (un `rutina.json` real que pasa el validador)
- **Catálogo de equipamiento referenciado por el esquema:** `data/equipment.json`

> El bloque SCHEMA incluido en esta guía (ver [Paso 3](#paso-3--copia-la-plantilla-de-prompt-completa))
> es un *borrador anotado* legible por humanos/LLM con la misma forma que impone
> `data/schema/rutina.schema.json`. Si alguna vez difieren, el archivo de esquema tiene
> prioridad — esta guía es documentación, no el validador.

## Cómo funciona

```
1. Rellena la lista de verificación (texto simple, más abajo)
2. Adjunta tu lista de equipamiento (catálogo completo o el subconjunto de tu gimnasio)
3. Copia la plantilla de prompt completa, pega tu lista de verificación en REQUEST
4. Pega todo en cualquier chat LLM
5. Copia la respuesta JSON del LLM en un archivo
6. Valida:  npm run validate-rutina -- ruta/a/tu-rutina.json
      ✓ pasa  → listo, el archivo está preparado para importar
      ✗ falla → pega el texto del error de nuevo al LLM como siguiente mensaje, pídele
                que lo corrija y vuelva a generar el JSON completo, vuelve al paso 5
7. Importa en la PWA (cuando esté disponible) — o conserva el archivo tal como está;
   un rutina.json validado es un artefacto completo y útil por sí solo
```

El bucle de corrección en los pasos 5–6 es el mecanismo de fiabilidad real. No
intentamos obtener un objeto JSON perfecto del LLM en el primer intento — hacemos que
el fallo sea *legible y autocorregible*. Los mensajes de error del validador están
escritos para que puedas pegarlos directamente en el chat.

---

## Paso 1 — Rellena la lista de verificación

Copia este bloque, rellena cada línea (texto simple, sin JSON) y tenlo disponible para
pegarlo en la sección `REQUEST` del Paso 3.

```text
1. Para quién es / nombre del programa:
2. Objetivo principal en esta fase:
3. Días por semana:
4. Presupuesto de duración de sesión:
5. Lesiones / movimientos a evitar (escribe "ninguna" si no hay):
6. Gimnasio objetivo (nombre o id — ver data/gyms.json):
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
| 6 | Gimnasio objetivo | "Avda. Andalucía, Centro Comercial Alameda, Málaga" | sí — determina qué subconjunto de equipamiento aplica |
| 7 | Idioma para el texto de salida | "Español" | sí |
| 8 | Exportación de progreso previo | Markdown pegado de la pantalla de exportación de la PWA | no — deja en blanco hasta que exista la PWA |

## Paso 2 — Adjunta tu lista de equipamiento

El campo 6 anterior (gimnasio objetivo) decide qué IDs de equipamiento son realmente
utilizables — un gimnasio solo tiene las máquinas que tiene. Elige **una** de estas dos
opciones:

**Opción A — catálogo completo, deja que el LLM filtre (más sencillo).**
Adjunta el archivo completo `data/equipment.json` (o pega su contenido) e indica al LLM,
en tu `REQUEST`, qué ID de gimnasio estás usando. Cada entrada de equipamiento incluye
un array `gyms` (p. ej. `"gyms": [1, 2, 3, 4, 5, 6, 7]`); la plantilla de prompt del
Paso 3 ya indica al LLM que solo utilice equipamiento cuyo array `gyms` contenga tu ID
de gimnasio.

**Opción B — subconjunto prefiltrado (menos tokens, útil para LLMs con contexto reducido).**
Abre `equipment-catalog.html` en un navegador (`npm run serve`, luego visita
`http://localhost:3000/equipment-catalog.html`), encuentra la insignia de tu gimnasio
en cada tarjeta de equipamiento y copia el `id`/`modelCode` y el nombre de cada máquina
que lleve la insignia de tu gimnasio en una lista breve. Pega esa lista en
`AVAILABLE EQUIPMENT` en lugar del archivo completo.

Cualquier opción es válida — la Opción A requiere menos trabajo manual, la Opción B
genera un prompt más corto.

## Paso 3 — Copia la plantilla de prompt completa

Esta es la plantilla completa, lista para pegar en un chat LLM. Rellena los dos
marcadores entre corchetes (`<<< ... >>>`) antes de enviar: tu lista de equipamiento
del Paso 2 y tu lista de verificación rellenada del Paso 1.

````text
### ROLE
You are a strength & conditioning coach. You will output ONLY a single JSON
object — no prose, no markdown fences, no explanation — conforming exactly
to the schema below. If a requested field has no natural value, omit it
only if the schema marks it optional (shown with `?`); never invent
equipment ids that are not in the AVAILABLE EQUIPMENT list.

### SCHEMA
{
  "schemaVersion": 1,
  "program": {
    "name": "string",              // e.g. "Nombre — Fase 2"
    "phaseName": "string",
    "phaseNumber": "number",
    "gymId": "number",             // joins data/gyms.json
    "durationWeeks": "number",
    "lastUpdated": "YYYY-MM-DD"
  },
  "phaseInfo": {
    "objective": "string",
    "intensityPercent": "string",  // e.g. "70-75%"
    "restSeconds": "string",       // e.g. "45-60"
    "frequencyPerWeek": "number"
  },
  "warmup":   { "durationMinutes": "string", "steps": ["string", ...] },
  "cooldown": { "durationMinutes": "string", "steps": ["string", ...] },
  "days": [
    {
      "label": "string",           // e.g. "Lunes", "Full Body A"
      "intro": "string?",
      "exercises": [
        {
          "name": "string",
          "muscleGroups": ["string", ...],
          "equipmentId": "string", // MUST exist in AVAILABLE EQUIPMENT below
          "sets": "number",
          "reps": "string",        // e.g. "12-15" — a string, not a number (ranges)
          "restSeconds": "number",
          "intensity": "string?",  // e.g. "RIR 1-2"
          "technique": ["string", ...],  // optional
          "videoQuery": "string?"  // search query OR full URL
        }
      ]
    }
  ],
  "rules": ["string", ...],
  "notes": [ { "title": "string", "body": "string" } ],
  "progression": [                 // optional — omit entirely if not applicable
    {
      "month": "string",
      "weeks": [ { "label": "string", "focus": "string", "deload": "boolean?" } ]
    }
  ]
}

Do NOT include a "summaryTable" field — it does not exist in the schema and
will fail validation. Any summary view is derived from "days" elsewhere.
`?` on a field name (or a "// optional" comment) means optional; every other field is required.

### AVAILABLE EQUIPMENT (use only these ids — do not invent equipment)
<<< pega aquí tu lista de equipamiento del Paso 2 >>>

### REQUEST
<<< pega aquí tu lista de verificación rellenada del Paso 1, literalmente >>>

### OUTPUT
Return the JSON object now. Nothing else.
````

Incluir "devuelve solo JSON, nada más" tanto al principio (`ROLE`) como al final
(`OUTPUT`) es deliberado — es la instrucción de mayor impacto para obtener una salida
parseable de un LLM ajustado para chat que, de otro modo, querría añadir un preámbulo
amigable o envolver la respuesta en una valla de markdown.

## Paso 4 — Valida lo que devuelve

Guarda la respuesta del LLM como un archivo `.json` y luego ejecuta:

```bash
npm run validate-rutina -- ruta/a/tu-rutina.json
```

Lo que verás:

| Resultado | Ejemplo de salida | Qué hacer |
|---|---|---|
| Éxito | `✓ Valid rutina: 4 days, 22 exercises` | Listo — el archivo está preparado |
| Error de esquema | `days[1].label: required` | Una línea por infracción, con ruta estilo JSON-pointer. Pega todo el bloque de error de vuelta al chat del LLM y pídele que corrija y vuelva a generar el JSON completo. |
| Error de ID de equipamiento | `days[2].exercises[0].equipmentId "g3-xx" not found in data/equipment.json` | Igual que arriba — pégalo de vuelta literalmente. |
| Sin ruta indicada | Cadena de uso + ejemplo de invocación | Vuelve a ejecutar con un argumento de ruta. |

El texto del error está escrito intencionalmente para ser pegable — no necesitas
traducirlo ni resumirlo para el LLM, solo copia todo el bloque como tu siguiente mensaje
en el chat.

## Paso 5 — Importa en la aplicación

Una vez que la PWA (`rutina-pwa`) esté disponible, podrás:

- Pegar el JSON validado directamente en su pantalla "Importar rutina", o
- Subir el archivo `.json` mediante la importación de archivos de la PWA.

Hasta entonces, un `rutina.json` validado ya es un artefacto completo e independiente —
puedes leerlo, compararlo con una versión anterior o compartirlo con alguien. Nada en él
depende de que exista la PWA.

---

## Ejemplo práctico (un turno completo)

**1 — Lista de verificación completada:**

```text
1. Para quién es / nombre del programa: Nombre — Fase 2
2. Objetivo principal en esta fase: Hipertrofia, más volumen muscular
3. Días por semana: 4
4. Presupuesto de duración de sesión: 45-60 min
5. Lesiones / movimientos a evitar: ninguna
6. Gimnasio objetivo: Bulevar Louis Pasteur 20 (id 5)
7. Idioma para el texto de salida: Español
8. Exportación de progreso previo (opcional): (ninguna todavía, primera vez usando esto)
```

**2 — Lista de equipamiento (Opción B, abreviada — un prompt real incluiría el
subconjunto completo del gimnasio 5, no solo estos tres):**

```json
[
  { "id": "g3-s10", "modelCode": "G3-S10", "names": { "es": "Prensa de Pecho" }, "category": "chest" },
  { "id": "g3-s30", "modelCode": "G3-S30", "names": { "es": "Jalón al Pecho" }, "category": "back" },
  { "id": "g3-s70", "modelCode": "G3-S70", "names": { "es": "Prensa de Piernas" }, "category": "legs" }
]
```

**3 — Prompt ensamblado (abreviado — el real incluye el bloque SCHEMA completo del
Paso 3 y la lista de equipamiento completa del Paso 2):**

```text
### ROLE
You are a strength & conditioning coach. Output ONLY JSON...
### SCHEMA
{ "schemaVersion": 1, "program": {...}, ... }
### AVAILABLE EQUIPMENT
[{ "id": "g3-s10", ... }, { "id": "g3-s30", ... }, { "id": "g3-s70", ... }]
### REQUEST
Programa: Nombre — Fase 2. Objetivo: Hipertrofia, más volumen muscular. Días/semana: 4.
Duración de sesión: 45-60 min. Lesiones: ninguna. Gimnasio: Bulevar Louis Pasteur 20
(id 5). Idioma: Español. Progreso previo: ninguno todavía.
### OUTPUT
Return the JSON object now. Nothing else.
```

**4 — Salida esperada del LLM (se muestra un día; una respuesta real cubre los 4 días
solicitados):**

```json
{
  "schemaVersion": 1,
  "program": {
    "name": "Nombre — Fase 2",
    "phaseName": "Hipertrofia",
    "phaseNumber": 2,
    "gymId": 5,
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
        },
        {
          "name": "Jalón al Pecho",
          "muscleGroups": ["latissimus-dorsi"],
          "equipmentId": "g3-s30",
          "sets": 4,
          "reps": "10-12",
          "restSeconds": 60,
          "technique": ["Tirar con los codos, no con las manos"]
        },
        {
          "name": "Prensa de Piernas",
          "muscleGroups": ["quadriceps", "glutes"],
          "equipmentId": "g3-s70",
          "sets": 4,
          "reps": "12-15",
          "restSeconds": 60,
          "technique": ["No bloquear rodillas al extender"]
        }
      ]
    }
  ],
  "rules": ["Hidratación - 2-3 litros de agua al día"],
  "notes": []
}
```

**5 — Validación:**

```bash
npm run validate-rutina -- data/rutina-nombre-fase2-draft.json
```

Si todo está correcto, verás `✓ Valid rutina: 4 days, N exercises` — listo. Si el LLM
hubiera usado, por ejemplo, un ID de equipamiento que no existe en el gimnasio 5, verías
algo como:

```
days[2].exercises[0].equipmentId "g3-xx" not found in data/equipment.json
```

Pega esa línea en el mismo chat del LLM como siguiente mensaje y pídele que corrija y
vuelva a generar el JSON completo. Vuelve a ejecutar el validador. Repite hasta que pase.

---

## Solución de problemas

- **El LLM añadió una introducción o envolvió el JSON en una valla de markdown.**
  Reenvía con un recordatorio: "Output ONLY the JSON object, no markdown fence, no
  explanation." Esto es poco frecuente si mantuviste las secciones `ROLE` y `OUTPUT`
  del Paso 3 intactas — esa duplicación existe precisamente para evitar esto.
- **La respuesta se cortó a la mitad del JSON (programas muy largos).** Pide al LLM
  que "continúe desde donde paró, siguiendo generando solo JSON" — la mayoría de
  interfaces de chat reanudarán desde el punto de corte.
- **ID de equipamiento no encontrado.** Comprueba que el ID proviene de la lista del
  Paso 2 para tu gimnasio real, no de otro gimnasio o un ID inventado/renombrado. Los
  IDs de equipamiento nunca son texto libre — deben coincidir exactamente con
  `data/equipment.json`.
- **¿No sabes el ID de tu gimnasio?** Consulta `data/gyms.json` — cada gimnasio tiene
  un `id` numérico y un nombre/dirección legibles (`name`/`address`).

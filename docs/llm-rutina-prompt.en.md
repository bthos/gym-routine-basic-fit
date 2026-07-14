# Authoring a Rutina with an LLM

This guide turns a training program that lives only in your head (or a coach's notes)
into a `rutina.json` file — the data format the project's rutina schema defines. You do
this by filling in a short checklist, pasting an assembled prompt into **any** LLM chat
(ChatGPT, Claude, Gemini, whatever you have on hand, on any device), and validating what
comes back with a local script.

No JSON knowledge required. No account, no API key — this works in a normal browser chat
window.

- **Schema (source of truth):** `data/schema/rutina.schema.json`
- **Validator:** `scripts/validate-rutina.js`, run via `npm run validate-rutina -- <path>`
- **Reference example:** `data/examples/` (a real, validator-passing `rutina.json`)
- **Equipment catalog referenced by the schema:** `data/equipment.json`

> The SCHEMA block inlined in this guide (see [Step 3](#step-3--copy-the-full-prompt-template))
> is a human/LLM-readable *annotated draft* of the same shape `data/schema/rutina.schema.json`
> enforces. If the two ever disagree, the schema file wins — this guide is documentation,
> not the validator.

## How it works

```
1. Fill the input checklist (plain language, below)
2. Attach your equipment list (full catalog, or your gym's subset)
3. Copy the full prompt template, paste your checklist into REQUEST
4. Paste the whole thing into any LLM chat
5. Copy the LLM's JSON reply into a file
6. Validate:  npm run validate-rutina -- path/to/your-rutina.json
      ✓ pass  → done, file is ready to import
      ✗ fail  → paste the error text back to the LLM as your next message, ask it to
                fix and re-output the full JSON, go back to step 5
7. Import into the PWA (once it ships) — or keep the file as-is; a validated
   rutina.json is a complete, useful artifact on its own
```

The fix loop in steps 5–6 is the actual reliability mechanism here. We're not trying to
get a perfect JSON object out of the LLM on the first try — we're making failure
*legible and self-correctable*. The validator's error messages are written so you can
paste them straight back into the chat.

---

## Step 1 — Fill in the input checklist

Copy this block, fill in every line (plain text, no JSON), and keep it somewhere you can
paste it into Step 3's `REQUEST` section.

```text
1. Who is this for / program name:
2. Primary goal this phase:
3. Days per week:
4. Session length budget:
5. Injuries / movements to avoid (write "none"/"ninguna" if none):
6. Target gym (name or id — see data/gyms.json):
7. Language for the output text:
8. Prior progress export (optional — paste Markdown from the PWA's export screen, or leave blank):
```

| # | Field | Example | Required |
|---|-------|---------|----------|
| 1 | Who is this for / program name | "Elena — Fase 2" | yes |
| 2 | Primary goal this phase | "Hipertrofia, más volumen" | yes |
| 3 | Days per week | 4 | yes |
| 4 | Session length budget | "45-60 min" | yes |
| 5 | Injuries / movements to avoid | "Evitar press militar por hombro derecho" | no — write "none" if none |
| 6 | Target gym | "Avda. Andalucía, Centro Comercial Alameda, Málaga" | yes — determines which equipment subset applies |
| 7 | Language for the output text | "Español" | yes |
| 8 | Prior progress export | pasted Markdown from the PWA's export screen | no — leave blank until the PWA exists |

## Step 2 — Attach your equipment list

Field 6 above (target gym) decides which equipment ids are actually usable — a gym only
has the machines it has. Pick **one** of these two paths:

**Path A — full catalog, let the LLM self-filter (simplest).**
Attach the entire `data/equipment.json` file (or paste its contents) and tell the LLM,
in your `REQUEST`, which gym id you're at. Every equipment entry carries a `gyms` array
(e.g. `"gyms": [1, 2, 3, 4, 5, 6, 7]`); the prompt template in Step 3 already instructs
the LLM to only pick equipment whose `gyms` array contains your gym id.

**Path B — pre-filtered subset (fewer tokens, useful for LLMs with small context).**
Open `equipment-catalog.html` in a browser (`npm run serve`, then visit
`http://localhost:3000/equipment-catalog.html`), find your gym's badge on each
equipment card, and copy the `id`/`modelCode` and name of every machine that carries
your gym's badge into a short list. Paste that short list into `AVAILABLE EQUIPMENT`
instead of the full file.

Either path is fine — Path A is less manual work, Path B produces a shorter prompt.

## Step 3 — Copy the full prompt template

This is the whole thing, ready to paste into an LLM chat. Fill in the two bracketed
placeholders (`<<< ... >>>`) before sending: your equipment list from Step 2, and your
filled checklist from Step 1.

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
<<< paste your equipment list from Step 2 here >>>

### REQUEST
<<< paste your filled checklist from Step 1 here, verbatim >>>

### OUTPUT
Return the JSON object now. Nothing else.
````

Putting "output only JSON, nothing else" at both the top (`ROLE`) and the bottom
(`OUTPUT`) is deliberate — it's the single highest-leverage instruction for getting
parseable output from a chat-tuned LLM that otherwise wants to add a friendly preamble
or wrap the answer in a markdown fence.

## Step 4 — Validate what comes back

Save the LLM's reply as a `.json` file, then run:

```bash
npm run validate-rutina -- path/to/your-rutina.json
```

What you'll see:

| Result | Example output | What to do |
|---|---|---|
| Success | `✓ Valid rutina: 4 days, 22 exercises` | Done — the file is ready |
| Schema error | `days[1].label: required` | One line per violation, JSON-pointer-style path. Paste the whole error block back into the LLM chat and ask it to fix and re-output the full JSON. |
| Equipment-id error | `days[2].exercises[0].equipmentId "g3-xx" not found in data/equipment.json` | Same as above — paste it back verbatim. |
| No path given | Usage string + example invocation | Re-run with a path argument. |

The error text is intentionally written to be pasteable — you don't need to translate
or summarize it for the LLM, just copy the whole block as your next chat message.

## Step 5 — Import into the app

Once the PWA (`rutina-pwa`) ships, you'll be able to either:

- Paste the validated JSON directly into its "Import rutina" screen, or
- Upload the `.json` file through the PWA's file-import.

Until then, a validated `rutina.json` is already a complete, standalone artifact — you
can read it, diff it against a previous version, or hand it to someone else. Nothing
about it depends on the PWA existing.

---

## Worked example (one full turn)

**1 — Checklist filled in:**

```text
1. Who is this for / program name: Nombre — Fase 2
2. Primary goal this phase: Hipertrofia, más volumen muscular
3. Days per week: 4
4. Session length budget: 45-60 min
5. Injuries / movements to avoid: ninguna
6. Target gym: Bulevar Louis Pasteur 20 (id 5)
7. Language for the output text: Español
8. Prior progress export (optional): (ninguna todavía, primera vez usando esto)
```

**2 — Equipment list (Path B, abbreviated — a real prompt would include the full
gym-5 subset, not just these three):**

```json
[
  { "id": "g3-s10", "modelCode": "G3-S10", "names": { "es": "Prensa de Pecho" }, "category": "chest" },
  { "id": "g3-s30", "modelCode": "G3-S30", "names": { "es": "Jalón al Pecho" }, "category": "back" },
  { "id": "g3-s70", "modelCode": "G3-S70", "names": { "es": "Prensa de Piernas" }, "category": "legs" }
]
```

**3 — Assembled prompt (abbreviated — the real one inlines the full SCHEMA block
from Step 3 and the full equipment list from Step 2):**

```text
### ROLE
You are a strength & conditioning coach. Output ONLY JSON...
### SCHEMA
{ "schemaVersion": 1, "program": {...}, ... }
### AVAILABLE EQUIPMENT
[{ "id": "g3-s10", ... }, { "id": "g3-s30", ... }, { "id": "g3-s70", ... }]
### REQUEST
Program: Nombre — Fase 2. Goal: Hipertrofia, más volumen muscular. Días/semana: 4.
Duración de sesión: 45-60 min. Lesiones: ninguna. Gimnasio: Bulevar Louis Pasteur 20
(id 5). Idioma: Español. Progreso previo: ninguno todavía.
### OUTPUT
Return the JSON object now. Nothing else.
```

**4 — Expected LLM output (one day shown; a real reply covers all 4 requested days):**

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

**5 — Validation:**

```bash
npm run validate-rutina -- data/rutina-nombre-fase2-draft.json
```

If everything resolves, that's a `✓ Valid rutina: 4 days, N exercises` — done. If the
LLM had, say, used an equipment id that doesn't exist at gym 5, you'd see something like:

```
days[2].exercises[0].equipmentId "g3-xx" not found in data/equipment.json
```

Paste that line back into the same LLM chat as your next message and ask it to fix and
re-output the full JSON. Re-run the validator. Repeat until it passes.

---

## Troubleshooting

- **The LLM added a friendly intro or wrapped the JSON in a markdown fence.** Re-send
  with a reminder: "Output ONLY the JSON object, no markdown fence, no explanation."
  This is rare if you kept the `ROLE` and `OUTPUT` sections from Step 3 intact — that
  duplication exists specifically to prevent this.
- **The reply got cut off mid-JSON (very long programs).** Ask the LLM to "continue
  from where you stopped, still outputting only JSON" — most chat interfaces will
  resume from the cut point.
- **Equipment id not found.** Double-check the id came from Step 2's list for your
  actual gym, not a different gym or a guessed/renamed id. Equipment ids are never
  free text — they must match `data/equipment.json` exactly.
- **Not sure your gym's id?** Check `data/gyms.json` — each gym has a numeric `id` and
  a human-readable `name`/`address`.

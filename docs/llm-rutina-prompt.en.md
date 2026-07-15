# Authoring a Rutina with an LLM

This guide turns a training program that lives only in your head (or a coach's notes)
into a `rutina.json` file. Fill in the prompt at the top of this screen, copy it into
**any** LLM chat (ChatGPT, Claude, Gemini, whatever you have on hand), and import what
comes back into the **Rutina** app.

No JSON knowledge required. No account, no API key — this works in a normal browser chat
window.

All reference data lives in the public repository
[github.com/bthos/gym-routine-basic-fit](https://github.com/bthos/gym-routine-basic-fit).
The prompt tells the LLM where to read it — you do **not** need to copy schema or
equipment files yourself.

| Data | URL |
|------|-----|
| Schema (source of truth) | [rutina.schema.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/schema/rutina.schema.json) |
| Equipment catalog | [equipment.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/equipment.json) |
| Gyms list (for the LLM) | [gyms.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/gyms.json) |
| Reference example | [phase1-monday.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/examples/phase1-monday.json) |

> **LLM without web access?** Download the four data files from the repository and attach
> them to the chat manually. The prompt already names each file.

## How it works

```
1. Fill in the REQUEST section at the top of the prompt (see the gym list callout below it for field 6)
2. Copy the whole prompt and paste it into any LLM chat
3. Copy the LLM's JSON reply
4. Import into the Rutina app (paste or upload .json)
      ✓ pass  → done
      ✗ fail  → copy validation errors back to the LLM, ask it to fix and re-output
                the full JSON, go back to step 4
```

The fix loop in step 4 is the reliability mechanism. The validator's error messages are
written so you can paste them straight back into the chat.

For local validation without the app: `npm run validate-rutina -- path/to/rutina.json`

---

## Step 1 — Copy the prompt

Use the **Copy** button above this guide. The prompt starts with **REQUEST** — fill in
every numbered line (plain text, no JSON) before sending.

> **Field 6 — target gym**
> Look up your gym’s name and numeric **id** in the **[gym list →](https://bthos.github.io/gym-routine-basic-fit/gyms.html)**
> (opens in a new tab). You can also find the same list in the Rutina app’s **Catalog** tab.

| # | Field | Example | Required |
|---|-------|---------|----------|
| 1 | Who is this for / program name | "Elena — Fase 2" | yes |
| 2 | Primary goal this phase | "Hipertrofia, más volumen" | yes |
| 3 | Days per week | 4 | yes |
| 4 | Session length budget | "45-60 min" | yes |
| 5 | Injuries / movements to avoid | "Evitar press militar por hombro derecho" | no — write "none" if none |
| 6 | Target gym | "Avda. Andalucía, Centro Comercial Alameda (id 3)" | yes |
| 7 | Language for the output text | "Español" | yes |
| 8 | Prior progress export | pasted Markdown from Rutina **History → Export** | no — omit if starting a first phase |

Putting "output only JSON, nothing else" at both the top (`ROLE`) and the bottom
(`OUTPUT`) is deliberate — it's the single highest-leverage instruction for getting
parseable output from a chat-tuned LLM.

## Step 2 — Import into the Rutina app

1. Copy the LLM's JSON reply (no markdown fences).
2. Open the **Import** screen in the Rutina app and paste it, or upload a `.json` file.
3. Tap **Import**. The app validates against the same schema and equipment catalog.

If validation fails, copy the error list from the app and paste it back into the LLM
chat as your next message. Ask it to fix and re-output the full JSON. Repeat until import
succeeds.

**Optional — validate on your computer:**

```bash
npm run validate-rutina -- path/to/your-rutina.json
```

| Result | Example output | What to do |
|---|---|---|
| Success | `✓ Valid rutina: 4 days, 22 exercises` | Import into the app |
| Schema error | `days[1].label: required` | Paste the whole error block back to the LLM |
| Equipment-id error | `days[2].exercises[0].equipmentId "g3-xx" not found in data/equipment.json` | Same — paste verbatim |

---

## Worked example (one full turn)

**REQUEST filled in (top of the copied prompt):**

```text
1. Who is this for / program name: Elena Rois — Fase 2
2. Primary goal this phase: Hipertrofia, más volumen muscular
3. Days per week: 4
4. Session length budget: 45-60 min
5. Injuries / movements to avoid: ninguna
6. Target gym: Avda. Andalucía, Centro Comercial Alameda (id 3)
7. Language for the output text: Español
8. Prior progress export (optional): (ninguna todavía, primera vez usando esto)
```

**LLM reads schema and equipment from URLs in DATA SOURCES, then returns JSON.**

**Import** into the Rutina app, or run `npm run validate-rutina -- data/rutina-nombre-fase2-draft.json`.

---

## Troubleshooting

- **The LLM cannot fetch URLs.** Attach the four DATA SOURCES files manually, or paste
  their contents into the chat. The filenames match those in the prompt.
- **The LLM added a friendly intro or wrapped the JSON in a markdown fence.** Re-send
  with: "Output ONLY the JSON object, no markdown fence, no explanation."
- **The reply got cut off mid-JSON (very long programs).** Ask the LLM to "continue
  from where you stopped, still outputting only JSON."
- **Equipment id not found.** The LLM must pick ids from `equipment.json` where the `gyms`
  array includes your gym id — not invented ids. Paste the validator error back and ask
  it to re-read the equipment catalog.
- **Not sure your gym's id?** Open the [gym list](https://bthos.github.io/gym-routine-basic-fit/gyms.html) or the **Catalog** tab in the Rutina app.

---

## Using your progress export (field 8)

After running a phase, **History → Exportar progreso** in the Rutina app produces a
Markdown text you can paste as-is into field 8. It looks like:

```
Prensa de Pecho (g3-s10)
  · 32kg / difícil
  · 32kg / normal
  · 35kg / fácil

Jalón al Pecho (g3-s30)
  · 45kg / normal
  · 48kg / fácil

Sesiones sin completar:
  · Lunes — 2026-07-01 (abandonada)
```

The LLM reads this as evidence of which weights were manageable, which felt too easy or
too hard, and which sessions were abandoned — and adjusts the next phase accordingly.

**Full format reference:** [`docs/export-format.md`](export-format.md)

---

## Updating your program

Once a program is loaded, you can replace or remove it from the **Program** tab:

1. Open the **Program** tab and scroll to the bottom of the overview.
2. Tap **Reemplazar programa** (Replace program) to go to the import screen and paste a new rutina.json.
3. Or tap **Eliminar programa** (Remove program) to clear the active program and return to first-run state.

Session history is preserved on remove — records are kept but are no longer linked to a program.

# Export Format Reference

This document specifies the exact format of the two artifacts the PWA generates on the
**Export** screen. Both are derived from the same underlying session history stored in
IndexedDB. The Markdown format is the primary one — it is designed to be pasted directly
into an LLM chat as context for generating the next training phase.

**Source:** `app/src/lib/exportFormat.js` (`buildExportPayload`).

---

## Markdown export (LLM paste format)

### Purpose

Copy this text and paste it into an LLM chat as field 8 of the
[rutina authoring prompt](llm-rutina-prompt.en.md) ("Prior progress export"). The LLM
uses it to understand how each exercise actually went — which weights were manageable,
which felt too easy or too hard — and to adjust the next phase accordingly.

### How to get it

1. Open the **History** tab in the PWA.
2. Tap **Exportar progreso**.
3. Select a date range (default: all sessions).
4. Tap **Copiar al portapapeles** (or **Compartir** on mobile).

On Android Chrome/Edge you can also tap **⬇ Descargar .json** to download both formats
together in one file.

### Format

```
<Equipment name (equipmentId)>
  · <weightUsed>kg / <difficulty>
  · <weightUsed>kg / <difficulty>
  ...

<Equipment name (equipmentId)>
  · <weightUsed>kg / <difficulty>
  ...

Sesiones sin completar:
  · <dayLabel> — <YYYY-MM-DD> (abandonada)
```

**Rules:**
- One block per equipment item that was logged at least once.
- Entries are in chronological order (oldest → newest), one line each.
- Difficulty values: `fácil` / `normal` / `difícil` (always lowercase Spanish).
- Equipment items appear in the order they were first logged across all sessions.
- Exercises from abandoned sessions are **excluded** from the per-exercise blocks
  (they were never completed, so no weight/difficulty was recorded). Abandoned sessions
  are called out in a trailing `Sesiones sin completar:` section instead.
- If there are no logged sessions, the output is the single line:
  `Sin sesiones registradas todavía.`

### Worked example

Given three sessions:
- 2026-07-01 — Lunes (abandoned, nothing logged)
- 2026-07-06 — Lunes (completed): Prensa de Pecho 32 kg / hard, Jalón al Pecho 45 kg / normal
- 2026-07-08 — Lunes (completed): Prensa de Pecho 32 kg / normal, Jalón al Pecho 48 kg / fácil

The Markdown export is:

```
Prensa de Pecho (g3-s10)
  · 32kg / difícil
  · 32kg / normal

Jalón al Pecho (g3-s30)
  · 45kg / normal
  · 48kg / fácil

Sesiones sin completar:
  · Lunes — 2026-07-01 (abandonada)
```

---

## JSON export

### Purpose

A precise, re-importable archive of all logged exercises. Machine-readable. Keep it as
a backup or to cross-reference against the Markdown text.

### Format

```json
{
  "exercises": {
    "<equipmentId>": [
      {
        "date": "YYYY-MM-DD",
        "weightUsed": <number>,
        "difficulty": "easy" | "normal" | "hard"
      }
    ]
  }
}
```

**Rules:**
- `difficulty` uses the internal tokens (`easy` / `normal` / `hard`), not the
  display labels used in the Markdown (`fácil` / `normal` / `difícil`).
- Entries per equipment id are in chronological order, oldest first.
- Only completed exercises are included (same rule as Markdown: abandoned/unlogged
  exercises contribute nothing to the per-exercise arrays).
- Date is derived from `completedAt` (the timestamp the user tapped "Marcar completado"),
  truncated to `YYYY-MM-DD` in UTC.
- There is no top-level session or date-range envelope — the file is a flat per-equipment
  log. If you exported with a date range filter, entries outside that range are simply
  absent (the filter is applied before serialisation, not recorded in the file).

### Worked example (same three sessions as above)

```json
{
  "exercises": {
    "g3-s10": [
      { "date": "2026-07-06", "weightUsed": 32, "difficulty": "hard" },
      { "date": "2026-07-08", "weightUsed": 32, "difficulty": "normal" }
    ],
    "g3-s30": [
      { "date": "2026-07-06", "weightUsed": 45, "difficulty": "normal" },
      { "date": "2026-07-08", "weightUsed": 48, "difficulty": "easy" }
    ]
  }
}
```

Note: the 2026-07-01 abandoned session contributes no entries to either equipment id.

---

## Cross-device workflow

The PWA stores everything locally (IndexedDB, no cloud). To close the loop — log
workouts on your phone, then generate the next phase from a laptop — the intended flow is:

```
Phone                               Laptop / any device
─────                               ──────────────────
History → Exportar progreso
  ↓
Copiar al portapapeles
  ↓
Share to yourself (notes, chat,
  clipboard sync, screenshot,
  whatever you use) ──────────────▶ Paste into LLM chat (field 8)
                                      ↓
                                    LLM generates next phase rutina.json
                                      ↓
                                    npm run validate-rutina -- <path>
                                      ↓
                                    Import into PWA on phone
```

The Web Share button (↗ Compartir) uses the OS share sheet on Android — you can share
the Markdown text directly to WhatsApp, Notes, Telegram, email, or any installed app
without copying and pasting manually.

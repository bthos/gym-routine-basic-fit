# BasicFit Rutina

A multilingual (EN/ES/BE) equipment catalog and training-routine PWA for BasicFit Málaga gyms featuring Matrix Aura series strength machines. Includes an offline-capable React PWA for tracking workouts, a static HTML catalog viewer, and an LLM-based routine authoring workflow.

## Overview

27 Matrix equipment items (25 Aura series + Smith Machine + Perfect Squat) across 7 BasicFit locations in Málaga, Spain. Each entry includes multilingual names and instructions (English, Spanish, Belarusian), product images, video links, PDF manuals, and muscle-group targeting.

The **Rutina PWA** (`app/`) lets you import a `rutina.json` training program, log workout sessions with per-exercise weight and difficulty, review history, and export progress — all offline, no backend.

## Quick Start

### Static catalog (no build required)

```bash
npm install
npm run serve
# open http://localhost:3000/equipment-catalog.html
```

### PWA (development)

```bash
npm install
npm run dev
# open http://localhost:5173
```

### PWA (production build)

```bash
npm run build      # outputs to dist/
npm run preview    # serve dist/ at http://localhost:4173
```

## Project Structure

```
basicfit-rutina/
├── app/                            # React + Vite PWA
│   ├── index.html                  # Vite HTML entry
│   ├── public/
│   │   ├── manifest.json           # PWA manifest
│   │   └── icons/                  # PWA icons
│   └── src/
│       ├── main.jsx                # ReactDOM root + SW registration
│       ├── App.jsx                 # HashRouter + route shell
│       ├── components/
│       │   ├── BottomTabBar.jsx    # Persistent bottom navigation (Home/Program/Catalog/History)
│       │   └── ConfirmSheet.jsx    # Reusable confirmation sheet
│       ├── screens/
│       │   ├── ImportScreen.jsx    # Import a rutina.json
│       │   ├── HomeScreen.jsx      # Today's workout summary
│       │   ├── ProgramScreen.jsx   # Full routine view (all days)
│       │   ├── ActiveSessionScreen.jsx  # Live workout logging
│       │   ├── HistoryScreen.jsx   # Past sessions + per-exercise trend
│       │   ├── ExportScreen.jsx    # JSON + Markdown export
│       │   └── CatalogScreen.jsx   # Equipment catalog (27 items, EN/ES/BE)
│       ├── lib/
│       │   ├── db.js               # IndexedDB wrapper (idb): activeRutina, sessions, lastWeights
│       │   ├── sessionMachine.js   # Pure session-state reducer
│       │   ├── exportFormat.js     # sessions[] → { json, markdown }
│       │   ├── today.js            # Heuristic: which day is "today" in the rutina
│       │   └── validateImport.js   # Browser wrapper around scripts/lib/rutina-validator.js
│       └── data/
│           └── equipment.js        # Imports data/equipment.json at build time
├── data/
│   ├── equipment.json              # Complete equipment catalog (27 items)
│   ├── gyms.json                   # 7 BasicFit Málaga locations
│   ├── user-weights.json           # Default weights per equipment
│   ├── examples/
│   │   └── phase1-monday.json      # Example rutina.json for first-run import
│   └── schema/
│       ├── equipment.schema.json
│       └── rutina.schema.json      # Schema for training programs
├── design-system/                  # Component library (tokens, primitives, composites)
├── scripts/                        # Node.js build and scraping scripts
│   ├── lib/
│   │   └── rutina-validator.js     # Shared rutina.json validator (isomorphic, used by PWA)
│   ├── generate-catalog.js         # Embeds equipment data into equipment-catalog.html
│   ├── build-rutina.js             # Embeds data into legacy rutina_*.html files
│   ├── validate-data.js            # Schema validation for equipment.json
│   └── validate-rutina.js          # CLI validator for rutina.json files
├── tests/
│   └── viewport-check.js           # Puppeteer: no horizontal scroll + tab-bar row-wrap at 360/390/412/768px
├── docs/
│   └── llm-rutina-prompt.md        # Prompt template for authoring routines with an LLM
├── equipment-catalog.html          # Static catalog (data embedded, works offline)
├── rutina_*.html                   # Legacy static routine pages
├── vite.config.js                  # Vite + React + vite-plugin-pwa config
└── vitest.config.js                # Vitest config (jsdom, app/src/**/*.test.{js,jsx})
```

## NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server for the PWA (`http://localhost:5173`) |
| `npm run build` | Build PWA for production → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run Vitest unit tests (lib modules) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:viewport` | Puppeteer viewport regression: 360/390/412/768px × 5 routes (requires `npm run preview` running) |
| `npm run validate-data` | Validate `data/equipment.json` against its schema |
| `npm run validate-rutina -- <path>` | Validate a `rutina.json` file against its schema + cross-check `equipmentId` values |
| `npm run serve` | Serve the repo root on port 3000 (for static HTML pages) |
| `npm run generate-catalog` | Embed equipment data into `equipment-catalog.html` |
| `npm run build-rutina` | Embed equipment + weights into legacy `rutina_*.html` files |
| `npm run extract-images` | Scrape equipment images from Matrix product pages (Puppeteer) |

## Building the PWA

### Prerequisites

```bash
node --version  # 18+ recommended
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`. Hot-reload is on. The dev server is configured to allow cross-root imports: `scripts/lib/rutina-validator.js` and `data/equipment.json` are imported directly from outside `app/` — no duplication.

### Production build

```bash
npm run build
```

Output goes to `dist/`. The build:
- Bundles the React app with Vite + Rollup
- Generates a service worker via `vite-plugin-pwa` (Workbox `generateSW`) that precaches the app shell
- Adds a runtime cache rule for equipment images (`images.jhtassets.com`, CacheFirst, 30-day TTL) so previously-viewed equipment stays available offline

```bash
npm run preview          # serve dist/ at http://localhost:4173
npm run test:viewport    # verify no horizontal overflow and tab-bar stays single-row
```

### Running tests

```bash
npm test                 # 5 Vitest suites: sessionMachine, exportFormat, today, db, validateImport
npm run validate-data    # data integrity gate (27 equipment items)
```

### Installing the PWA

After `npm run preview` (or deploying `dist/`), open the app in Chrome/Edge on Android or Safari on iOS and use the browser's "Add to Home Screen" / "Install" prompt. The manifest at `app/public/manifest.json` uses a relative `start_url` and `scope` so it works on any static host.

## Using the PWA

1. **Import a rutina** — paste a `rutina.json` or upload a file. Use `data/examples/phase1-monday.json` to try the flow immediately. Generate your own with the LLM workflow below.
2. **Home** — shows today's day (resolved by matching the day label against the current weekday in Spanish, with a fallback to the first unstarted day).
3. **Program** — full routine view across all days.
4. **Active session** — tap a day on Home to start. Log weight + difficulty per exercise. Finish or abandon at any time.
5. **History** — past sessions with per-exercise last-3-sessions weight trend.
6. **Export** — download a JSON archive or copy Markdown to clipboard. Optional Web Share on mobile.
7. **Catalog** — all 27 equipment items with images and instructions (EN/ES/BE).

All data is stored locally in IndexedDB — no account, no server.

## Authoring a Rutina with an LLM

Training programs are authored by pasting a filled-in checklist into any LLM chat — no coding required.

1. Fill in an 8-field checklist (goal, days/week, session length, injuries, gym, output language, etc.)
2. Paste the assembled prompt (checklist + schema + your gym's equipment list) into any LLM
3. Save the reply and validate: `npm run validate-rutina -- path/to/rutina.json`
4. If validation fails, paste the error text back to the LLM and re-validate
5. Import the validated file into the PWA

Full walkthrough, prompt template, and a worked example: **[`docs/llm-rutina-prompt.md`](docs/llm-rutina-prompt.md)**

## Data Format

### Equipment entry (abbreviated)

```json
{
  "id": "g3-s10",
  "modelCode": "G3-S10",
  "series": "Aura",
  "category": "chest",
  "muscleGroup": {
    "primary": ["pectoralis-major"],
    "secondary": ["triceps", "anterior-deltoid"]
  },
  "names": { "en": "Chest Press", "es": "Prensa de Pecho", "be": "Жым ад грудзей" },
  "images": [{ "url": "https://images.jhtassets.com/...", "isMain": true }],
  "instructions": {
    "en": "<ol><li>Step 1</li></ol>",
    "es": "<ol><li>Paso 1</li></ol>",
    "be": "<ol><li>Крок 1</li></ol>"
  },
  "gyms": [1, 2, 3, 4, 5, 6, 7]
}
```

### Rutina entry (abbreviated)

```json
{
  "meta": { "name": "Phase 1", "language": "es", "goal": "strength" },
  "days": [
    {
      "label": "Lunes",
      "exercises": [
        { "equipmentId": "g3-s10", "sets": 3, "reps": "10", "restSeconds": 60 }
      ]
    }
  ]
}
```

Full schemas: `data/schema/equipment.schema.json` and `data/schema/rutina.schema.json`.

## Equipment Catalog

### Chest (3)
G3-S10 Chest Press · G3-S12 Pectoral Fly · G3-S13 Converging Chest Press

### Shoulders (4)
G3-S20 Shoulder Press · G3-S21 Lateral Raise · G3-S22 Rear Delt Fly · G3-S23 Converging Shoulder Press

### Back (4)
G3-S30 Lat Pulldown · G3-S31 Seated Row · G3-S33 Diverging Lat Pulldown · G3-S34 Diverging Seated Row

### Arms (3)
G3-S40 Arm Curl · G3-S42 Triceps Press · G3-S45 Tricep Extension

### Core (5)
G3-S50 Abdominal · G3-S51 Abdominal Crunch · G3-S52 Back Extension · G3-S55 Rotary Torso · G3-S60 Dip/Chin Assist

### Legs (8)
G3-S70 Leg Press · G3-S71 Leg Extension · G3-S72 Seated Leg Curl · G3-S73 Prone Leg Curl · G3-S74 Hip Adductor · G3-S75 Hip Abductor · Smith Machine (G1-FW161) · Perfect Squat (VY-400)

## Gym Locations

7 BasicFit locations in Málaga, Spain:

1. Armengual de la Mota — Calle Armengual de la Mota 26, 29007 (Centro)
2. Héroe de Sostoa — Calle Héroe de Sostoa 51
3. Alameda — CC Alameda, Avda. Andalucía s/n (La Luz)
4. Félix García Palacios — Calle Félix García Palacios 1
5. Teatinos — Bulevar Louis Pasteur 20
6. El Palo — Calle Olmos 43
7. Rincón de la Victoria (nearby; address to be confirmed)

## Contributing

To add or update equipment:

1. Edit `data/equipment.json`
2. Follow the existing structure (EN/ES/BE content required)
3. Run `npm run validate-data` — must pass
4. Run `npm run generate-catalog` to update the static HTML catalog

## License

For personal use. Equipment specifications and names are based on publicly available Matrix Fitness documentation.

## Resources

- [Matrix Fitness](https://www.matrixfitness.com/)
- [BasicFit Málaga](https://www.basic-fit.com/en-es/gyms/malaga)
- [Matrix Manuals](https://jhtsupport.com/eng/matrix/manuals/)

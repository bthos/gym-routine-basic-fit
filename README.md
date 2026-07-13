# BasicFit Equipment Catalog

A multilingual (EN/ES/BE) equipment catalog and routine generator for BasicFit Málaga gyms featuring Matrix Aura series strength training machines. Includes an HTML catalog viewer and rutina (training routine) page with embedded data for offline use.

## Overview

This project contains a complete catalog of 27 Matrix equipment items (25 Aura series + Smith Machine + Perfect Squat) available at 7 BasicFit locations in Málaga, Spain. Each equipment entry includes:

- Multilingual names and descriptions (English, Spanish, Belarusian)
- Step-by-step usage instructions in HTML format
- Product images (Matrix CDN: images.jhtassets.com)
- Video tutorial links (YouTube search URLs)
- Manual PDF links
- Muscle group targeting information
- Equipment specifications
- Gym location mapping

## Project Structure

```
basicfit-rutina/
├── data/
│   ├── equipment.json          # Complete equipment catalog (27 items)
│   ├── user-weights.json       # User weight settings per equipment
│   ├── gyms.json               # 7 BasicFit Málaga locations
│   └── schema/
│       └── equipment.schema.json  # JSON schema for validation
├── scripts/
│   ├── generate-catalog.js     # Убудоўвае дадзеныя ў equipment-catalog.html
│   ├── build-rutina.js         # Убудоўвае equipment + weights у rutina.html
│   ├── validate-data.js        # Schema validation
│   ├── extract-matrix-images-puppeteer.js  # Здабыванне выяў Matrix
│   ├── analyze-images.js      # Аналіз выяў на старонцы
│   └── debug-page-structure.js # Адладка структуры старонкі Matrix
├── equipment-catalog.html      # Каталог абсталявання (HTML)
├── rutina.html                # Трэніровачная праграма
└── README.md
```

## NPM Scripts

| Каманда | Апісанне |
|---------|---------|
| `npm run serve` | Запуск лакальнага сервера (порт 3000) |
| `npm run generate-catalog` | Генерацыя каталога: абнаўленне даты, фікс URL відэа, убудаванне ў equipment-catalog.html |
| `npm run build-rutina` | Убудаванне equipment + weights у rutina.html для афлайн-рэжыму |
| `npm run validate-data` | Валідацыя equipment.json па схеме |
| `npm run extract-images` | Здабыванне выяў Matrix (Puppeteer) |
| `npm run extract-images-all` | Здабыванне выяў для ўсіх мадэляў |
| `npm run extract-images-list` | Спіс даступных мадэляў |
| `npm run validate-rutina -- <path>` | Валідацыя `rutina.json` па схеме + праверка `equipmentId` супраць `data/equipment.json` |

### Quick Start

```bash
npm install
npm run generate-catalog   # абнавіць каталог
npm run serve              # адкрыць http://localhost:3000/equipment-catalog.html
```

## Equipment Categories

### Chest (3 machines)
- G3-S10: Chest Press / Prensa de Pecho
- G3-S12: Pectoral Fly / Aperturas de Pecho
- G3-S13: Converging Chest Press / Prensa de Pecho Convergente

### Shoulders (4 machines)
- G3-S20: Shoulder Press / Prensa de Hombros
- G3-S21: Lateral Raise / Elevación Lateral
- G3-S22: Rear Delt Fly / Deltoides Posterior
- G3-S23: Converging Shoulder Press / Prensa de Hombros Convergente

### Back (4 machines)
- G3-S30: Lat Pulldown / Jalón al Pecho
- G3-S31: Seated Row / Remo Sentado
- G3-S33: Diverging Lat Pulldown / Jalón Divergente
- G3-S34: Diverging Seated Row / Remo Divergente

### Arms (3 machines)
- G3-S40: Arm Curl / Curl de Bíceps
- G3-S42: Triceps Press / Prensa de Tríceps
- G3-S45: Tricep Extension / Extensión de Tríceps

### Core (5 machines)
- G3-S50: Abdominal / Abdominales
- G3-S51: Abdominal Crunch / Crunch Abdominal
- G3-S52: Back Extension / Extensión Lumbar
- G3-S55: Rotary Torso / Rotación de Torso
- G3-S60: Dip / Chin Assist / Fondos y Dominadas Asistidas

### Legs (8 machines)
- G3-S70: Leg Press / Prensa de Piernas
- G3-S71: Leg Extension / Extensión de Piernas
- G3-S72: Seated Leg Curl / Curl de Piernas Sentado
- G3-S73: Prone Leg Curl / Curl de Piernas Tumbado
- G3-S74: Hip Adductor / Aductor de Cadera
- G3-S75: Hip Abductor / Abductor de Cadera
- Smith Machine (G1-FW161)
- Perfect Squat (VY-400)

## Gym Locations

The catalog includes 7 BasicFit locations in Málaga:

1. **Armengual de la Mota** - Calle Armengual de la Mota 26, 29007 Málaga (Centro)
2. **Calle Héroe de Sostoa 51** - Jardín de la Abadía neighborhood
3. **Centro Comercial Alameda** - Avda. Andalucía s/n, La Luz neighborhood
4. **Calle Félix García Palacios 1**
5. **Bulevar Louis Pasteur 20** - Teatinos neighborhood
6. **Calle Olmos 43** - El Palo neighborhood
7. **Rincón de la Victoria** - Nearby location (address to be confirmed)

Operating hours vary by location:
- **Most locations**: Weekdays 6:00-24:00, Weekends 8:00-21:00
- **Armengual de la Mota**: Weekdays 7:00-22:30, Weekends 8:00-21:00

## Data Format

### Equipment Entry Structure

Each equipment entry follows this structure:

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
  "names": {
    "en": "Chest Press",
    "es": "Prensa de Pecho",
    "be": "Жым ад грудзей"
  },
  "descriptions": {
    "en": "Seated chest press machine...",
    "es": "Máquina de prensa de pecho..."
  },
  "images": [
    {
      "url": "https://world.matrixfitness.com/assets/...",
      "source": "Matrix Official",
      "isMain": true
    }
  ],
  "videos": {
    "en": [
      {
        "url": "https://www.youtube.com/results?search_query=Matrix+chest+press+tutorial",
        "type": "instruction",
        "title": "How to Use...",
        "note": "Search YouTube: '...'"
      }
    ],
    "es": [...],
    "be": [...]
  },
  "manuals": [
    {
      "url": "https://jhtsupport.com/eng/matrix/manuals/...",
      "language": "en",
      "type": "pdf"
    }
  ],
  "instructions": {
    "en": "<ol><li>Step 1</li><li>Step 2</li></ol>",
    "es": "<ol><li>Paso 1</li><li>Paso 2</li></ol>",
    "be": "<ol><li>Крок 1</li><li>Крок 2</li></ol>"
  },
  "specifications": {
    "stackHeight": "ergo-form",
    "weightStack": "standard",
    "features": ["feature1", "feature2"]
  },
  "gyms": [1, 2, 3, 4, 5, 6, 7]
}
```

## Usage

### Прагляд каталога

```bash
npm run serve
# Адкрыйце http://localhost:3000/equipment-catalog.html
```

Або адкрыйце `equipment-catalog.html` напрамую (дадзеныя ўбудаваныя).

### Генерацыя каталога

Пасля змены `data/equipment.json`:

```bash
npm run generate-catalog
```

Скрыпт абнаўляе дату, замяняе плейсхолдары ў URL відэа на рэальныя пошукавыя запыты і ўбудоўвае дадзеныя ў HTML.

### Афлайн-рэжым rutina.html

```bash
npm run build-rutina
# Адкрыйце rutina.html (file:// або праз serve)
```

### Прагляд JSON

```bash
cat data/equipment.json | jq .
```

### Validating the Data

```bash
npm run validate-data
```

Правярае структуру, абавязковыя палі, шматмоўны кантэнт (EN/ES/BE) і выводзіць статыстыку.

### Using in Applications

The JSON files can be imported into any application that supports JSON:

**JavaScript/Node.js:**
```javascript
const equipment = require('./data/equipment.json');
const gyms = require('./data/gyms.json');
```

**Python:**
```python
import json

with open('data/equipment.json', 'r', encoding='utf-8') as f:
    equipment = json.load(f)
```

**Other languages:**
Use standard JSON parsing libraries for your language.

## Video Resources

Скрыпт `generate-catalog` аўтаматычна замяняе плейсхолдар `SEARCH_REQUIRED` у URL на рэальны пошукавы запыт з поля `note` (першы радок у двукоссі). Спасылкі вядуць на вынікі пошуку YouTube.

Прыклад: `note: "Search YouTube: 'Matrix chest press tutorial' or 'chest press machine how to'"` → URL з `search_query=Matrix%20chest%20press%20tutorial`

## Manual Resources

Official Matrix equipment manuals are available at:
- Base URL: `https://jhtsupport.com/eng/matrix/manuals/`
- Format: `[model-code-lowercase]` (e.g., `g3-s10`)

## Image Sources

Equipment images from Matrix CDN:
- Base URL: `https://images.jhtassets.com/`
- Use `npm run extract-images` to fetch images from Matrix product pages

## Data Sources

- **Equipment Specifications**: Matrix Fitness official catalog (world.matrixfitness.com)
- **Gym Locations**: BasicFit website (basic-fit.com/en-es/gyms/malaga)
- **Translations**: Based on Matrix official Spanish documentation
- **Instructions**: Created following wger-project exercise instruction standards

## Schema Validation

The JSON schema (`data/schema/equipment.schema.json`) defines the structure and can be used with JSON schema validators like:
- [ajv](https://github.com/ajv-validator/ajv) (JavaScript)
- [jsonschema](https://github.com/python-jsonschema/jsonschema) (Python)
- Online validators: json-schema-validator.herokuapp.com

## Authoring a Rutina with an LLM

Training programs (`rutina_*.html` today, moving to a `rutina.json` data format) can be
authored by pasting a filled-in checklist into any LLM chat — no coding required.

1. Fill in an 8-field plain-language checklist (goal, days/week, session length,
   injuries, gym, output language, etc.)
2. Paste the assembled prompt (checklist + schema + your gym's equipment list) into any
   LLM chat, on any device
3. Save the reply and validate it: `npm run validate-rutina -- path/to/rutina.json`
4. Fix loop: if validation fails, paste the error text back to the LLM verbatim and
   re-validate
5. Import the validated `rutina.json` into the PWA once it ships (or keep it as a
   standalone file — it's already useful on its own)

Full walkthrough, the copy-pasteable prompt template, and a worked example:
**[`docs/llm-rutina-prompt.md`](docs/llm-rutina-prompt.md)**.

## Contributing

To add or update equipment:

1. Edit `data/equipment.json`
2. Follow the existing structure
3. Ensure multilingual content (EN/ES/BE)
4. Run validation: `npm run validate-data`
5. Run `npm run generate-catalog` to update the HTML catalog

## License

This catalog is for personal use and manual routine creation. Equipment specifications and names are based on publicly available Matrix Fitness documentation.

## Notes

- Video URLs: `generate-catalog` аўтаматычна падстаўляе пошукавыя запыты з `note`
- 6 gym locations have confirmed addresses; 1 location (Rincón de la Victoria) address to be confirmed
- Image URLs: images.jhtassets.com (Matrix CDN)
- All equipment is assumed available at all 7 BasicFit Málaga locations
- Operating hours may vary by location - check individual gym details

## Related Resources

- [Matrix Fitness](https://www.matrixfitness.com/)
- [BasicFit Málaga](https://www.basic-fit.com/en-es/gyms/malaga)
- [Matrix Support/Manuals](https://jhtsupport.com/eng/matrix/manuals/)

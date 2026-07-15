---
name: equipment-display-html
description: BasicFit equipment-catalog HTML conventions. Use when creating or editing HTML that renders equipment cards — equipment-catalog.html, rutina_*.html, or design-system components — that read from data/equipment.json. Covers card structure, image fallbacks, HTML-instruction rendering, bilingual (ES/EN/BE) display, category colours, and model-code format.
disable-model-invocation: false
---

# Equipment Display HTML — Catalog Conventions (skill)

Project-specific rules for rendering BasicFit / Matrix equipment in HTML. Adapted from the Cursor rule `html-equipment-display.mdc`. Load this when touching `equipment-catalog.html`, `rutina_*.html`, or `design-system/` components that display equipment. The **source of truth is `data/equipment.json`** (validated against `data/schema/`); these pages embed that JSON for offline use — never hardcode equipment data into the HTML.

## Data integration

Load equipment from the JSON data file, not from inline literals:

```javascript
// ✅ GOOD — load from data/equipment.json
fetch('data/equipment.json')
  .then(response => response.json())
  .then(data => renderEquipment(data.equipment));
```

For the **offline** catalog pages (`equipment-catalog.html`, `rutina_*.html`), the build scripts embed the JSON at generation time rather than fetching at runtime — follow the existing embed pattern in `scripts/` instead of adding a live `fetch`.

## Equipment card structure

Each card includes:

- **Model code** (e.g. `G3-S10`) — prominently displayed, uppercase with hyphen (`G3-S##`).
- **Bilingual names** — Spanish (`names.es`, primary) and English (`names.en`, secondary); Belarusian (`names.be`) where present.
- **Equipment image** — from the Matrix CDN (`images.jhtassets.com`); see the `matrix-image-handling` skill for URL rules.
- **Instructions** — rendered from the HTML in `instructions.es` / `instructions.en`.
- **Muscle groups** — both primary and secondary.
- **Category badge** — visual indicator per category.

## Image handling

Always include a fallback and lazy loading:

```html
<!-- ✅ GOOD — fallback + loading state -->
<img
  src="${equipment.images[0].url}"
  alt="${equipment.names.es}"
  loading="lazy"
  onerror="this.src='placeholder.jpg'"
/>

<!-- ❌ BAD — no fallback -->
<img src="${equipment.images[0].url}" />
```

## Instructions rendering

Equipment instructions contain HTML markup — render with `innerHTML`, not `textContent`:

```javascript
// ✅ GOOD — preserves HTML formatting
instructionsDiv.innerHTML = equipment.instructions.es;

// ❌ BAD — strips the formatting
instructionsDiv.textContent = equipment.instructions.es;
```

> Because instructions are injected as HTML, they must come from the trusted `data/equipment.json` only. Do not `innerHTML` untrusted or user-supplied strings.

## Language support

- **Primary:** Spanish (`es`) — displayed by default.
- **Secondary:** English (`en`) — offer a toggle/option.
- **Additional:** Belarusian (`be`) — when present in the data.

## Category colours

Consistent scheme across the catalog:

| Category | Colour family |
|----------|---------------|
| Chest | Purple / violet |
| Back | Blue |
| Shoulders | Orange |
| Arms | Red |
| Core | Green |
| Legs | Indigo |

## Styling guidelines

- Modern CSS — gradients and shadows.
- Responsive, mobile-first.
- Consistent category colours (table above).

## Talaka fit

This is a domain-convention skill, not a pipeline stage. It carries knowledge; it doesn't own a handoff. When `@cmok` builds or edits equipment HTML, these rules apply. After changes, the data gate is `npm run validate-data` (per `.tlk/PROJECT.md`); the build is `npm run build-catalog && npm run build-rutina`. Pair with the `matrix-image-handling` skill whenever image URLs are involved.

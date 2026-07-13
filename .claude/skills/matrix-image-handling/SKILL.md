---
name: matrix-image-handling
description: Matrix / Johnson Health Tech CDN image extraction and URL conventions. Use when writing or editing scraping scripts (scripts/*.js with puppeteer/cheerio/axios) or working with image URLs in data/equipment.json — extraction priority, thumbnail URL transforms, exclusion patterns, and the images[] data shape.
disable-model-invocation: false
---

# Matrix Image Handling — CDN & Scraping Conventions (skill)

Project-specific rules for extracting and storing Matrix Fitness equipment images. Adapted from the Cursor rule `matrix-image-handling.mdc`. Load this when editing the scraping scripts in `scripts/` (puppeteer + cheerio + axios) or when the `images[]` array in `data/equipment.json` is involved. Matrix uses the Johnson Health Tech assets CDN: `images.jhtassets.com`.

## URL patterns

```javascript
// ✅ GOOD — hash-based URL with transformed parameter
"https://images.jhtassets.com/[hash]/transformed/w_300"

// ✅ GOOD — named upload (thumbnail version)
"https://images.jhtassets.com/uploads/G3-S30-Lat-Pulldown-150x150.jpg"

// ⚠️ OK — full-size (prefer transformed/w_300 when possible)
"https://images.jhtassets.com/[hash]/"
```

### URL transformation — always prefer thumbnails

```javascript
// If the URL ends with '/', append the transform parameter
if (imageUrl.endsWith('/')) {
  imageUrl = imageUrl + 'transformed/w_300';
}

// Convert full-size to thumbnail
imageUrl = imageUrl
  .replace('/w_1250', '/w_300')
  .replace('/w_900', '/w_300');
```

## Extraction priority

When scraping a Matrix product page, prioritise in this order:

1. **Meta tags** (highest): `<meta property="og:image">`, `<meta name="twitter:image">`.
2. **Hero images**: `alt="PNG Hero"` / `alt="Hero"`, or `loading="eager"`.
3. **JSON-LD**: `<script type="application/ld+json">` with `@type: "Product"` and an `image` field.
4. **Product selectors**: `.product-image img`, `.hero-image img`, `.main-image img`.

```javascript
// ✅ GOOD — meta tags first
const ogImage = await page.$eval(
  'meta[property="og:image"]', el => el.content
).catch(() => null);

// ✅ GOOD — handle Angular attributes for hero images
const heroImage = await page.$eval(
  'img[alt*="Hero"], img[loading="eager"]', el => el.src
).catch(() => null);
```

## Exclusions

Never capture layout / marketing assets or tiny images:

```javascript
// ❌ EXCLUDE by pattern
const excludePatterns = [
  '/logo', 'logo.',    // logos
  '/icon', 'icon.',    // icons
  'header', 'footer',  // layout
  'nav', 'menu',       // navigation
  'banner', 'ad'       // marketing
];

// ❌ EXCLUDE small images (likely icon/logo)
if (width < 200 || height < 200) { /* skip */ }
```

## Image data shape

In `data/equipment.json`, store images as:

```json
{
  "images": [
    {
      "url": "https://images.jhtassets.com/[hash]/transformed/w_300",
      "source": "Hero image (PNG Hero)",
      "isMain": false,
      "type": "image"
    }
  ]
}
```

## Model code → product URL mapping

```
Model G3-S10 → segment g3-s10-chest-press
Model G3-S30 → segment g3-s30-lat-pulldown
```

Example product page:

```
https://matrixfitness.com/us/eng/strength/single-station/aura-series/g3-s30-lat-pulldown
```

## Talaka fit

A domain-convention skill, not a pipeline stage. Applies whenever `@cmok` (or a researcher via `/researching-tasks`) touches image scraping or the `images[]` field. After changes to `data/equipment.json`, validate with `npm run validate-data` (per `.tlk/PROJECT.md`) — the data must still satisfy `data/schema/`. Pair with the `equipment-display-html` skill when the images are then rendered in the catalog.

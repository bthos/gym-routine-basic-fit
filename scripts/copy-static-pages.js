#!/usr/bin/env node
/**
 * Copies root-level static HTML pages and DATA SOURCES JSON files into dist/
 * for GitHub Pages deployment. jsDelivr serves .html as text/plain (by
 * design), so these pages must be hosted on GitHub Pages to render in the
 * browser. The DATA SOURCES files are also copied so the LLM guide's
 * same-origin "Download data files" card (llm-guide-file-downloads) can
 * serve them with a real `download` attribute instead of linking to
 * raw.githubusercontent.com.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES = ['gyms.html'];
const DATA_FILES = [
  'data/schema/rutina.schema.json',
  'data/equipment.json',
  'data/gyms.json',
  'data/examples/phase1-monday.json',
];

function copyStaticAssets(root, dist) {
  if (!fs.existsSync(dist)) return;
  for (const page of PAGES) {
    const src = path.join(root, page);
    if (!fs.existsSync(src)) continue;
    fs.copyFileSync(src, path.join(dist, page));
  }
  for (const rel of DATA_FILES) {
    const src = path.join(root, rel);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(dist, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

if (require.main === module) {
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) {
    console.warn('dist/ not found — skipping static page copy (run after vite build)');
    process.exit(0);
  }
  copyStaticAssets(ROOT, dist);
  console.log('Copied static assets → dist/');
}

module.exports = { copyStaticAssets, PAGES, DATA_FILES };

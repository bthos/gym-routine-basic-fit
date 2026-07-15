#!/usr/bin/env node
/**
 * Copies root-level static HTML pages into dist/ for GitHub Pages deployment.
 * jsDelivr serves .html as text/plain (by design), so these pages must be
 * hosted on GitHub Pages to render in the browser.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const dist = path.join(ROOT, 'dist');
const pages = ['gyms.html'];

if (!fs.existsSync(dist)) {
  console.warn('dist/ not found — skipping static page copy (run after vite build)');
  process.exit(0);
}

for (const page of pages) {
  const src = path.join(ROOT, page);
  if (!fs.existsSync(src)) {
    console.warn(`Missing ${page}, skipping`);
    continue;
  }
  fs.copyFileSync(src, path.join(dist, page));
  console.log(`Copied ${page} → dist/`);
}

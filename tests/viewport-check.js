#!/usr/bin/env node

/**
 * Mobile viewport regression check for rutina-pwa.
 *
 * Guards against the two bug classes fixed earlier in this project's static
 * pages and carried forward as an explicit spec requirement for this feature:
 *   1. Page-level horizontal scroll (an unwrapped wide element, e.g. a table
 *      not inside overflow-x:auto).
 *   2. The bottom tab bar wrapping to multiple rows instead of staying a
 *      single row of 4 fixed items.
 *
 * Requires `npm run preview` (or an equivalent static server for the built
 * app) already running. Run: node tests/viewport-check.js [baseUrl]
 *
 * /session and /export are intentionally excluded — reaching their non-empty
 * states requires seeded IndexedDB data, which this script does not set up.
 * Check those two manually at the widths below before Bagnik sign-off.
 */

const puppeteer = require('puppeteer');

const BASE_URL = process.argv[2] || 'http://localhost:4173';
const WIDTHS = [360, 390, 412, 768];
const ROUTES = ['/import', '/', '/program', '/catalog', '/history'];
const HEIGHT = 800;

async function checkRoute(browser, width, route) {
  const page = await browser.newPage();
  const failures = [];
  page.on('pageerror', (err) => failures.push(`console error: ${err.message}`));

  // Block external image requests so networkidle0 is reached without waiting
  // for equipment CDN images (images.jhtassets.com). We only measure layout
  // dimensions — image loading is irrelevant to the scroll/tab-bar checks.
  try {
    await page.setViewport({ width, height: HEIGHT });
    // domcontentloaded is enough — we only measure DOM layout (scrollWidth,
    // getBoundingClientRect). networkidle0 would hang on external equipment
    // images (images.jhtassets.com) loading on the Catalog route.
    await page.goto(`${BASE_URL}/#${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    // Brief settle: React renders synchronously, but let the event loop flush
    // so any layout-affecting effects (CSS, scroll containers) have applied.
    await new Promise((r) => setTimeout(r, 400));

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    if (overflow.scrollWidth > overflow.clientWidth + 1) {
      failures.push(
        `horizontal overflow: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`
      );
    }

    const tabBarRows = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[data-testid="tab-item"]'));
      if (items.length === 0) return null; // tab bar not present on this route/state — not a failure
      const tops = new Set(items.map((el) => el.getBoundingClientRect().top));
      return tops.size;
    });
    if (tabBarRows !== null && tabBarRows > 1) {
      failures.push(`bottom tab bar wrapped to ${tabBarRows} rows (expected 1)`);
    }
  } catch (err) {
    failures.push(`navigation error: ${err.message}`);
  } finally {
    await page.close();
  }

  return failures;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // Prevents Chrome from using the limited /dev/shm on headless hosts;
      // without this, Chrome can crash after ~10 pages when shm fills up.
      '--disable-dev-shm-usage',
    ],
  });
  let failCount = 0;

  for (const width of WIDTHS) {
    for (const route of ROUTES) {
      const failures = await checkRoute(browser, width, route);
      const label = `${width}px ${route}`;
      if (failures.length === 0) {
        console.log(`✓ ${label}`);
      } else {
        failCount += failures.length;
        console.log(`✗ ${label}`);
        failures.forEach((f) => console.log(`    ${f}`));
      }
    }
  }

  await browser.close();

  if (failCount > 0) {
    console.log(`\n${failCount} viewport check(s) failed.`);
    process.exit(1);
  }
  console.log('\n✓ All viewport checks passed! (/session and /export require manual check — see file header)');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

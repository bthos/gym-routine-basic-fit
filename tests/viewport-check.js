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
 * Starts `npm run preview` automatically when nothing is listening on the
 * target port. Run: node tests/viewport-check.js [baseUrl]
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const REPO_ROOT = path.resolve(__dirname, '..');
const BASE_URL = process.argv[2] || 'http://localhost:4173';
const WIDTHS = [360, 390, 412, 768];
const ROUTES = ['/import', '/', '/program', '/catalog', '/history', '/session', '/export'];
const HEIGHT = 800;

const EXAMPLE_RUTINA = JSON.parse(
  fs.readFileSync(path.join(REPO_ROOT, 'data/examples/phase1-monday.json'), 'utf8')
);

const ACTIVE_SESSION = {
  id: 'viewport-test-active',
  dayLabel: EXAMPLE_RUTINA.days[0].label,
  dayIndex: 0,
  status: 'active',
  startedAt: '2026-07-15T10:00:00.000Z',
  endedAt: null,
  exercises: EXAMPLE_RUTINA.days[0].exercises.map((ex) => ({
    equipmentId: ex.equipmentId,
    name: ex.name,
    weightUsed: null,
    difficulty: null,
    completedAt: null,
  })),
};

const COMPLETED_SESSION = {
  ...ACTIVE_SESSION,
  id: 'viewport-test-completed',
  status: 'completed',
  endedAt: '2026-07-15T11:00:00.000Z',
  exercises: ACTIVE_SESSION.exercises.map((ex) => ({
    ...ex,
    weightUsed: 32,
    difficulty: 'normal',
    completedAt: '2026-07-15T10:30:00.000Z',
  })),
};

let previewProc = null;

async function isServerUp(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok || res.status === 304;
  } catch {
    return false;
  }
}

async function waitForServer(url, maxMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (await isServerUp(url)) return;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Preview server at ${url} did not become ready within ${maxMs}ms`);
}

async function ensurePreviewServer() {
  if (await isServerUp(BASE_URL)) return;
  previewProc = spawn('npm', ['run', 'preview'], {
    cwd: REPO_ROOT,
    shell: true,
    stdio: 'ignore',
  });
  await waitForServer(BASE_URL);
}

function stopPreviewServer() {
  if (previewProc && !previewProc.killed) {
    previewProc.kill();
    previewProc = null;
  }
}

async function seedIndexedDB(page, { rutina, sessions }) {
  await page.evaluate(
    async ({ rutinaData, sessionData }) => {
      await new Promise((resolve, reject) => {
        const req = indexedDB.open('basicfit-rutina', 1);
        req.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('activeRutina')) {
            db.createObjectStore('activeRutina', { keyPath: 'key' });
          }
          if (!db.objectStoreNames.contains('sessions')) {
            const store = db.createObjectStore('sessions', { keyPath: 'id' });
            store.createIndex('by-status', 'status');
            store.createIndex('by-startedAt', 'startedAt');
          }
          if (!db.objectStoreNames.contains('lastWeights')) {
            db.createObjectStore('lastWeights', { keyPath: 'equipmentId' });
          }
        };
        req.onsuccess = (event) => {
          const db = event.target.result;
          const tx = db.transaction(['activeRutina', 'sessions'], 'readwrite');
          tx.objectStore('activeRutina').put({
            key: 'current',
            rutina: rutinaData,
            importedAt: new Date().toISOString(),
          });
          for (const session of sessionData) {
            tx.objectStore('sessions').put(session);
          }
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
        req.onerror = () => reject(req.error);
      });
    },
    { rutinaData: rutina, sessionData: sessions }
  );
}

function seedPlanForRoute(route) {
  if (route === '/session') {
    return { rutina: EXAMPLE_RUTINA, sessions: [ACTIVE_SESSION] };
  }
  if (route === '/export') {
    return { rutina: EXAMPLE_RUTINA, sessions: [COMPLETED_SESSION] };
  }
  return null;
}

async function checkRoute(browser, width, route) {
  const page = await browser.newPage();
  const failures = [];
  page.on('pageerror', (err) => failures.push(`console error: ${err.message}`));

  try {
    await page.setViewport({ width, height: HEIGHT });

    const seed = seedPlanForRoute(route);
    if (seed) {
      await page.goto(`${BASE_URL}/#/import`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await seedIndexedDB(page, seed);
    }

    await page.goto(`${BASE_URL}/#${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
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
      if (items.length === 0) return null;
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
  await ensurePreviewServer();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  let failCount = 0;

  try {
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
  } finally {
    await browser.close();
    stopPreviewServer();
  }

  if (failCount > 0) {
    console.log(`\n${failCount} viewport check(s) failed.`);
    process.exit(1);
  }
  console.log('\n✓ All viewport checks passed!');
  process.exit(0);
}

main().catch((err) => {
  stopPreviewServer();
  console.error(err);
  process.exit(1);
});

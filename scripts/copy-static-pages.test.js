// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { copyStaticAssets, DATA_FILES } from './copy-static-pages.js';

// Architecture note (llm-guide-file-downloads, AC4): copy-static-pages.js
// currently only copies gyms.html into dist/ (imperative script, no exports).
// This test targets the intended post-Cmok shape: a `copyStaticAssets(root, dist)`
// function exported alongside the existing CLI behavior, extended to also copy
// the four DATA SOURCES files into dist/data/... mirroring their source subpaths.
// These tests are expected to fail until Cmok implements the export + the new
// copy loop — see tech-plan.md.

describe('copyStaticAssets (postbuild static asset copy)', () => {
  let tmpRoot;
  let tmpDist;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rutina-root-'));
    tmpDist = path.join(tmpRoot, 'dist');
    fs.mkdirSync(tmpDist, { recursive: true });

    // Fixture: root-level gyms.html (existing behavior — must not regress).
    fs.writeFileSync(path.join(tmpRoot, 'gyms.html'), '<html>gyms</html>', 'utf8');

    // Fixture: the four data source files, mirroring real repo subpaths.
    for (const rel of DATA_FILES || []) {
      const src = path.join(tmpRoot, rel);
      fs.mkdirSync(path.dirname(src), { recursive: true });
      fs.writeFileSync(src, JSON.stringify({ fixture: rel }), 'utf8');
    }
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('is exported as a function', () => {
    expect(typeof copyStaticAssets).toBe('function');
  });

  it('exposes the four canonical DATA_FILES subpaths in AC3 canonical order', () => {
    expect(DATA_FILES).toEqual([
      'data/schema/rutina.schema.json',
      'data/equipment.json',
      'data/gyms.json',
      'data/examples/phase1-monday.json',
    ]);
  });

  it('still copies gyms.html into dist/ (no regression)', () => {
    copyStaticAssets(tmpRoot, tmpDist);
    expect(fs.existsSync(path.join(tmpDist, 'gyms.html'))).toBe(true);
  });

  it('copies all four data files into dist/, mirroring source subpaths (AC4)', () => {
    copyStaticAssets(tmpRoot, tmpDist);
    for (const rel of DATA_FILES) {
      const dest = path.join(tmpDist, rel);
      expect(fs.existsSync(dest)).toBe(true);
      expect(JSON.parse(fs.readFileSync(dest, 'utf8'))).toEqual({ fixture: rel });
    }
  });

  it('does not throw when dist/ does not exist yet (pre-vite-build case)', () => {
    fs.rmSync(tmpDist, { recursive: true, force: true });
    expect(() => copyStaticAssets(tmpRoot, tmpDist)).not.toThrow();
  });

  it('skips a missing source data file without throwing (defensive, matches existing gyms.html handling)', () => {
    fs.rmSync(path.join(tmpRoot, 'data', 'gyms.json'));
    expect(() => copyStaticAssets(tmpRoot, tmpDist)).not.toThrow();
  });
});

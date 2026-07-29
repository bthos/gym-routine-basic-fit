// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import zlib from 'zlib';
import { copyStaticAssets, buildDataArchive, DATA_FILES } from './copy-static-pages.js';

// Independent CRC-32 (IEEE 802.3, poly 0xEDB88320), deliberately separate
// from whatever Cmok implements in copy-static-pages.js, so a shared bug in
// one CRC-32 implementation can't mask itself in the other's test.
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

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

// llm-guide-zip-download (AC2, AC3, AC9): pending Cmok implementation — see
// tech-plan.md for the exact zip container layout (local file headers +
// central directory + EOCD, hand-rolled, no npm dependency). Failures here
// are expected until Cmok implements `buildDataArchive` — same convention as
// the block above for the prior feature.
describe('buildDataArchive (postbuild zip writer)', () => {
  let tmpRoot;
  let tmpDist;

  const EXPECTED_ENTRIES = [
    { rel: 'data/schema/rutina.schema.json', name: 'rutina.schema.json' },
    { rel: 'data/equipment.json', name: 'equipment.json' },
    { rel: 'data/gyms.json', name: 'gyms.json' },
    { rel: 'data/examples/phase1-monday.json', name: 'phase1-monday.json' },
  ];
  const ARCHIVE_REL = path.join('data', 'rutina-data-files.zip');

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rutina-root-'));
    tmpDist = path.join(tmpRoot, 'dist');
    fs.mkdirSync(tmpDist, { recursive: true });

    for (const { rel } of EXPECTED_ENTRIES) {
      const src = path.join(tmpRoot, rel);
      fs.mkdirSync(path.dirname(src), { recursive: true });
      // Distinct, non-trivial content per file so a mixed-up entry order or
      // wrong-source bug is visible as a content mismatch, not a false pass.
      fs.writeFileSync(src, JSON.stringify({ fixture: rel, filler: rel.repeat(20) }), 'utf8');
    }
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('is exported as a function', () => {
    expect(typeof buildDataArchive).toBe('function');
  });

  it('writes dist/data/rutina-data-files.zip', () => {
    buildDataArchive(tmpRoot, tmpDist);
    expect(fs.existsSync(path.join(tmpDist, ARCHIVE_REL))).toBe(true);
  });

  it('does not throw when dist/ does not exist yet (pre-vite-build case)', () => {
    fs.rmSync(tmpDist, { recursive: true, force: true });
    expect(() => buildDataArchive(tmpRoot, tmpDist)).not.toThrow();
  });

  describe('written archive structure', () => {
    let buf;
    let centralDirectory;

    beforeEach(() => {
      buildDataArchive(tmpRoot, tmpDist);
      buf = fs.readFileSync(path.join(tmpDist, ARCHIVE_REL));

      // EOCD is the last 22 bytes since this writer never emits a zip comment.
      const eocdOffset = buf.length - 22;
      expect(buf.readUInt32LE(eocdOffset)).toBe(0x06054b50);

      const totalEntries = buf.readUInt16LE(eocdOffset + 10);
      const cdSize = buf.readUInt32LE(eocdOffset + 12);
      const cdOffset = buf.readUInt32LE(eocdOffset + 16);

      expect(totalEntries).toBe(EXPECTED_ENTRIES.length);

      centralDirectory = [];
      let p = cdOffset;
      for (let i = 0; i < totalEntries; i++) {
        expect(buf.readUInt32LE(p)).toBe(0x02014b50);
        const compressedSize = buf.readUInt32LE(p + 20);
        const uncompressedSize = buf.readUInt32LE(p + 24);
        const nameLen = buf.readUInt16LE(p + 28);
        const extraLen = buf.readUInt16LE(p + 30);
        const commentLen = buf.readUInt16LE(p + 32);
        const crc = buf.readUInt32LE(p + 16);
        const localHeaderOffset = buf.readUInt32LE(p + 42);
        const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
        centralDirectory.push({ name, crc, compressedSize, uncompressedSize, localHeaderOffset });
        p += 46 + nameLen + extraLen + commentLen;
      }
      expect(p).toBe(cdOffset + cdSize);
    });

    it('lists all four entries flat at archive root, in canonical AC3 order', () => {
      expect(centralDirectory.map((e) => e.name)).toEqual(
        EXPECTED_ENTRIES.map((e) => e.name)
      );
      for (const entry of centralDirectory) {
        expect(entry.name).not.toContain('/');
        expect(entry.name).not.toContain('\\');
      }
    });

    it('each local file header has the correct signature at its recorded offset', () => {
      for (const entry of centralDirectory) {
        expect(buf.readUInt32LE(entry.localHeaderOffset)).toBe(0x04034b50);
      }
    });

    it('each entry decompresses to bytes identical to its source file (round-trip)', () => {
      for (let i = 0; i < centralDirectory.length; i++) {
        const entry = centralDirectory[i];
        const nameLen = buf.readUInt16LE(entry.localHeaderOffset + 26);
        const extraLen = buf.readUInt16LE(entry.localHeaderOffset + 28);
        const dataStart = entry.localHeaderOffset + 30 + nameLen + extraLen;
        const compressed = buf.subarray(dataStart, dataStart + entry.compressedSize);
        const decompressed = zlib.inflateRawSync(compressed);

        const source = fs.readFileSync(path.join(tmpRoot, EXPECTED_ENTRIES[i].rel));
        expect(decompressed.equals(source)).toBe(true);
        expect(entry.uncompressedSize).toBe(source.length);
      }
    });

    it('each entry\'s stored CRC-32 matches an independently computed CRC-32 of the decompressed bytes', () => {
      for (const entry of centralDirectory) {
        const nameLen = buf.readUInt16LE(entry.localHeaderOffset + 26);
        const extraLen = buf.readUInt16LE(entry.localHeaderOffset + 28);
        const dataStart = entry.localHeaderOffset + 30 + nameLen + extraLen;
        const compressed = buf.subarray(dataStart, dataStart + entry.compressedSize);
        const decompressed = zlib.inflateRawSync(compressed);
        expect(entry.crc).toBe(crc32(decompressed));
      }
    });
  });
});

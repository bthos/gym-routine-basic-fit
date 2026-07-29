#!/usr/bin/env node
/**
 * Copies root-level static HTML pages and DATA SOURCES JSON files into dist/
 * for GitHub Pages deployment. jsDelivr serves .html as text/plain (by
 * design), so these pages must be hosted on GitHub Pages to render in the
 * browser. The DATA SOURCES files are also copied (per-file, mirroring their
 * source subpaths — llm-guide-file-downloads) and additionally packed into a
 * single flat zip archive (llm-guide-zip-download) so the LLM guide's
 * same-origin "download" card can offer one archive containing all four
 * files instead of four separate per-file links.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const PAGES = ['gyms.html'];
const DATA_FILES = [
  'data/schema/rutina.schema.json',
  'data/equipment.json',
  'data/gyms.json',
  'data/examples/phase1-monday.json',
];
const ARCHIVE_REL = path.join('data', 'rutina-data-files.zip');

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

// Hand-rolled CRC-32 (IEEE 802.3, polynomial 0xEDB88320) — a small private
// helper for the zip writer below, not exported. Works on any Node version
// (no reliance on zlib.crc32(), which is a much newer addition); the zip
// format requires a per-entry CRC-32 of the *uncompressed* bytes regardless
// of which compression method is used, so this has to exist independent of
// zlib's deflate helpers either way.
const CRC32_TABLE = (() => {
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
    crc = CRC32_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Writes dist/data/rutina-data-files.zip — a flat zip archive (no directory
 * nesting, AC3) containing the four DATA_FILES, in DATA_FILES order, at the
 * archive root under their bare filenames. Hand-rolled ZIP container (local
 * file headers + central directory + EOCD, all fields little-endian) using
 * zlib.deflateRawSync for compression — see tech-plan.md for the exact byte
 * layout this mirrors. No new npm dependency (AC2).
 *
 * Local file header mod-time/date are hardcoded to the DOS epoch
 * (1980-01-01 00:00:00) rather than Date.now(), so the archive's bytes are
 * reproducible given the same inputs.
 */
function buildDataArchive(root, dist) {
  if (!fs.existsSync(dist)) return;

  const localChunks = [];
  const centralRecords = [];
  let offset = 0;

  for (const rel of DATA_FILES) {
    const src = path.join(root, rel);
    if (!fs.existsSync(src)) continue;

    const data = fs.readFileSync(src);
    const compressed = zlib.deflateRawSync(data);
    const crc = crc32(data);
    const nameBuf = Buffer.from(path.basename(rel), 'utf8');

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // local file header signature
    localHeader.writeUInt16LE(20, 4); // version needed to extract
    localHeader.writeUInt16LE(0, 6); // general purpose bit flag
    localHeader.writeUInt16LE(8, 8); // compression method (8 = deflate)
    localHeader.writeUInt16LE(0x0000, 10); // DOS time (epoch)
    localHeader.writeUInt16LE(0x0021, 12); // DOS date (1980-01-01)
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28); // extra field length

    centralRecords.push({
      name: nameBuf,
      crc,
      compressedSize: compressed.length,
      uncompressedSize: data.length,
      localHeaderOffset: offset,
    });

    localChunks.push(localHeader, nameBuf, compressed);
    offset += localHeader.length + nameBuf.length + compressed.length;
  }

  const centralChunks = [];
  let centralSize = 0;
  for (const rec of centralRecords) {
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); // central directory signature
    central.writeUInt16LE(20, 4); // version made by
    central.writeUInt16LE(20, 6); // version needed to extract
    central.writeUInt16LE(0, 8); // general purpose bit flag
    central.writeUInt16LE(8, 10); // compression method (8 = deflate)
    central.writeUInt16LE(0x0000, 12); // DOS time (epoch)
    central.writeUInt16LE(0x0021, 14); // DOS date (1980-01-01)
    central.writeUInt32LE(rec.crc, 16);
    central.writeUInt32LE(rec.compressedSize, 20);
    central.writeUInt32LE(rec.uncompressedSize, 24);
    central.writeUInt16LE(rec.name.length, 28);
    central.writeUInt16LE(0, 30); // extra field length
    central.writeUInt16LE(0, 32); // comment length
    central.writeUInt16LE(0, 34); // disk number start
    central.writeUInt16LE(0, 36); // internal attributes
    central.writeUInt32LE(0, 38); // external attributes
    central.writeUInt32LE(rec.localHeaderOffset, 42);

    centralChunks.push(central, rec.name);
    centralSize += central.length + rec.name.length;
  }

  const centralOffset = offset;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // disk where CD starts
  eocd.writeUInt16LE(centralRecords.length, 8); // CD records on this disk
  eocd.writeUInt16LE(centralRecords.length, 10); // total CD records
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(centralOffset, 16);
  eocd.writeUInt16LE(0, 20); // comment length

  const archive = Buffer.concat([...localChunks, ...centralChunks, eocd]);
  const archivePath = path.join(dist, ARCHIVE_REL);
  fs.mkdirSync(path.dirname(archivePath), { recursive: true });
  fs.writeFileSync(archivePath, archive);

  return { path: archivePath, bytes: archive.length };
}

if (require.main === module) {
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) {
    console.warn('dist/ not found — skipping static page copy (run after vite build)');
    process.exit(0);
  }
  copyStaticAssets(ROOT, dist);
  console.log('Copied static assets → dist/');
  const archive = buildDataArchive(ROOT, dist);
  if (archive) {
    console.log(`Wrote dist/${ARCHIVE_REL.split(path.sep).join('/')} (${archive.bytes} bytes)`);
  }
}

module.exports = { copyStaticAssets, buildDataArchive, PAGES, DATA_FILES };

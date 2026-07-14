#!/usr/bin/env node
'use strict';

/**
 * Generates solid-color placeholder PWA icons (brand purple background,
 * simple white dumbbell glyph) as real PNG files — zero dependencies,
 * using Node's built-in zlib for DEFLATE plus a small local CRC32.
 *
 * Placeholder only. rutina-pwa's tech-plan.md notes this feature loosely
 * depends on the sibling research-pwa-icon feature for final icon art;
 * the PWA install/Lighthouse AC only requires an installable manifest +
 * icons to exist, not final icon art. Swap the files in
 * app/public/icons/ once research-pwa-icon lands — this script documents
 * how to regenerate placeholders in the meantime.
 *
 * Usage: node scripts/generate-placeholder-icon.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PURPLE = [0x5b, 0x21, 0xac, 0xff]; // --bf-purple (design-system/tokens/colors.css)
const WHITE = [0xff, 0xff, 0xff, 0xff];

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

/**
 * Rasterizes a centered white dumbbell (two bars + connecting rod) over a
 * solid field. Content is kept within the centered ~60% safe zone so the
 * same raster works for both "any" and "maskable" manifest icon purposes.
 */
function drawDumbbell(size) {
  const px = new Uint8Array(size * size); // 0 = background, 1 = glyph
  const barW = Math.round(size * 0.14);
  const barH = Math.round(size * 0.46);
  const rodH = Math.round(size * 0.1);
  const cy = size / 2;
  const barLX = Math.round(size * 0.2);
  const barRX = Math.round(size * 0.66);

  const setRect = (x0, y0, w, h) => {
    for (let y = Math.max(0, Math.round(y0)); y < Math.min(size, Math.round(y0 + h)); y++) {
      for (let x = Math.max(0, x0); x < Math.min(size, x0 + w); x++) {
        px[y * size + x] = 1;
      }
    }
  };

  setRect(barLX, cy - barH / 2, barW, barH);
  setRect(barRX, cy - barH / 2, barW, barH);
  setRect(barLX + barW, cy - rodH / 2, barRX - (barLX + barW), rodH);
  return px;
}

function buildPng(size) {
  const px = drawDumbbell(size);
  const bytesPerPixel = 4;
  const rowBytes = size * bytesPerPixel;
  const raw = Buffer.alloc((rowBytes + 1) * size);

  for (let y = 0; y < size; y++) {
    const rowStart = y * (rowBytes + 1);
    raw[rowStart] = 0; // filter type: None
    for (let x = 0; x < size; x++) {
      const color = px[y * size + x] === 1 ? WHITE : PURPLE;
      const offset = rowStart + 1 + x * bytesPerPixel;
      raw[offset] = color[0];
      raw[offset + 1] = color[1];
      raw[offset + 2] = color[2];
      raw[offset + 3] = color[3];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: truecolor + alpha
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

  const idat = zlib.deflateSync(raw);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  return Buffer.concat([signature, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

function main() {
  const outDir = path.join(__dirname, '..', 'app', 'public', 'icons');
  fs.mkdirSync(outDir, { recursive: true });

  const targets = [
    ['icon-192.png', 192],
    ['icon-512.png', 512],
    ['icon-512-maskable.png', 512],
  ];

  targets.forEach(([filename, size]) => {
    fs.writeFileSync(path.join(outDir, filename), buildPng(size));
    console.log(`✓ ${filename} (${size}x${size})`);
  });
}

main();

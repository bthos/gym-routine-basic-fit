import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import commonjs from '@rollup/plugin-commonjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// NOTE (Bagnik build note #1, non-negotiable): Vite's dev server refuses to
// serve files outside its configured root (app/) unless explicitly allowed.
// This app imports scripts/lib/rutina-validator.js and data/equipment.json
// from OUTSIDE app/ on purpose (tech-plan.md's "reuse, don't fork" decision),
// so the repo root must be added to server.fs.allow or `npm run dev` 403s.
export default defineConfig({
  root: path.resolve(__dirname, 'app'),
  base: './',
  server: {
    fs: {
      allow: [__dirname],
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    // scripts/lib/rutina-validator.js (imported directly by
    // app/src/lib/validateImport.js, per tech-plan's "reuse, don't fork"
    // decision) is plain CommonJS (require/module.exports). Rollup only
    // auto-interops CJS found in node_modules by default — without this,
    // `require('ajv')` inside that first-party file resolves to nothing in
    // the browser bundle. Not called out in tech-plan's own gotcha note
    // (which only covers the dev-server 403 above); added here as a
    // necessary follow-on fix for the same "reuse the validator" decision.
    commonjsOptions: {
      include: [/node_modules/, /scripts[\\/]lib/],
      transformMixedEsModules: true,
    },
  },
  plugins: [
    // Same CJS-interop reason as build.commonjsOptions above, but for the
    // dev server: Vite's dev server does NOT run source files through
    // Rollup's commonjs plugin by default (that only happens for the
    // production build), so `npm run dev` would otherwise throw
    // "require is not defined" the moment ImportScreen imports
    // validateImport.js. This plugin's transform hook runs in both dev
    // and build because Vite plugins share Rollup's plugin interface.
    // apply: 'serve' — this CJS plugin runs ONLY during `vite dev` (the dev
    // server), NOT during `vite build`. In production, Rollup's built-in CJS
    // transform (configured via build.commonjsOptions above) handles
    // scripts/lib on its own. Running both in production causes a proxy
    // conflict where ajv's `?commonjs-proxy` virtual module is generated
    // twice with inconsistent exports. During dev, Vite's built-in doesn't
    // transform first-party CJS outside app/ (scripts/lib), so we need this
    // explicit plugin pass.
    Object.assign(commonjs({
      include: [/scripts[\\/]lib/],
      transformMixedEsModules: true,
    }), { apply: 'serve' }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // app/public/manifest.json is hand-authored (relative start_url/scope) and linked from index.html
      includeAssets: ['icons/*.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        runtimeCaching: [
          {
            // Equipment images are hosted externally (Matrix CDN) and referenced
            // by URL in the bundled data/equipment.json, not bundled as build
            // assets — cache them on first view so a previously-viewed rutina's
            // equipment images stay available offline (tech-plan.md's PWA decision).
            urlPattern: ({ url }) => url.hostname === 'images.jhtassets.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'equipment-images',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});

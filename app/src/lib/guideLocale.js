/** Detect guide locale from navigator.language (spec AC4). */
export function detectGuideLocale(navLang = navigator.language) {
  const code = (navLang || '').toLowerCase().slice(0, 2);
  if (code === 'es') return 'es';
  if (code === 'be') return 'be';
  return 'en';
}

export const GUIDE_LINK_TEXT = {
  es: 'Ver la guía de creación con LLM →',
  en: 'View the LLM creation guide →',
  be: 'Паглядзіце кіраўніцтва па стварэнні з LLM →',
};

export const GUIDE_TITLE = {
  es: 'Guía de creación con LLM',
  en: 'LLM creation guide',
  be: 'Кіраўніцтва па стварэнні з LLM',
};

export const GUIDE_CLOSE = { es: 'Cerrar', en: 'Close', be: 'Закрыць' };

export const GUIDE_PROMPT_LABEL = {
  es: 'Prompt para el LLM',
  en: 'LLM prompt',
  be: 'Prompt для LLM',
};

export const GUIDE_COPY = { es: 'Copiar', en: 'Copy', be: 'Скапіраваць' };
export const GUIDE_COPIED = { es: 'Copiado', en: 'Copied', be: 'Скапіравана' };

/** Public gym list (names + ids) — not part of the LLM prompt. */
export const GYMS_CATALOG_URL =
  'https://bthos.github.io/gym-routine-basic-fit/gyms.html';

export const GUIDE_FILL_HINT = {
  es: 'Rellena cada línea numerada del REQUEST (texto simple, sin JSON) antes de enviar.',
  en: 'Fill in every numbered REQUEST line (plain text, no JSON) before sending.',
  be: 'Запоўніце кожны нумараваны радок REQUEST (звычайны тэкст, без JSON) перад адпраўкай.',
};

export const GUIDE_GYM_HINT = {
  es: 'Campo 6 — gimnasio objetivo',
  en: 'Field 6 — target gym',
  be: 'Поле 6 — мэтавы зал',
};

export const GUIDE_GYM_BODY = {
  es: 'Busca el nombre y el id numérico de tu gimnasio en el listado.',
  en: 'Look up your gym’s name and numeric id in the list.',
  be: 'Знайдзіце назву і лічбавы id вашага зала ў спісе.',
};

export const GUIDE_GYM_LINK = {
  es: 'Listado de gimnasios',
  en: 'Gym list',
  be: 'Спіс залаў',
};

export const GUIDE_GYM_ALT = {
  es: 'También en la pestaña Catálogo de la app.',
  en: 'Also in the app’s Catálogo tab.',
  be: 'Таксама на ўкладцы Catálogo ў прыкладзе.',
};

/**
 * In-app "download data archive" card (llm-guide-zip-download; superseded
 * the per-file "download data files" card from llm-guide-file-downloads).
 * Served same-origin from the deployed PWA (GitHub Pages) so the HTML
 * `download` attribute reliably forces a save dialog instead of an inline
 * browser view — see spec AC2. Always the absolute production URL, mirroring
 * GYMS_CATALOG_URL's existing convention (the guide never points this at
 * localhost, even in local dev).
 */
export const GUIDE_DATA_FILES_BASE_URL =
  'https://bthos.github.io/gym-routine-basic-fit/';

export const GUIDE_DOWNLOADS_HEADING = {
  es: '¿LLM sin acceso web?',
  en: 'LLM without web access?',
  be: 'LLM без доступу да інтэрнэту?',
};

export const GUIDE_DOWNLOADS_BODY = {
  es: 'Descarga el archivo de datos (ZIP) y adjúntalo al chat manualmente.',
  en: 'Download the data archive (ZIP) and attach it to the chat manually.',
  be: 'Спампуйце архіў даных (ZIP) і далучыце яго да чата ўручную.',
};

export const GUIDE_DOWNLOAD_ACTION = { es: 'Descargar', en: 'Download', be: 'Спампаваць' };

/**
 * Single zip archive replacing the four per-file downloads
 * (llm-guide-zip-download). `path` must mirror where
 * scripts/copy-static-pages.js's buildDataArchive() writes the archive
 * inside dist/ (dist/data/rutina-data-files.zip → 'data/rutina-data-files.zip'
 * here, combined with GUIDE_DATA_FILES_BASE_URL above). `bytes` is
 * hand-maintained (not build-computed) — same convention as the old
 * per-file `bytes` fields; update it after running `npm run build && npm run postbuild`
 * and reading the "Wrote dist/data/rutina-data-files.zip (N bytes)" log line.
 */
export const GUIDE_DATA_ARCHIVE = {
  filename: 'rutina-data-files.zip',
  path: 'data/rutina-data-files.zip',
  bytes: 19291,
};

export const GUIDE_DOWNLOAD_ARCHIVE_LABEL = {
  es: 'Todos los archivos (ZIP)',
  en: 'All data files (ZIP)',
  be: 'Усе файлы (ZIP)',
};

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
  en: 'Also in the app’s Catalog tab.',
  be: 'Таксама на ўкладцы Catálogo ў прыкладзе.',
};

/**
 * In-app "Download data files" card (llm-guide-file-downloads).
 * Served same-origin from the deployed PWA (GitHub Pages) so the HTML
 * `download` attribute reliably forces a save dialog instead of an inline
 * browser view — see spec AC2. Always the absolute production URL, mirroring
 * GYMS_CATALOG_URL's existing convention (the guide never points these at
 * localhost, even in local dev).
 */
export const GUIDE_DATA_FILES_BASE_URL =
  'https://bthos.github.io/gym-routine-basic-fit/';

/** Canonical AC3 order — must mirror DATA_FILES in scripts/copy-static-pages.js. */
export const GUIDE_DATA_FILES = [
  { key: 'schema', filename: 'rutina.schema.json', path: 'data/schema/rutina.schema.json', bytes: 10772 },
  { key: 'equipment', filename: 'equipment.json', path: 'data/equipment.json', bytes: 111480 },
  { key: 'gyms', filename: 'gyms.json', path: 'data/gyms.json', bytes: 4955 },
  { key: 'example', filename: 'phase1-monday.json', path: 'data/examples/phase1-monday.json', bytes: 2428 },
];

export const GUIDE_DOWNLOADS_HEADING = {
  es: '¿LLM sin acceso web?',
  en: 'LLM without web access?',
  be: 'LLM без доступу да інтэрнэту?',
};

export const GUIDE_DOWNLOADS_BODY = {
  es: 'Descarga los cuatro archivos de datos y adjúntalos al chat manualmente.',
  en: 'Download the four data files and attach them to the chat manually.',
  be: 'Спампуйце чатыры файлы даных і далучыце іх да чата ўручную.',
};

export const GUIDE_DOWNLOAD_ACTION = { es: 'Descargar', en: 'Download', be: 'Спампаваць' };

export const GUIDE_DOWNLOAD_FILE_LABELS = {
  schema: { es: 'Esquema', en: 'Schema', be: 'Схема' },
  equipment: { es: 'Equipamiento', en: 'Equipment', be: 'Абсталяванне' },
  gyms: { es: 'Gimnasios', en: 'Gyms', be: 'Залы' },
  example: { es: 'Ejemplo', en: 'Example', be: 'Прыклад' },
};

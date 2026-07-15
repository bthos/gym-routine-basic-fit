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
  'https://cdn.jsdelivr.net/gh/bthos/gym-routine-basic-fit@main/gyms.html';

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

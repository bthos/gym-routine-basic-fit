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

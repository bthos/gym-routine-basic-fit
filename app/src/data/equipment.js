// Bundled at build time (same offline-embedding convention as the existing
// static-HTML pipeline — spec.md's Architecture note: "the app does not
// fetch them at runtime"). Real data: 27 items, languages en/es/be
// (data/equipment.json's own metadata.languages — spec.md's "EN/ES/RU" is a
// known typo, flagged for eliciting-requirements; the shipped UI must never
// hardcode "RU").
import equipmentData from '../../../data/equipment.json';
import gymsData from '../../../data/gyms.json';

export const EQUIPMENT = equipmentData.equipment;
export const EQUIPMENT_METADATA = equipmentData.metadata;
export const LANGUAGES = equipmentData.metadata.languages; // real data, never hardcoded — see note above
export const GYMS = gymsData.gyms;

const byId = new Map(EQUIPMENT.map((item) => [item.id, item]));

export function getEquipmentById(id) {
  return byId.get(id) ?? null;
}

/** Main image URL for a catalog/exercise card, with a documented fallback (equipment-display-html skill convention). */
export function mainImageUrl(item) {
  if (!item || !Array.isArray(item.images) || item.images.length === 0) return undefined;
  return (item.images.find((img) => img.isMain) || item.images[0]).url;
}

export function equipmentDisplayName(item, lang = 'es') {
  if (!item) return '';
  return item.names[lang] || item.names.es || item.names.en;
}

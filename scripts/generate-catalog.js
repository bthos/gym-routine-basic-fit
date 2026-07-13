#!/usr/bin/env node
/**
 * Генерацыя каталога абсталявання: убудоўвае data/equipment.json у equipment-catalog.html.
 * - Абнаўляе дату ў метаданых
 * - Замяняе плейсхолдары SEARCH_REQUIRED у спасылках на відэа рэальнымі пошукавымі запытамі
 * - Выпраўляе спасылкі на мануалы JHT: прамыя URL /manuals/{slug} не існуюць (404),
 *   выкарыстоўваецца старонка спіса + пошук (https://www.jhtsupport.com/eng/matrix/manuals)
 * - Захоўвае абноўленыя дадзеныя ў equipment.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const equipmentPath = path.join(ROOT, 'data', 'equipment.json');
const catalogPath = path.join(ROOT, 'equipment-catalog.html');

const data = JSON.parse(fs.readFileSync(equipmentPath, 'utf8'));

// Абнаўляем дату ў метаданых
data.metadata.lastUpdated = new Date().toISOString().slice(0, 10);

// Замяняем плейсхолдары ў спасылках на відэа рэальнымі пошукавымі запытамі
function fixVideoUrls(equipment) {
  for (const eq of equipment) {
    if (!eq.videos) continue;
    for (const lang of Object.keys(eq.videos)) {
      for (const video of eq.videos[lang]) {
        if (video.url && video.url.includes('SEARCH_REQUIRED') && video.note) {
          const match = video.note.match(/['"]([^'"]+)['"]/);
          const searchQuery = match ? match[1].trim() : eq.names[lang] || eq.names.en;
          video.url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
        }
      }
    }
  }
}
fixVideoUrls(data.equipment);

// Выпраўляем спасылкі на мануалы JHT: /manuals/{slug} вяртае 404.
// Працоўны URL: https://www.jhtsupport.com/eng/matrix/manuals (пошук па ключавых словах).
const JHT_MANUALS_BASE = 'https://www.jhtsupport.com/eng/matrix/manuals';
const JHT_MANUALS_PATTERN = /^https?:\/\/(www\.)?jhtsupport\.com\/eng\/matrix\/manuals\/[^/]+/i;

function fixManualUrls(equipment) {
  for (const eq of equipment) {
    if (!eq.manuals) continue;
    for (const m of eq.manuals) {
      if (!m.url || !JHT_MANUALS_PATTERN.test(m.url)) continue;
      m.url = JHT_MANUALS_BASE;
      m.searchTerm = eq.modelCode || eq.id || '';
    }
  }
}
fixManualUrls(data.equipment);

// Чытаем шаблон HTML
let html = fs.readFileSync(catalogPath, 'utf8');

const dataStr = JSON.stringify(data, null, 2);
const dataPattern = /(\/\/ Убудаваныя дадзеныя\s+const embeddedData = )\{[\s\S]*?\};/;

if (dataPattern.test(html)) {
  html = html.replace(dataPattern, `$1${dataStr};`);
  console.log('✅ Дадзеныя абноўлены');
} else {
  console.error('❌ Не ўдалося знайсці секцыю з убудаванымі дадзенымі');
  process.exit(1);
}

// Правяраем, што ўсе неабходныя функцыі прысутнічаюць
const requiredFunctions = ['renderMetadata', 'renderEquipmentCard', 'renderEquipment', 'setGlobalLanguage', 'init'];
const missingFunctions = requiredFunctions.filter(func => !html.includes(`function ${func}`));

if (missingFunctions.length > 0) {
  console.warn(`⚠️  Папярэджанне: адсутнічаюць функцыі: ${missingFunctions.join(', ')}`);
}

// Захоўваем абноўлены HTML
fs.writeFileSync(catalogPath, html);

// Захоўваем абноўленую дату і URL відэа ў зыходным JSON
fs.writeFileSync(equipmentPath, JSON.stringify(data, null, 2), 'utf8');

console.log('✅ HTML файл абноўлены з убудаванымі дадзенымі!');
console.log(`📅 Дата абнаўлення: ${data.metadata.lastUpdated}`);
console.log(`📊 Апрацавана ${data.equipment.length} трэнажораў`);

#!/usr/bin/env node
/**
 * Embeds equipment and user-weights data into rutina.html for offline use.
 * Run: node scripts/build-rutina.js
 * Then open rutina.html directly (file://) - no server needed.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const equipmentPath = path.join(ROOT, 'data', 'equipment.json');
const weightsPath = path.join(ROOT, 'data', 'user-weights.json');
const rutinaPath = path.join(ROOT, 'rutina.html');

const equipment = JSON.parse(fs.readFileSync(equipmentPath, 'utf8'));
const weights = JSON.parse(fs.readFileSync(weightsPath, 'utf8'));

// Minimal equipment data for display (id, names, modelCode, gymZone, gyms)
const equipmentList = equipment.equipment.map(e => ({
  id: e.id,
  names: e.names,
  modelCode: e.modelCode,
  gymZone: e.gymZone,
  gyms: e.gyms
}));

const embeddedData = {
  equipment: equipmentList,
  weights: weights.weights || {}
};

const dataScript = `<script>
window.__RUTINA_DATA__ = ${JSON.stringify(embeddedData)};
</script>
`;

let html = fs.readFileSync(rutinaPath, 'utf8');

// Replace fetch-based loading with embedded data + fallback
const oldFetch = `        // Load equipment and user weights, display for selected gym
        const GYM_ID = 3; // Avda. Andalucía, Centro Comercial Alameda
        Promise.all([
            fetch('data/equipment.json').then(r => r.json()),
            fetch('data/user-weights.json').then(r => r.json())
        ]).then(([equipmentData, weightsData]) => {
            const container = document.getElementById('equipment-list');
            const weights = weightsData.weights || {};
            const inGym = equipmentData.equipment.filter(eq => eq.gyms && eq.gyms.includes(GYM_ID));

            const pesosLibres = inGym.filter(e => e.gymZone === 'pesos-libres');
            const strength = inGym.filter(e => e.gymZone === 'strength');

            let html = '';
            [pesosLibres, strength].forEach((group, i) => {
                const title = i === 0 ? 'Sala de pesos libres' : 'Sala de strength';
                if (group.length === 0) return;
                html += \`<div class="equipment-category"><h4>\${title}</h4>\`;
                group.forEach(item => {
                    const w = weights[item.id];
                    const weight = w != null ? \`<span class="weight-badge">\${w} kg</span>\` : '<span class="weight-empty">—</span>';
                    const model = item.modelCode ? \` (\${item.modelCode})\` : '';
                    html += \`<div class="equipment-item"><span>\${item.names.es || item.names.en}\${model}</span>\${weight}</div>\`;
                });
                html += '</div>';
            });

            container.innerHTML = html || '<p>No hay datos de equipamiento.</p>';
        }).catch(err => {
            document.getElementById('equipment-list').innerHTML = '<p style="color: #e53e3e;">Error al cargar datos. Verifica data/equipment.json y data/user-weights.json.</p>';
        });`;

const newFetch = `        // Load equipment and user weights (embedded for offline, or fetch when served)
        const GYM_ID = 3; // Avda. Andalucía, Centro Comercial Alameda
        function renderEquipmentList(equipmentData, weightsData) {
            const container = document.getElementById('equipment-list');
            const weights = (weightsData && weightsData.weights) || weightsData || {};
            const eqList = Array.isArray(equipmentData) ? equipmentData : (equipmentData.equipment || []);
            const inGym = eqList.filter(eq => eq.gyms && eq.gyms.includes(GYM_ID));

            const pesosLibres = inGym.filter(e => e.gymZone === 'pesos-libres');
            const strength = inGym.filter(e => e.gymZone === 'strength');

            let html = '';
            [pesosLibres, strength].forEach((group, i) => {
                const title = i === 0 ? 'Sala de pesos libres' : 'Sala de strength';
                if (group.length === 0) return;
                html += '<div class="equipment-category"><h4>' + title + '</h4>';
                group.forEach(item => {
                    const w = weights[item.id];
                    const weight = w != null ? '<span class="weight-badge">' + w + ' kg</span>' : '<span class="weight-empty">—</span>';
                    const model = item.modelCode ? ' (' + item.modelCode + ')' : '';
                    html += '<div class="equipment-item"><span>' + (item.names.es || item.names.en) + model + '</span>' + weight + '</div>';
                });
                html += '</div>';
            });

            container.innerHTML = html || '<p>No hay datos de equipamiento.</p>';
        }
        if (window.__RUTINA_DATA__) {
            renderEquipmentList(window.__RUTINA_DATA__.equipment, window.__RUTINA_DATA__.weights);
        } else {
            Promise.all([
                fetch('data/equipment.json').then(r => r.json()),
                fetch('data/user-weights.json').then(r => r.json())
            ]).then(([equipmentData, weightsData]) => {
                renderEquipmentList(equipmentData.equipment, weightsData);
            }).catch(function(err) {
                document.getElementById('equipment-list').innerHTML = '<p style="color: #e53e3e;">Error al cargar. Ejecuta <code>npm run build-rutina</code> para uso offline, o <code>npm run serve</code> para abrir con servidor.</p>';
            });
        }`;

html = html.replace(oldFetch, newFetch);

// Replace existing __RUTINA_DATA__ script or add after <body>
const dataBlockRegex = /<script>\s*window\.__RUTINA_DATA__\s*=\s*[\s\S]*?;\s*<\/script>/;
const placeholderRegex = /<script>\s*window\.__RUTINA_DATA_PLACEHOLDER__\s*=\s*[\s\S]*?;\s*<\/script>/;
if (dataBlockRegex.test(html)) {
  html = html.replace(dataBlockRegex, dataScript.trim());
} else if (placeholderRegex.test(html)) {
  html = html.replace(placeholderRegex, dataScript.trim());
} else {
  html = html.replace('<body>', '<body>\n    ' + dataScript.trim());
}

fs.writeFileSync(rutinaPath, html);
console.log('✓ rutina.html actualizado con datos embebidos. Abre el archivo directamente.');

import React, { useState } from 'react';
import { PageHeader } from '../../../design-system/components/sections/PageHeader.jsx';
import { FilterPill } from '../../../design-system/components/primitives/FilterPill.jsx';
import { StatCard } from '../../../design-system/components/primitives/StatCard.jsx';
import { EquipmentCard } from '../../../design-system/components/composite/EquipmentCard.jsx';
import { EQUIPMENT, EQUIPMENT_METADATA, LANGUAGES, GYMS, mainImageUrl, equipmentDisplayName } from '../data/equipment.js';
import { muscleGroupLabels } from '../lib/muscleGroups.js';

// Fixed 6-category vocabulary (validate-data.js's own validCategories list)
// — data doesn't carry a display label, so this small map is UI-chrome text,
// not equipment data. "all" is the catalog-only "no filter" pseudo-category.
const CATEGORY_LABELS = {
  all: 'Todas',
  chest: 'Pecho',
  back: 'Espalda',
  shoulders: 'Hombros',
  arms: 'Brazos',
  core: 'Core',
  legs: 'Piernas',
};
const CATEGORIES = ['all', ...new Set(EQUIPMENT.map((e) => e.category))];

/**
 * Direct reuse of the mockup's CatalogScreen.jsx structure (ux-design.md:
 * "no new design here"), with its data source swapped from kit-data.js's
 * 6-item invented shape to the real bundled data/equipment.json (27 items) —
 * tech-plan.md's Porting Plan, following the equipment-display-html skill's
 * conventions for card structure / image fallback / bilingual display.
 */
export function CatalogScreen() {
  const [lang, setLang] = useState(LANGUAGES.includes('es') ? 'es' : LANGUAGES[0]);
  const [category, setCategory] = useState('all');

  const items = EQUIPMENT.filter((e) => category === 'all' || e.category === category);
  const wrap = { maxWidth: 900, margin: '0 auto', padding: '0 var(--page-gutter)' };

  return (
    <div style={{ background: 'var(--bf-grey-1)', minHeight: '100vh', paddingBottom: 90 }}>
      <PageHeader title="Catálogo de equipamiento" subtitle="Máquinas Matrix Aura en tus gimnasios Basic-Fit de Málaga" />

      <div style={{ ...wrap, marginTop: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <StatCard value={String(EQUIPMENT_METADATA.totalEquipment ?? EQUIPMENT.length)} label="máquinas" />
          <StatCard value={String(GYMS.length)} label="gimnasios" />
          <StatCard value={String(LANGUAGES.length)} label="idiomas" />
        </div>
      </div>

      <div style={{ ...wrap, marginTop: 'var(--space-6)', display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ font: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Idioma</span>
          {LANGUAGES.map((l) => (
            <FilterPill key={l} active={lang === l} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </FilterPill>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ font: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Categoría</span>
          {CATEGORIES.map((c) => (
            <FilterPill key={c} active={category === c} onClick={() => setCategory(c)}>
              {CATEGORY_LABELS[c] || c}
            </FilterPill>
          ))}
        </div>
      </div>

      <div
        style={{
          ...wrap,
          marginTop: 'var(--space-5)',
          paddingBottom: 'var(--space-10)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
          alignItems: 'start',
        }}
      >
        {items.map((item) => (
          <EquipmentCard
            key={item.id}
            name={equipmentDisplayName(item, lang)}
            modelCode={item.modelCode}
            series={item.series}
            imageUrl={mainImageUrl(item)}
            primaryMuscles={muscleGroupLabels(item.muscleGroup.primary)}
            secondaryMuscles={muscleGroupLabels(item.muscleGroup.secondary)}
            description={item.descriptions[lang] || item.descriptions.es}
            videoHref={(item.videos[lang] || item.videos.es || [])[0]?.url}
            manualHref={item.manuals?.[0]?.url}
          />
        ))}
        {items.length === 0 && (
          <div style={{ gridColumn: '1 / -1', background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Sin resultados</div>
        )}
      </div>
    </div>
  );
}

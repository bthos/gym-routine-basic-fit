/**
 * Muscle-group slug -> Spanish display label. Covers every slug used across
 * data/equipment.json's muscleGroup.primary/secondary (verified via the
 * shipped 27-item dataset) — the same vocabulary rutina.schema.json's
 * exercises[].muscleGroups is authored in, so one map serves both the
 * per-exercise Tag labels (ExerciseCard) and the day "focus" summary
 * (ProgramScreen's derived SummaryTable, tech-plan.md's explicit
 * requirement: never read a focus string from an authored field).
 */
const LABELS = {
  'anterior-deltoid': 'Deltoides anterior',
  biceps: 'Bíceps',
  brachialis: 'Braquial',
  calves: 'Gemelos',
  core: 'Core',
  'erector-spinae': 'Erectores espinales',
  forearms: 'Antebrazos',
  glutes: 'Glúteos',
  'gluteus-medius': 'Glúteo medio',
  hamstrings: 'Isquiotibiales',
  'hip-adductors': 'Aductores',
  'inner-thigh': 'Cara interna del muslo',
  'latissimus-dorsi': 'Dorsal ancho',
  'medial-deltoid': 'Deltoides medio',
  'middle-trapezius': 'Trapecio medio',
  obliques: 'Oblicuos',
  'pectoralis-major': 'Pectoral mayor',
  quadriceps: 'Cuádriceps',
  'rear-deltoid': 'Deltoides posterior',
  'rectus-abdominis': 'Recto abdominal',
  rhomboids: 'Romboides',
  'tensor-fasciae-latae': 'Tensor de la fascia lata',
  triceps: 'Tríceps',
  'upper-chest': 'Pecho superior',
};

export function muscleGroupLabel(slug) {
  return LABELS[slug] || slug;
}

export function muscleGroupLabels(slugs = []) {
  return slugs.map(muscleGroupLabel);
}

/** Unique labels across every exercise in a day, first-seen order, capped at `limit` — the day-summary "focus" string. */
export function dayFocusLabels(exercises = [], limit = 4) {
  const seen = new Set();
  const labels = [];
  for (const ex of exercises) {
    for (const slug of ex.muscleGroups || []) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      labels.push(muscleGroupLabel(slug));
      if (labels.length >= limit) return labels;
    }
  }
  return labels;
}

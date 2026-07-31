/**
 * Onboarding carousel copy (onboarding-screens feature).
 *
 * Spanish-only, no locale keys (spec AC8) — unlike guideLocale.js's
 * es/en/be pattern, which feeds the separate LLM-facing guide document
 * pipeline. Copy lifted verbatim from mockups.md (UAT-approved 2026-07-29).
 *
 * Shape: 4 plain objects, {icon, title, body} for steps 1/2/4, and
 * {icon, title, steps, outcomes, footnote} for step 3 (index 2) — the
 * relocated "How it works" flow from GuideOverlay's former "Cómo funciona"
 * section (spec AC4).
 */
export const ONBOARDING_STEPS = [
  {
    icon: 'dumbbell',
    title: 'Tu entrenador sin cuentas ni conexión',
    body: 'Guarda tu rutina y tu historial en este dispositivo. Sin cuenta, sin clave API.',
  },
  {
    icon: 'message-square',
    title: 'Tú creas el plan con un LLM',
    body: 'Rutina no genera tu programa — tú lo creas con un chat LLM (ChatGPT, Claude, Gemini…) y lo importas aquí.',
  },
  {
    icon: 'list-checks',
    title: 'Así funciona',
    steps: [
      'Rellena el prompt',
      'Cópialo en un chat LLM',
      'Copia la respuesta JSON',
      'Impórtala en la app',
    ],
    outcomes: [
      '✓ pasa → listo',
      '✗ falla → corrige y vuelve a intentar',
    ],
    footnote: '(Verás el prompt completo en la guía de creación, con el paso a paso detallado.)',
  },
  {
    icon: 'check-circle',
    title: 'Ya puedes empezar',
    body: 'Puedes volver a ver esto cuando quieras desde la pantalla de importar.',
  },
];

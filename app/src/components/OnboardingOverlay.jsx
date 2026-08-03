import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../design-system/components/primitives/Icon.jsx';
import { Button } from '../../../design-system/components/primitives/Button.jsx';
import { ONBOARDING_STEPS } from '../lib/onboardingContent.js';
import { markOnboardingSeen } from '../lib/onboardingStorage.js';

const TOTAL_STEPS = ONBOARDING_STEPS.length;

/** Decorative-only step position (dots) — aria-hidden, real progress is the sr-only text below. */
function DotIndicator({ total, current }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: i === current ? 'var(--bf-purple)' : 'transparent',
            border: `1px solid ${i === current ? 'var(--bf-purple)' : 'var(--border-control)'}`,
            boxSizing: 'border-box',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Full-screen onboarding carousel (spec AC1, AC2, AC3, AC4), shown once on
 * first app open and reachable afterward on demand (AC7). Same
 * role="dialog" aria-modal="true" + Escape-to-close chrome pattern as
 * GuideOverlay.jsx (ux-design.md — reused verbatim, no new DS primitive).
 *
 * Owns "mark seen" internally (tech-plan.md Decision 5): both Shell
 * (first-run) and ImportScreen (on-demand revisit) pass only `onClose`.
 *
 * Props:
 *   onClose: () => void
 */
export function OnboardingOverlay({ onClose }) {
  const [step, setStep] = useState(0);
  const headingRef = useRef(null);
  const current = ONBOARDING_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TOTAL_STEPS - 1;

  function exit() {
    markOnboardingSeen();
    onClose && onClose();
  }

  function handleNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // Focus the current step's heading on mount and on every step change, so
  // screen-reader users get the new step announced (ux-design.md a11y
  // checklist — mirrors GuideOverlay's closeRef.current?.focus() on mount).
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') exit();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        background: 'var(--bf-white)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="sr-only"
        aria-live="polite"
      >
        {`Paso ${step + 1} de ${TOTAL_STEPS}`}
      </div>

      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-4) var(--page-pad-x)',
        }}
      >
        <DotIndicator total={TOTAL_STEPS} current={step} />
        <button
          type="button"
          onClick={exit}
          style={{
            font: '600 14px/1 var(--font-sans)',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            padding: '6px 4px',
            cursor: 'pointer',
          }}
        >
          Saltar
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6) var(--page-pad-x)',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--bf-purple)', marginBottom: 'var(--space-4)' }}>
            <Icon name={current.icon} size={40} strokeWidth={1.6} />
          </div>

          <h1
            id="onboarding-title"
            ref={headingRef}
            tabIndex={-1}
            style={{
              font: 'var(--text-h2)',
              color: 'var(--bf-ink)',
              margin: '0 0 var(--space-4)',
              outline: 'none',
            }}
          >
            {current.title}
          </h1>

          {current.body && (
            <p
              style={{
                font: 'var(--text-body-sm)',
                color: 'var(--bf-ink-2)',
                margin: '0 auto',
                maxWidth: 320,
              }}
            >
              {current.body}
            </p>
          )}

          {current.steps && (
            <div style={{ textAlign: 'left', margin: '0 auto' }}>
              <ol
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'grid',
                  gap: 10,
                }}
              >
                {current.steps.map((line, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      font: 'var(--text-body-sm)',
                      color: 'var(--bf-ink)',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: 'var(--bf-purple)' }}>{i + 1}</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>

              {current.outcomes && (
                <div
                  style={{
                    marginTop: 'var(--space-4)',
                    display: 'grid',
                    gap: 4,
                    font: 'var(--text-body-sm)',
                    color: 'var(--bf-ink-2)',
                  }}
                >
                  {current.outcomes.map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </div>
              )}

              {current.footnote && (
                <p
                  style={{
                    font: 'var(--text-caption)',
                    color: 'var(--text-muted)',
                    marginTop: 'var(--space-4)',
                  }}
                >
                  {current.footnote}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          padding: 'var(--space-4) var(--page-pad-x)',
        }}
      >
        {!isFirst && (
          <Button variant="outline" onClick={handleBack}>
            Atrás
          </Button>
        )}
        <Button variant="primary" onClick={isLast ? exit : handleNext} style={isFirst ? { marginLeft: 'auto' } : undefined}>
          {isLast ? 'Empezar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
}

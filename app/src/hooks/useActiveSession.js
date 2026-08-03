import { useCallback, useEffect, useState } from 'react';
import { getActiveSession } from '../lib/db.js';

/**
 * Single source of truth for "is there a session in progress right now"
 * (spec.md AC15). Mounted ONCE in the shell (tech-plan.md Decision 3) —
 * Inicio and `SessionInProgressBanner` both read it via props, and
 * `ActiveSessionScreen` calls `refresh()` after FINISH / ABANDON / discard,
 * so the two consumers can never drift out of agreement or need a manual
 * reload to clear.
 *
 * `status: 'loading'` is what makes AC10 structural rather than a render
 * guard: HomeScreen cannot paint a start CTA before the read resolves.
 * `status: 'error'` is distinct from `'ready' + session:null` — the first
 * means "unknown" (Inicio surfaces a retry, the banner fail-closes to
 * hidden), the second means "definitely none".
 *
 * @returns {{ status: 'loading'|'ready'|'error', session: object|null, refresh: () => Promise<void> }}
 */
export function useActiveSession() {
  const [status, setStatus] = useState('loading');
  const [session, setSession] = useState(null);

  const load = useCallback(() => {
    return getActiveSession()
      .then((s) => {
        setSession(s);
        setStatus('ready');
      })
      .catch(() => {
        setSession(null);
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { status, session, refresh: load };
}

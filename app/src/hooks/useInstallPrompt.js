import { useCallback, useEffect, useState } from 'react';

/** True when the app is already running as an installed PWA (standalone). */
export function isAppInstalled() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
  );
}

/**
 * Captures the Chromium `beforeinstallprompt` event (spec.md Render AC:
 * "beforeinstallprompt handled") so the UI can offer a deliberate install
 * action instead of relying on the browser chrome menu alone.
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isAppInstalled()) return undefined;

    const onBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === 'accepted') setDismissed(true);
    return outcome === 'accepted';
  }, [deferredPrompt]);

  const dismiss = useCallback(() => setDismissed(true), []);

  return {
    canInstall: Boolean(deferredPrompt) && !dismissed && !isAppInstalled(),
    promptInstall,
    dismiss,
  };
}

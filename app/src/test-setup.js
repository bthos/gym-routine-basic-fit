import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

// jsdom doesn't implement window.matchMedia. Previously unexercised because
// no test rendered <App/> (which mounts InstallBanner -> useInstallPrompt's
// isAppInstalled(), a pre-existing call unrelated to onboarding-screens) —
// surfaced by App.test.jsx (onboarding-screens feature). Standard jsdom
// polyfill, global so any future component/hook depending on matchMedia
// doesn't hit the same crash.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function matchMedia(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated, kept for older API consumers
      removeListener: () => {}, // deprecated, kept for older API consumers
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
}

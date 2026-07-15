import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { isAppInstalled, useInstallPrompt } from './useInstallPrompt.js';

describe('useInstallPrompt', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
    Object.defineProperty(window.navigator, 'standalone', { value: false, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('isAppInstalled returns false in a normal browser tab', () => {
    expect(isAppInstalled()).toBe(false);
  });

  it('captures beforeinstallprompt and calls prompt() on install', async () => {
    const prompt = vi.fn().mockResolvedValue(undefined);
    const userChoice = Promise.resolve({ outcome: 'accepted' });

    const { result } = renderHook(() => useInstallPrompt());

    await act(async () => {
      const event = new Event('beforeinstallprompt');
      event.preventDefault = vi.fn();
      Object.defineProperty(event, 'prompt', { value: prompt });
      Object.defineProperty(event, 'userChoice', { value: userChoice });
      window.dispatchEvent(event);
    });

    expect(result.current.canInstall).toBe(true);

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(prompt).toHaveBeenCalledOnce();
    expect(result.current.canInstall).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════
   Tests — Accessibility Store (Zustand)
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach } from 'vitest';
import { useAccessibilityStore } from './accessibility-store';

describe('accessibility-store', () => {
  beforeEach(() => {
    useAccessibilityStore.setState({
      fontSize: 'normal',
      highContrast: false,
      reducedMotion: false,
      screenReaderMode: false,
      voiceControl: false,
      userType: 'general',
      captions: [],
    });
  });

  it('has correct default state', () => {
    const state = useAccessibilityStore.getState();
    expect(state.fontSize).toBe('normal');
    expect(state.highContrast).toBe(false);
    expect(state.reducedMotion).toBe(false);
    expect(state.screenReaderMode).toBe(false);
    expect(state.voiceControl).toBe(false);
    expect(state.userType).toBe('general');
    expect(state.captions).toEqual([]);
  });

  it('setFontSize updates font size', () => {
    useAccessibilityStore.getState().setFontSize('large');
    expect(useAccessibilityStore.getState().fontSize).toBe('large');
    useAccessibilityStore.getState().setFontSize('extra-large');
    expect(useAccessibilityStore.getState().fontSize).toBe('extra-large');
  });

  it('setHighContrast toggles high contrast', () => {
    useAccessibilityStore.getState().setHighContrast(true);
    expect(useAccessibilityStore.getState().highContrast).toBe(true);
  });

  it('setReducedMotion toggles reduced motion', () => {
    useAccessibilityStore.getState().setReducedMotion(true);
    expect(useAccessibilityStore.getState().reducedMotion).toBe(true);
  });

  it('setScreenReaderMode toggles screen reader mode', () => {
    useAccessibilityStore.getState().setScreenReaderMode(true);
    expect(useAccessibilityStore.getState().screenReaderMode).toBe(true);
  });

  it('setVoiceControl toggles voice control', () => {
    useAccessibilityStore.getState().setVoiceControl(true);
    expect(useAccessibilityStore.getState().voiceControl).toBe(true);
  });

  it('setUserType updates user type', () => {
    useAccessibilityStore.getState().setUserType('visual');
    expect(useAccessibilityStore.getState().userType).toBe('visual');
    useAccessibilityStore.getState().setUserType('mobility');
    expect(useAccessibilityStore.getState().userType).toBe('mobility');
  });

  it('addCaption appends a new caption', () => {
    useAccessibilityStore.getState().addCaption('Goal scored!');
    const state = useAccessibilityStore.getState();
    expect(state.captions).toHaveLength(1);
    expect(state.captions[0]).toBe('Goal scored!');
  });

  it('addCaption caps at 50 captions', () => {
    const store = useAccessibilityStore.getState();
    for (let i = 0; i < 55; i++) {
      store.addCaption(`Caption ${i}`);
    }
    const state = useAccessibilityStore.getState();
    expect(state.captions.length).toBeLessThanOrEqual(50);
  });

  it('addCaption keeps the most recent captions', () => {
    const store = useAccessibilityStore.getState();
    for (let i = 0; i < 55; i++) {
      store.addCaption(`Caption ${i}`);
    }
    const state = useAccessibilityStore.getState();
    // The last caption should be the most recent one
    expect(state.captions[state.captions.length - 1]).toBe('Caption 54');
  });
});

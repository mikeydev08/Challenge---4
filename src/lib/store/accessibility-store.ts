/* ═══════════════════════════════════════════════════════
   StadiumMind AI — Accessibility Store (Zustand)
   ═══════════════════════════════════════════════════════ */

import { create } from 'zustand';

interface AccessibilityState {
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  voiceControl: boolean;
  userType: 'visual' | 'hearing' | 'mobility' | 'elderly' | 'general';
  captions: string[];

  setFontSize: (size: AccessibilityState['fontSize']) => void;
  setHighContrast: (on: boolean) => void;
  setReducedMotion: (on: boolean) => void;
  setScreenReaderMode: (on: boolean) => void;
  setVoiceControl: (on: boolean) => void;
  setUserType: (type: AccessibilityState['userType']) => void;
  addCaption: (caption: string) => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  screenReaderMode: false,
  voiceControl: false,
  userType: 'general',
  captions: [],

  setFontSize: (fontSize) => set({ fontSize }),
  setHighContrast: (highContrast) => set({ highContrast }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setScreenReaderMode: (screenReaderMode) => set({ screenReaderMode }),
  setVoiceControl: (voiceControl) => set({ voiceControl }),
  setUserType: (userType) => set({ userType }),
  addCaption: (caption) =>
    set((state) => ({ captions: [...state.captions, caption].slice(-50) })),
}));

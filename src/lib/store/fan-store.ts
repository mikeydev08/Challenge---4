/* ═══════════════════════════════════════════════════════
   StadiumMind AI — Fan Store (Zustand)
   Fan profile and chat history.
   ═══════════════════════════════════════════════════════ */

import { create } from 'zustand';
import type { FanProfile } from '@/lib/simulation/types';
import type { FanCompanionMessage } from '@/lib/ai/types';

interface FanState {
  profile: FanProfile;
  messages: FanCompanionMessage[];
  isTyping: boolean;

  setProfile: (updates: Partial<FanProfile>) => void;
  addMessage: (message: FanCompanionMessage) => void;
  setIsTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

const defaultProfile: FanProfile = {
  name: 'Alex Rivera',
  ticketId: 'WC2026-BRA-GER-A7842',
  seatSection: 'North Stand',
  seatRow: 'F',
  seatNumber: '24',
  preferredLanguage: 'English',
  dietaryPreferences: ['Vegetarian'],
  mobilityLimitations: [],
  favoriteTeam: 'Brazil',
  currentZone: 'Concourse A',
};

export const useFanStore = create<FanState>((set) => ({
  profile: defaultProfile,
  messages: [
    {
      role: 'assistant',
      content: `Welcome to the FIFA World Cup 2026! 🏟️⚽\n\nI'm your personal AI companion. I can help you with:\n\n🧭 **Navigation** — Find your seat, food, washrooms\n🍔 **Food** — Personalized recommendations\n⏱️ **Wait Times** — Queue predictions\n🚪 **Exit Planning** — Beat the crowd\n📊 **Match Updates** — Live scores & commentary\n\nHow can I help you today?`,
      timestamp: new Date().toISOString(),
    },
  ],
  isTyping: false,

  setProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setIsTyping: (isTyping) => set({ isTyping }),

  clearMessages: () =>
    set({
      messages: [
        {
          role: 'assistant',
          content: 'Chat cleared. How can I help you?',
          timestamp: new Date().toISOString(),
        },
      ],
    }),
}));

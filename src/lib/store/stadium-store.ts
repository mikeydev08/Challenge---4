/* ═══════════════════════════════════════════════════════
   StadiumMind AI — Stadium Store (Zustand)
   Global state for real-time stadium data.
   ═══════════════════════════════════════════════════════ */

import { create } from 'zustand';
import type { StadiumData } from '@/lib/simulation/types';
import type { AIInsight } from '@/lib/ai/types';

interface StadiumState {
  /** Latest snapshot from the simulation SSE stream */
  data: StadiumData | null;
  /** Whether the SSE stream is connected */
  connected: boolean;
  /** AI-generated operational insights */
  insights: (AIInsight & { id: string; status: string; timestamp: string })[];
  /** Last time data was received */
  lastUpdate: string | null;

  /* Actions */
  setData: (data: StadiumData) => void;
  setConnected: (connected: boolean) => void;
  addInsights: (insights: AIInsight[]) => void;
  updateInsightStatus: (id: string, status: string) => void;
}

export const useStadiumStore = create<StadiumState>((set) => ({
  data: null,
  connected: false,
  insights: [],
  lastUpdate: null,

  setData: (data) =>
    set({ data, lastUpdate: new Date().toISOString() }),

  setConnected: (connected) => set({ connected }),

  addInsights: (newInsights) =>
    set((state) => ({
      insights: [
        ...newInsights.map((insight, i) => ({
          ...insight,
          id: `insight-${Date.now()}-${i}`,
          status: 'pending',
          timestamp: new Date().toISOString(),
        })),
        ...state.insights,
      ].slice(0, 30), // Keep last 30
    })),

  updateInsightStatus: (id, status) =>
    set((state) => ({
      insights: state.insights.map((insight) =>
        insight.id === id ? { ...insight, status } : insight
      ),
    })),
}));

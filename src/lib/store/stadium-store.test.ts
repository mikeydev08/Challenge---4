/* ═══════════════════════════════════════════════════════
   Tests — Stadium Store (Zustand)
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach } from 'vitest';
import { useStadiumStore } from './stadium-store';
import type { StadiumData } from '@/lib/simulation/types';

describe('stadium-store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useStadiumStore.setState({
      data: null,
      connected: false,
      insights: [],
      lastUpdate: null,
    });
  });

  it('has correct initial state', () => {
    const state = useStadiumStore.getState();
    expect(state.data).toBeNull();
    expect(state.connected).toBe(false);
    expect(state.insights).toEqual([]);
    expect(state.lastUpdate).toBeNull();
  });

  it('setData updates data and lastUpdate', () => {
    const mockData = { timestamp: '2026-07-17T00:00:00Z' } as StadiumData;
    useStadiumStore.getState().setData(mockData);
    const state = useStadiumStore.getState();
    expect(state.data).toBe(mockData);
    expect(state.lastUpdate).toBeTruthy();
  });

  it('setConnected toggles connection status', () => {
    useStadiumStore.getState().setConnected(true);
    expect(useStadiumStore.getState().connected).toBe(true);
    useStadiumStore.getState().setConnected(false);
    expect(useStadiumStore.getState().connected).toBe(false);
  });

  it('addInsights prepends new insights', () => {
    const insight = {
      priority: 'warning' as const,
      title: 'Test Insight',
      description: 'Description',
      reasoning: 'Reasoning',
      suggestedAction: 'Action',
      affectedZones: ['Zone A'],
    };
    useStadiumStore.getState().addInsights([insight]);
    const state = useStadiumStore.getState();
    expect(state.insights).toHaveLength(1);
    expect(state.insights[0].title).toBe('Test Insight');
    expect(state.insights[0].status).toBe('pending');
    expect(state.insights[0].id).toBeTruthy();
    expect(state.insights[0].timestamp).toBeTruthy();
  });

  it('addInsights caps at 30 insights', () => {
    const insights = Array.from({ length: 35 }, (_, i) => ({
      priority: 'info' as const,
      title: `Insight ${i}`,
      description: 'D',
      reasoning: 'R',
      suggestedAction: 'A',
      affectedZones: [],
    }));
    useStadiumStore.getState().addInsights(insights);
    expect(useStadiumStore.getState().insights.length).toBeLessThanOrEqual(30);
  });

  it('updateInsightStatus updates the correct insight', () => {
    const insight = {
      priority: 'warning' as const,
      title: 'Test',
      description: 'D',
      reasoning: 'R',
      suggestedAction: 'A',
      affectedZones: [],
    };
    useStadiumStore.getState().addInsights([insight]);
    const id = useStadiumStore.getState().insights[0].id;

    useStadiumStore.getState().updateInsightStatus(id, 'approved');
    expect(useStadiumStore.getState().insights[0].status).toBe('approved');
  });

  it('updateInsightStatus does not affect other insights', () => {
    const insights = [
      {
        priority: 'warning' as const,
        title: 'A',
        description: 'D',
        reasoning: 'R',
        suggestedAction: 'A',
        affectedZones: [],
      },
      {
        priority: 'info' as const,
        title: 'B',
        description: 'D',
        reasoning: 'R',
        suggestedAction: 'A',
        affectedZones: [],
      },
    ];
    useStadiumStore.getState().addInsights(insights);
    const firstId = useStadiumStore.getState().insights[0].id;

    useStadiumStore.getState().updateInsightStatus(firstId, 'rejected');
    const state = useStadiumStore.getState();
    expect(state.insights[0].status).toBe('rejected');
    expect(state.insights[1].status).toBe('pending');
  });
});

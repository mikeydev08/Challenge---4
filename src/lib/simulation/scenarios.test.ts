/* ═══════════════════════════════════════════════════════
   Tests — Scenarios
   Validates the pre-built simulation scenarios.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from 'vitest';
import { SCENARIOS } from './scenarios';
import type { Scenario } from './scenarios';

describe('scenarios', () => {
  it('has at least 5 pre-built scenarios', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(5);
  });

  it('all scenario IDs are unique', () => {
    const ids = SCENARIOS.map((s: Scenario) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every scenario has required fields', () => {
    for (const scenario of SCENARIOS) {
      expect(scenario.id).toBeTruthy();
      expect(scenario.name).toBeTruthy();
      expect(scenario.description).toBeTruthy();
      expect(scenario.icon).toBeTruthy();
      expect(scenario.overrides).toBeDefined();
      expect(typeof scenario.overrides).toBe('object');
    }
  });

  it('every scenario has at least one override', () => {
    for (const scenario of SCENARIOS) {
      expect(Object.keys(scenario.overrides).length).toBeGreaterThan(0);
    }
  });

  it('known scenario IDs exist', () => {
    const ids = SCENARIOS.map((s) => s.id);
    expect(ids).toContain('pre-match-rush');
    expect(ids).toContain('half-time-surge');
    expect(ids).toContain('post-match-exodus');
    expect(ids).toContain('emergency-drill');
    expect(ids).toContain('peak-capacity');
    expect(ids).toContain('heat-wave');
  });
});

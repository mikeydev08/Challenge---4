/* ═══════════════════════════════════════════════════════
   Tests — Tournament Schedule
   Validates schedule data, context generation, and helpers.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from 'vitest';
import {
  getTournamentContext,
  getMatchesByRound,
  getMatchById,
  SCHEDULE,
  VENUES,
} from './schedule';

describe('schedule', () => {
  /* ── SCHEDULE data integrity ── */

  it('SCHEDULE contains at least 30 matches', () => {
    expect(SCHEDULE.length).toBeGreaterThanOrEqual(30);
  });

  it('every match has required fields', () => {
    for (const match of SCHEDULE) {
      expect(match.id).toBeTruthy();
      expect(match.round).toBeTruthy();
      expect(match.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(match.kickoff).toMatch(/^\d{2}:\d{2}$/);
      expect(match.teamA).toBeTruthy();
      expect(match.teamB).toBeTruthy();
      expect(match.venue).toBeTruthy();
      expect(match.city).toBeTruthy();
      expect(match.capacity).toBeGreaterThan(0);
    }
  });

  it('all match IDs are unique', () => {
    const ids = SCHEDULE.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('VENUES object contains at least 10 venues', () => {
    expect(Object.keys(VENUES).length).toBeGreaterThanOrEqual(10);
  });

  it('each venue has required properties', () => {
    for (const venue of Object.values(VENUES)) {
      expect(venue.name).toBeTruthy();
      expect(venue.city).toBeTruthy();
      expect(venue.capacity).toBeGreaterThan(0);
      expect(venue.timezone).toBeTruthy();
    }
  });

  /* ── getTournamentContext ── */

  it('returns a valid tournament context', () => {
    const ctx = getTournamentContext();
    expect(ctx.currentPhase).toBeTruthy();
    expect(ctx.venue).toBeDefined();
    expect(ctx.venue.name).toBeTruthy();
    expect(ctx.venue.capacity).toBeGreaterThan(0);
    expect(typeof ctx.tournamentDay).toBe('number');
    expect(typeof ctx.matchesPlayed).toBe('number');
    expect(typeof ctx.matchesRemaining).toBe('number');
    expect(typeof ctx.hoursUntilNextMatch).toBe('number');
    expect(ctx.todayMatches).toBeDefined();
    expect(ctx.upcomingMatches).toBeDefined();
    expect(ctx.completedMatches).toBeDefined();
  });

  it('stadiumMode is one of the valid modes', () => {
    const ctx = getTournamentContext();
    const validModes = ['idle', 'pre-match', 'matchday', 'live', 'post-match'];
    expect(validModes).toContain(ctx.stadiumMode);
  });

  it('bracket has correct structure', () => {
    const ctx = getTournamentContext();
    expect(ctx.bracket).toBeDefined();
    expect(ctx.bracket.quarterFinals).toBeDefined();
    expect(ctx.bracket.semiFinals).toBeDefined();
    expect(ctx.bracket.quarterFinals.length).toBe(4);
    expect(ctx.bracket.semiFinals.length).toBe(2);
  });

  it('bracket final exists', () => {
    const ctx = getTournamentContext();
    expect(ctx.bracket.final).not.toBeNull();
    expect(ctx.bracket.final?.teamA).toBeTruthy();
    expect(ctx.bracket.final?.teamB).toBeTruthy();
  });

  it('matchesPlayed + matchesRemaining equals total matches', () => {
    const ctx = getTournamentContext();
    // Some matches may be "today"/"live" so they are counted as upcoming
    expect(ctx.matchesPlayed + ctx.matchesRemaining).toBe(SCHEDULE.length);
  });

  /* ── getMatchesByRound ── */

  it('groups matches by round correctly', () => {
    const byRound = getMatchesByRound();
    expect(Object.keys(byRound).length).toBeGreaterThanOrEqual(5);
    for (const [round, matches] of Object.entries(byRound)) {
      expect(matches.length).toBeGreaterThan(0);
      for (const match of matches) {
        expect(match.round).toBe(round);
      }
    }
  });

  it('includes all expected rounds', () => {
    const byRound = getMatchesByRound();
    const expectedRounds = [
      'Round of 32',
      'Round of 16',
      'Quarter-Final',
      'Semi-Final',
      'Final',
    ];
    for (const round of expectedRounds) {
      expect(byRound[round]).toBeDefined();
      expect(byRound[round].length).toBeGreaterThan(0);
    }
  });

  /* ── getMatchById ── */

  it('finds a match by valid ID', () => {
    const match = getMatchById('final');
    expect(match).toBeDefined();
    expect(match?.round).toBe('Final');
  });

  it('returns undefined for non-existent ID', () => {
    const match = getMatchById('non-existent');
    expect(match).toBeUndefined();
  });

  it('finds quarter-final matches by ID', () => {
    const qf1 = getMatchById('qf1');
    expect(qf1).toBeDefined();
    expect(qf1?.round).toBe('Quarter-Final');
  });
});

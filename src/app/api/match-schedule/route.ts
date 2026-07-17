/* ═══════════════════════════════════════════════════════
   API: /api/match-schedule
   Returns the full FIFA World Cup 2026 schedule with
   auto-computed statuses and tournament context.
   ═══════════════════════════════════════════════════════ */

import { NextResponse } from 'next/server';
import { getTournamentContext, getMatchesByRound, SCHEDULE } from '@/lib/simulation/schedule';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const context = getTournamentContext();
    const matchesByRound = getMatchesByRound();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tournament: {
        name: 'FIFA World Cup 2026',
        hosts: ['Canada', 'Mexico', 'United States'],
        startDate: '2026-06-11',
        endDate: '2026-07-19',
        totalMatches: SCHEDULE.length,
      },
      context: {
        currentPhase: context.currentPhase,
        stadiumMode: context.stadiumMode,
        tournamentDay: context.tournamentDay,
        matchesPlayed: context.matchesPlayed,
        matchesRemaining: context.matchesRemaining,
        hoursUntilNextMatch: context.hoursUntilNextMatch,
        currentMatch: context.currentMatch,
        nextMatch: context.nextMatch,
        todayMatches: context.todayMatches,
      },
      bracket: context.bracket,
      matchesByRound,
    });
  } catch (error) {
    console.error('Match schedule API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate match schedule' },
      { status: 500 }
    );
  }
}

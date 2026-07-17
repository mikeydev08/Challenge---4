/* ═══════════════════════════════════════════════════════
   TournamentBracket — Visual knockout bracket from QF→Final.
   ═══════════════════════════════════════════════════════ */

'use client';

import React from 'react';
import type { BracketData, ScheduledMatch } from '@/lib/simulation/schedule';
import { Trophy } from 'lucide-react';

interface TournamentBracketProps {
  bracket: BracketData;
}

function BracketMatch({ match, highlight }: { match: ScheduledMatch; highlight?: boolean }) {
  const isCompleted = match.status === 'completed';
  const winnerA = isCompleted && match.scoreA !== undefined && match.scoreB !== undefined && match.scoreA > match.scoreB;
  const winnerB = isCompleted && match.scoreB !== undefined && match.scoreA !== undefined && match.scoreB > match.scoreA;
  // Handle penalties — first listed team wins on pens
  const pensWinA = isCompleted && match.penalties && !winnerA && !winnerB;

  return (
    <div
      className={`rounded-lg overflow-hidden transition-all ${highlight ? 'ring-1 ring-yellow-500/40' : ''}`}
      style={{
        background: highlight
          ? 'rgba(251,191,36,0.06)'
          : 'rgba(15, 25, 50, 0.9)',
        border: `1px solid ${highlight ? 'rgba(251,191,36,0.25)' : 'rgba(100, 160, 255, 0.12)'}`,
        minWidth: '180px',
      }}
    >
      {/* Team A */}
      <div
        className="flex items-center justify-between gap-2 px-3 py-2"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: (winnerA || pensWinA) ? 'rgba(34,197,94,0.06)' : 'transparent',
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm">{match.flagA}</span>
          <span
            className="text-xs font-semibold truncate"
            style={{ color: (winnerA || pensWinA) ? '#4ade80' : '#c8d6e5' }}
          >
            {match.teamA}
          </span>
        </div>
        <span
          className="text-xs font-bold tabular-nums"
          style={{ color: (winnerA || pensWinA) ? '#4ade80' : '#6b7fa0' }}
        >
          {match.scoreA !== undefined ? match.scoreA : '-'}
        </span>
      </div>

      {/* Team B */}
      <div
        className="flex items-center justify-between gap-2 px-3 py-2"
        style={{
          background: winnerB ? 'rgba(34,197,94,0.06)' : 'transparent',
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm">{match.flagB}</span>
          <span
            className="text-xs font-semibold truncate"
            style={{ color: winnerB ? '#4ade80' : '#c8d6e5' }}
          >
            {match.teamB}
          </span>
        </div>
        <span
          className="text-xs font-bold tabular-nums"
          style={{ color: winnerB ? '#4ade80' : '#6b7fa0' }}
        >
          {match.scoreB !== undefined ? match.scoreB : '-'}
        </span>
      </div>

      {/* Penalties / AET indicator */}
      {(match.penalties || match.extraTime) && (
        <div className="text-center py-0.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: '#6b7fa0' }}>
            {match.penalties ? `PEN ${match.penalties}` : 'AET'}
          </span>
        </div>
      )}
    </div>
  );
}

export function TournamentBracket({ bracket }: TournamentBracketProps) {
  const { quarterFinals, semiFinals, thirdPlace, final: finalMatch } = bracket;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(15, 25, 50, 0.6)',
        border: '1px solid rgba(100, 160, 255, 0.12)',
        backdropFilter: 'blur(16px)',
        padding: '1.5rem',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5" style={{ color: '#fbbf24' }} />
        <h2 className="text-lg font-bold text-white">Tournament Bracket</h2>
      </div>

      {/* Desktop bracket layout */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-5 gap-4 items-center">
          {/* Column 1: QF */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#6b7fa0' }}>
              Quarter-Finals
            </div>
            {quarterFinals.map((m) => (
              <BracketMatch key={m.id} match={m} />
            ))}
          </div>

          {/* Column 2: Connector */}
          <div className="flex flex-col items-center justify-center gap-24">
            {[0, 1].map((i) => (
              <div key={i} className="w-full flex items-center justify-center">
                <div className="h-px flex-1" style={{ background: 'rgba(100,160,255,0.15)' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(100,160,255,0.3)' }} />
                <div className="h-px flex-1" style={{ background: 'rgba(100,160,255,0.15)' }} />
              </div>
            ))}
          </div>

          {/* Column 3: SF */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#6b7fa0' }}>
              Semi-Finals
            </div>
            {semiFinals.map((m) => (
              <BracketMatch key={m.id} match={m} />
            ))}
            {thirdPlace && (
              <div className="mt-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-center mb-2" style={{ color: '#6b7fa0' }}>
                  3rd Place
                </div>
                <BracketMatch match={thirdPlace} />
              </div>
            )}
          </div>

          {/* Column 4: Connector */}
          <div className="flex items-center justify-center">
            <div className="h-px flex-1" style={{ background: 'rgba(251,191,36,0.2)' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(251,191,36,0.5)' }} />
            <div className="h-px flex-1" style={{ background: 'rgba(251,191,36,0.2)' }} />
          </div>

          {/* Column 5: Final */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#fbbf24' }}>
              🏆 Final
            </div>
            {finalMatch && <BracketMatch match={finalMatch} highlight />}
          </div>
        </div>
      </div>

      {/* Mobile/tablet layout — stacked */}
      <div className="lg:hidden space-y-6">
        {/* QF */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6b7fa0' }}>
            Quarter-Finals
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quarterFinals.map((m) => (
              <BracketMatch key={m.id} match={m} />
            ))}
          </div>
        </div>

        {/* SF */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6b7fa0' }}>
            Semi-Finals
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {semiFinals.map((m) => (
              <BracketMatch key={m.id} match={m} />
            ))}
          </div>
        </div>

        {/* 3rd Place */}
        {thirdPlace && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6b7fa0' }}>
              Third-Place Play-off
            </div>
            <BracketMatch match={thirdPlace} />
          </div>
        )}

        {/* Final */}
        {finalMatch && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#fbbf24' }}>
              🏆 Final
            </div>
            <BracketMatch match={finalMatch} highlight />
          </div>
        )}
      </div>
    </div>
  );
}

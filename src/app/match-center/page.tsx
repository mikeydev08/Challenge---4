/* ═══════════════════════════════════════════════════════
   Match Center — Real-time FIFA World Cup 2026 Schedule
   Auto-detects tournament phase from the system clock.
   ═══════════════════════════════════════════════════════ */

'use client';

import React, { useState } from 'react';
import {
  getTournamentContext,
  getMatchesByRound,
} from '@/lib/simulation/schedule';
import type { ScheduledMatch } from '@/lib/simulation/schedule';
import { MatchCard, FinalMatchCard } from '@/components/match-center/MatchCard';
import { CountdownTimer } from '@/components/match-center/CountdownTimer';
import { TournamentBracket } from '@/components/match-center/TournamentBracket';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  Flag,
} from 'lucide-react';

/* ── Phase Banner ── */
function PhaseBanner({ context }: { context: ReturnType<typeof getTournamentContext> }) {
  const isRestDay = context.todayMatches.length === 0;
  const phaseColors: Record<string, string> = {
    'Final': '#fbbf24',
    'Third-Place Play-off': '#a78bfa',
    'Semi-Finals': '#60a5fa',
    'Quarter-Finals': '#34d399',
    'Round of 16': '#f97316',
    'Round of 32': '#fb923c',
    'Group Stage': '#94a3b8',
  };
  const accentColor = phaseColors[context.currentPhase] || '#60a5fa';

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(135deg, rgba(15,25,50,0.9) 0%, rgba(15,25,50,0.7) 100%)`,
        border: `1px solid ${accentColor}33`,
        padding: '1.5rem 2rem',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accentColor, opacity: 0.7 }} />
      
      {/* Glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5" style={{ color: accentColor }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>
              FIFA World Cup 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {context.currentPhase}
          </h1>
          {isRestDay && (
            <p className="mt-1 text-sm" style={{ color: '#8899b8' }}>
              Rest day — next match in {Math.floor(context.hoursUntilNextMatch)} hours
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <StatChip icon={Calendar} label="Day" value={`${context.tournamentDay}`} color="#60a5fa" />
          <StatChip icon={BarChart3} label="Played" value={`${context.matchesPlayed}`} color="#4ade80" />
          <StatChip icon={Flag} label="Remaining" value={`${context.matchesRemaining}`} color="#fbbf24" />
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{
        background: `${color}0d`,
        border: `1px solid ${color}26`,
      }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color }} />
      <div>
        <div className="text-[10px] uppercase tracking-wider" style={{ color: '#6b7fa0' }}>{label}</div>
        <div className="text-sm font-bold" style={{ color }}>{value}</div>
      </div>
    </div>
  );
}

/* ── Round Section (collapsible) ── */
function RoundSection({ round, matches, defaultOpen = false }: { round: string; matches: ScheduledMatch[]; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const completedCount = matches.filter(m => m.status === 'completed').length;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(15, 25, 50, 0.6)',
        border: '1px solid rgba(100, 160, 255, 0.1)',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">{round}</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>
            {completedCount}/{matches.length} played
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" style={{ color: '#6b7fa0' }} />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color: '#6b7fa0' }} />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} compact />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════ */

export default function MatchCenterPage() {
  const context = getTournamentContext();
  const matchesByRound = getMatchesByRound();

  const roundOrder = [
    'Final',
    'Third-Place Play-off',
    'Semi-Final',
    'Quarter-Final',
    'Round of 16',
    'Round of 32',
  ];

  return (
    <div className="space-y-6">
      {/* Phase Banner */}
      <PhaseBanner context={context} />

      {/* Row 1: Countdown + Final Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Countdown to next match */}
        {context.nextMatch && (
          <CountdownTimer match={context.nextMatch} />
        )}

        {/* Final match highlight */}
        {context.bracket.final && (
          <FinalMatchCard match={context.bracket.final} />
        )}
      </div>

      {/* Row 2: Tournament Bracket */}
      <TournamentBracket bracket={context.bracket} />

      {/* Row 3: All Results by Round */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5" style={{ color: '#a78bfa' }} />
          <h2 className="text-lg font-bold text-white">All Match Results</h2>
        </div>
        <div className="space-y-3">
          {roundOrder.map((round) => {
            const matches = matchesByRound[round];
            if (!matches) return null;
            // Default open for recent rounds
            const defaultOpen = round === 'Semi-Final' || round === 'Quarter-Final';
            return (
              <RoundSection key={round} round={round} matches={matches} defaultOpen={defaultOpen} />
            );
          })}
        </div>
      </div>

      {/* Tournament Stats Footer */}
      <div
        className="rounded-xl p-5"
        style={{
          background: 'rgba(15, 25, 50, 0.5)',
          border: '1px solid rgba(100, 160, 255, 0.08)',
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-black text-white">{context.matchesPlayed}</div>
            <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#6b7fa0' }}>Matches Played</div>
          </div>
          <div>
            <div className="text-2xl font-black" style={{ color: '#4ade80' }}>16</div>
            <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#6b7fa0' }}>Venues</div>
          </div>
          <div>
            <div className="text-2xl font-black" style={{ color: '#60a5fa' }}>3</div>
            <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#6b7fa0' }}>Host Countries</div>
          </div>
          <div>
            <div className="text-2xl font-black" style={{ color: '#fbbf24' }}>48</div>
            <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#6b7fa0' }}>Teams</div>
          </div>
        </div>
      </div>
    </div>
  );
}

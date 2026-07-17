/* ═══════════════════════════════════════════════════════
   MatchCard — Displays a single match result/fixture.
   ═══════════════════════════════════════════════════════ */

'use client';

import React from 'react';
import type { ScheduledMatch } from '@/lib/simulation/schedule';
import { MapPin, Clock, Trophy } from 'lucide-react';

interface MatchCardProps {
  match: ScheduledMatch;
  compact?: boolean;
}

function StatusBadge({ status, penalties, extraTime }: { status: string; penalties?: string; extraTime?: boolean }) {
  const styles: Record<string, { bg: string; text: string; border: string; label: string }> = {
    completed: { bg: 'rgba(34,197,94,0.12)', text: '#4ade80', border: 'rgba(34,197,94,0.3)', label: 'FT' },
    live:      { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.4)', label: '● LIVE' },
    today:     { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.3)', label: 'TODAY' },
    upcoming:  { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.3)', label: 'UPCOMING' },
  };

  const s = styles[status] || styles.upcoming;
  let label = s.label;
  if (status === 'completed' && penalties) label = `FT (Pens ${penalties})`;
  else if (status === 'completed' && extraTime) label = 'FT (AET)';

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {label}
    </span>
  );
}

export function MatchCard({ match, compact = false }: MatchCardProps) {
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';

  const dateObj = new Date(`${match.date}T${match.kickoff}:00`);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-200 ${
        isLive ? 'ring-1 ring-red-500/40' : ''
      }`}
      style={{
        background: isLive
          ? 'rgba(239,68,68,0.06)'
          : 'rgba(15, 25, 50, 0.7)',
        border: `1px solid ${isLive ? 'rgba(239,68,68,0.25)' : 'rgba(100, 160, 255, 0.12)'}`,
        backdropFilter: 'blur(12px)',
        padding: compact ? '0.75rem' : '1rem 1.25rem',
      }}
    >
      {/* Top: Round + Status */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#8899b8' }}>
          {match.round}
        </span>
        <StatusBadge status={match.status} penalties={match.penalties} extraTime={match.extraTime} />
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-between gap-3">
        {/* Team A */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl">{match.flagA}</span>
          <span
            className={`font-semibold truncate ${compact ? 'text-sm' : 'text-base'}`}
            style={{
              color: isCompleted && match.scoreA !== undefined && match.scoreB !== undefined && match.scoreA > match.scoreB
                ? '#ffffff'
                : '#c8d6e5',
            }}
          >
            {match.teamA}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isCompleted || isLive ? (
            <>
              <span
                className={`${compact ? 'text-lg' : 'text-2xl'} font-bold tabular-nums`}
                style={{
                  color: match.scoreA !== undefined && match.scoreB !== undefined && match.scoreA >= match.scoreB
                    ? '#ffffff' : '#6b7fa0',
                }}
              >
                {match.scoreA}
              </span>
              <span className="text-sm font-light" style={{ color: '#4a5d7a' }}>–</span>
              <span
                className={`${compact ? 'text-lg' : 'text-2xl'} font-bold tabular-nums`}
                style={{
                  color: match.scoreB !== undefined && match.scoreA !== undefined && match.scoreB >= match.scoreA
                    ? '#ffffff' : '#6b7fa0',
                }}
              >
                {match.scoreB}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium" style={{ color: '#60a5fa' }}>
              {dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </span>
          )}
        </div>

        {/* Team B */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span
            className={`font-semibold truncate text-right ${compact ? 'text-sm' : 'text-base'}`}
            style={{
              color: isCompleted && match.scoreB !== undefined && match.scoreA !== undefined && match.scoreB > match.scoreA
                ? '#ffffff'
                : '#c8d6e5',
            }}
          >
            {match.teamB}
          </span>
          <span className="text-xl">{match.flagB}</span>
        </div>
      </div>

      {/* Bottom: Date + Venue */}
      {!compact && (
        <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: '#6b7fa0' }}>
            <Clock className="w-3 h-3" />
            <span>{dateStr} • {match.kickoff}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: '#6b7fa0' }}>
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[180px]">{match.venue}, {match.city}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Highlight card for the Final */
export function FinalMatchCard({ match }: { match: ScheduledMatch }) {
  const dateObj = new Date(`${match.date}T${match.kickoff}:00`);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(168,85,247,0.08) 50%, rgba(96,165,250,0.08) 100%)',
        border: '1px solid rgba(251,191,36,0.25)',
        padding: '1.5rem 2rem',
      }}
    >
      {/* Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-purple-500 to-blue-500 opacity-80" />

      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5" style={{ color: '#fbbf24' }} />
        <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#fbbf24' }}>
          {match.round}
        </span>
        <StatusBadge status={match.status} />
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-4xl">{match.flagA}</span>
          <div>
            <span className="text-xl font-bold text-white">{match.teamA}</span>
          </div>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          {match.scoreA !== undefined ? (
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-white">{match.scoreA}</span>
              <span className="text-lg" style={{ color: '#4a5d7a' }}>–</span>
              <span className="text-3xl font-black text-white">{match.scoreB}</span>
            </div>
          ) : (
            <span className="text-lg font-bold" style={{ color: '#fbbf24' }}>VS</span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="text-right">
            <span className="text-xl font-bold text-white">{match.teamB}</span>
          </div>
          <span className="text-4xl">{match.flagB}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9aafc8' }}>
          <Clock className="w-3.5 h-3.5" />
          <span>{dateStr} • {match.kickoff} ET</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9aafc8' }}>
          <MapPin className="w-3.5 h-3.5" />
          <span>{match.venue}</span>
        </div>
      </div>
    </div>
  );
}

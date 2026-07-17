/* ═══════════════════════════════════════════════════════
   CountdownTimer — Live countdown to the next match.
   ═══════════════════════════════════════════════════════ */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { ScheduledMatch } from '@/lib/simulation/schedule';
import { Clock, MapPin, Calendar } from 'lucide-react';

interface CountdownTimerProps {
  match: ScheduledMatch;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    total: diff,
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center"
        style={{
          background: 'rgba(96,165,250,0.08)',
          border: '1px solid rgba(96,165,250,0.2)',
          boxShadow: '0 0 20px rgba(96,165,250,0.05)',
        }}
      >
        <span className="text-2xl sm:text-3xl font-black tabular-nums text-white">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-[10px] sm:text-xs font-medium uppercase tracking-widest" style={{ color: '#6b7fa0' }}>
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ match }: CountdownTimerProps) {
  const targetDate = useMemo(() => new Date(`${match.date}T${match.kickoff}:00`), [match.date, match.kickoff]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [match.date, match.kickoff, targetDate]);

  const dateObj = new Date(`${match.date}T${match.kickoff}:00`);
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isMatchStarted = timeLeft.total <= 0;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(15, 25, 50, 0.8)',
        border: '1px solid rgba(100, 160, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        padding: '1.5rem 2rem',
      }}
    >
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 opacity-80" />

      {/* Header */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-4 h-4 animate-pulse" style={{ color: '#60a5fa' }} />

          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#60a5fa' }}>
            {isMatchStarted ? 'Match Underway' : 'Next Match Countdown'}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {match.teamA} <span style={{ color: '#4a5d7a' }}>vs</span> {match.teamB}
        </h3>
        <div className="flex items-center justify-center gap-1 mt-1">
          <span className="text-2xl">{match.flagA}</span>
          <span className="mx-2 text-sm" style={{ color: '#4a5d7a' }}>⚔️</span>
          <span className="text-2xl">{match.flagB}</span>
        </div>
      </div>

      {/* Countdown */}
      {!isMatchStarted && (
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5">
          <TimeUnit value={timeLeft.days} label="Days" />
          <div className="text-2xl font-light self-start mt-5" style={{ color: '#4a5d7a' }}>:</div>
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <div className="text-2xl font-light self-start mt-5" style={{ color: '#4a5d7a' }}>:</div>
          <TimeUnit value={timeLeft.minutes} label="Mins" />
          <div className="text-2xl font-light self-start mt-5" style={{ color: '#4a5d7a' }}>:</div>
          <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
      )}

      {/* Match details */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8899b8' }}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8899b8' }}>
          <Clock className="w-3.5 h-3.5" />
          <span>{dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8899b8' }}>
          <MapPin className="w-3.5 h-3.5" />
          <span>{match.venue}</span>
        </div>
      </div>

      {/* Round badge */}
      <div className="flex justify-center mt-3">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{
            background: match.round === 'Final' ? 'rgba(251,191,36,0.12)' : 'rgba(168,85,247,0.12)',
            color: match.round === 'Final' ? '#fbbf24' : '#a78bfa',
            border: `1px solid ${match.round === 'Final' ? 'rgba(251,191,36,0.3)' : 'rgba(168,85,247,0.3)'}`,
          }}
        >
          {match.round}
        </span>
      </div>
    </div>
  );
}

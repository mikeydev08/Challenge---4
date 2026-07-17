'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { StadiumData } from '@/lib/simulation/types';

interface MatchSummaryProps {
  data: StadiumData;
}

const eventIcons: Record<string, string> = {
  goal: '⚽',
  yellow_card: '🟨',
  red_card: '🟥',
  substitution: '🔄',
  var_review: '📺',
};

export function MatchSummary({ data }: MatchSummaryProps) {
  const match = data.match;
  const isIdle = data.tournamentContext?.stadiumMode === 'idle';
  const activeMatch = data.tournamentContext?.currentMatch || data.tournamentContext?.nextMatch;
  const flagA = activeMatch?.flagA || '🏳️';
  const flagB = activeMatch?.flagB || '🏳️';

  const isPreMatch = match.status === 'pre-match';
  const showNext = isIdle || isPreMatch;

  return (
    <Card hover={false} padding="md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent-400" />
          <CardTitle>{isIdle ? 'Next Match' : isPreMatch ? 'Upcoming Match' : 'Live Match'}</CardTitle>
        </div>
        {!showNext && (
          <Badge variant="live" pulse>
            {match.status === 'pre-match'
              ? 'Pre-Match'
              : match.status === 'half-time'
              ? 'HT'
              : match.status === 'full-time'
              ? 'FT'
              : `${match.minute}'`}
          </Badge>
        )}
      </CardHeader>

      {/* Scoreboard */}
      <div className="flex items-center justify-center gap-4 py-3">
        <div className="text-center">
          <div className="text-2xl mb-1">{flagA}</div>
          <div className="text-sm font-bold text-white">{showNext ? activeMatch?.teamA : match.teamA}</div>
        </div>
        
        {showNext ? (
          <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-white/5">
            <div className="text-xs text-slate-400 text-center">
              {data.tournamentContext?.nextMatch ? new Date(data.tournamentContext.nextMatch.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Upcoming'} • {data.tournamentContext?.nextMatch?.kickoff}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5">
            <span className="text-3xl font-black text-white counter">{match.scoreA}</span>
            <span className="text-lg text-slate-500">—</span>
            <span className="text-3xl font-black text-white counter">{match.scoreB}</span>
          </div>
        )}

        <div className="text-center">
          <div className="text-2xl mb-1">{flagB}</div>
          <div className="text-sm font-bold text-white">{showNext ? activeMatch?.teamB : match.teamB}</div>
        </div>
      </div>

      {/* Recent events */}
      {!showNext && match.events.length > 0 && (
        <div className="mt-2 space-y-1.5 max-h-[120px] overflow-y-auto custom-scrollbar">
          {[...match.events].reverse().slice(0, 5).map((event, i) => (
            <div key={i} className="flex items-center gap-2 py-1 px-2 rounded-lg bg-white/3 text-xs">
              <span className="text-[10px] text-slate-500 font-mono w-6">{event.minute}&apos;</span>
              <span>{eventIcons[event.type] || '•'}</span>
              <span className="text-slate-300 flex-1 truncate">{event.description}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

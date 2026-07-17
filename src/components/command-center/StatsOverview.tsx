'use client';

import React from 'react';
import {
  Users,
  Percent,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
} from 'lucide-react';
import type { StadiumData } from '@/lib/simulation/types';

interface StatsOverviewProps {
  data: StadiumData;
}

interface StatCardProps {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value: string | number;
  subtext: string;
  trend?: 'up' | 'down' | 'stable';
  variant?: 'default' | 'warning' | 'danger' | 'success';
}

function StatCard({ icon: Icon, iconColor, label, value, subtext, trend, variant = 'default' }: StatCardProps) {
  const borderClass =
    variant === 'danger'
      ? 'border-l-2 border-l-red-500'
      : variant === 'warning'
      ? 'border-l-2 border-l-yellow-500'
      : variant === 'success'
      ? 'border-l-2 border-l-emerald-500'
      : '';

  return (
    <div className={`glass p-4 ${borderClass}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
            {trend === 'stable' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white counter">{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
      <div className="text-[11px] text-slate-500 mt-1">{subtext}</div>
    </div>
  );
}

export function StatsOverview({ data }: StatsOverviewProps) {
  const capacityPct = Math.round((data.totalInStadium / data.maxCapacity) * 100);
  const activeIncidents = data.security.filter((a) => a.status !== 'resolved').length +
    data.medical.filter((m) => m.status !== 'resolved').length;
  const avgFoodWait = data.foodStalls.length
    ? Math.round(
        data.foodStalls.reduce((s, f) => s + f.estimatedWaitMinutes, 0) / data.foodStalls.length
      )
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
      <StatCard
        icon={Users}
        iconColor="bg-primary-600/80"
        label="Total Attendance"
        value={data.totalInStadium.toLocaleString()}
        subtext={`of ${data.maxCapacity.toLocaleString()} capacity`}
        trend={data.tournamentContext?.stadiumMode === 'idle' ? 'stable' : 'up'}
      />
      <StatCard
        icon={Percent}
        iconColor={capacityPct > 90 ? 'bg-red-600/80' : capacityPct > 75 ? 'bg-yellow-600/80' : 'bg-emerald-600/80'}
        label="Stadium Capacity"
        value={`${capacityPct}%`}
        subtext={capacityPct > 90 ? 'Approaching limit' : 'Within safe range'}
        variant={capacityPct > 90 ? 'danger' : capacityPct > 75 ? 'warning' : 'success'}
      />
      <StatCard
        icon={AlertTriangle}
        iconColor={activeIncidents > 3 ? 'bg-red-600/80' : 'bg-yellow-600/80'}
        label="Active Incidents"
        value={activeIncidents}
        subtext={`${data.security.length} security, ${data.medical.length} medical`}
        variant={activeIncidents > 3 ? 'danger' : activeIncidents > 0 ? 'warning' : 'success'}
      />
      <StatCard
        icon={Clock}
        iconColor="bg-orange-600/80"
        label="Avg Food Wait"
        value={`${avgFoodWait} min`}
        subtext={avgFoodWait > 15 ? 'Above target' : 'On target'}
        variant={avgFoodWait > 15 ? 'warning' : 'default'}
      />
      <div className="col-span-2 md:col-span-4 xl:col-span-1">
        <div className="glass p-4 h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-accent-400" />
            <span className="text-xs text-slate-400 font-medium">
              {data.tournamentContext?.stadiumMode === 'idle' ? 'NEXT MATCH' : data.match.status === 'pre-match' ? 'UPCOMING MATCH' : 'LIVE MATCH'}
            </span>
          </div>
          {data.tournamentContext?.stadiumMode === 'idle' ? (
            <>
              <div className="flex flex-col gap-1 mt-1">
                <div className="text-sm font-bold text-white text-center">
                  {data.tournamentContext?.nextMatch?.teamA} vs {data.tournamentContext?.nextMatch?.teamB}
                </div>
                <div className="text-xs text-slate-400 text-center">
                  {data.tournamentContext?.nextMatch ? new Date(data.tournamentContext.nextMatch.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : 'UPCOMING'} • {data.tournamentContext?.nextMatch?.kickoff}
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 rounded text-accent-400 font-medium">
                  Stadium Idle
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm font-bold text-white">{data.match.teamA}</span>
                {data.match.status === 'pre-match' ? (
                  <div className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl bg-white/5">
                    <span className="text-[10px] font-bold text-accent-400">TODAY</span>
                    <span className="text-sm text-slate-300 font-mono">
                      {data.tournamentContext?.currentMatch?.kickoff || 'TBD'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5">
                    <span className="text-xl font-black text-white counter">{data.match.scoreA}</span>
                    <span className="text-slate-500">-</span>
                    <span className="text-xl font-black text-white counter">{data.match.scoreB}</span>
                  </div>
                )}
                <span className="text-sm font-bold text-white">{data.match.teamB}</span>
              </div>
              <div className="text-center mt-1.5">
                <span className="text-xs text-accent-400 font-medium">
                  {data.match.status === 'pre-match'
                    ? 'Pre-Match'
                    : data.match.status === 'half-time'
                    ? 'Half-Time'
                    : data.match.status === 'full-time'
                    ? 'Full-Time'
                    : `${data.match.minute}'`}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

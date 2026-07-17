'use client';

import React from 'react';
import { UtensilsCrossed, Clock, Droplets } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { LinearGauge } from '@/components/ui/Gauge';
import type { FoodStall, WashroomStatus } from '@/lib/simulation/types';

interface QueueMonitorProps {
  foodStalls: FoodStall[];
  washrooms: WashroomStatus[];
}

export function QueueMonitor({ foodStalls, washrooms }: QueueMonitorProps) {
  const sortedFood = [...foodStalls].sort((a, b) => b.queueLength - a.queueLength);
  const washroomsByZone = washrooms.reduce<Record<string, WashroomStatus[]>>((acc, wr) => {
    (acc[wr.zone] = acc[wr.zone] || []).push(wr);
    return acc;
  }, {});

  return (
    <Card hover={false} padding="md" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-accent-400" />
          <CardTitle>Queue Monitor</CardTitle>
        </div>
      </CardHeader>

      {/* Food Stalls */}
      <div className="mb-5">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <UtensilsCrossed className="w-3 h-3" /> Food Stalls
        </div>
        <div className="space-y-2.5">
          {sortedFood.slice(0, 5).map((stall) => (
            <div key={stall.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-200">{stall.name}</span>
                  <span className="text-[10px] text-slate-500">{stall.cuisine}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-2.5 h-2.5" />
                    {stall.estimatedWaitMinutes}m
                  </span>
                  <span
                    className={`text-[10px] font-medium ${
                      stall.status === 'busy'
                        ? 'text-yellow-400'
                        : stall.status === 'closed'
                        ? 'text-red-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {stall.queueLength} in queue
                  </span>
                </div>
              </div>
              <LinearGauge value={stall.queueLength} max={60} height={4} />
            </div>
          ))}
        </div>
      </div>

      {/* Washrooms */}
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Droplets className="w-3 h-3" /> Washrooms
        </div>
        <div className="space-y-2">
          {Object.entries(washroomsByZone)
            .slice(0, 4)
            .map(([zone, wrs]) => {
              const totalOcc = wrs.reduce((s, w) => s + w.occupancy, 0);
              const totalCap = wrs.reduce((s, w) => s + w.capacity, 0);
              const totalQueue = wrs.reduce((s, w) => s + w.queueLength, 0);
              const pct = Math.round((totalOcc / totalCap) * 100);
              return (
                <div key={zone}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300">{zone}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        {totalQueue > 0 ? `${totalQueue} waiting` : 'No queue'}
                      </span>
                      <span
                        className={`text-[10px] font-medium ${
                          pct > 85 ? 'text-red-400' : pct > 60 ? 'text-yellow-400' : 'text-emerald-400'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <LinearGauge value={pct} max={100} height={3} />
                </div>
              );
            })}
        </div>
      </div>
    </Card>
  );
}

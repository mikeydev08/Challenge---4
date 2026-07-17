'use client';

import React from 'react';
import { DoorOpen, Clock, TrendingDown, Car, Train } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LinearGauge } from '@/components/ui/Gauge';
import type { GateStatus, TransportStatus } from '@/lib/simulation/types';

interface ExitPredictorProps {
  gates: GateStatus[];
  transport: TransportStatus;
}

export function ExitPredictor({ gates, transport }: ExitPredictorProps) {
  const sortedGates = [...gates].sort((a, b) => a.queueLength - b.queueLength);
  const bestGate = sortedGates[0];
  const worstGate = sortedGates[sortedGates.length - 1];
  const timeSaved = Math.round((worstGate.queueLength - bestGate.queueLength) / 15);

  return (
    <Card hover={false} padding="md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DoorOpen className="w-4 h-4 text-emerald-400" />
          <CardTitle>Exit Predictor</CardTitle>
        </div>
      </CardHeader>

      {/* Best exit */}
      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-400 font-medium">🏆 Best Exit Right Now</div>
            <div className="text-lg font-bold text-white mt-0.5">{bestGate.name}</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              ~{Math.round(bestGate.queueLength / 15)} min wait
            </div>
            {timeSaved > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5">
                <TrendingDown className="w-3 h-3" />
                Save ~{timeSaved} min vs {worstGate.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All gates */}
      <div className="space-y-2 mb-3">
        {sortedGates.slice(0, 4).map((gate) => (
          <div key={gate.id}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-slate-300">{gate.name}</span>
              <span className="text-[10px] text-slate-400">{gate.queueLength} in queue</span>
            </div>
            <LinearGauge value={gate.queueLength} max={500} height={3} />
          </div>
        ))}
      </div>

      {/* Transport */}
      <div className="pt-2 border-t border-white/5 space-y-1.5">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Transport Home</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Train className="w-3 h-3 text-blue-400" /> Metro
          </div>
          <Badge variant={transport.metro.status === 'running' ? 'success' : 'warning'}>
            {transport.metro.nextArrivalMinutes}m
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Car className="w-3 h-3 text-orange-400" /> Rideshare
          </div>
          <Badge variant={transport.rideshare.surgeMultiplier > 2 ? 'warning' : 'info'}>
            ~{transport.rideshare.estimatedWaitMinutes}m • {transport.rideshare.surgeMultiplier}x
          </Badge>
        </div>
      </div>
    </Card>
  );
}

'use client';

import React from 'react';
import { Train, Car, Bus, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LinearGauge } from '@/components/ui/Gauge';
import type { TransportStatus as TransportStatusType } from '@/lib/simulation/types';

interface TransportStatusProps {
  transport: TransportStatusType;
}

export function TransportStatus({ transport }: TransportStatusProps) {
  return (
    <Card hover={false} padding="md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Train className="w-4 h-4 text-cyan-400" />
          <CardTitle>Transport</CardTitle>
        </div>
      </CardHeader>

      <div className="space-y-3">
        {/* Metro */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Train className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-slate-300">Metro</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={transport.metro.status === 'running' ? 'success' : 'warning'}>
              {transport.metro.status}
            </Badge>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {transport.metro.nextArrivalMinutes}m
            </span>
          </div>
        </div>

        {/* Parking */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Car className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-slate-300">Parking</span>
            </div>
            <span className={`text-xs font-medium ${transport.parking.percentage > 90 ? 'text-red-400' : 'text-slate-300'}`}>
              {transport.parking.available.toLocaleString()} spots left
            </span>
          </div>
          <LinearGauge value={transport.parking.percentage} max={100} height={4} />
        </div>

        {/* Bus Shuttle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-slate-300">Shuttle</span>
          </div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Next in {transport.busShuttle.nextDepartureMinutes}m
          </span>
        </div>
      </div>
    </Card>
  );
}

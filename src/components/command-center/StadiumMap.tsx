'use client';

import React from 'react';
import { Map, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { StadiumData } from '@/lib/simulation/types';

interface StadiumMapProps {
  data: StadiumData;
}

function getZoneColor(percentage: number): string {
  if (percentage > 90) return '#ef4444';
  if (percentage > 75) return '#eab308';
  if (percentage > 50) return '#f97316';
  return '#22c55e';
}

function getZoneFill(percentage: number): string {
  if (percentage > 90) return 'rgba(239, 68, 68, 0.25)';
  if (percentage > 75) return 'rgba(234, 179, 8, 0.2)';
  if (percentage > 50) return 'rgba(249, 115, 22, 0.15)';
  return 'rgba(34, 197, 94, 0.12)';
}

export function StadiumMap({ data }: StadiumMapProps) {
  const zones = data.zones;
  const gates = data.gates;

  return (
    <Card hover={false} padding="md" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-primary-400" />
          <CardTitle>Stadium Map — Live Crowd Density</CardTitle>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60" /> &lt;50%
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500/60" /> 50-75%
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500/60" /> 75-90%
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500/60" /> &gt;90%
          </div>
        </div>
      </CardHeader>

      {/* SVG Stadium Map */}
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-surface-0/50">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full"
          role="img"
          aria-label="Stadium map showing crowd density across zones"
        >
          {/* Background field */}
          <rect x="0" y="0" width="800" height="500" fill="#0a0e1a" rx="12" />

          {/* Playing field */}
          <rect x="200" y="120" width="400" height="260" rx="4" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="2" />
          <line x1="400" y1="120" x2="400" y2="380" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
          <circle cx="400" cy="250" r="40" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
          <circle cx="400" cy="250" r="3" fill="rgba(34,197,94,0.4)" />
          {/* Goal areas */}
          <rect x="200" y="195" width="40" height="110" rx="2" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
          <rect x="560" y="195" width="40" height="110" rx="2" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />

          {/* ── ZONES ── */}
          {/* North Stand */}
          <rect
            x="180" y="20" width="440" height="80" rx="8"
            fill={getZoneFill(zones[0]?.percentage || 0)}
            stroke={getZoneColor(zones[0]?.percentage || 0)}
            strokeWidth="1.5"
            className="transition-all duration-1000"
          />
          <text x="400" y="50" textAnchor="middle" fill={getZoneColor(zones[0]?.percentage || 0)} fontSize="11" fontWeight="600">
            {zones[0]?.name || 'North Stand'}
          </text>
          <text x="400" y="70" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">
            {zones[0]?.percentage || 0}% • {(zones[0]?.currentOccupancy || 0).toLocaleString()} ppl
          </text>

          {/* South Stand */}
          <rect
            x="180" y="400" width="440" height="80" rx="8"
            fill={getZoneFill(zones[1]?.percentage || 0)}
            stroke={getZoneColor(zones[1]?.percentage || 0)}
            strokeWidth="1.5"
            className="transition-all duration-1000"
          />
          <text x="400" y="430" textAnchor="middle" fill={getZoneColor(zones[1]?.percentage || 0)} fontSize="11" fontWeight="600">
            {zones[1]?.name || 'South Stand'}
          </text>
          <text x="400" y="450" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">
            {zones[1]?.percentage || 0}% • {(zones[1]?.currentOccupancy || 0).toLocaleString()} ppl
          </text>

          {/* East Stand */}
          <rect
            x="640" y="100" width="140" height="300" rx="8"
            fill={getZoneFill(zones[2]?.percentage || 0)}
            stroke={getZoneColor(zones[2]?.percentage || 0)}
            strokeWidth="1.5"
            className="transition-all duration-1000"
          />
          <text x="710" y="240" textAnchor="middle" fill={getZoneColor(zones[2]?.percentage || 0)} fontSize="10" fontWeight="600">
            East
          </text>
          <text x="710" y="258" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">
            {zones[2]?.percentage || 0}%
          </text>

          {/* West Stand */}
          <rect
            x="20" y="100" width="140" height="300" rx="8"
            fill={getZoneFill(zones[3]?.percentage || 0)}
            stroke={getZoneColor(zones[3]?.percentage || 0)}
            strokeWidth="1.5"
            className="transition-all duration-1000"
          />
          <text x="90" y="240" textAnchor="middle" fill={getZoneColor(zones[3]?.percentage || 0)} fontSize="10" fontWeight="600">
            West
          </text>
          <text x="90" y="258" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">
            {zones[3]?.percentage || 0}%
          </text>

          {/* ── GATES ── */}
          {gates.slice(0, 8).map((gate, i) => {
            const positions = [
              { x: 220, y: 14 }, { x: 340, y: 14 }, { x: 460, y: 14 }, { x: 580, y: 14 },
              { x: 220, y: 486 }, { x: 340, y: 486 }, { x: 460, y: 486 }, { x: 580, y: 486 },
            ];
            const pos = positions[i];
            const color = gate.status === 'critical' ? '#ef4444' : gate.status === 'busy' ? '#eab308' : '#22c55e';
            return (
              <g key={gate.id}>
                <circle cx={pos.x} cy={pos.y} r="8" fill={color} opacity="0.3">
                  {gate.status === 'critical' && (
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" />
                  )}
                </circle>
                <circle cx={pos.x} cy={pos.y} r="4" fill={color} />
                <text x={pos.x + 14} y={pos.y + 3} fill="rgba(255,255,255,0.5)" fontSize="7">
                  G{i + 1}: {gate.queueLength}
                </text>
              </g>
            );
          })}

          {/* Incident markers */}
          {data.security
            .filter((a) => a.status === 'active')
            .slice(0, 3)
            .map((alert, i) => {
              const x = 300 + i * 100;
              const y = 250;
              return (
                <g key={alert.id}>
                  <circle cx={x} cy={y} r="10" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1">
                    <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x={x} y={y + 3} textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">
                    ⚠
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Overlay info */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Badge variant="live" pulse>
            <Users className="w-3 h-3" />
            {data.totalInStadium.toLocaleString()} in stadium
          </Badge>
        </div>
      </div>
    </Card>
  );
}

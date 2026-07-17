'use client';

import React from 'react';
import {
  HeartPulse,
  Clock,
  MapPin,
  Ambulance,
  Stethoscope,
  Activity,
  PhoneCall
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { MedicalIncident } from '@/lib/simulation/types';

interface EmergencyMedicalTrackerProps {
  medical: MedicalIncident[];
}

const severityBadge = {
  minor: 'info' as const,
  moderate: 'warning' as const,
  severe: 'critical' as const,
  critical: 'critical' as const,
};

const statusConfig = {
  reported: { icon: PhoneCall, color: 'text-yellow-400', label: 'Reported' },
  responding: { icon: Ambulance, color: 'text-orange-400', label: 'Dispatching EMT' },
  treating: { icon: Stethoscope, color: 'text-blue-400', label: 'Treating on Scene' },
  resolved: { icon: Activity, color: 'text-emerald-400', label: 'Resolved' },
};

export function EmergencyMedicalTracker({ medical }: EmergencyMedicalTrackerProps) {
  const activeMedical = medical.filter((m) => m.status !== 'resolved');

  return (
    <Card hover={false} padding="md" className="h-full border-red-500/20 bg-red-950/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-red-500" />
          <CardTitle className="text-red-50">Emergency Medical Dispatch</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {activeMedical.length > 0 && (
            <Badge variant="critical" pulse>{activeMedical.length} ACTIVE</Badge>
          )}
        </div>
      </CardHeader>

      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 mt-2">
        {activeMedical.map((incident) => {
          const StatusIcon = statusConfig[incident.status as keyof typeof statusConfig]?.icon || Activity;
          const statusColor = statusConfig[incident.status as keyof typeof statusConfig]?.color || 'text-slate-400';
          const statusLabel = statusConfig[incident.status as keyof typeof statusConfig]?.label || incident.status;

          return (
            <div
              key={incident.id}
              className="rounded-xl border border-red-500/20 bg-black/40 p-3 overflow-hidden relative"
            >
              {/* Status indicator bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${incident.severity === 'severe' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
              
              <div className="flex items-start justify-between gap-2 pl-2">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={severityBadge[incident.severity as keyof typeof severityBadge] || 'critical'}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${incident.status === 'reported' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/10 text-white'}`}>
                      <StatusIcon className={`w-3 h-3 ${statusColor}`} />
                      {statusLabel}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-white">{incident.description}</p>
                  
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-xs text-red-200/70 bg-red-950/30 px-2 py-1 rounded">
                      <MapPin className="w-3.5 h-3.5 text-red-400" /> {incident.zone}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> 
                      Reported: {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* AI Response Recommendation */}
                  {incident.status === 'reported' && (
                    <div className="mt-2 text-[11px] p-2 bg-blue-500/10 border border-blue-500/20 rounded text-blue-200">
                      <strong className="text-blue-400">AI Routing:</strong> Dispatching Medic Team Alpha from First Aid Station 3. Est. arrival: 2 mins.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {activeMedical.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <HeartPulse className="w-10 h-10 mb-3 text-slate-600" />
            <p className="text-sm font-medium">No active medical incidents</p>
            <p className="text-xs mt-1">All stadium zones clear</p>
          </div>
        )}
      </div>
    </Card>
  );
}

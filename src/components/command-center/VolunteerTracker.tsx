'use client';

import React from 'react';
import {
  UserCheck,
  MapPin,
  Coffee,
  Radio,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { VolunteerLocation } from '@/lib/simulation/types';

interface VolunteerTrackerProps {
  volunteers: VolunteerLocation[];
}

const roleConfig = {
  guide: { color: 'text-blue-400', bg: 'bg-blue-500/20' },
  medic: { color: 'text-red-400', bg: 'bg-red-500/20' },
  security: { color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  general: { color: 'text-slate-400', bg: 'bg-slate-500/20' },
};

const statusConfig = {
  active: { badge: 'success' as const, label: 'Active' },
  'on-break': { badge: 'warning' as const, label: 'Break' },
  deployed: { badge: 'info' as const, label: 'Deployed' },
};

export function VolunteerTracker({ volunteers }: VolunteerTrackerProps) {
  const activeCount = volunteers.filter((v) => v.status === 'active').length;
  const deployedCount = volunteers.filter((v) => v.status === 'deployed').length;

  return (
    <Card hover={false} padding="md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-blue-400" />
          <CardTitle>Volunteer Tracker</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">{activeCount} active</Badge>
          <Badge variant="info">{deployedCount} deployed</Badge>
        </div>
      </CardHeader>

      <div className="space-y-1.5 max-h-[280px] overflow-y-auto custom-scrollbar">
        {volunteers.map((vol) => {
          const role = roleConfig[vol.role] || roleConfig.general;
          const status = statusConfig[vol.status] || statusConfig.active;

          return (
            <div
              key={vol.id}
              className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full ${role.bg} flex items-center justify-center text-xs font-bold ${role.color}`}>
                  {vol.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">{vol.name}</span>
                    <span className={`text-[10px] capitalize ${role.color}`}>{vol.role}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <MapPin className="w-2.5 h-2.5" /> {vol.zone}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Radio className="w-2.5 h-2.5" /> {vol.language.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {vol.status === 'on-break' && <Coffee className="w-3 h-3 text-yellow-400" />}
                <Badge variant={status.badge}>{status.label}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

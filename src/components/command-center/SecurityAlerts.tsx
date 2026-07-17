'use client';

import React from 'react';
import {
  ShieldAlert,
  Siren,
  Clock,
  MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { SecurityAlert } from '@/lib/simulation/types';

interface SecurityAlertsProps {
  alerts: SecurityAlert[];
}

const severityBadge = {
  low: 'info' as const,
  medium: 'warning' as const,
  high: 'critical' as const,
  critical: 'critical' as const,
};

export function SecurityAlerts({ alerts }: SecurityAlertsProps) {
  const activeAlerts = alerts.filter((a) => a.status !== 'resolved');

  return (
    <Card hover={false} padding="md" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <CardTitle>Security Alerts</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {activeAlerts.length > 0 && (
            <Badge variant="critical" pulse>{activeAlerts.length} active</Badge>
          )}
        </div>
      </CardHeader>

      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {/* Security Alerts */}
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border p-2.5 ${
              alert.severity === 'high' || alert.severity === 'critical'
                ? 'bg-red-500/5 border-red-500/20'
                : 'bg-yellow-500/5 border-yellow-500/20'
            }`}
          >
            <div className="flex items-start gap-2">
              <Siren
                className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                  alert.severity === 'high' || alert.severity === 'critical'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={severityBadge[alert.severity as keyof typeof severityBadge] || 'info'}>{alert.severity}</Badge>
                  <span className="text-[10px] text-slate-500 capitalize">{alert.status}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{alert.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <MapPin className="w-2.5 h-2.5" /> {alert.zone}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {activeAlerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <ShieldAlert className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-xs">No active security alerts</p>
          </div>
        )}
      </div>
    </Card>
  );
}

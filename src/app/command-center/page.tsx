'use client';

import React from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import { StatsOverview } from '@/components/command-center/StatsOverview';
import { StadiumMap } from '@/components/command-center/StadiumMap';
import { AIInsightsPanel } from '@/components/command-center/AIInsightsPanel';
import { SecurityAlerts } from '@/components/command-center/SecurityAlerts';
import { EmergencyMedicalTracker } from '@/components/command-center/EmergencyMedicalTracker';
import { VoiceTranslationAutomation } from '@/components/command-center/VoiceTranslationAutomation';
import { SkeletonCard } from '@/components/ui/Skeleton';

export default function CommandCenterPage() {
  const { data } = useSimulation();

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Row 1: KPI Stats */}
      <StatsOverview data={data} />

      {/* Row 2: Map + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <StadiumMap data={data} />
        </div>
        <div className="lg:col-span-1">
          <AIInsightsPanel stadiumData={data} />
        </div>
      </div>

      {/* Row 3: Medical Emergencies & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EmergencyMedicalTracker medical={data.medical} />
        <SecurityAlerts alerts={data.security} />
      </div>

      {/* Row 4: Voice Translation Automation */}
      <div className="grid grid-cols-1 gap-4">
        <VoiceTranslationAutomation />
      </div>
    </div>
  );
}

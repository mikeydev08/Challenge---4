'use client';

import React, { useState } from 'react';
import { Siren, Phone, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAI } from '@/hooks/useAI';
import { useAccessibilityStore } from '@/lib/store/accessibility-store';
import { useStadiumStore } from '@/lib/store/stadium-store';

export function EmergencyGuide() {
  const { userType } = useAccessibilityStore();
  const { data } = useStadiumStore();
  const [guide, setGuide] = useState<string | null>(null);
  const { loading, execute } = useAI<{ response: string }>({
    endpoint: '/api/ai/accessibility',
  });

  const getEmergencyRoute = async () => {
    const result = await execute({
      type: 'emergency',
      userType,
      context: {
        currentLocation: 'Concourse A',
        emergencyType: 'severe-weather',
        matchStatus: data?.match?.status || 'idle',
        matchMinute: data?.match?.minute || 0,
        crowdDensity: data?.zones?.find(z => z.name === 'Concourse A')?.percentage || 0,
      },
    });
    if (result?.response) {
      setGuide(result.response);
    }
  };

  return (
    <Card hover={false} padding="md" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Siren className="w-4 h-4 text-red-400" />
          <CardTitle>Emergency Guide</CardTitle>
        </div>
        <Badge variant="critical">
          <Phone className="w-3 h-3" /> SOS
        </Badge>
      </CardHeader>

      <p className="text-xs text-slate-400 mb-3">
        Accessible emergency evacuation routes tailored to your mobility needs.
        Clear, calm, step-by-step instructions.
      </p>

      {/* Emergency buttons */}
      <div className="mb-4">
        <Button
          onClick={getEmergencyRoute}
          loading={loading}
          variant="danger"
          icon={<RefreshCw className="w-4 h-4" />}
          className="w-full"
        >
          Get Evacuation Route
        </Button>
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/15 text-center">
          <div className="text-xs text-red-400 font-medium">Nearest Exit</div>
          <div className="text-sm font-bold text-white mt-0.5">35m → Right</div>
        </div>
        <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/15 text-center">
          <div className="text-xs text-blue-400 font-medium">Emergency Elevator</div>
          <div className="text-sm font-bold text-white mt-0.5">25m → Ahead</div>
        </div>
      </div>

      {guide && (
        <div
          className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 animate-slide-up"
          role="alert"
          aria-live="assertive"
        >
          {guide.split('\n').map((line, i) => (
            <p key={i} className={`text-sm text-slate-200 leading-relaxed ${i > 0 ? 'mt-1.5' : ''}`}>
              {line.split(/(\*\*.*?\*\*)/).map((part, pi) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={pi} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                }
                return <span key={pi}>{part}</span>;
              })}
            </p>
          ))}
        </div>
      )}

      {!guide && !loading && (
        <div className="flex flex-col items-center py-4 text-slate-500">
          <Siren className="w-8 h-8 mb-2 opacity-20" />
          <p className="text-xs text-center">
            Tap above to get personalized emergency evacuation guidance
          </p>
        </div>
      )}
    </Card>
  );
}

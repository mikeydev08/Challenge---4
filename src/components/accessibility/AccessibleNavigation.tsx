'use client';

import React, { useState } from 'react';
import { Navigation, Route, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAI } from '@/hooks/useAI';
import { useAccessibilityStore } from '@/lib/store/accessibility-store';
import { useStadiumStore } from '@/lib/store/stadium-store';

export function AccessibleNavigation() {
  const { userType } = useAccessibilityStore();
  const { data } = useStadiumStore();
  const [route, setRoute] = useState<string | null>(null);
  const [destination, setDestination] = useState('My Seat (North Stand, Row F)');
  const { loading, execute } = useAI<{ response: string }>({
    endpoint: '/api/ai/accessibility',
  });

  const destinations = [
    'My Seat (North Stand, Row F)',
    'Nearest Accessible Washroom',
    'Food Court B',
    'First Aid Station',
    'Elevator to Level 2',
    'Exit — Gate 6',
  ];

  const getRoute = async () => {
    const result = await execute({
      type: 'navigation',
      userType,
      context: {
        from: 'Concourse A, Gate 3 area',
        to: destination,
        requirements: userType === 'mobility' ? ['no-stairs', 'elevator-only', 'wide-paths'] : ['avoid-crowds'],
        matchStatus: data?.match?.status || 'idle',
        matchMinute: data?.match?.minute || 0,
        crowdDensity: data?.zones?.find(z => z.name === 'Concourse A')?.percentage || 0,
      },
    });
    if (result?.response) {
      setRoute(result.response);
    }
  };

  return (
    <Card hover={false} padding="md" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <CardTitle>Accessible Navigation</CardTitle>
        </div>
        <Badge variant="success">
          <Route className="w-3 h-3" /> No Stairs
        </Badge>
      </CardHeader>

      <p className="text-xs text-slate-400 mb-3">
        Routes that avoid stairs, use elevators, and bypass crowded areas.
      </p>

      {/* Destination selector */}
      <div className="mb-3">
        <label className="text-xs text-slate-500 block mb-1.5" htmlFor="destination-select">Navigate to:</label>
        <select
          id="destination-select"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors"
        >
          {destinations.map((d) => (
            <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
          ))}
        </select>
      </div>

      <Button
        onClick={getRoute}
        loading={loading}
        icon={<RefreshCw className="w-4 h-4" />}
        variant="success"
        className="w-full mb-4"
      >
        Get Accessible Route
      </Button>

      {route && (
        <div
          className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 animate-slide-up"
          role="region"
          aria-label="Navigation route"
          aria-live="polite"
        >
          {route.split('\n').map((line, i) => (
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

      {!route && !loading && (
        <div className="flex flex-col items-center py-6 text-slate-500">
          <Navigation className="w-8 h-8 mb-2 opacity-20" />
          <p className="text-xs text-center">Select a destination and get an accessible route</p>
        </div>
      )}
    </Card>
  );
}

'use client';

import React, { useState } from 'react';
import { Eye, Camera, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAI } from '@/hooks/useAI';
import { useAccessibilityStore } from '@/lib/store/accessibility-store';
import { useStadiumStore } from '@/lib/store/stadium-store';

export function SceneDescriber() {
  const { userType } = useAccessibilityStore();
  const [description, setDescription] = useState<string | null>(null);
  const { loading, execute } = useAI<{ response: string }>({
    endpoint: '/api/ai/accessibility',
  });

  const { data } = useStadiumStore();

  const describeScene = async () => {
    const result = await execute({
      type: 'scene-description',
      userType,
      context: {
        currentLocation: 'Concourse A, near Gate 3',
        surroundings: ['Food Court B', 'Escalator bank', 'Washrooms', 'Gate 3 entrance'],
        matchStatus: data?.match?.status || 'idle',
        matchMinute: data?.match?.minute || 0,
        crowdDensity: data?.zones?.find(z => z.name === 'Concourse A')?.percentage || 0,
      },
    });
    if (result?.response) {
      setDescription(result.response);
    }
  };

  return (
    <Card hover={false} padding="md" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <CardTitle>AI Scene Description</CardTitle>
        </div>
        <Badge variant="info">
          <Camera className="w-3 h-3" /> Vision AI
        </Badge>
      </CardHeader>

      <p className="text-xs text-slate-400 mb-4">
        Uses Gemini Vision AI to describe your surroundings in detail — obstacles, distances,
        accessibility features, and hazards.
      </p>

      <Button
        onClick={describeScene}
        loading={loading}
        icon={<RefreshCw className="w-4 h-4" />}
        className="w-full mb-4"
      >
        Describe My Surroundings
      </Button>

      {description && (
        <div
          className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 animate-slide-up"
          role="region"
          aria-label="Scene description"
          aria-live="polite"
        >
          {description.split('\n').map((line, i) => (
            <p key={i} className={`text-sm text-slate-200 leading-relaxed ${i > 0 ? 'mt-2' : ''}`}>
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

      {!description && !loading && (
        <div className="flex flex-col items-center py-8 text-slate-500">
          <Eye className="w-10 h-10 mb-3 opacity-20" />
          <p className="text-xs text-center">
            Tap the button above to get an AI description of your current surroundings
          </p>
        </div>
      )}
    </Card>
  );
}

'use client';

import React, { useState, useCallback } from 'react';
import {
  Brain,
  CheckCircle,
  XCircle,
  Edit3,
  AlertTriangle,
  Info,
  AlertOctagon,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAI } from '@/hooks/useAI';
import { useStadiumStore } from '@/lib/store/stadium-store';
import type { StadiumData } from '@/lib/simulation/types';
import type { CommandCenterAIResponse, AIInsight } from '@/lib/ai/types';

interface AIInsightsPanelProps {
  stadiumData: StadiumData;
}

const priorityConfig = {
  critical: { icon: AlertOctagon, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', badge: 'critical' as const },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', badge: 'warning' as const },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', badge: 'info' as const },
  success: { icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', badge: 'success' as const },
};

export function AIInsightsPanel({ stadiumData }: AIInsightsPanelProps) {
  const { insights, addInsights, updateInsightStatus } = useStadiumStore();
  const { loading, execute } = useAI<CommandCenterAIResponse>({
    endpoint: '/api/ai/command-center',
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const requestAnalysis = useCallback(async () => {
    const result = await execute({ stadiumData });
    if (result?.insights) {
      addInsights(result.insights);
    }
  }, [execute, stadiumData, addInsights]);

  return (
    <Card hover={false} padding="md" className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary-400" />
          <CardTitle>AI Operational Insights</CardTitle>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={requestAnalysis}
          loading={loading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Analyze
        </Button>
      </CardHeader>

      {/* Insights list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 max-h-[500px]">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Brain className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Click &quot;Analyze&quot; to generate AI insights</p>
            <p className="text-xs mt-1">Gemini will analyze all live stadium data</p>
          </div>
        ) : (
          insights.map((insight) => {
            const config = priorityConfig[insight.priority as keyof typeof priorityConfig] || priorityConfig.info;
            const PriorityIcon = config.icon;
            const isExpanded = expanded === insight.id;

            return (
              <div
                key={insight.id}
                className={`rounded-xl border p-3 ${config.bg} transition-all duration-300`}
              >
                {/* Header */}
                <div className="flex items-start gap-2">
                  <PriorityIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{insight.title}</span>
                      <Badge variant={config.badge}>
                        {insight.priority}
                      </Badge>
                      {insight.status !== 'pending' && (
                        <Badge variant={insight.status === 'approved' ? 'success' : insight.status === 'rejected' ? 'critical' : 'info'}>
                          {insight.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {insight.description}
                    </p>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-3 space-y-2 animate-slide-down">
                        <div className="p-2 rounded-lg bg-white/5">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                            Reasoning
                          </div>
                          <p className="text-xs text-slate-300">{insight.reasoning}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                            Suggested Action
                          </div>
                          <p className="text-xs text-slate-300">{insight.suggestedAction}</p>
                        </div>
                        {insight.affectedZones.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-slate-500">Zones:</span>
                            {insight.affectedZones.map((zone) => (
                              <span key={zone} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                                {zone}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : insight.id)}
                        className="text-[10px] text-primary-400 hover:text-primary-300 font-medium"
                      >
                        {isExpanded ? 'Collapse' : 'View Details'}
                      </button>
                      {insight.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateInsightStatus(insight.id, 'approved')}
                            className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-medium"
                          >
                            <CheckCircle className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={() => updateInsightStatus(insight.id, 'modified')}
                            className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-medium"
                          >
                            <Edit3 className="w-3 h-3" /> Modify
                          </button>
                          <button
                            onClick={() => updateInsightStatus(insight.id, 'rejected')}
                            className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 font-medium"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

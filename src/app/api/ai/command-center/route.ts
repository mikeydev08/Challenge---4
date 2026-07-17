/* ═══════════════════════════════════════════════════════
   API: /api/ai/command-center
   Analyzes stadium data and returns operational insights.
   ═══════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/ai/gemini-client';
import { COMMAND_CENTER_PROMPT } from '@/lib/ai/prompts';
import type { CommandCenterAIResponse } from '@/lib/ai/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stadiumData } = body;

    if (!stadiumData) {
      return NextResponse.json(
        { error: 'Missing stadiumData' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      // Return mock insights when no API key
      return NextResponse.json({
        insights: getMockInsights(stadiumData),
      });
    }

    const userPrompt = `Analyze the following real-time stadium data and provide operational insights:\n\n${JSON.stringify(stadiumData, null, 2)}`;

    const response = await generateJSON<CommandCenterAIResponse>(
      COMMAND_CENTER_PROMPT,
      userPrompt
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Command Center AI error:', error);
    return NextResponse.json(
      { error: 'AI analysis failed', insights: [] },
      { status: 500 }
    );
  }
}

/* ── Mock insights when no API key is available ── */

function getMockInsights(data: Record<string, unknown>): unknown[] {
  const stadiumData = data as Record<string, unknown>;
  const context = stadiumData.tournamentContext as Record<string, unknown>;
  const isIdle = context?.stadiumMode === 'idle' || context?.stadiumMode === 'post-match';
  const isPreMatch = context?.stadiumMode === 'pre-match';

  if (isIdle) {
    return [
      {
        priority: 'info' as const,
        title: 'Stadium in Idle Mode',
        description: 'No active matches today. Next match is scheduled for tomorrow.',
        reasoning: 'Tournament schedule confirms no events for the next 24 hours. Stadium is operating on minimal power and security skeleton crew.',
        suggestedAction: 'Initiate overnight maintenance protocols for South Stand and Fan Zone.',
        affectedZones: ['All Zones'],
      },
      {
        priority: 'success' as const,
        title: 'Energy Conservation Active',
        description: 'HVAC and lighting systems have been scaled down in unoccupied concourses.',
        reasoning: 'With zero attendance expected today, IoT sensors have triggered the automated sustainability profile.',
        suggestedAction: 'Review daily energy savings report in the Analytics tab.',
        affectedZones: ['Concourse A', 'Concourse B'],
      },
    ];
  }

  if (isPreMatch) {
    return [
      {
        priority: 'warning' as const,
        title: 'Early Arrival Surge Expected',
        description: 'Predictive models indicate a 30% higher early arrival rate than the historical average.',
        reasoning: 'Metro delays on Line 2 have cleared, and weather is optimal, encouraging fans to arrive 3+ hours early.',
        suggestedAction: 'Open Gates 1-4 an hour earlier than scheduled and deploy early-shift volunteers to the Fan Zone.',
        affectedZones: ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Fan Zone'],
      },
      {
        priority: 'info' as const,
        title: 'Pre-Match Food Staging',
        description: 'Recommend pre-staging inventory at major food stalls in the lower bowl.',
        reasoning: 'Inventory sensors indicate that VIP Lounge and South Stand stalls are 15% below target capacity for kickoff.',
        suggestedAction: 'Dispatch logistics carts to restock Taco Fiesta and Noodle Bar.',
        affectedZones: ['South Stand', 'VIP Lounge'],
      },
    ];
  }

  // Active match insights
  const gates = (stadiumData.gates as Array<{ name: string; queueLength: number }>) || [];
  const busiestGate = gates.reduce((max, g) => g.queueLength > max.queueLength ? g : max, gates[0]);

  return [
    {
      priority: 'warning' as const,
      title: `${busiestGate?.name || 'Gate 4'} Approaching Capacity`,
      description: `${busiestGate?.name || 'Gate 4'} queue has reached ${busiestGate?.queueLength || 340} people, approaching the 400-person safety threshold.`,
      reasoning: `Queue growth rate of ~15 people/minute suggests threshold breach in approximately 4 minutes. Current scan rate is below optimal throughput.`,
      suggestedAction: `Open additional scanning lanes at ${busiestGate?.name || 'Gate 4'}. Activate digital signage to redirect fans to Gate 5 and Gate 6.`,
      affectedZones: [busiestGate?.name || 'Gate 4', 'Concourse A'],
    },
    {
      priority: 'info' as const,
      title: 'Half-Time Food Rush Predicted',
      description: 'Based on current match time, a 200% increase in food stall queues is expected in 12 minutes.',
      reasoning: 'Historical data shows food stall demand peaks within 2 minutes of half-time whistle. Pre-staging additional staff can reduce average wait times by 40%.',
      suggestedAction: 'Alert food stall managers to prepare for surge. Consider opening backup service windows at Taco Fiesta and Burger Barn.',
      affectedZones: ['Concourse A', 'Concourse B'],
    },
    {
      priority: 'success' as const,
      title: 'North Stand Flow Optimized',
      description: 'North Stand crowd density has stabilized at 72% after implementing last hour\'s re-routing suggestion.',
      reasoning: 'Zone density dropped from 89% to 72% following Gate 2 redirect. Fan satisfaction indicators remain positive.',
      suggestedAction: 'Maintain current configuration. Continue monitoring for any upward trends.',
      affectedZones: ['North Stand'],
    },
  ];
}

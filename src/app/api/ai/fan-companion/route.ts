/* ═══════════════════════════════════════════════════════
   API: /api/ai/fan-companion
   Personal AI assistant for spectators.
   ═══════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/ai/gemini-client';
import { FAN_COMPANION_PROMPT } from '@/lib/ai/prompts';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, fanProfile, stadiumContext } = body;

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response: getMockResponse(message),
      });
    }

    const contextPrompt = `
Fan Profile:
${JSON.stringify(fanProfile, null, 2)}

Current Stadium Context:
${JSON.stringify(stadiumContext, null, 2)}

Fan Message: "${message}"

Respond naturally and helpfully.`;

    const response = await generateText(FAN_COMPANION_PROMPT, contextPrompt);

    return NextResponse.json({ response });
  } catch (error: unknown) {
    console.error('Fan Companion AI error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'AI response failed', response: `I'm sorry, I'm having trouble connecting right now. Please try again in a moment.` },
      { status: 500 }
    );
  }
}

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('food') || lower.includes('eat') || lower.includes('hungry')) {
    return `🍔 Great question! Based on your vegetarian preferences, here are my top picks:\n\n1. **Falafel House** (North Stand) — 4 min wait\n   → Try the Loaded Falafel Bowl — fans love it!\n\n2. **Smoothie Station** (Fan Zone) — 2 min wait\n   → Fresh mango smoothie is perfect for this heat\n\n3. **Pizza Roma** (West Stand) — 8 min wait\n   → Margherita & Quattro Formaggi are veggie-friendly\n\n💡 **Pro tip**: Falafel House has the shortest queue right now. Want me to navigate you there?`;
  }

  if (lower.includes('washroom') || lower.includes('bathroom') || lower.includes('toilet') || lower.includes('restroom')) {
    return `🚻 Here are the nearest washrooms from your location (Concourse A):\n\n1. **Section A Washroom** — 45m away, ~2 min wait\n2. **North Stand Washroom** — 80m away, ~5 min wait\n3. **Accessible Washroom** — 60m away, no wait ♿\n\n📍 **Directions to the nearest one**: Head straight past Food Court B, turn left at the escalators. It's on your right.\n\nWant turn-by-turn navigation?`;
  }

  if (lower.includes('seat') || lower.includes('navigate') || lower.includes('find') || lower.includes('where')) {
    return `🧭 I'll guide you to your seat!\n\n**Your Seat**: Section North Stand, Row F, Seat 24\n\n📍 From your current location (Concourse A):\n1. Walk straight 80m toward Gate 3\n2. Take the escalator to Level 2\n3. Enter through Tunnel N-3\n4. Walk left along the row — your seat is 6 seats in\n\n⏱️ Estimated walk time: **4 minutes**\n\nThe view from your seat is excellent — you'll have a clear view of the north goal! ⚽`;
  }

  if (lower.includes('exit') || lower.includes('leave') || lower.includes('go home')) {
    return `🚪 Smart thinking to plan ahead! Here's your exit analysis:\n\n**Best option right now**:\n→ **Gate 6** — estimated 8 min wait\n→ Save ~18 min vs Gate 1 (busiest)\n\n📍 Directions: Head through Concourse B, follow signs to Gate 6\n\n🚇 **Metro**: Line 2 departing every 4 min (moderate crowding)\n🅿️ **Parking**: Lot B exit is clearest — ~6 min to your car\n🚕 **Rideshare**: ~12 min wait, 1.8x surge pricing\n\n💡 If you wait 15 minutes after full-time, exit wait drops to ~3 min.`;
  }

  if (lower.includes('score') || lower.includes('match') || lower.includes('game')) {
    return `⚽ **Live Match Update**\n\n🇧🇷 Brazil 2 — 1 Germany 🇩🇪\n\n⏱️ 67th minute\n\n**Recent Events**:\n• 64' ⚽ Vinícius Jr. (Brazil) — Beautiful curling shot from outside the box!\n• 52' ⚽ Müller (Germany) — Header from corner kick\n• 38' ⚽ Neymar Jr. (Brazil) — Penalty kick converted\n\n📊 Possession: Brazil 54% — 46% Germany\n🎯 Shots: 12 — 8\n\nBrazil looking strong! Shall I explain any of the plays?`;
  }

  return `Hey there! 👋 I'd be happy to help you with that.\n\nHere are some things I can assist with:\n\n🧭 **"Navigate to my seat"** — Turn-by-turn directions\n🍔 **"Find food near me"** — Personalized recommendations\n🚻 **"Nearest washroom"** — With queue times\n📊 **"Match score"** — Live updates\n🚪 **"Best exit"** — Beat the crowd\n⚡ **"Charging station"** — Nearest power outlet\n\nJust ask naturally — I'm here to make your World Cup experience amazing! 🏆`;
}

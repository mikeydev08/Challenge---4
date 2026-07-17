/* ═══════════════════════════════════════════════════════
   API: /api/ai/accessibility
   Scene description, navigation, and emergency guidance.
   ═══════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/ai/gemini-client';
import { ACCESSIBILITY_PROMPT } from '@/lib/ai/prompts';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, context, userType } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing type' }, { status: 400 });
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response: getMockAccessibilityResponse(type, userType),
      });
    }

    const userPrompt = `
Request type: ${type}
User accessibility profile: ${userType || 'general'}
Context: ${JSON.stringify(context || {})}

Provide assistance based on the request type and user's accessibility needs.`;

    const response = await generateText(ACCESSIBILITY_PROMPT, userPrompt);

    return NextResponse.json({ response });
  } catch (error: unknown) {
    console.error('Accessibility AI error:', error);
    return NextResponse.json(
      { error: 'AI response failed', response: `Error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

function getMockAccessibilityResponse(type: string, userType?: string): string {
  switch (type) {
    case 'scene-description':
      return `📍 **Scene Description**\n\nYou are currently in Concourse A, near Gate 3.\n\n**Surroundings:**\n- To your left (2 meters): Food Court B with Taco Fiesta and Burger Barn\n- Straight ahead (8 meters): Escalator bank — 3 escalators, 1 elevator on the far right\n- To your right (5 meters): Washroom entrance, clearly marked\n- Behind you: Gate 3 entrance, 15 meters\n\n**Floor surface**: Smooth concrete, no changes in level\n**Lighting**: Well-lit, overhead fluorescent\n**Crowd density**: Moderate — approximately 40 people visible\n\n⚠️ **Hazard**: Wet floor sign 3 meters ahead, near the drink fountain.\n\n♿ **Accessibility**: Elevator available to your right. Tactile floor guides lead to all gates.`;

    case 'navigation':
      if (userType === 'mobility') {
        return `🧭 **Accessible Route to Your Seat (North Stand, Row F)**\n\n✅ This route avoids stairs and uses elevators only.\n\n1. From your current location, proceed straight 20m\n2. Take the **elevator** on the right (clearly marked with ♿ symbol)\n3. Press **Level 2**\n4. Exit elevator, turn left\n5. Follow the ramp (gentle 5° incline, 30m)\n6. Enter through **Accessible Entrance N-A** (automated doors)\n7. Wheelchair space is at Row F, Position 24\n\n⏱️ Estimated time: **6 minutes**\n📏 Total distance: **180 meters**\n\n**Assistance available**: Press the help button in the elevator or ask any volunteer (yellow vests).`;
      }
      return `🧭 **Navigation Assistance**\n\nYou are in Concourse A.\n\n**To reach your seat (North Stand, Row F, Seat 24):**\n\n1. Walk straight ahead 20 meters — the floor is smooth and level\n2. You will reach the elevator bank — the elevator is on the far right\n3. Take the elevator to Level 2\n4. Upon exiting, turn left. There is a handrail on the right wall\n5. Walk 40 meters along the corridor\n6. Enter Tunnel N-3 — there is a gentle downward slope\n7. Your seat is 6 seats from the left in Row F\n\n**Tactile markers** are available along the main corridor.\n**Audio beacons** will guide you at each turn point.`;

    case 'emergency':
      return `🚨 **Emergency Evacuation Route**\n\n⚠️ CALM AND CLEAR INSTRUCTIONS:\n\n1. From your current location, move toward the GREEN exit signs\n2. The nearest **accessible emergency exit** is 35 meters to your right\n3. Follow the tactile floor strips (raised lines under your feet)\n4. An **emergency elevator** is available at Point E-3 (25m ahead)\n5. Ground-level assembly point: **Area P2** in the parking lot\n\n**DO NOT use escalators during emergencies**\n\n📞 Emergency volunteers are stationed every 50 meters in yellow vests\n📞 Emergency helpline: Press the red button on any wall panel\n\n♿ Wheelchair users: Emergency personnel will assist. Stay near elevator Point E-3.\n\nStay calm. Help is available. You are safe.`;

    default:
      return `I'm here to help with accessibility assistance. I can:\n\n👁️ **Describe scenes** — Detailed surroundings description\n🧭 **Navigate** — Accessible routes avoiding stairs\n🚨 **Emergency guidance** — Accessible evacuation routes\n💬 **Live captions** — Real-time text for announcements\n🌐 **Translate** — Multilingual support\n\nWhat would you like help with?`;
  }
}

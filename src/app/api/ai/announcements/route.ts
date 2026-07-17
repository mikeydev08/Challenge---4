/* ═══════════════════════════════════════════════════════
   API: /api/ai/announcements
   Generates multilingual announcements.
   ═══════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/ai/gemini-client';
import { ANNOUNCEMENT_PROMPT } from '@/lib/ai/prompts';
import type { AnnouncementTranslations } from '@/lib/ai/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, priority } = body;

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        translations: getMockTranslations(text),
      });
    }

    const userPrompt = `Translate this ${priority || 'routine'} stadium announcement into all supported languages:\n\n"${text}"`;

    const response = await generateJSON<AnnouncementTranslations>(
      ANNOUNCEMENT_PROMPT,
      userPrompt
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Announcement AI error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

function getMockTranslations(text: string): Record<string, string> {
  return {
    en: text,
    es: `[ES] ${text}`,
    fr: `[FR] ${text}`,
    ar: `[AR] ${text}`,
    ja: `[JA] ${text}`,
    hi: `[HI] ${text}`,
  };
}

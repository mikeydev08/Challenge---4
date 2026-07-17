/* ═══════════════════════════════════════════════════════
   StadiumMind AI — Gemini Client
   Lazy-initialised singleton for Google AI (Gemini 2.5).
   ═══════════════════════════════════════════════════════ */

import { GoogleGenAI } from '@google/genai';

let _client: GoogleGenAI | null = null;

/**
 * Returns a lazily-initialised GoogleGenAI client.
 *
 * Uses API key if GEMINI_API_KEY is set, otherwise falls
 * back to Vertex AI ADC credentials for Cloud Run.
 */
export function getGeminiClient(): GoogleGenAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      _client = new GoogleGenAI({ apiKey });
    } else {
      _client = new GoogleGenAI({
        vertexai: true,
        project: process.env.GOOGLE_CLOUD_PROJECT_ID || 'stadiummind-ai',
        location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
      } as unknown as { apiKey: string });
    }
  }
  return _client;
}

/** Model identifier used across all API routes. */
export const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * Convenience wrapper: send a prompt with a system instruction
 * and return the text response.
 */
export async function generateText(
  systemInstruction: string,
  userPrompt: string,
): Promise<string> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: userPrompt,
    config: {
      systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  });

  return response.text || 'No response generated.';
}

/**
 * Generate structured JSON from Gemini.
 */
export async function generateJSON<T>(
  systemInstruction: string,
  userPrompt: string,
): Promise<T> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.6,
      maxOutputTokens: 8192,
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  return JSON.parse(text) as T;
}

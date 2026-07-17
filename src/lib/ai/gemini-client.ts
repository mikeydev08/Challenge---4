/* ═══════════════════════════════════════════════════════
   StadiumMind AI — Gemini Client
   Lazy-initialised singleton for Google AI (Gemini 2.5).
   Provides convenience wrappers for text and JSON generation.
   ═══════════════════════════════════════════════════════ */

import { GoogleGenAI } from '@google/genai';

/** Default temperature for conversational text generation. */
const DEFAULT_TEXT_TEMPERATURE = 0.7;

/** Default temperature for structured JSON generation. */
const DEFAULT_JSON_TEMPERATURE = 0.6;

/** Maximum output tokens for text generation requests. */
const MAX_TEXT_TOKENS = 4096;

/** Maximum output tokens for JSON generation requests. */
const MAX_JSON_TOKENS = 8192;

/** Default GCP project ID when running on Cloud Run without an API key. */
const DEFAULT_PROJECT_ID = 'stadiummind-ai';

/** Default GCP region for Vertex AI. */
const DEFAULT_LOCATION = 'us-central1';

let _client: GoogleGenAI | null = null;

/**
 * Returns a lazily-initialised GoogleGenAI client.
 *
 * Uses the `GEMINI_API_KEY` environment variable when available.
 * Falls back to Vertex AI Application Default Credentials (ADC)
 * for Cloud Run deployments where the API key is not set.
 *
 * @returns The singleton {@link GoogleGenAI} instance.
 */
export function getGeminiClient(): GoogleGenAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      _client = new GoogleGenAI({ apiKey });
    } else {
      _client = new GoogleGenAI({
        vertexai: true,
        project: process.env.GOOGLE_CLOUD_PROJECT_ID || DEFAULT_PROJECT_ID,
        location: process.env.GOOGLE_CLOUD_LOCATION || DEFAULT_LOCATION,
      } as unknown as { apiKey: string });
    }
  }
  return _client;
}

/** Model identifier used across all API routes. */
export const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * Sends a prompt to Gemini and returns the plain-text response.
 *
 * @param systemInstruction - The system-level prompt that defines
 *   the AI's persona and behaviour constraints.
 * @param userPrompt - The user-facing query or data payload.
 * @returns The generated text, or a fallback message if the
 *   model returns an empty response.
 * @throws {Error} If the underlying API call fails.
 */
export async function generateText(
  systemInstruction: string,
  userPrompt: string,
): Promise<string> {
  if (!systemInstruction || !userPrompt) {
    throw new Error('Both systemInstruction and userPrompt are required.');
  }

  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: userPrompt,
    config: {
      systemInstruction,
      temperature: DEFAULT_TEXT_TEMPERATURE,
      maxOutputTokens: MAX_TEXT_TOKENS,
    },
  });

  return response.text || 'No response generated.';
}

/**
 * Sends a prompt to Gemini and parses the response as typed JSON.
 *
 * Configures the model to return `application/json` so that the
 * output can be directly deserialised into the target type.
 *
 * @typeParam T - The expected shape of the parsed JSON response.
 * @param systemInstruction - The system-level prompt defining the
 *   AI's persona and output schema.
 * @param userPrompt - The user-facing query or data payload.
 * @returns The parsed JSON response cast to `T`.
 * @throws {Error} If the model returns an empty response or
 *   the text cannot be parsed as valid JSON.
 */
export async function generateJSON<T>(
  systemInstruction: string,
  userPrompt: string,
): Promise<T> {
  if (!systemInstruction || !userPrompt) {
    throw new Error('Both systemInstruction and userPrompt are required.');
  }

  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: DEFAULT_JSON_TEMPERATURE,
      maxOutputTokens: MAX_JSON_TOKENS,
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  return JSON.parse(text) as T;
}

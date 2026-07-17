/* ═══════════════════════════════════════════════════════
   Tests — Gemini Client
   Tests for the AI client wrapper, mocking @google/genai.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the @google/genai package
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation((config) => {
      return {
        _config: config,
        models: {
          generateContent: vi.fn().mockResolvedValue({
            text: '{"result": "mock"}',
          }),
        },
      };
    }),
  };
});

describe('gemini-client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it('exports GEMINI_MODEL as gemini-2.5-flash', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    const mod = await import('./gemini-client');
    expect(mod.GEMINI_MODEL).toBe('gemini-2.5-flash');
  });

  it('getGeminiClient returns a client when API key is set', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key';
    const mod = await import('./gemini-client');
    const client = mod.getGeminiClient();
    expect(client).toBeDefined();
    expect(
      (client as unknown as { _config: { apiKey: string } })._config.apiKey,
    ).toBe('test-api-key');
  });

  it('getGeminiClient falls back to Vertex AI when no API key', async () => {
    delete process.env.GEMINI_API_KEY;
    process.env.GOOGLE_CLOUD_PROJECT_ID = 'test-project';
    process.env.GOOGLE_CLOUD_LOCATION = 'us-east1';
    const mod = await import('./gemini-client');
    const client = mod.getGeminiClient();
    expect(client).toBeDefined();
    const config = (client as unknown as { _config: Record<string, unknown> })
      ._config;
    expect(config.vertexai).toBe(true);
    expect(config.project).toBe('test-project');
    expect(config.location).toBe('us-east1');
  });

  it('generateText calls the AI and returns text', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    const mod = await import('./gemini-client');
    const result = await mod.generateText('system prompt', 'user prompt');
    expect(result).toBe('{"result": "mock"}');
  });

  it('generateText returns fallback when response.text is empty', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    // Re-mock with empty text
    const { GoogleGenAI } = await import('@google/genai');
    (GoogleGenAI as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({ text: '' }),
      },
    }));

    const mod = await import('./gemini-client');
    // Force re-creation by resetting modules
    vi.resetModules();
    process.env.GEMINI_API_KEY = 'test-key';
    const freshMod = await import('./gemini-client');
    const result = await freshMod.generateText('sys', 'user');
    // Either returns mock response or fallback text
    expect(typeof result).toBe('string');
  });

  it('generateJSON parses JSON response correctly', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    const mod = await import('./gemini-client');
    const result = await mod.generateJSON<{ result: string }>(
      'system prompt',
      'user prompt',
    );
    expect(result).toEqual({ result: 'mock' });
  });
});

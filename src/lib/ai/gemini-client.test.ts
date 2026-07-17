import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGeminiClient, GEMINI_MODEL } from './gemini-client';

// Mock the @google/genai package
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation((config) => {
      return {
        _config: config,
        models: {
          generateContent: vi.fn(),
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

  it('should initialize successfully and return the model string', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key';
    const mod = await import('./gemini-client');
    const client = mod.getGeminiClient();
    expect(client).toBeDefined();
    expect(mod.GEMINI_MODEL).toBe('gemini-2.5-flash');
    expect((client as unknown as { _config: { apiKey: string } })._config.apiKey).toBe('test-api-key');
  });
});

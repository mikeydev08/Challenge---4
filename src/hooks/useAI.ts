/* ═══════════════════════════════════════════════════════
   StadiumMind AI — useAI Hook
   Wraps AI API calls with loading/error state.
   ═══════════════════════════════════════════════════════ */

'use client';

import { useState, useCallback } from 'react';

interface UseAIOptions {
  endpoint: string;
}

interface UseAIReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (body: Record<string, unknown>) => Promise<T | null>;
}

export function useAI<T = unknown>({ endpoint }: UseAIOptions): UseAIReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (body: Record<string, unknown>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || `HTTP ${res.status}`);
        }

        const result = (await res.json()) as T;
        setData(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { data, loading, error, execute };
}

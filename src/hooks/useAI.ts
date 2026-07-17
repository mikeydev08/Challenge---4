/* ═══════════════════════════════════════════════════════
   StadiumMind AI — useAI Hook
   Wraps AI API calls with loading/error state.
   ═══════════════════════════════════════════════════════ */

'use client';

import { useState, useCallback } from 'react';

/** Configuration options for the {@link useAI} hook. */
interface UseAIOptions {
  /** The API endpoint URL to send POST requests to. */
  endpoint: string;
}

/** Return type of the {@link useAI} hook. */
interface UseAIReturn<T> {
  /** The most recent successful response data, or `null`. */
  data: T | null;
  /** Whether a request is currently in flight. */
  loading: boolean;
  /** Human-readable error message from the last failed request. */
  error: string | null;
  /** Sends a POST request to the endpoint with the given body. */
  execute: (body: Record<string, unknown>) => Promise<T | null>;
}

/**
 * React hook for making AI API calls with loading and error state.
 *
 * Wraps a POST fetch to the given `endpoint` and manages
 * `loading`, `error`, and `data` state automatically.
 *
 * @typeParam T - The expected response data shape.
 * @param options - Hook configuration containing the API endpoint.
 * @returns An object with `data`, `loading`, `error`, and `execute`.
 *
 * @example
 * ```tsx
 * const { data, loading, execute } = useAI<InsightsResponse>({
 *   endpoint: '/api/ai/command-center',
 * });
 * ```
 */
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

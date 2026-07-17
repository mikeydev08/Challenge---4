/* ═══════════════════════════════════════════════════════
   StadiumMind AI — useSimulation Hook
   Subscribes to the SSE simulation stream.
   ═══════════════════════════════════════════════════════ */

'use client';

import { useEffect, useRef } from 'react';
import { useStadiumStore } from '@/lib/store/stadium-store';
import type { StadiumData } from '@/lib/simulation/types';

export function useSimulation() {
  const { setData, setConnected, data, connected } = useStadiumStore();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connect = () => {
      const es = new EventSource('/api/simulation');
      eventSourceRef.current = es;

      es.onopen = () => setConnected(true);

      es.onmessage = (event) => {
        try {
          const parsed: StadiumData = JSON.parse(event.data);
          setData(parsed);
        } catch {
          console.error('Failed to parse simulation data');
        }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        // Reconnect after 3s
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      eventSourceRef.current?.close();
      setConnected(false);
    };
  }, [setData, setConnected]);

  return { data, connected };
}

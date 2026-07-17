/* ═══════════════════════════════════════════════════════
   API: /api/simulation — SSE Stream
   Sends real-time stadium data every 3 seconds.
   ═══════════════════════════════════════════════════════ */

import { generateStadiumData } from '@/lib/simulation/data-generator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial data immediately
      const initial = generateStadiumData();
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initial)}\n\n`)
      );

      // Stream updates every 3 seconds
      const interval = setInterval(() => {
        try {
          const data = generateStadiumData();
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          clearInterval(interval);
        }
      }, 3000);

      // Handle client disconnect properly
      if (request.signal) {
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
        });
      }

      // Clean up on close
      const cleanup = () => {
        clearInterval(interval);
        try { controller.close(); } catch { /* already closed */ }
      };

      // Auto-close after 5 minutes to prevent zombie connections
      setTimeout(cleanup, 5 * 60 * 1000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}

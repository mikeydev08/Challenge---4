'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Activity,
  Calendar,
} from 'lucide-react';
import { LiveIndicator } from '@/components/ui/LiveIndicator';

export default function MatchCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-0 bg-grid">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 glass-heavy border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" style={{ color: '#fbbf24' }} />
              <span className="font-bold text-white text-sm sm:text-base">
                Match Center
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <LiveIndicator />
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-time schedule</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-600/20 border border-yellow-500/30">
              <Calendar className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />
              <span className="text-xs font-medium" style={{ color: '#fcd34d' }}>FIFA WC 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 py-4">
        {children}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ArrowLeft,
  Shield,
  Activity,
} from 'lucide-react';
import { LiveIndicator } from '@/components/ui/LiveIndicator';

export default function CommandCenterLayout({
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
              <Shield className="w-5 h-5 text-primary-400" />
              <span className="font-bold text-white text-sm sm:text-base">
                AI Command Center
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <LiveIndicator />
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-time • 3s refresh</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600/20 border border-primary-500/30">
              <LayoutDashboard className="w-3.5 h-3.5 text-primary-400" />
              <span className="text-xs font-medium text-primary-300">Operations</span>
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

'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Smartphone,
} from 'lucide-react';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { ChatInterface } from '@/components/fan-companion/ChatInterface';
import { FanProfile } from '@/components/fan-companion/FanProfile';
import { QuickActions } from '@/components/fan-companion/QuickActions';
import { MatchSummary } from '@/components/fan-companion/MatchSummary';
import { ExitPredictor } from '@/components/fan-companion/ExitPredictor';
import { useSimulation } from '@/hooks/useSimulation';
import { SkeletonCard } from '@/components/ui/Skeleton';

export default function FanCompanionPage() {
  const { data } = useSimulation();

  return (
    <div className="min-h-screen bg-surface-0 bg-grid">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-heavy border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
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
              <Smartphone className="w-5 h-5 text-accent-400" />
              <span className="font-bold text-white">AI Fan Companion</span>
            </div>
          </div>
          <LiveIndicator />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4">
        {!data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2"><SkeletonCard /></div>
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Chat */}
            <div className="lg:col-span-2 flex flex-col">
              <ChatInterface stadiumData={data} />
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-4">
              <FanProfile />
              <QuickActions />
              <MatchSummary data={data} />
              <ExitPredictor gates={data.gates} transport={data.transport} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

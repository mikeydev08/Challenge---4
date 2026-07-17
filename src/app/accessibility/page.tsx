'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Accessibility,
} from 'lucide-react';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { SceneDescriber } from '@/components/accessibility/SceneDescriber';
import { LiveCaptions } from '@/components/accessibility/LiveCaptions';
import { AccessibleNavigation } from '@/components/accessibility/AccessibleNavigation';
import { EmergencyGuide } from '@/components/accessibility/EmergencyGuide';
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls';

export default function AccessibilityPage() {
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
              <Accessibility className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-white">Accessibility AI</span>
            </div>
          </div>
          <LiveIndicator />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        {/* Accessibility controls at the top */}
        <AccessibilityControls />

        {/* Main features grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SceneDescriber />
          <AccessibleNavigation />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LiveCaptions />
          <EmergencyGuide />
        </div>
      </div>
    </div>
  );
}

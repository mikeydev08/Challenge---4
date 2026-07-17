'use client';

import React from 'react';
import {
  Eye,
  Bell,
  Activity,
  Heart,
  Settings,
  Sun,
  Volume2,
  Monitor,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAccessibilityStore } from '@/lib/store/accessibility-store';

export function AccessibilityControls() {
  const store = useAccessibilityStore();

  const userTypes = [
    { value: 'visual' as const, icon: Eye, label: 'Visual', desc: 'Screen reader & voice' },
    { value: 'hearing' as const, icon: Bell, label: 'Hearing', desc: 'Captions & visual alerts' },
    { value: 'mobility' as const, icon: Activity, label: 'Mobility', desc: 'Accessible routes' },
    { value: 'elderly' as const, icon: Heart, label: 'Elderly', desc: 'Large text & simple UI' },
    { value: 'general' as const, icon: Settings, label: 'General', desc: 'Standard accessibility' },
  ];

  return (
    <Card hover={false} padding="md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <CardTitle>Accessibility Settings</CardTitle>
        </div>
      </CardHeader>

      {/* User type selector */}
      <div className="mb-4">
        <div className="text-xs text-slate-500 mb-2">I need assistance for:</div>
        <div className="flex flex-wrap gap-2">
          {userTypes.map(({ value, icon: Icon, label, desc }) => (
            <button
              key={value}
              onClick={() => store.setUserType(value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                store.userType === value
                  ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                  : 'bg-white/3 border-white/8 text-slate-400 hover:bg-white/5'
              }`}
              aria-pressed={store.userType === value}
            >
              <Icon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-xs font-medium">{label}</div>
                <div className="text-[10px] opacity-60">{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Font size */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Monitor className="w-3 h-3" /> Font Size
          </div>
          <div className="flex gap-1">
            {(['normal', 'large', 'extra-large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => store.setFontSize(size)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
                  store.fontSize === size
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-white/3 border-white/8 text-slate-400 hover:bg-white/5'
                }`}
                aria-pressed={store.fontSize === size}
              >
                {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>
        </div>

        {/* High contrast */}
        <ToggleControl
          icon={Sun}
          label="High Contrast"
          checked={store.highContrast}
          onChange={store.setHighContrast}
        />

        {/* Screen reader */}
        <ToggleControl
          icon={Volume2}
          label="Screen Reader"
          checked={store.screenReaderMode}
          onChange={store.setScreenReaderMode}
        />

        {/* Reduced motion */}
        <ToggleControl
          icon={Settings}
          label="Reduced Motion"
          checked={store.reducedMotion}
          onChange={store.setReducedMotion}
        />
      </div>
    </Card>
  );
}

function ToggleControl({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
          checked
            ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
            : 'bg-white/3 border-white/8 text-slate-400 hover:bg-white/5'
        }`}
      >
        {checked ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}

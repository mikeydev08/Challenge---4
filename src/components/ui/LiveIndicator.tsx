'use client';

import React from 'react';

interface LiveIndicatorProps {
  label?: string;
  className?: string;
}

export function LiveIndicator({ label = 'LIVE', className = '' }: LiveIndicatorProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-400 ${className}`}
      aria-label={`${label} - data is streaming in real time`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
      </span>
      {label}
    </span>
  );
}

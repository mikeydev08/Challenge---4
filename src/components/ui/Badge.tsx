'use client';

import React from 'react';

type BadgeVariant = 'live' | 'warning' | 'critical' | 'info' | 'success' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  live: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  neutral: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export function Badge({
  children,
  variant = 'neutral',
  pulse = false,
  className = '',
  icon,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${variantStyles[variant]} ${className}`}
    >
      {pulse && (
        <span className={`status-dot ${variant === 'live' || variant === 'success' ? 'status-dot-live' : variant === 'warning' ? 'status-dot-warning' : variant === 'critical' ? 'status-dot-danger' : 'status-dot-live'}`} />
      )}
      {icon}
      {children}
    </span>
  );
}

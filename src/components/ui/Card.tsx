'use client';

import React from 'react';

type CardVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default: '',
  success: 'glass-card-success',
  warning: 'glass-card-warning',
  danger: 'glass-card-danger',
  info: 'glass-card-info',
};

const paddingClasses = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({
  children,
  variant = 'default',
  className = '',
  hover = true,
  padding = 'md',
  onClick,
}: CardProps) {
  const base = hover ? 'glass-card' : 'glass';
  const role = onClick ? 'button' : undefined;
  const tabIndex = onClick ? 0 : undefined;

  return (
    <div
      className={`${base} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-sm font-semibold text-slate-300 uppercase tracking-wider ${className}`}>
      {children}
    </h3>
  );
}

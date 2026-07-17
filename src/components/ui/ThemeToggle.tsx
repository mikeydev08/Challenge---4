'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
  className?: string;
}

export function ThemeToggle({ theme, onChange, className = '' }: ThemeToggleProps) {
  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'dark', icon: <Moon size={14} />, label: 'Dark mode' },
    { value: 'light', icon: <Sun size={14} />, label: 'Light mode' },
    { value: 'system', icon: <Monitor size={14} />, label: 'System preference' },
  ];

  return (
    <div
      className={`inline-flex items-center gap-0.5 p-1 rounded-xl bg-white/5 border border-white/10 ${className}`}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          className={`p-2 rounded-lg transition-all duration-200 ${
            theme === value
              ? 'bg-primary-600/80 text-white shadow-neon-blue'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

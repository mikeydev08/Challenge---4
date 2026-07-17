'use client';

import React from 'react';

interface GaugeProps {
  value: number; // 0-100
  max?: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'auto';
  showValue?: boolean;
  suffix?: string;
}

const sizeConfig = {
  sm: { r: 30, stroke: 6, text: 'text-lg', container: 'w-20 h-20' },
  md: { r: 40, stroke: 7, text: 'text-2xl', container: 'w-28 h-28' },
  lg: { r: 52, stroke: 8, text: 'text-3xl', container: 'w-36 h-36' },
};

function getAutoColor(value: number): string {
  if (value < 50) return '#22c55e';
  if (value < 75) return '#eab308';
  if (value < 90) return '#f97316';
  return '#ef4444';
}

const colorMap: Record<string, string> = {
  blue: '#3478ff',
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
};

export function Gauge({
  value,
  max = 100,
  label,
  size = 'md',
  color = 'auto',
  showValue = true,
  suffix = '%',
}: GaugeProps) {
  const config = sizeConfig[size];
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;
  const circumference = 2 * Math.PI * config.r;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const strokeColor = color === 'auto' ? getAutoColor(percentage) : colorMap[color];
  const viewBox = config.r * 2 + config.stroke * 2;
  const center = config.r + config.stroke;

  return (
    <div className={`relative flex flex-col items-center gap-1.5`}>
      <div className={`${config.container} relative`}>
        <svg
          viewBox={`0 0 ${viewBox} ${viewBox}`}
          className="w-full h-full -rotate-90"
          role="meter"
          aria-valuenow={normalizedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${normalizedValue}${suffix}`}
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={config.r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={config.stroke}
          />
          {/* Value arc */}
          <circle
            cx={center}
            cy={center}
            r={config.r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s',
              filter: `drop-shadow(0 0 6px ${strokeColor}50)`,
            }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${config.text} font-bold counter`} style={{ color: strokeColor }}>
              {Math.round(normalizedValue)}
              <span className="text-xs font-normal text-slate-400">{suffix}</span>
            </span>
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-slate-400 text-center">{label}</span>
    </div>
  );
}

/* ── Linear Gauge (horizontal bar) ── */

interface LinearGaugeProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'auto';
  height?: number;
  className?: string;
}

export function LinearGauge({
  value,
  max = 100,
  color = 'auto',
  height = 6,
  className = '',
}: LinearGaugeProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = color === 'auto' ? getAutoColor(percentage) : colorMap[color];

  return (
    <div
      className={`w-full rounded-full overflow-hidden ${className}`}
      style={{ height, background: 'rgba(255,255,255,0.07)' }}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${percentage}%`,
          background: barColor,
          boxShadow: `0 0 8px ${barColor}50`,
        }}
      />
    </div>
  );
}

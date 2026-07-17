'use client';

import React from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { WeatherData } from '@/lib/simulation/types';

interface WeatherWidgetProps {
  weather: WeatherData;
}

const conditionConfig = {
  sunny: { icon: Sun, label: 'Sunny', color: 'text-yellow-400' },
  cloudy: { icon: Cloud, label: 'Cloudy', color: 'text-slate-400' },
  partly_cloudy: { icon: Cloud, label: 'Partly Cloudy', color: 'text-blue-300' },
  rainy: { icon: CloudRain, label: 'Rainy', color: 'text-blue-400' },
  thunderstorm: { icon: CloudLightning, label: 'Thunderstorm', color: 'text-yellow-500' },
};

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  const config = conditionConfig[weather.condition] || conditionConfig.sunny;
  const WeatherIcon = config.icon;

  return (
    <Card hover={false} padding="md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <WeatherIcon className={`w-4 h-4 ${config.color}`} />
          <CardTitle>Weather</CardTitle>
        </div>
        {weather.heatAdvisory && (
          <Badge variant="critical" pulse>
            <AlertTriangle className="w-3 h-3" /> Heat Advisory
          </Badge>
        )}
      </CardHeader>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white counter">{weather.temperature}</span>
            <span className="text-sm text-slate-400">°C</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{config.label}</p>
        </div>

        <div className="space-y-1.5 text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
            <Thermometer className="w-3 h-3" />
            Feels {weather.feelsLike}°C
          </div>
          <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
            <Droplets className="w-3 h-3" />
            {weather.humidity}% humidity
          </div>
          <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
            <Wind className="w-3 h-3" />
            {weather.windSpeed} km/h
          </div>
        </div>
      </div>

      {weather.uvIndex >= 8 && (
        <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-[10px] text-yellow-300">
            ⚠ UV Index: {weather.uvIndex} (Very High) — Recommend sunscreen announcement
          </p>
        </div>
      )}
    </Card>
  );
}

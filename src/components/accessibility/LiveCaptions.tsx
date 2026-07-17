'use client';

import React, { useState, useEffect } from 'react';
import { Captions, Globe, Volume2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LiveIndicator } from '@/components/ui/LiveIndicator';

const SIMULATED_ANNOUNCEMENTS = [
  {
    time: '14:32',
    en: 'Attention all spectators: The match will begin in 15 minutes. Please take your seats.',
    es: 'Atención a todos los espectadores: El partido comenzará en 15 minutos. Por favor, tomen sus asientos.',
    fr: 'Attention à tous les spectateurs : Le match commencera dans 15 minutes. Veuillez prendre vos places.',
    ar: 'انتباه لجميع المتفرجين: ستبدأ المباراة خلال 15 دقيقة. يرجى أخذ مقاعدكم.',
  },
  {
    time: '14:45',
    en: 'Welcome to MetLife Stadium for the FIFA World Cup 2026 Group Stage match between Brazil and Germany!',
    es: '¡Bienvenidos al MetLife Stadium para el partido de la fase de grupos de la Copa Mundial de la FIFA 2026 entre Brasil y Alemania!',
    fr: 'Bienvenue au MetLife Stadium pour le match de phase de groupes de la Coupe du Monde FIFA 2026 entre le Brésil et l\'Allemagne !',
    ar: 'مرحباً بكم في ملعب ميتلايف لمباراة دور المجموعات لكأس العالم فيفا 2026 بين البرازيل وألمانيا!',
  },
  {
    time: '15:10',
    en: 'Please stay hydrated. Free water stations are available at all concourse areas. UV index is currently very high.',
    es: 'Por favor manténganse hidratados. Estaciones de agua gratuitas están disponibles en todas las áreas del concurso.',
    fr: 'Veuillez rester hydratés. Des points d\'eau gratuits sont disponibles dans toutes les zones des halls.',
    ar: 'يرجى الحفاظ على رطوبة الجسم. محطات المياه المجانية متوفرة في جميع مناطق الممرات.',
  },
];

export function LiveCaptions() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [captions, setCaptions] = useState(SIMULATED_ANNOUNCEMENTS.slice(0, 1));

  // Simulate new captions arriving
  useEffect(() => {
    const timers = SIMULATED_ANNOUNCEMENTS.slice(1).map((ann, i) =>
      setTimeout(() => {
        setCaptions((prev) => [...prev, ann]);
      }, (i + 1) * 12000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Spanish' },
    { code: 'fr', flag: '🇫🇷', name: 'French' },
    { code: 'ar', flag: '🇸🇦', name: 'Arabic' },
  ];

  return (
    <Card hover={false} padding="md" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Captions className="w-4 h-4 text-blue-400" />
          <CardTitle>Live Captions</CardTitle>
        </div>
        <LiveIndicator label="LIVE" />
      </CardHeader>

      {/* Language selector */}
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <div className="flex gap-1.5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all ${
                selectedLang === lang.code
                  ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                  : 'bg-white/3 border border-white/8 text-slate-400 hover:bg-white/5'
              }`}
              aria-pressed={selectedLang === lang.code}
            >
              <span>{lang.flag}</span>
              <span className="hidden sm:inline">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Captions feed */}
      <div
        className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar"
        role="log"
        aria-label="Live captions"
        aria-live="polite"
      >
        {[...captions].reverse().map((caption, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border animate-slide-up ${
              i === 0 ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white/3 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant={i === 0 ? 'live' : 'neutral'}>{caption.time}</Badge>
              <button className="p-1 rounded text-slate-500 hover:text-white transition-colors" aria-label="Play audio">
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p
              className="text-sm text-slate-200 leading-relaxed"
              dir={selectedLang === 'ar' ? 'rtl' : 'ltr'}
            >
              {(caption as Record<string, string>)[selectedLang] || caption.en}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

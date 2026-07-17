'use client';

import React, { useState } from 'react';
import {
  Globe,
  Mic,
  Volume2,
  Settings2,
  Languages,
  Radio,
  Play,
  Square,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAI } from '@/hooks/useAI';
import type { AnnouncementTranslations } from '@/lib/ai/types';

const LANGUAGES_MAP: Record<string, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Spanish', flag: '🇪🇸' },
  fr: { name: 'French', flag: '🇫🇷' },
  ar: { name: 'Arabic', flag: '🇸🇦' },
  ja: { name: 'Japanese', flag: '🇯🇵' },
  hi: { name: 'Hindi', flag: '🇮🇳' },
};

const ZONES = ['All Zones', 'Concourse A', 'Concourse B', 'Gate 4', 'VIP Lounge', 'Medical Tents'];

export function VoiceTranslationAutomation() {
  const [text, setText] = useState('');
  const [targetZone, setTargetZone] = useState('All Zones');
  const [translations, setTranslations] = useState<Record<string, string> | null>(null);
  const [broadcasting, setBroadcasting] = useState<string | null>(null);

  const { loading, error, execute } = useAI<AnnouncementTranslations>({
    endpoint: '/api/ai/announcements',
  });

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setTranslations(null); // Clear old translations
    try {
      const result = await execute({ text, priority: 'urgent' });
      if (result?.translations) {
        setTranslations(result.translations);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleBroadcast = (lang: string) => {
    if (broadcasting === lang) {
      setBroadcasting(null);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setBroadcasting(lang);
      
      if (typeof window !== 'undefined' && window.speechSynthesis && translations) {
        window.speechSynthesis.cancel(); 
        
        const utterance = new SpeechSynthesisUtterance(translations[lang]);
        utterance.lang = lang;
        
        // Prevent GC bug in Chrome by attaching to window temporarily
        (window as any)._currentUtterance = utterance;
        
        utterance.onend = () => {
          setBroadcasting(null);
        };
        
        utterance.onerror = (e) => {
          console.error("SpeechSynthesis error:", e);
          setBroadcasting(null);
        };
        
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <Card hover={false} padding="md" className="border-emerald-500/20 bg-emerald-950/10 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-500" />
          <CardTitle className="text-emerald-50">Voice Translation Automation</CardTitle>
        </div>
        <Badge variant="info" className="bg-emerald-500/20 text-emerald-300">
          <Radio className="w-3 h-3 mr-1 animate-pulse" /> Live Broadcast
        </Badge>
      </CardHeader>

      <div className="space-y-4 mt-2">
        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-emerald-200/70 font-medium uppercase tracking-wider">Source Text (English)</span>
            <select
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
              className="px-2 py-1 rounded bg-black/40 border border-emerald-500/20 text-xs text-emerald-100 focus:outline-none focus:border-emerald-500/50"
            >
              {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
          
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type announcement to synthesize into voice..."
              className="w-full h-20 px-3 py-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <Button
              onClick={handleTranslate}
              loading={loading}
              disabled={!text.trim()}
              className="absolute bottom-2 right-2 bg-emerald-600 hover:bg-emerald-500 text-white"
              size="sm"
            >
              <Languages className="w-3.5 h-3.5 mr-1.5" /> Auto-Translate
            </Button>
          </div>
          
          {error && (
            <div className="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded">
              Error translating: {error} (Check your Gemini API Key)
            </div>
          )}
        </div>

        {/* Translations & Voice Control */}
        {translations && (
          <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-200/70 font-medium uppercase tracking-wider">Automated Voice Dispatch</span>
              {broadcasting && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 animate-pulse">
                  <Volume2 className="w-3 h-3" /> Transmitting to {targetZone}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(translations).map(([lang, translation]) => {
                const langInfo = LANGUAGES_MAP[lang];
                if (!langInfo) return null;
                const isPlaying = broadcasting === lang;

                return (
                  <div
                    key={lang}
                    className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${
                      isPlaying ? 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-black/40 border-emerald-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{langInfo.flag}</span>
                        <span className="text-xs font-semibold text-emerald-100">{langInfo.name}</span>
                      </div>
                      <button
                        onClick={() => toggleBroadcast(lang)}
                        className={`p-1.5 rounded-full transition-colors ${
                          isPlaying 
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/30'
                        }`}
                        title={isPlaying ? "Stop Broadcast" : "Synthesize & Broadcast Voice"}
                      >
                        {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>
                    </div>

                    <p className="text-[11px] text-emerald-100/70 leading-relaxed line-clamp-2" dir={lang === 'ar' ? 'rtl' : 'ltr'} title={translation}>
                      {translation}
                    </p>

                    {/* Waveform Animation for Playing State */}
                    {isPlaying && (
                      <div className="flex items-center justify-center gap-1 h-3 mt-1">
                        {[...Array(6)].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-emerald-400 rounded-full animate-pulse"
                            style={{ 
                              height: `${Math.max(20, Math.random() * 100)}%`,
                              animationDelay: `${i * 0.1}s` 
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

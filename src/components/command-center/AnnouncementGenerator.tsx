'use client';

import React, { useState } from 'react';
import {
  Globe,
  Send,
  Volume2,
  Copy,
  Check,
  Languages,
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

const QUICK_TEMPLATES = [
  'Attention please: Gate 4 is experiencing high volume. Please use Gate 5 or Gate 6 for faster entry.',
  'Half-time break: Food stalls are now open. Visit Concourse A and B for refreshments.',
  'Weather advisory: Please stay hydrated. Free water stations are available at all concourse areas.',
  'The match will resume in 5 minutes. Please return to your seats.',
];

export function AnnouncementGenerator() {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'routine' | 'important' | 'urgent' | 'emergency'>('routine');
  const [translations, setTranslations] = useState<Record<string, string> | null>(null);
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  const { loading, execute } = useAI<AnnouncementTranslations>({
    endpoint: '/api/ai/announcements',
  });

  const handleGenerate = async () => {
    if (!text.trim()) return;
    const result = await execute({ text, priority });
    if (result?.translations) {
      setTranslations(result.translations);
    }
  };

  const copyTranslation = (lang: string, translation: string) => {
    navigator.clipboard.writeText(translation);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  return (
    <Card hover={false} padding="md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <CardTitle>Multilingual Announcements</CardTitle>
        </div>
        <Badge variant="info">
          <Languages className="w-3 h-3" /> 6 Languages
        </Badge>
      </CardHeader>

      {/* Input */}
      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your announcement in English..."
          className="w-full h-20 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-primary-500/50 transition-colors"
          aria-label="Announcement text"
        />

        {/* Quick templates */}
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TEMPLATES.map((tmpl, i) => (
            <button
              key={i}
              onClick={() => setText(tmpl)}
              className="text-[10px] px-2 py-1 rounded-lg bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 transition-all truncate max-w-[200px]"
            >
              {tmpl.slice(0, 40)}...
            </button>
          ))}
        </div>

        {/* Priority + Generate */}
        <div className="flex items-center gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as typeof priority)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-primary-500/50"
            aria-label="Announcement priority"
          >
            <option value="routine">Routine</option>
            <option value="important">Important</option>
            <option value="urgent">Urgent</option>
            <option value="emergency">Emergency</option>
          </select>
          <Button
            onClick={handleGenerate}
            loading={loading}
            disabled={!text.trim()}
            icon={<Send className="w-3.5 h-3.5" />}
            size="sm"
          >
            Translate All
          </Button>
        </div>
      </div>

      {/* Translations */}
      {translations && (
        <div className="mt-4 space-y-2">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Translations</div>
          {Object.entries(translations).map(([lang, translation]) => {
            const langInfo = LANGUAGES_MAP[lang];
            if (!langInfo) return null;
            return (
              <div
                key={lang}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-white/3 border border-white/5"
              >
                <span className="text-sm mt-0.5">{langInfo.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-slate-500 font-medium">{langInfo.name}</div>
                  <p className="text-xs text-slate-300 mt-0.5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {translation}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyTranslation(lang, translation)}
                    className="p-1 rounded text-slate-500 hover:text-white transition-colors"
                    aria-label={`Copy ${langInfo.name} translation`}
                  >
                    {copiedLang === lang ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    className="p-1 rounded text-slate-500 hover:text-white transition-colors"
                    aria-label={`Play ${langInfo.name} announcement`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

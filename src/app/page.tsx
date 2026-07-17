'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  Accessibility,
  Activity,
  Zap,
  Globe,
  ChevronRight,
  Radio,
  BarChart3,
  Brain,
  Sparkles,
  Trophy,
  Calendar,
  Clock,
} from 'lucide-react';
import { getTournamentContext } from '@/lib/simulation/schedule';

/* ── Animated Counter ── */
function Counter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span className="counter">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Module Card ── */
function ModuleCard({
  href,
  icon: Icon,
  title,
  description,
  gradient,
  features,
  delay,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  features: string[];
  delay: number;
}) {
  return (
    <Link href={href} className="group block">
      <div
        className="relative overflow-hidden rounded-2xl animate-slide-up"
        style={{
          animationDelay: `${delay}ms`,
          background: 'rgba(15, 25, 50, 0.8)',
          border: '1px solid rgba(100, 160, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          padding: '2rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(100, 160, 255, 0.4)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(77,141,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(100, 160, 255, 0.15)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)';
        }}
      >
        {/* Glow accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${gradient} opacity-90`} />

        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${gradient} mb-5`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Content */}
        <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {title}
        </h3>
        <p style={{ color: '#a8b8d0', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
          {description}
        </p>

        {/* Features */}
        <ul style={{ marginBottom: '1.5rem' }} className="space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2" style={{ color: '#c8d6e5', fontSize: '0.875rem' }}>
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#60a5fa' }} />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-2 font-medium text-sm group-hover:gap-3 transition-all" style={{ color: '#60a5fa' }}>
          Launch Module
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

/* ── Tech Badge ── */
function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#c8d6e5',
      }}
    >
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   Landing Page
   ═══════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative" style={{ background: '#060a14' }}>
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        {/* Background glow orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%',
            left: '30%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(77,141,255,0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: '10%',
            right: '20%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: '20%',
            left: '15%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16">
          {/* Top badge */}
          <div className="flex justify-center mb-8">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
              style={{
                background: 'rgba(77,141,255,0.12)',
                border: '1px solid rgba(77,141,255,0.3)',
                color: '#79b4ff',
              }}
            >
              <Radio className="w-4 h-4 animate-pulse" />
              FIFA World Cup 2026 • Live Operations Platform
            </div>
          </div>

          {/* Next Match Ticker */}
          {mounted && (() => {
            const ctx = getTournamentContext();
            const nextMatch = ctx.nextMatch;
            if (!nextMatch) return null;
            const matchDate = new Date(`${nextMatch.date}T${nextMatch.kickoff}:00`);
            const hoursLeft = Math.max(0, Math.round((matchDate.getTime() - Date.now()) / (1000 * 60 * 60)));
            return (
              <div className="flex justify-center mb-4">
                <Link
                  href="/match-center"
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-sm transition-all hover:scale-105"
                  style={{
                    background: 'rgba(251,191,36,0.1)',
                    border: '1px solid rgba(251,191,36,0.25)',
                    color: '#fcd34d',
                  }}
                >
                  <Trophy className="w-4 h-4" />
                  <span className="font-semibold">
                    {nextMatch.round}: {nextMatch.flagA} {nextMatch.teamA} vs {nextMatch.teamB} {nextMatch.flagB}
                  </span>
                  <span style={{ color: '#9aafc8' }}>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {hoursLeft > 24 ? `${Math.floor(hoursLeft / 24)}d ${hoursLeft % 24}h` : `${hoursLeft}h`}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })()}

          {/* Title */}
          <h1
            className={`text-center transition-all duration-700 delay-150 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
              <span
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #38bdf8 30%, #22d3ee 60%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'brightness(1.3) drop-shadow(0 0 30px rgba(96,165,250,0.3))',
                }}
              >
                Stadium
              </span>
              <span style={{ color: '#ffffff', textShadow: '0 0 40px rgba(255,255,255,0.15)' }}>Mind</span>
            </span>
            <span
              className="block text-2xl sm:text-3xl md:text-4xl font-light mt-2"
              style={{ color: '#8899b8', letterSpacing: '0.3em' }}
            >
              A I
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-center text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ color: '#9aafc8' }}
          >
            The <span style={{ color: '#ffffff', fontWeight: 600 }}>AI Operating System</span> for smart stadiums.
            Real-time intelligence for every stakeholder — organizers, fans, and accessibility.
          </p>

          {/* Stats ticker */}
          <div
            className={`flex flex-wrap justify-center gap-6 sm:gap-10 mt-12 transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {[
              { value: 85000, suffix: '', label: 'Capacity', icon: Users, iconColor: '#60a5fa' },
              { value: 12, suffix: '', label: 'AI Modules', icon: Brain, iconColor: '#a78bfa' },
              { value: 6, suffix: '', label: 'Languages', icon: Globe, iconColor: '#34d399' },
              { value: 99.9, suffix: '%', label: 'Uptime', icon: Activity, iconColor: '#fbbf24' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-bold" style={{ color: '#ffffff' }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.iconColor }} />
                  {mounted && <Counter end={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="mt-1 uppercase tracking-wider font-medium" style={{ color: '#6b7fa0', fontSize: '0.7rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules Section ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#ffffff' }}>
            Four Modules. One Intelligence Platform.
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: '#8899b8' }}>
            Every stakeholder gets their own AI experience, powered by the same
            real-time data and Google Gemini intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModuleCard
            href="/command-center"
            icon={Shield}
            title="AI Command Center"
            description="Real-time operational dashboard for organizers, security, and operations staff."
            gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
            delay={100}
            features={[
              'Live stadium map with crowd density',
              'AI-generated operational insights',
              'Multilingual announcement generator',
              'Security & medical incident tracking',
              'Predictive congestion analytics',
            ]}
          />
          <ModuleCard
            href="/match-center"
            icon={Trophy}
            title="Match Center"
            description="Live FIFA World Cup 2026 match schedule, results, and tournament bracket."
            gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
            delay={175}
            features={[
              'Real-time match schedule analysis',
              'Auto-detected tournament phase',
              'Visual knockout bracket',
              'Live countdown to next match',
              'Complete results & scores',
            ]}
          />
          <ModuleCard
            href="/fan-companion"
            icon={Users}
            title="AI Fan Companion"
            description="Personal AI assistant for every spectator — navigation, food, exits, and more."
            gradient="bg-gradient-to-br from-orange-500 to-amber-500"
            delay={250}
            features={[
              'Indoor turn-by-turn navigation',
              'Personalized food recommendations',
              'Queue wait time predictions',
              'Exit congestion predictions',
              'Live match updates & rule explanations',
            ]}
          />
          <ModuleCard
            href="/accessibility"
            icon={Accessibility}
            title="Accessibility AI"
            description="Inclusive experience for visually impaired, hearing impaired, wheelchair, and elderly users."
            gradient="bg-gradient-to-br from-purple-500 to-pink-500"
            delay={400}
            features={[
              'AI scene description (Vision AI)',
              'Accessible navigation (no stairs)',
              'Live captions & translations',
              'Emergency evacuation guidance',
              'High contrast & large text modes',
            ]}
          />
        </div>
      </section>

      {/* ── Technology Section ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: 'rgba(15, 25, 50, 0.7)',
            border: '1px solid rgba(100, 160, 255, 0.12)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6" style={{ color: '#fbbf24' }} />
            <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>Powered by Google Cloud</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Gemini 2.5 Flash', 'Vertex AI', 'Firebase', 'Cloud Run',
              'Google Maps Platform', 'Vision AI', 'Speech-to-Text', 'Text-to-Speech',
              'Translation API', 'Cloud Functions', 'Firestore', 'BigQuery',
              'Cloud Monitoring', 'Secret Manager', 'Next.js 14', 'TypeScript',
              'Tailwind CSS', 'React Query', 'Zustand',
            ].map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-8 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#6b7fa0' }}>
          <Trophy className="w-4 h-4" />
          StadiumMind AI • FIFA World Cup 2026 • Prompt Wars Hackathon
        </div>
        <div className="flex items-center justify-center gap-2 mt-2 text-xs" style={{ color: '#4a5d7a' }}>
          <BarChart3 className="w-3 h-3" />
          Built with Google Gemini AI
        </div>
      </footer>
    </div>
  );
}

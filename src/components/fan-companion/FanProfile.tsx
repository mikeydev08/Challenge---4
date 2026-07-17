'use client';

import React, { useState } from 'react';
import { UserCircle, Ticket, MapPin, Heart, Globe, Edit3, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useFanStore } from '@/lib/store/fan-store';

export function FanProfile() {
  const { profile, setProfile } = useFanStore();
  const [editing, setEditing] = useState(false);

  return (
    <Card hover={false} padding="md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCircle className="w-4 h-4 text-accent-400" />
          <CardTitle>Fan Profile</CardTitle>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={editing ? 'Save profile' : 'Edit profile'}
        >
          {editing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
        </button>
      </CardHeader>

      <div className="space-y-3">
        {/* Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-bold text-sm">
            {profile.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            {editing ? (
              <input
                value={profile.name}
                onChange={(e) => setProfile({ name: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-primary-500/50 w-full"
              />
            ) : (
              <div className="text-sm font-semibold text-white">{profile.name}</div>
            )}
            <div className="text-[10px] text-slate-500">{profile.ticketId}</div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Ticket className="w-3 h-3" />
            <span>{profile.seatSection}, Row {profile.seatRow}, Seat {profile.seatNumber}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3 h-3" />
            <span>{profile.currentZone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Globe className="w-3 h-3" />
            {editing ? (
              <select
                value={profile.preferredLanguage}
                onChange={(e) => setProfile({ preferredLanguage: e.target.value })}
                className="bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[10px] text-slate-300 focus:outline-none"
              >
                {['English', 'Spanish', 'French', 'Arabic', 'Japanese', 'Hindi'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            ) : (
              <span>{profile.preferredLanguage}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Heart className="w-3 h-3" />
            <span>{profile.favoriteTeam}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {profile.dietaryPreferences.map((d) => (
            <Badge key={d} variant="success">{d}</Badge>
          ))}
          {profile.mobilityLimitations.length > 0 &&
            profile.mobilityLimitations.map((m) => (
              <Badge key={m} variant="info">{m}</Badge>
            ))}
        </div>
      </div>
    </Card>
  );
}

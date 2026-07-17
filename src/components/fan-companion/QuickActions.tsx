'use client';

import React from 'react';
import {
  MapPin,
  UtensilsCrossed,
  Droplets,
  ShoppingBag,
  BatteryCharging,
  Car,
  HelpCircle,
  Ticket,
} from 'lucide-react';
import { useFanStore } from '@/lib/store/fan-store';

const actions = [
  { icon: MapPin, label: 'My Seat', prompt: 'Navigate me to my seat', color: 'text-blue-400 bg-blue-500/10' },
  { icon: UtensilsCrossed, label: 'Food', prompt: 'Recommend food near me based on my dietary preferences', color: 'text-orange-400 bg-orange-500/10' },
  { icon: Droplets, label: 'Washroom', prompt: 'Where is the nearest washroom with the shortest queue?', color: 'text-cyan-400 bg-cyan-500/10' },
  { icon: ShoppingBag, label: 'Merch', prompt: 'Where can I find official merchandise near me?', color: 'text-pink-400 bg-pink-500/10' },
  { icon: BatteryCharging, label: 'Charging', prompt: 'Where is the nearest phone charging station?', color: 'text-yellow-400 bg-yellow-500/10' },
  { icon: Car, label: 'Parking', prompt: 'Help me find my car and the best exit route to the parking lot', color: 'text-emerald-400 bg-emerald-500/10' },
  { icon: HelpCircle, label: 'Rules', prompt: 'Explain the offside rule in football simply', color: 'text-purple-400 bg-purple-500/10' },
  { icon: Ticket, label: 'My Ticket', prompt: 'Show me my ticket information and seat details', color: 'text-red-400 bg-red-500/10' },
];

export function QuickActions() {
  const { addMessage, setIsTyping } = useFanStore();

  const handleAction = async (prompt: string) => {
    addMessage({
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
    });
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/fan-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      addMessage({
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      });
    } catch {
      addMessage({
        role: 'assistant',
        content: "I'm having trouble right now. Please try again.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">
        Quick Actions
      </div>
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleAction(action.prompt)}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
            aria-label={action.label}
          >
            <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

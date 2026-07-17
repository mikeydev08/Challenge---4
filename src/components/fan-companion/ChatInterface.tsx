'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  MapPin,
  UtensilsCrossed,
  Droplets,
  DoorOpen,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useFanStore } from '@/lib/store/fan-store';
import type { StadiumData } from '@/lib/simulation/types';

interface ChatInterfaceProps {
  stadiumData: StadiumData;
}

const QUICK_CHIPS = [
  { label: 'Navigate to seat', icon: MapPin, prompt: 'Navigate me to my seat' },
  { label: 'Find food', icon: UtensilsCrossed, prompt: 'Find food near me based on my preferences' },
  { label: 'Nearest washroom', icon: Droplets, prompt: 'Where is the nearest washroom?' },
  { label: 'Best exit', icon: DoorOpen, prompt: 'What is the best exit to leave now?' },
  { label: 'Match score', icon: Sparkles, prompt: 'What is the current match score and highlights?' },
  { label: 'Help', icon: HelpCircle, prompt: 'What can you help me with?' },
];

export function ChatInterface({ stadiumData }: ChatInterfaceProps) {
  const { messages, addMessage, isTyping, setIsTyping, profile } = useFanStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage({
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    });
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/fan-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          fanProfile: profile,
          stadiumContext: {
            match: stadiumData.match,
            weather: stadiumData.weather,
            foodStalls: stadiumData.foodStalls.map((f) => ({
              name: f.name,
              cuisine: f.cuisine,
              queueLength: f.queueLength,
              estimatedWaitMinutes: f.estimatedWaitMinutes,
              zone: f.zone,
            })),
            gates: stadiumData.gates.map((g) => ({
              name: g.name,
              queueLength: g.queueLength,
              status: g.status,
            })),
          },
        }),
      });

      const data = await res.json();
      addMessage({
        role: 'assistant',
        content: data.response || "Sorry, I couldn't process that.",
        timestamp: new Date().toISOString(),
      });
    } catch {
      addMessage({
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Card hover={false} padding="sm" className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-md'
                  : 'bg-white/5 border border-white/8 text-slate-200 rounded-bl-md'
              }`}
            >
              {/* Render markdown-like bold text */}
              {msg.content.split('\n').map((line, li) => (
                <p key={li} className={li > 0 ? 'mt-1.5' : ''}>
                  {line.split(/(\*\*.*?\*\*)/).map((part, pi) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={pi} className="font-semibold text-white">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return <span key={pi}>{part}</span>;
                  })}
                </p>
              ))}
              <div className="text-[10px] text-slate-500 mt-1.5">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-accent-600/30 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-accent-400" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5 animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary-400" />
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick chips */}
      <div className="px-3 py-2 flex gap-2 overflow-x-auto custom-scrollbar">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => sendMessage(chip.prompt)}
            disabled={isTyping}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-white transition-all whitespace-nowrap disabled:opacity-50"
          >
            <chip.icon className="w-3 h-3" />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-3 pb-3">
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 focus-within:border-primary-500/40 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about the stadium..."
            disabled={isTyping}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            aria-label="Chat message"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Card>
  );
}

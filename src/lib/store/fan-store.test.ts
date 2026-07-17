/* ═══════════════════════════════════════════════════════
   Tests — Fan Store (Zustand)
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach } from 'vitest';
import { useFanStore } from './fan-store';

describe('fan-store', () => {
  beforeEach(() => {
    // Reset to default state
    useFanStore.setState({
      profile: {
        name: 'Alex Rivera',
        ticketId: 'WC2026-BRA-GER-A7842',
        seatSection: 'North Stand',
        seatRow: 'F',
        seatNumber: '24',
        preferredLanguage: 'English',
        dietaryPreferences: ['Vegetarian'],
        mobilityLimitations: [],
        favoriteTeam: 'Brazil',
        currentZone: 'Concourse A',
      },
      messages: [
        {
          role: 'assistant',
          content: 'Welcome!',
          timestamp: new Date().toISOString(),
        },
      ],
      isTyping: false,
    });
  });

  it('has correct default profile values', () => {
    const state = useFanStore.getState();
    expect(state.profile.name).toBe('Alex Rivera');
    expect(state.profile.seatSection).toBe('North Stand');
    expect(state.profile.favoriteTeam).toBe('Brazil');
    expect(state.profile.preferredLanguage).toBe('English');
  });

  it('setProfile partially updates the profile', () => {
    useFanStore.getState().setProfile({ name: 'Carlos M.' });
    const state = useFanStore.getState();
    expect(state.profile.name).toBe('Carlos M.');
    // Other fields remain unchanged
    expect(state.profile.seatSection).toBe('North Stand');
  });

  it('setProfile can update multiple fields at once', () => {
    useFanStore.getState().setProfile({
      favoriteTeam: 'Argentina',
      currentZone: 'VIP Lounge',
    });
    const state = useFanStore.getState();
    expect(state.profile.favoriteTeam).toBe('Argentina');
    expect(state.profile.currentZone).toBe('VIP Lounge');
  });

  it('addMessage appends a new message', () => {
    const initialLength = useFanStore.getState().messages.length;
    useFanStore.getState().addMessage({
      role: 'user',
      content: 'Where is my seat?',
      timestamp: new Date().toISOString(),
    });
    const state = useFanStore.getState();
    expect(state.messages.length).toBe(initialLength + 1);
    expect(state.messages[state.messages.length - 1].content).toBe(
      'Where is my seat?',
    );
  });

  it('clearMessages resets to a single welcome message', () => {
    useFanStore.getState().addMessage({
      role: 'user',
      content: 'Hello',
      timestamp: new Date().toISOString(),
    });
    useFanStore.getState().clearMessages();
    const state = useFanStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].role).toBe('assistant');
  });

  it('setIsTyping toggles typing state', () => {
    useFanStore.getState().setIsTyping(true);
    expect(useFanStore.getState().isTyping).toBe(true);
    useFanStore.getState().setIsTyping(false);
    expect(useFanStore.getState().isTyping).toBe(false);
  });

  it('initial messages contain a welcome message', () => {
    const state = useFanStore.getState();
    expect(state.messages.length).toBeGreaterThanOrEqual(1);
    expect(state.messages[0].role).toBe('assistant');
  });
});

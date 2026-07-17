/* ═══════════════════════════════════════════════════════
   Tests — AI Prompts
   Validates all system prompts are well-formed.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from 'vitest';
import {
  COMMAND_CENTER_PROMPT,
  FAN_COMPANION_PROMPT,
  ACCESSIBILITY_PROMPT,
  ANNOUNCEMENT_PROMPT,
} from './prompts';

describe('prompts', () => {
  it('COMMAND_CENTER_PROMPT is a non-empty string', () => {
    expect(typeof COMMAND_CENTER_PROMPT).toBe('string');
    expect(COMMAND_CENTER_PROMPT.length).toBeGreaterThan(100);
  });

  it('COMMAND_CENTER_PROMPT contains required keywords', () => {
    expect(COMMAND_CENTER_PROMPT).toContain('StadiumMind');
    expect(COMMAND_CENTER_PROMPT).toContain('FIFA');
    expect(COMMAND_CENTER_PROMPT).toContain('insights');
    expect(COMMAND_CENTER_PROMPT).toContain('priority');
    expect(COMMAND_CENTER_PROMPT).toContain('JSON');
  });

  it('FAN_COMPANION_PROMPT is a non-empty string', () => {
    expect(typeof FAN_COMPANION_PROMPT).toBe('string');
    expect(FAN_COMPANION_PROMPT.length).toBeGreaterThan(100);
  });

  it('FAN_COMPANION_PROMPT covers all required capabilities', () => {
    expect(FAN_COMPANION_PROMPT).toContain('navigation');
    expect(FAN_COMPANION_PROMPT).toContain('Food');
    expect(FAN_COMPANION_PROMPT).toContain('Exit');
    expect(FAN_COMPANION_PROMPT).toContain('language');
  });

  it('ACCESSIBILITY_PROMPT is a non-empty string', () => {
    expect(typeof ACCESSIBILITY_PROMPT).toBe('string');
    expect(ACCESSIBILITY_PROMPT.length).toBeGreaterThan(100);
  });

  it('ACCESSIBILITY_PROMPT covers all disability types', () => {
    expect(ACCESSIBILITY_PROMPT).toContain('Visually impaired');
    expect(ACCESSIBILITY_PROMPT).toContain('Hearing impaired');
    expect(ACCESSIBILITY_PROMPT).toContain('Wheelchair');
    expect(ACCESSIBILITY_PROMPT).toContain('Elderly');
  });

  it('ANNOUNCEMENT_PROMPT is a non-empty string', () => {
    expect(typeof ANNOUNCEMENT_PROMPT).toBe('string');
    expect(ANNOUNCEMENT_PROMPT.length).toBeGreaterThan(50);
  });

  it('ANNOUNCEMENT_PROMPT specifies all 6 target languages', () => {
    expect(ANNOUNCEMENT_PROMPT).toContain('"en"');
    expect(ANNOUNCEMENT_PROMPT).toContain('"es"');
    expect(ANNOUNCEMENT_PROMPT).toContain('"fr"');
    expect(ANNOUNCEMENT_PROMPT).toContain('"ar"');
    expect(ANNOUNCEMENT_PROMPT).toContain('"ja"');
    expect(ANNOUNCEMENT_PROMPT).toContain('"hi"');
  });
});

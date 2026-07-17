/* ═══════════════════════════════════════════════════════
   Tests — Validation Utilities
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from 'vitest';
import {
  validateRequiredString,
  validateMaxLength,
  validateEnum,
  sanitizeInput,
  VALID_ACCESSIBILITY_TYPES,
  VALID_PRIORITIES,
  MAX_TEXT_LENGTH,
  MAX_ANNOUNCEMENT_LENGTH,
} from './validation';

describe('validateRequiredString', () => {
  it('returns null for valid non-empty strings', () => {
    expect(validateRequiredString('hello', 'field')).toBeNull();
  });

  it('returns error for empty string', () => {
    expect(validateRequiredString('', 'name')).toContain('name');
  });

  it('returns error for whitespace-only string', () => {
    expect(validateRequiredString('   ', 'name')).toContain('name');
  });

  it('returns error for null', () => {
    expect(validateRequiredString(null, 'field')).not.toBeNull();
  });

  it('returns error for undefined', () => {
    expect(validateRequiredString(undefined, 'field')).not.toBeNull();
  });

  it('returns error for number', () => {
    expect(validateRequiredString(42, 'field')).not.toBeNull();
  });
});

describe('validateMaxLength', () => {
  it('returns null when within limit', () => {
    expect(validateMaxLength('hello', 10, 'field')).toBeNull();
  });

  it('returns error when exceeding limit', () => {
    expect(validateMaxLength('hello world', 5, 'text')).toContain('text');
  });

  it('returns null when exactly at limit', () => {
    expect(validateMaxLength('12345', 5, 'field')).toBeNull();
  });
});

describe('validateEnum', () => {
  it('returns null for valid enum value', () => {
    expect(validateEnum('navigation', VALID_ACCESSIBILITY_TYPES, 'type')).toBeNull();
  });

  it('returns error for invalid enum value', () => {
    expect(validateEnum('invalid', VALID_ACCESSIBILITY_TYPES, 'type')).toContain('type');
  });

  it('returns error for non-string values', () => {
    expect(validateEnum(42, VALID_PRIORITIES, 'priority')).not.toBeNull();
  });

  it('validates all accessibility types', () => {
    for (const t of VALID_ACCESSIBILITY_TYPES) {
      expect(validateEnum(t, VALID_ACCESSIBILITY_TYPES, 'type')).toBeNull();
    }
  });

  it('validates all priority levels', () => {
    for (const p of VALID_PRIORITIES) {
      expect(validateEnum(p, VALID_PRIORITIES, 'priority')).toBeNull();
    }
  });
});

describe('sanitizeInput', () => {
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('removes control characters', () => {
    expect(sanitizeInput('hello\x00world')).toBe('helloworld');
  });

  it('preserves newlines and tabs', () => {
    expect(sanitizeInput('line1\nline2\tindented')).toBe('line1\nline2\tindented');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

describe('constants', () => {
  it('MAX_TEXT_LENGTH is a positive number', () => {
    expect(MAX_TEXT_LENGTH).toBeGreaterThan(0);
  });

  it('MAX_ANNOUNCEMENT_LENGTH is a positive number', () => {
    expect(MAX_ANNOUNCEMENT_LENGTH).toBeGreaterThan(0);
  });

  it('VALID_ACCESSIBILITY_TYPES has at least 3 entries', () => {
    expect(VALID_ACCESSIBILITY_TYPES.length).toBeGreaterThanOrEqual(3);
  });

  it('VALID_PRIORITIES has at least 3 entries', () => {
    expect(VALID_PRIORITIES.length).toBeGreaterThanOrEqual(3);
  });
});

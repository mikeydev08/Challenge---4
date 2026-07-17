/* ═══════════════════════════════════════════════════════
   StadiumMind AI — Input Validation Utilities
   Centralized validation for API request payloads.
   ═══════════════════════════════════════════════════════ */

/** Maximum allowed length for user-submitted text fields. */
export const MAX_TEXT_LENGTH = 2000;

/** Maximum allowed length for announcement text. */
export const MAX_ANNOUNCEMENT_LENGTH = 500;

/** Allowed accessibility request types. */
export const VALID_ACCESSIBILITY_TYPES = [
  'scene-description',
  'navigation',
  'emergency',
  'captions',
  'translation',
] as const;

/** Allowed announcement priority levels. */
export const VALID_PRIORITIES = [
  'routine',
  'important',
  'urgent',
  'emergency',
] as const;

export type AccessibilityType = (typeof VALID_ACCESSIBILITY_TYPES)[number];
export type AnnouncementPriority = (typeof VALID_PRIORITIES)[number];

/**
 * Validates that a value is a non-empty string.
 *
 * @param value - The value to validate.
 * @param fieldName - The name of the field (used in error messages).
 * @returns An error message string, or `null` if valid.
 */
export function validateRequiredString(
  value: unknown,
  fieldName: string,
): string | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return `Missing or empty required field: ${fieldName}`;
  }
  return null;
}

/**
 * Validates that a string does not exceed a maximum length.
 *
 * @param value - The string to check.
 * @param maxLength - The maximum allowed character count.
 * @param fieldName - The name of the field (used in error messages).
 * @returns An error message string, or `null` if valid.
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string,
): string | null {
  if (value.length > maxLength) {
    return `${fieldName} exceeds maximum length of ${maxLength} characters`;
  }
  return null;
}

/**
 * Validates that a value belongs to an allowed set.
 *
 * @param value - The value to check.
 * @param allowed - The set of allowed values.
 * @param fieldName - The name of the field (used in error messages).
 * @returns An error message string, or `null` if valid.
 */
export function validateEnum(
  value: unknown,
  allowed: readonly string[],
  fieldName: string,
): string | null {
  if (typeof value !== 'string' || !allowed.includes(value)) {
    return `Invalid ${fieldName}. Allowed values: ${allowed.join(', ')}`;
  }
  return null;
}

/**
 * Sanitizes a user-provided string by trimming whitespace
 * and removing control characters (excluding newlines/tabs).
 *
 * @param input - The raw user input string.
 * @returns The sanitized string.
 */
export function sanitizeInput(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Normalizes phone numbers consistently for tenant storage and search.
 * Prefer E.164 formatting where practical (+[country_code][number]).
 * Strips formatting noise (parentheses, hyphens, spaces, dots).
 */
export function normalizePhoneNumber(rawPhone: string, defaultCountryCode = '91'): string {
  if (!rawPhone) return '';

  const trimmed = rawPhone.trim();

  // If starts with +, retain + and strip non-digits
  if (trimmed.startsWith('+')) {
    const digitsOnly = trimmed.replace(/\D/g, '');
    return `+${digitsOnly}`;
  }

  // Strip all non-digits
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (!digitsOnly) return '';

  // If 10 digits (common for mobile numbers), prepend default country code (+91 for India)
  if (digitsOnly.length === 10) {
    return `+${defaultCountryCode}${digitsOnly}`;
  }

  // If starts with 0 and has 11 digits (trunk prefix), strip leading 0 and prepend default country code
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return `+${defaultCountryCode}${digitsOnly.slice(1)}`;
  }

  // Default: prepend +
  return `+${digitsOnly}`;
}

/**
 * Strips phone down to raw search digits for flexible prefix/sub-string matching
 */
export function getPhoneSearchDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

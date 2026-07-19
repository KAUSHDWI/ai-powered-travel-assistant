/**
 * Basic email validator
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Basic phone validator (expects 10+ digits, ignores common symbols)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^\+?\d{10,15}$/.test(cleaned);
}

/**
 * Validate presence of input
 */
export function isNotEmpty(value: string | undefined | null): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

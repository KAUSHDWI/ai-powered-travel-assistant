/**
 * Sanitize input to prevent NoSQL injection attacks.
 * Strips any keys starting with '$' and removes nested objects that could
 * contain MongoDB operators.
 */
export function sanitizeInput<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item)) as T;
  }

  if (typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (key.startsWith('$')) {
        continue;
      }
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized as T;
  }

  return input;
}

/**
 * Sanitize a string for safe use in MongoDB regex queries.
 * Escapes special regex characters.
 */
export function sanitizeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Mask sensitive data for logging purposes.
 * Shows first 2 and last 2 characters, masks the rest.
 */
export function maskSensitive(value: string): string {
  if (value.length <= 4) {
    return '****';
  }
  const first = value.slice(0, 2);
  const last = value.slice(-2);
  const masked = '*'.repeat(Math.min(value.length - 4, 8));
  return `${first}${masked}${last}`;
}

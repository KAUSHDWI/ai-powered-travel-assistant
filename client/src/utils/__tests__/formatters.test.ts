import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatPhoneNumber, capitalize } from '../formatters.js';

describe('Client Formatters', () => {
  describe('formatCurrency', () => {
    it('should format numbers to INR by default', () => {
      const formatted = formatCurrency(50000);
      // Expect formatted currency string containing symbol/commas
      expect(formatted).toContain('50,000');
    });

    it('should handle alternative currency codes', () => {
      const formatted = formatCurrency(1000, 'USD');
      expect(formatted).toContain('1,000');
    });
  });

  describe('formatDate', () => {
    it('should convert ISO string to clean date display', () => {
      const date = '2026-07-19T12:00:00.000Z';
      const formatted = formatDate(date);
      expect(formatted).toContain('2026');
      expect(formatted).toContain('Jul');
    });

    it('should return raw string if not a valid ISO date', () => {
      expect(formatDate('invalid-date')).toBe('invalid-date');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10 digit numbers for India standard', () => {
      expect(formatPhoneNumber('9999999999')).toBe('+91 99999-99999');
    });

    it('should return raw phone number if other lengths', () => {
      expect(formatPhoneNumber('+1-555-5555')).toBe('+1-555-5555');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first character of strings', () => {
      expect(capitalize('honeymoon')).toBe('Honeymoon');
    });

    it('should return empty string if empty input', () => {
      expect(capitalize('')).toBe('');
    });
  });
});

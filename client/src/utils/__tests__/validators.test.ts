import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhone, isNotEmpty } from '../validators.js';

describe('Client Validators', () => {
  describe('isValidEmail', () => {
    it('should validate valid emails', () => {
      expect(isValidEmail('admin@travel.com')).toBe(true);
      expect(isValidEmail('test.user@company.co.in')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('admin')).toBe(false);
      expect(isValidEmail('admin@')).toBe(false);
      expect(isValidEmail('@company.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate 10-15 digit phone formats', () => {
      expect(isValidPhone('+919999999999')).toBe(true);
      expect(isValidPhone('9999999999')).toBe(true);
      expect(isValidPhone('123456789012345')).toBe(true);
    });

    it('should reject short or alphabetic numbers', () => {
      expect(isValidPhone('12345')).toBe(false);
      expect(isValidPhone('99999abcde')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should validate present text strings', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty('  spaces  ')).toBe(true);
    });

    it('should reject empty or blank inputs', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
    });
  });
});

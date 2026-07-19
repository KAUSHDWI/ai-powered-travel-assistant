import { describe, it, expect } from 'vitest';
import { detectIntent, detectIntentFromSignals } from '../intentDetection.service.js';
import type { ConversationMemory, Intent } from '../../types/index.js';

describe('Intent Detection Service', () => {
  it('should prefer AI-returned intent when valid', () => {
    const aiIntent: Intent = { level: 'High', reason: 'User mentions dates' };
    const memory: ConversationMemory = {};
    const result = detectIntent(aiIntent, memory, 'I want to travel');

    expect(result.level).toBe('High');
    expect(result.reason).toBe('User mentions dates');
  });

  it('should fall back to signal detection if AI intent is invalid or null', () => {
    const memory: ConversationMemory = {
      destination: 'Maldives',
    };
    const result = detectIntent(null, memory, 'Tell me about travel');

    expect(result.level).toBe('Low'); // Destination: 10 + Casual keyword: 5 = 15 -> Low (< 20)
    expect(result.reason).toContain('Destination specified');
  });

  describe('detectIntentFromSignals', () => {
    it('should assign Low intent to casual inquiry messages with empty memory', () => {
      const result = detectIntentFromSignals({}, 'Hello');
      expect(result.level).toBe('Low');
    });

    it('should assign Maximum intent when booking keywords and contact details exist', () => {
      const memory: ConversationMemory = {
        destination: 'Bali',
        phone: '1234567890',
        budget: '1000 USD'
      };
      const result = detectIntentFromSignals(memory, 'Confirm my booking immediately');

      expect(result.level).toBe('Maximum'); // booking keyword(30) + urgency(15) + dest(10) + budget(15) + phone(20) = 90 >= 70 -> Maximum
      expect(result.reason).toContain('Booking-related keywords detected');
      expect(result.reason).toContain('Contact information shared');
    });
  });
});

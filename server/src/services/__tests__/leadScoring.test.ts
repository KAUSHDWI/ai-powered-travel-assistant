import { describe, it, expect } from 'vitest';
import { calculateLeadScore } from '../leadScoring.service.js';
import type { ConversationMemory } from '../../types/index.js';

describe('Lead Scoring Service', () => {
  it('should return 0 points and Low confidence for empty memory', () => {
    const memory: ConversationMemory = {};
    const result = calculateLeadScore(memory);

    expect(result.score).toBe(0);
    expect(result.confidence).toBe('Low');
    expect(result.reasons).toHaveLength(0);
  });

  it('should calculate correct points for travel parameters', () => {
    const memory: ConversationMemory = {
      destination: 'Bali',     // +15
      travelDate: 'December',  // +10
      budget: '200000 INR',    // +15
      travellers: 2,           // +10
    };
    const result = calculateLeadScore(memory);

    expect(result.score).toBe(50); // 15 + 10 + 15 + 10
    expect(result.confidence).toBe('Medium'); // 40-69 is Medium
    expect(result.reasons).toContain('Destination provided: "Bali" (+15)');
    expect(result.reasons).toContain('Travel date provided: "December" (+10)');
  });

  it('should calculate max 100 points when all fields are present', () => {
    const memory: ConversationMemory = {
      destination: 'Bali',
      travelDate: 'December',
      budget: '200000 INR',
      travellers: 2,
      tripType: 'honeymoon',            // +10
      duration: '7 nights',            // +5
      departureCity: 'Mumbai',          // +5
      specialRequirements: 'pool villa', // +5
      name: 'Kaushal',                  // +10
      phone: '+91 9999999999',         // +15
    };
    const result = calculateLeadScore(memory);

    expect(result.score).toBe(100);
    expect(result.confidence).toBe('High'); // >=70 is High
    expect(result.reasons).toHaveLength(10);
  });

  it('should handle partial contact parameters correctly', () => {
    const memory: ConversationMemory = {
      destination: 'Paris',            // +15
      name: 'John Doe',                // +10
    };
    const result = calculateLeadScore(memory);

    expect(result.score).toBe(25);
    expect(result.confidence).toBe('Low');
  });
});

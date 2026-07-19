import { describe, it, expect } from 'vitest';
import { parseAIResponse } from '../ai/aiResponseParser.js';
import type { ConversationMemory } from '../../types/index.js';

describe('AI Response Parser', () => {
  const currentMemory: ConversationMemory = { destination: 'Bali' };

  it('should parse valid JSON response directly', () => {
    const rawText = JSON.stringify({
      reply: 'A Bali honeymoon is wonderful!',
      memory: { destination: 'Bali', travellers: 2 },
      intent: { level: 'High', reason: 'Specific honey trip mentioned' },
    });

    const result = parseAIResponse(rawText, currentMemory);

    expect(result.reply).toBe('A Bali honeymoon is wonderful!');
    expect(result.memory.destination).toBe('Bali');
    expect(result.memory.travellers).toBe(2);
    expect(result.intent.level).toBe('High');
  });

  it('should extract JSON from markdown blocks successfully', () => {
    const rawText = `
Some conversational intro text from model.
\`\`\`json
{
  "reply": "Extracted response",
  "memory": { "destination": "Paris" },
  "intent": { "level": "Medium", "reason": "Planning details" }
}
\`\`\`
Ending text.
    `;

    const result = parseAIResponse(rawText, currentMemory);

    expect(result.reply).toBe('Extracted response');
    expect(result.memory.destination).toBe('Paris');
    expect(result.intent.level).toBe('Medium');
  });

  it('should attempt common repairs like trailing commas', () => {
    // Malformed JSON with trailing comma in array/object
    const malformedJson = `
{
  "reply": "Repaired response",
  "memory": { "destination": "Tokyo", },
  "intent": { "level": "Low", "reason": "Inquiry", }
}
    `;

    const result = parseAIResponse(malformedJson, currentMemory);

    expect(result.reply).toBe('Repaired response');
    expect(result.memory.destination).toBe('Tokyo');
  });

  it('should fallback to safe default when parsing fails completely', () => {
    const rawText = 'This is not JSON and contains no JSON blocks at all';

    const result = parseAIResponse(rawText, currentMemory);

    expect(result.reply).toContain("I'd love to help you plan");
    expect(result.memory.destination).toBe('Bali'); // preserved current memory
    expect(result.intent.level).toBe('Low');
  });
});

import { aiResponseSchema } from '../../validation/ai.schema.js';
import { AI_CONFIG } from '../../config/constants.js';
import { logger } from '../../config/logger.js';
import type { AIResponse, ConversationMemory } from '../../types/index.js';

/**
 * Parse and validate the AI model's raw text output into a structured AIResponse.
 * Implements a repair/retry path for invalid JSON and a safe fallback.
 */
export function parseAIResponse(
  rawText: string,
  currentMemory: ConversationMemory
): AIResponse {
  // Attempt 1: Direct parse
  const firstAttempt = tryParseAndValidate(rawText);
  if (firstAttempt) {
    return firstAttempt;
  }

  // Attempt 2: Extract JSON from markdown code blocks
  const extracted = extractJsonFromText(rawText);
  if (extracted) {
    const secondAttempt = tryParseAndValidate(extracted);
    if (secondAttempt) {
      return secondAttempt;
    }
  }

  // Attempt 3: Try to repair common JSON issues
  const repaired = repairJson(rawText);
  if (repaired) {
    const thirdAttempt = tryParseAndValidate(repaired);
    if (thirdAttempt) {
      return thirdAttempt;
    }
  }

  // Final fallback: return safe default response
  logger.warn(
    { rawTextPreview: rawText.slice(0, 200) },
    'All AI response parse attempts failed, using fallback'
  );

  return {
    reply: AI_CONFIG.FALLBACK_REPLY,
    memory: { ...currentMemory },
    intent: {
      level: 'Low',
      reason: 'Could not parse AI response; defaulting to Low intent',
    },
  };
}

/**
 * Attempt to parse raw text as JSON and validate against the schema.
 */
function tryParseAndValidate(text: string): AIResponse | null {
  try {
    const parsed: unknown = JSON.parse(text);
    const validated = aiResponseSchema.parse(parsed);
    return validated;
  } catch {
    return null;
  }
}

/**
 * Extract JSON from text that may be wrapped in markdown code blocks.
 */
function extractJsonFromText(text: string): string | null {
  // Match ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch?.[1]) {
    return codeBlockMatch[1].trim();
  }

  // Try to find JSON object boundaries
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  return null;
}

/**
 * Attempt to repair common JSON formatting issues.
 */
function repairJson(text: string): string | null {
  try {
    let repaired = text;

    // Remove trailing commas before closing braces/brackets
    repaired = repaired.replace(/,\s*([}\]])/g, '$1');

    // Replace single quotes with double quotes
    repaired = repaired.replace(/'/g, '"');

    // Remove control characters
    repaired = repaired.replace(/[\x00-\x1F\x7F]/g, (char) => {
      if (char === '\n' || char === '\r' || char === '\t') {
        return char;
      }
      return '';
    });

    return repaired;
  } catch {
    return null;
  }
}

/**
 * Builds a repair prompt to ask the model to return valid JSON.
 * Used when the initial response couldn't be parsed.
 */
export function buildRepairPrompt(invalidResponse: string): string {
  return [
    'Your previous response was not valid JSON. Please return ONLY a valid JSON object with exactly this structure:',
    '',
    '{',
    '  "reply": "your natural language reply to the user",',
    '  "memory": { ...updated memory fields... },',
    '  "intent": { "level": "Low|Medium|High|Very High|Maximum", "reason": "explanation" }',
    '}',
    '',
    'Your previous invalid response was:',
    invalidResponse.slice(0, 500),
    '',
    'Return ONLY the corrected JSON object, no other text.',
  ].join('\n');
}

import type { ConversationMemory, Intent, IntentLevel } from '../types/index.js';
import { INTENT_LEVELS } from '../config/constants.js';

/**
 * Combines LLM-returned intent with rule-based signal detection as a fallback.
 * The LLM intent is preferred when available; rule-based is used when the LLM
 * returns no intent or the result seems inconsistent with conversation signals.
 */
export function detectIntent(
  aiIntent: Intent | null,
  memory: ConversationMemory,
  latestMessage: string
): Intent {
  // If the AI provided a valid intent, use it — the LLM has richer context
  if (aiIntent && isValidIntentLevel(aiIntent.level)) {
    return aiIntent;
  }

  // Fallback: rule-based intent detection
  return detectIntentFromSignals(memory, latestMessage);
}

/**
 * Rule-based intent detection from conversation memory and the latest message.
 * Uses a combination of filled fields and keyword signals.
 */
export function detectIntentFromSignals(
  memory: ConversationMemory,
  latestMessage: string
): Intent {
  const messageLower = latestMessage.toLowerCase();
  let score = 0;
  const signals: string[] = [];

  // ─── Keyword Signals ─────────────────────────────────────────────

  const bookingKeywords = ['book', 'booking', 'reserve', 'reservation', 'confirm', 'finalize'];
  const urgentKeywords = ['need', 'urgent', 'asap', 'immediately', 'soon', 'ready'];
  const planningKeywords = ['planning', 'plan', 'looking', 'want', 'interested', 'considering'];
  const casualKeywords = ['tell me about', 'what is', 'how is', 'information', 'curious'];

  if (bookingKeywords.some((kw) => messageLower.includes(kw))) {
    score += 30;
    signals.push('Booking-related keywords detected');
  }

  if (urgentKeywords.some((kw) => messageLower.includes(kw))) {
    score += 15;
    signals.push('Urgency signals detected');
  }

  if (planningKeywords.some((kw) => messageLower.includes(kw))) {
    score += 10;
    signals.push('Active planning signals detected');
  }

  if (casualKeywords.some((kw) => messageLower.includes(kw))) {
    score += 5;
    signals.push('Casual inquiry signals');
  }

  // ─── Memory Field Signals ────────────────────────────────────────

  if (memory.destination) {
    score += 10;
    signals.push('Destination specified');
  }

  if (memory.travelDate) {
    score += 10;
    signals.push('Travel dates mentioned');
  }

  if (memory.budget) {
    score += 15;
    signals.push('Budget discussed');
  }

  if (memory.travellers) {
    score += 5;
    signals.push('Traveller count provided');
  }

  if (memory.phone || memory.name) {
    score += 20;
    signals.push('Contact information shared');
  }

  // ─── Map Score to Intent Level ───────────────────────────────────

  let level: IntentLevel;
  if (score >= 70) {
    level = 'Maximum';
  } else if (score >= 55) {
    level = 'Very High';
  } else if (score >= 35) {
    level = 'High';
  } else if (score >= 20) {
    level = 'Medium';
  } else {
    level = 'Low';
  }

  return {
    level,
    reason: signals.length > 0 ? signals.join('; ') : 'Initial inquiry with minimal signals',
  };
}

/**
 * Validate that a string is a valid IntentLevel.
 */
function isValidIntentLevel(level: string): level is IntentLevel {
  return (INTENT_LEVELS as readonly string[]).includes(level);
}

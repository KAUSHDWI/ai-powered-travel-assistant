import type { ConversationMemory, LeadScoreResult, Confidence } from '../types/index.js';
import { LEAD_SCORE_WEIGHTS, CONFIDENCE_BANDS } from '../config/constants.js';

/**
 * Compute an explainable, rule-based lead score from the conversation memory.
 * Returns the total score, confidence band, and an array of reasons
 * explaining exactly which fields contributed.
 */
export function calculateLeadScore(memory: ConversationMemory): LeadScoreResult {
  const reasons: string[] = [];
  let score = 0;

  // Destination — 15 points
  if (memory.destination && memory.destination.trim().length > 0) {
    score += LEAD_SCORE_WEIGHTS.destination;
    reasons.push(`Destination provided: "${memory.destination}" (+${LEAD_SCORE_WEIGHTS.destination})`);
  }

  // Travel Date — 10 points
  if (memory.travelDate && memory.travelDate.trim().length > 0) {
    score += LEAD_SCORE_WEIGHTS.travelDate;
    reasons.push(`Travel date provided: "${memory.travelDate}" (+${LEAD_SCORE_WEIGHTS.travelDate})`);
  }

  // Budget — 15 points
  if (memory.budget && memory.budget.trim().length > 0) {
    score += LEAD_SCORE_WEIGHTS.budget;
    reasons.push(`Budget provided: "${memory.budget}" (+${LEAD_SCORE_WEIGHTS.budget})`);
  }

  // Travellers — 10 points
  if (memory.travellers && memory.travellers > 0) {
    score += LEAD_SCORE_WEIGHTS.travellers;
    reasons.push(`Travellers count: ${memory.travellers} (+${LEAD_SCORE_WEIGHTS.travellers})`);
  }

  // Trip Type — 10 points
  if (memory.tripType && memory.tripType.trim().length > 0) {
    score += LEAD_SCORE_WEIGHTS.tripType;
    reasons.push(`Trip type: "${memory.tripType}" (+${LEAD_SCORE_WEIGHTS.tripType})`);
  }

  // Duration — 5 points
  if (memory.duration && memory.duration.trim().length > 0) {
    score += LEAD_SCORE_WEIGHTS.duration;
    reasons.push(`Duration provided: "${memory.duration}" (+${LEAD_SCORE_WEIGHTS.duration})`);
  }

  // Departure City — 5 points
  if (memory.departureCity && memory.departureCity.trim().length > 0) {
    score += LEAD_SCORE_WEIGHTS.departureCity;
    reasons.push(`Departure city: "${memory.departureCity}" (+${LEAD_SCORE_WEIGHTS.departureCity})`);
  }

  // Special Requirements — 5 points
  if (memory.specialRequirements && memory.specialRequirements.trim().length > 0) {
    score += LEAD_SCORE_WEIGHTS.specialRequirements;
    reasons.push(`Special requirements noted (+${LEAD_SCORE_WEIGHTS.specialRequirements})`);
  }

  // Name — 10 points
  if (memory.name && memory.name.trim().length > 0) {
    score += LEAD_SCORE_WEIGHTS.name;
    reasons.push(`Customer name provided (+${LEAD_SCORE_WEIGHTS.name})`);
  }

  // Phone — 15 points
  if (memory.phone && memory.phone.trim().length > 0) {
    score += LEAD_SCORE_WEIGHTS.phone;
    reasons.push(`Phone number provided (+${LEAD_SCORE_WEIGHTS.phone})`);
  }

  // Determine confidence band
  const confidence = getConfidence(score);

  return { score, confidence, reasons };
}

/**
 * Map a numeric score to a confidence band label.
 */
function getConfidence(score: number): Confidence {
  if (score >= CONFIDENCE_BANDS.HIGH.min) {
    return CONFIDENCE_BANDS.HIGH.label;
  }
  if (score >= CONFIDENCE_BANDS.MEDIUM.min) {
    return CONFIDENCE_BANDS.MEDIUM.label;
  }
  return CONFIDENCE_BANDS.LOW.label;
}

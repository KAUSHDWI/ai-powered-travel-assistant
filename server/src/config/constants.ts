/**
 * Lead scoring field weights — each field's maximum point contribution.
 * Total maximum: 100 points.
 */
export const LEAD_SCORE_WEIGHTS = {
  destination: 15,
  travelDate: 10,
  budget: 15,
  travellers: 10,
  tripType: 10,
  duration: 5,
  departureCity: 5,
  specialRequirements: 5,
  name: 10,
  phone: 15,
} as const;

export const LEAD_SCORE_MAX = Object.values(LEAD_SCORE_WEIGHTS).reduce(
  (sum, val) => sum + val,
  0
);

/**
 * Confidence bands based on lead score ranges.
 */
export const CONFIDENCE_BANDS = {
  LOW: { min: 0, max: 39, label: 'Low' as const },
  MEDIUM: { min: 40, max: 69, label: 'Medium' as const },
  HIGH: { min: 70, max: 100, label: 'High' as const },
} as const;

/**
 * Intent levels from lowest to highest buying signal.
 */
export const INTENT_LEVELS = [
  'Low',
  'Medium',
  'High',
  'Very High',
  'Maximum',
] as const;

/**
 * Field priority order for the AI to ask questions.
 * Contact info is gated behind intent level.
 */
export const FIELD_PRIORITY_ORDER = [
  'destination',
  'travelDate',
  'travellers',
  'budget',
  'tripType',
  'duration',
  'departureCity',
  'specialRequirements',
  'name',
  'phone',
  'email',
] as const;

/**
 * Rate limiting presets.
 */
export const RATE_LIMITS = {
  GENERAL: { windowMs: 15 * 60 * 1000, max: 100 },
  CHAT: { windowMs: 60 * 1000, max: 30 },
  AUTH: { windowMs: 15 * 60 * 1000, max: 5 },
} as const;

/**
 * AI configuration defaults.
 */
export const AI_CONFIG = {
  MAX_HISTORY_MESSAGES: 20,
  MAX_RETRY_ATTEMPTS: 3,
  RESPONSE_TIMEOUT_MS: 30000,
  FALLBACK_REPLY:
    "I'd love to help you plan your perfect trip! Could you tell me a bit more about what kind of travel experience you're looking for?",
} as const;

/**
 * JWT configuration.
 */
export const JWT_CONFIG = {
  ACCESS_TOKEN_TYPE: 'access' as const,
  REFRESH_TOKEN_TYPE: 'refresh' as const,
} as const;

/**
 * Pagination defaults.
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

import type { INTENT_LEVELS, CONFIDENCE_BANDS } from '../config/constants.js';

// ─── Intent ──────────────────────────────────────────────────────────────────

export type IntentLevel = (typeof INTENT_LEVELS)[number];

export interface Intent {
  level: IntentLevel;
  reason: string;
}

// ─── Conversation Memory ─────────────────────────────────────────────────────

export interface ConversationMemory {
  destination?: string;
  departureCity?: string;
  travelDate?: string;
  duration?: string;
  travellers?: number;
  budget?: string;
  tripType?: string;
  specialRequirements?: string;
  name?: string;
  phone?: string;
  email?: string;
}

// ─── Lead Score ──────────────────────────────────────────────────────────────

export type Confidence = (typeof CONFIDENCE_BANDS)[keyof typeof CONFIDENCE_BANDS]['label'];

export interface LeadScoreResult {
  score: number;
  confidence: Confidence;
  reasons: string[];
}

// ─── AI Response ─────────────────────────────────────────────────────────────

export interface AIResponse {
  reply: string;
  memory: ConversationMemory;
  intent: Intent;
}

// ─── Message ─────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  reply: string;
  conversationId: string;
  memory: ConversationMemory;
  intent: Intent;
  leadScore: LeadScoreResult;
  summary: string;
}

// ─── Lead ────────────────────────────────────────────────────────────────────

export interface LeadCustomer {
  name: string;
  phone: string;
  email: string;
}

export interface LeadTravel {
  destination: string;
  departureCity: string;
  travelDate: string;
  travellers: number;
  budget: string;
  duration: string;
  tripType: string;
  specialRequirements: string;
}

export interface LeadQualification {
  leadScore: number;
  confidence: Confidence;
  reason: string[];
  summary: string;
}

export interface LeadData {
  conversationId: string;
  customer: LeadCustomer;
  travel: LeadTravel;
  qualification: LeadQualification;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export type AdminRole = 'admin' | 'super_admin';

export interface AdminPayload {
  id: string;
  email: string;
  role: AdminRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ─── API Response Envelope ───────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ─── Express Extensions ─────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      admin?: AdminPayload;
    }
  }
}

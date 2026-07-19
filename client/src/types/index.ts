export interface Intent {
  level: 'Low' | 'Medium' | 'High' | 'Very High' | 'Maximum';
  reason: string;
}

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

export interface LeadScoreResult {
  score: number;
  confidence: 'Low' | 'Medium' | 'High';
  reasons: string[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  reply: string;
  conversationId: string;
  memory: ConversationMemory;
  intent: Intent;
  leadScore: LeadScoreResult;
  summary: string;
}

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
  confidence: 'Low' | 'Medium' | 'High';
  reason: string[];
  summary: string;
}

export interface Lead {
  _id: string;
  conversationId: string;
  customer: LeadCustomer;
  travel: LeadTravel;
  qualification: LeadQualification;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
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

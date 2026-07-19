import { Lead, type ILead } from '../models/Lead.model.js';
import type { ConversationMemory, LeadScoreResult, PaginatedResult } from '../types/index.js';
import type { LeadQuery } from '../validation/lead.schema.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/apiError.js';
import { sanitizeRegex } from '../utils/sanitize.js';

/**
 * Create or update a lead from the current conversation memory and score.
 * Uses upsert to handle duplicate conversations gracefully.
 */
export async function upsertLead(
  conversationId: string,
  memory: ConversationMemory,
  scoreResult: LeadScoreResult,
  summary: string
): Promise<ILead> {
  const leadData = {
    conversationId,
    customer: {
      name: memory.name ?? '',
      phone: memory.phone ?? '',
      email: memory.email ?? '',
    },
    travel: {
      destination: memory.destination ?? '',
      departureCity: memory.departureCity ?? '',
      travelDate: memory.travelDate ?? '',
      travellers: memory.travellers ?? 0,
      budget: memory.budget ?? '',
      duration: memory.duration ?? '',
      tripType: memory.tripType ?? '',
      specialRequirements: memory.specialRequirements ?? '',
    },
    qualification: {
      leadScore: scoreResult.score,
      confidence: scoreResult.confidence,
      reason: scoreResult.reasons,
      summary,
    },
  };

  const lead = await Lead.findOneAndUpdate(
    { conversationId },
    { $set: leadData },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (!lead) {
    throw ApiError.internal('Failed to upsert lead');
  }

  logger.info(
    {
      conversationId,
      leadScore: scoreResult.score,
      confidence: scoreResult.confidence,
    },
    'Lead upserted'
  );

  return lead;
}

/**
 * Get a single lead by its MongoDB _id.
 */
export async function getLeadById(id: string): Promise<ILead> {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw ApiError.notFound('Lead');
  }
  return lead;
}

/**
 * Get a lead by its conversation ID.
 */
export async function getLeadByConversationId(conversationId: string): Promise<ILead | null> {
  return Lead.findOne({ conversationId });
}

/**
 * List leads with pagination, filtering, sorting, and search.
 */
export async function listLeads(query: LeadQuery): Promise<PaginatedResult<ILead>> {
  const { page, limit, confidence, search, sortBy, sortOrder, startDate, endDate } = query;

  // Build filter
  const filter: Record<string, unknown> = {};

  if (confidence) {
    filter['qualification.confidence'] = confidence;
  }

  if (search) {
    const sanitized = sanitizeRegex(search);
    filter['$or'] = [
      { 'customer.name': { $regex: sanitized, $options: 'i' } },
      { 'customer.email': { $regex: sanitized, $options: 'i' } },
      { 'travel.destination': { $regex: sanitized, $options: 'i' } },
    ];
  }

  if (startDate || endDate) {
    const dateFilter: Record<string, Date> = {};
    if (startDate) {
      dateFilter['$gte'] = new Date(startDate);
    }
    if (endDate) {
      dateFilter['$lte'] = new Date(endDate);
    }
    filter['createdAt'] = dateFilter;
  }

  // Build sort
  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Lead.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data as unknown as ILead[],
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

/**
 * Delete a lead by its MongoDB _id.
 */
export async function deleteLead(id: string): Promise<void> {
  const result = await Lead.findByIdAndDelete(id);
  if (!result) {
    throw ApiError.notFound('Lead');
  }
  logger.info({ leadId: id }, 'Lead deleted');
}

/**
 * Get all leads for CSV export (no pagination).
 */
export async function getLeadsForExport(query: Partial<LeadQuery>): Promise<ILead[]> {
  const filter: Record<string, unknown> = {};

  if (query.confidence) {
    filter['qualification.confidence'] = query.confidence;
  }

  if (query.startDate || query.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (query.startDate) {
      dateFilter['$gte'] = new Date(query.startDate);
    }
    if (query.endDate) {
      dateFilter['$lte'] = new Date(query.endDate);
    }
    filter['createdAt'] = dateFilter;
  }

  return Lead.find(filter).sort({ createdAt: -1 }).lean() as unknown as Promise<ILead[]>;
}

/**
 * Convert leads to CSV format.
 */
export function leadsToCSV(leads: ILead[]): string {
  const headers = [
    'Conversation ID',
    'Name',
    'Phone',
    'Email',
    'Destination',
    'Departure City',
    'Travel Date',
    'Duration',
    'Travellers',
    'Budget',
    'Trip Type',
    'Special Requirements',
    'Lead Score',
    'Confidence',
    'Summary',
    'Created At',
  ];

  const rows = leads.map((lead) => [
    lead.conversationId,
    lead.customer.name,
    lead.customer.phone,
    lead.customer.email,
    lead.travel.destination,
    lead.travel.departureCity,
    lead.travel.travelDate,
    lead.travel.duration,
    String(lead.travel.travellers),
    lead.travel.budget,
    lead.travel.tripType,
    lead.travel.specialRequirements,
    String(lead.qualification.leadScore),
    lead.qualification.confidence,
    lead.qualification.summary,
    lead.createdAt.toISOString(),
  ]);

  const escape = (val: string): string => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const csvLines = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ];

  return csvLines.join('\n');
}

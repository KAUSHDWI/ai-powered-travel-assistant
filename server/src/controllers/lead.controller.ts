import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as leadService from '../services/lead.service.js';
import * as conversationService from '../services/conversation.service.js';
import { calculateLeadScore } from '../services/leadScoring.service.js';
import { logger } from '../config/logger.js';
import type { LeadQuery } from '../validation/lead.schema.js';

/**
 * POST /api/v1/lead
 * Create/finalize a lead from a conversation.
 */
export const createLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { conversationId } = req.body as { conversationId: string };

  const conversation = await conversationService.getConversationById(conversationId);
  const memory = conversation.memory ?? {};
  const scoreResult = calculateLeadScore(memory);
  const summary = conversationService.generateConversationSummary(memory);

  const lead = await leadService.upsertLead(conversationId, memory, scoreResult, summary);

  logger.info({ conversationId, leadId: lead._id }, 'Lead created/updated');

  res.status(201).json({ success: true, data: lead });
});

/**
 * GET /api/v1/lead/:id
 * Fetch a single lead by its ID.
 */
export const getLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const lead = await leadService.getLeadById(id as string);

  res.status(200).json({ success: true, data: lead });
});

/**
 * GET /api/v1/leads
 * List leads with pagination, filtering, and sorting.
 */
export const listLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = req.query as unknown as LeadQuery;
  const result = await leadService.listLeads(query);

  res.status(200).json({ success: true, data: result });
});

/**
 * DELETE /api/v1/lead/:id
 * Delete a lead (admin only).
 */
export const deleteLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await leadService.deleteLead(id as string);

  logger.info({ leadId: id, adminId: req.admin?.id }, 'Lead deleted by admin');

  res.status(200).json({ success: true, data: { message: 'Lead deleted successfully' } });
});

/**
 * GET /api/v1/leads/export
 * Export leads as CSV (admin only).
 */
export const exportLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = req.query as unknown as Partial<LeadQuery>;
  const leads = await leadService.getLeadsForExport(query);
  const csv = leadService.leadsToCSV(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=leads-export-${Date.now()}.csv`);
  res.status(200).send(csv);
});

/**
 * GET /api/v1/conversations/:id
 * Fetch full conversation transcript (admin only).
 */
export const getConversation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const conversation = await conversationService.getConversationById(id as string);

    res.status(200).json({ success: true, data: conversation });
  }
);

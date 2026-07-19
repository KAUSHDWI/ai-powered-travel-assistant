import { z } from 'zod';
import { PAGINATION } from '../config/constants.js';

export const createLeadRequestSchema = z
  .object({
    conversationId: z.string().uuid('Invalid conversation ID'),
  })
  .strict();

export const leadIdParamSchema = z.object({
  id: z.string().min(1, 'Lead ID is required'),
});

export const leadQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
  confidence: z.enum(['Low', 'Medium', 'High']).optional(),
  search: z.string().max(200).optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'qualification.leadScore'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateLeadRequest = z.infer<typeof createLeadRequestSchema>;
export type LeadIdParam = z.infer<typeof leadIdParamSchema>;
export type LeadQuery = z.infer<typeof leadQuerySchema>;

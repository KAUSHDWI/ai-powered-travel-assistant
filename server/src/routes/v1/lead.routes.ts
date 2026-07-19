import { Router } from 'express';
import {
  createLead,
  getLead,
  listLeads,
  deleteLead,
  exportLeads,
  getConversation,
} from '../../controllers/lead.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { authMiddleware } from '../../middleware/auth.js';
import {
  createLeadRequestSchema,
  leadIdParamSchema,
  leadQuerySchema,
} from '../../validation/lead.schema.js';
import { conversationIdParamSchema } from '../../validation/common.schema.js';

const router = Router();

// Public routes
router.post(
  '/lead',
  validateRequest(createLeadRequestSchema, 'body'),
  createLead
);

router.get(
  '/lead/:id',
  validateRequest(leadIdParamSchema, 'params'),
  getLead
);

router.get(
  '/leads',
  validateRequest(leadQuerySchema, 'query'),
  listLeads
);

// Admin-only routes
router.delete(
  '/lead/:id',
  authMiddleware,
  validateRequest(leadIdParamSchema, 'params'),
  deleteLead
);

router.get(
  '/leads/export',
  authMiddleware,
  exportLeads
);

router.get(
  '/conversations/:id',
  authMiddleware,
  validateRequest(conversationIdParamSchema, 'params'),
  getConversation
);

export default router;

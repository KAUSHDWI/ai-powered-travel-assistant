import { Router } from 'express';
import { handleChat } from '../../controllers/chat.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { chatRequestSchema } from '../../validation/chat.schema.js';
import { chatLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/',
  chatLimiter,
  validateRequest(chatRequestSchema, 'body'),
  handleChat
);

export default router;

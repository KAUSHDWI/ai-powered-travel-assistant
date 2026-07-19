import { Router } from 'express';
import { login, refresh } from '../../controllers/auth.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { loginRequestSchema, refreshTokenRequestSchema } from '../../validation/auth.schema.js';
import { authLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/login',
  authLimiter,
  validateRequest(loginRequestSchema, 'body'),
  login
);

router.post(
  '/refresh',
  authLimiter,
  validateRequest(refreshTokenRequestSchema, 'body'),
  refresh
);

export default router;

import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';
import type { LoginRequest, RefreshTokenRequest } from '../validation/auth.schema.js';

/**
 * POST /api/v1/auth/login
 * Admin login — returns JWT access + refresh token pair.
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginRequest;
  const { admin, tokens } = await authService.loginAdmin(email, password);

  res.status(200).json({
    success: true,
    data: {
      admin,
      tokens,
    },
  });
});

/**
 * POST /api/v1/auth/refresh
 * Refresh the access token using a valid refresh token.
 * Implements token rotation.
 */
export const refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body as RefreshTokenRequest;
  const tokens = await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    data: { tokens },
  });
});

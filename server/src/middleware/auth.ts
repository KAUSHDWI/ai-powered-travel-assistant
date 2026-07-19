import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { JWT_CONFIG } from '../config/constants.js';
import type { AdminPayload } from '../types/index.js';

/**
 * JWT authentication middleware for admin-only routes.
 * Extracts the Bearer token from the Authorization header,
 * verifies it, and attaches the decoded admin payload to req.admin.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Missing or invalid authorization header');
  }

  const token = authHeader.slice(7);

  if (!token) {
    throw ApiError.unauthorized('Token not provided');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AdminPayload & {
      type: string;
    };

    if (decoded.type !== JWT_CONFIG.ACCESS_TOKEN_TYPE) {
      throw ApiError.unauthorized('Invalid token type');
    }

    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('Token has expired');
    }

    if (err instanceof jwt.JsonWebTokenError) {
      throw ApiError.unauthorized('Invalid token');
    }

    throw ApiError.unauthorized('Authentication failed');
  }
}

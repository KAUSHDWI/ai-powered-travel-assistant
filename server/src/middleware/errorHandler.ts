import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';
import mongoose from 'mongoose';

/**
 * Centralized error-handling middleware.
 * Returns a consistent JSON error envelope: { success: false, error: { code, message } }
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.requestId ?? 'unknown';

  // ─── Zod Validation Error ─────────────────────────────────────────
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    logger.warn({ requestId, errors: fieldErrors }, 'Validation error');

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: fieldErrors,
      },
    });
    return;
  }

  // ─── Operational API Error ────────────────────────────────────────
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error({ requestId, err }, 'Server error');
    } else {
      logger.warn({ requestId, code: err.code, message: err.message }, 'Client error');
    }

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // ─── Mongoose Validation Error ────────────────────────────────────
  if (err instanceof mongoose.Error.ValidationError) {
    const fieldErrors = Object.entries(err.errors).map(([field, e]) => ({
      field,
      message: e.message,
    }));

    logger.warn({ requestId, errors: fieldErrors }, 'Database validation error');

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Data validation failed',
        details: fieldErrors,
      },
    });
    return;
  }

  // ─── Mongoose Cast Error (invalid ObjectId, etc.) ─────────────────
  if (err instanceof mongoose.Error.CastError) {
    logger.warn({ requestId, path: err.path, value: err.value }, 'Cast error');

    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PARAMETER',
        message: `Invalid value for ${err.path}`,
      },
    });
    return;
  }

  // ─── MongoDB Duplicate Key Error ──────────────────────────────────
  if (
    err.name === 'MongoServerError' &&
    'code' in err &&
    (err as Record<string, unknown>)['code'] === 11000
  ) {
    logger.warn({ requestId }, 'Duplicate key error');

    res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'A record with this data already exists',
      },
    });
    return;
  }

  // ─── Unknown / Programming Error ──────────────────────────────────
  logger.error({ requestId, err }, 'Unhandled error');

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env['NODE_ENV'] === 'production'
          ? 'An unexpected error occurred'
          : err.message,
    },
  });
}

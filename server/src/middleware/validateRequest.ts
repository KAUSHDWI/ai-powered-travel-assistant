import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema, ZodError } from 'zod';
import { sanitizeInput } from '../utils/sanitize.js';

type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Generic Zod validation middleware factory.
 * Validates and sanitizes the specified request property (body, params, or query)
 * against the provided Zod schema.
 */
export function validateRequest(
  schema: ZodSchema,
  target: ValidationTarget = 'body'
): (req: Request, _res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const rawData = req[target];
      const sanitizedData = sanitizeInput(rawData);
      const parsed = schema.parse(sanitizedData);

      // Replace the original data with the parsed (and potentially transformed) data
      if (target === 'body') {
        req.body = parsed;
      } else if (target === 'params') {
        req.params = parsed as Record<string, string>;
      } else {
        req.query = parsed as Record<string, string>;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(err);
        return;
      }
      next(err);
    }
  };
}

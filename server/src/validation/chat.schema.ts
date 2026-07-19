import { z } from 'zod';

export const chatRequestSchema = z
  .object({
    message: z.string().min(1, 'Message must not be empty').max(2000, 'Message too long'),
    conversationId: z.string().uuid().optional(),
  })
  .strict();

export type ChatRequestSchema = z.infer<typeof chatRequestSchema>;

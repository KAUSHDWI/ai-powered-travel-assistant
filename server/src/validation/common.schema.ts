import { z } from 'zod';

export const conversationIdParamSchema = z.object({
  id: z.string().uuid('Invalid conversation ID'),
});

export type ConversationIdParam = z.infer<typeof conversationIdParamSchema>;

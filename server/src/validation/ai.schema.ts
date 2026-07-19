import { z } from 'zod';

export const intentLevelSchema = z.enum(['Low', 'Medium', 'High', 'Very High', 'Maximum']);

export const conversationMemorySchema = z.object({
  destination: z.string().optional(),
  departureCity: z.string().optional(),
  travelDate: z.string().optional(),
  duration: z.string().optional(),
  travellers: z.number().int().positive().optional(),
  budget: z.string().optional(),
  tripType: z.string().optional(),
  specialRequirements: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

export const intentSchema = z.object({
  level: intentLevelSchema,
  reason: z.string(),
});

export const aiResponseSchema = z.object({
  reply: z.string().min(1, 'Reply must not be empty'),
  memory: conversationMemorySchema,
  intent: intentSchema,
});

export type AIResponseSchema = z.infer<typeof aiResponseSchema>;

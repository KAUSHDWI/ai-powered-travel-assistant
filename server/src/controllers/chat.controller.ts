import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getGeminiService } from '../services/ai/gemini.service.js';
import * as conversationService from '../services/conversation.service.js';
import * as leadService from '../services/lead.service.js';
import { calculateLeadScore } from '../services/leadScoring.service.js';
import { detectIntent } from '../services/intentDetection.service.js';
import { logger } from '../config/logger.js';
import type { ChatRequest, ChatResponse } from '../types/index.js';

/**
 * POST /api/v1/chat
 * Process a user message: call AI, update conversation, score lead.
 */
export const handleChat = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { message, conversationId: incomingId } = req.body as ChatRequest;
  const requestId = req.requestId;

  logger.info({ requestId, conversationId: incomingId }, 'Processing chat message');

  // 1. Get or create conversation
  const conversation = await conversationService.getOrCreateConversation(incomingId);
  const conversationId = conversation.conversationId;

  // 2. Add user message to history
  await conversationService.addMessage(conversationId, {
    role: 'user',
    content: message,
  });

  // 3. Get current state
  const currentMessages = conversation.messages.map((m) => ({
    role: m.role,
    content: m.content,
    timestamp: m.timestamp,
  }));
  const currentMemory = conversation.memory ?? {};

  // 4. Call AI service
  const aiService = getGeminiService();
  const aiResponse = await aiService.generateResponse(currentMessages, currentMemory, message);

  // 5. Merge memory — preserve existing fields, update with new ones
  const updatedMemory = {
    ...currentMemory,
    ...aiResponse.memory,
  };

  // Clean undefined/null/empty values from memory (but keep valid falsy values like 0)
  for (const [key, value] of Object.entries(updatedMemory)) {
    if (value === undefined || value === null || value === '') {
      const existingValue = (currentMemory as Record<string, unknown>)[key];
      if (existingValue && existingValue !== '') {
        (updatedMemory as Record<string, unknown>)[key] = existingValue;
      }
    }
  }

  // 6. Detect intent (AI-provided + rule-based fallback)
  const intent = detectIntent(aiResponse.intent, updatedMemory, message);

  // 7. Update conversation in DB
  await conversationService.addMessage(conversationId, {
    role: 'assistant',
    content: aiResponse.reply,
  });
  await conversationService.updateMemory(conversationId, updatedMemory);
  await conversationService.addIntentHistory(conversationId, intent);

  // 8. Calculate lead score
  const leadScore = calculateLeadScore(updatedMemory);

  // 9. Generate conversation summary
  const summary = conversationService.generateConversationSummary(updatedMemory);

  // 10. Auto-upsert lead if score > 0
  if (leadScore.score > 0) {
    await leadService.upsertLead(conversationId, updatedMemory, leadScore, summary);
  }

  // 11. Build response
  const response: ChatResponse = {
    reply: aiResponse.reply,
    conversationId,
    memory: updatedMemory,
    intent,
    leadScore,
    summary,
  };

  res.status(200).json({ success: true, data: response });
});

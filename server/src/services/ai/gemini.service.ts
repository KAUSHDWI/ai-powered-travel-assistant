import { GoogleGenAI } from '@google/genai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { IAIService } from './ai.interface.js';
import type { ConversationMemory, AIResponse, Message } from '../../types/index.js';
import { buildPrompt } from './promptBuilder.js';
import { parseAIResponse, buildRepairPrompt } from './aiResponseParser.js';
import { aiResponseSchema } from '../../validation/ai.schema.js';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { AI_CONFIG } from '../../config/constants.js';

/**
 * Gemini AI Service implementation.
 * Uses @google/genai SDK with structured JSON output mode.
 */
export class GeminiService implements IAIService {
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    this.model = env.GEMINI_MODEL;
  }

  async generateResponse(
    messages: Message[],
    memory: ConversationMemory,
    userMessage: string
  ): Promise<AIResponse> {
    const { systemInstruction, contents } = buildPrompt(messages, memory, userMessage);

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= AI_CONFIG.MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        logger.debug({ attempt, model: this.model }, 'Calling Gemini API');

        const response = await this.client.models.generateContent({
          model: this.model,
          contents: contents.map((c) => ({
            role: c.role as 'user' | 'model',
            parts: [{ text: c.text }],
          })),
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: zodToJsonSchema(aiResponseSchema) as Record<string, unknown>,
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        });

        const rawText = response.text ?? '';

        if (!rawText.trim()) {
          logger.warn({ attempt }, 'Empty response from Gemini');
          continue;
        }

        const parsed = parseAIResponse(rawText, memory);

        logger.info(
          {
            attempt,
            intentLevel: parsed.intent.level,
            replyLength: parsed.reply.length,
          },
          'Gemini response parsed successfully'
        );

        return parsed;
      } catch (err) {
        lastError = err as Error;
        logger.error(
          { err, attempt, maxRetries: AI_CONFIG.MAX_RETRY_ATTEMPTS },
          'Gemini API call failed'
        );

        if (attempt < AI_CONFIG.MAX_RETRY_ATTEMPTS) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries exhausted — try a repair prompt as last resort
    try {
      logger.warn('All standard retries exhausted, attempting repair prompt');

      const repairPrompt = buildRepairPrompt(lastError?.message ?? 'Unknown error');

      const repairResponse = await this.client.models.generateContent({
        model: this.model,
        contents: [{ role: 'user' as const, parts: [{ text: repairPrompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: zodToJsonSchema(aiResponseSchema) as Record<string, unknown>,
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      });

      const repairText = repairResponse.text ?? '';
      if (repairText.trim()) {
        const repaired = parseAIResponse(repairText, memory);
        return repaired;
      }
    } catch (repairErr) {
      logger.error({ err: repairErr }, 'Repair prompt also failed');
    }

    // Final fallback
    logger.error('All Gemini attempts exhausted, returning fallback response');

    return {
      reply: AI_CONFIG.FALLBACK_REPLY,
      memory: { ...memory },
      intent: {
        level: 'Low',
        reason: 'AI service temporarily unavailable',
      },
    };
  }
}

// Singleton instance
let geminiServiceInstance: GeminiService | null = null;

export function getGeminiService(): IAIService {
  if (!geminiServiceInstance) {
    geminiServiceInstance = new GeminiService();
  }
  return geminiServiceInstance;
}

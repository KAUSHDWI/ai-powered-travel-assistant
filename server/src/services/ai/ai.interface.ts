import type { ConversationMemory, AIResponse, Message } from '../../types/index.js';

/**
 * AI Service Interface.
 * Abstracts the AI provider so Gemini can be swapped for another
 * provider (OpenAI, Anthropic, etc.) without changing business logic.
 */
export interface IAIService {
  /**
   * Generate a response from the AI model given the conversation context.
   *
   * @param messages - The conversation message history
   * @param memory - The current conversation memory snapshot
   * @param userMessage - The latest user message
   * @returns Parsed AI response with reply, updated memory, and intent
   */
  generateResponse(
    messages: Message[],
    memory: ConversationMemory,
    userMessage: string
  ): Promise<AIResponse>;
}

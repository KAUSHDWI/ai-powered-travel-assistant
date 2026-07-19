import { v4 as uuidv4 } from 'uuid';
import { Conversation, type IConversation } from '../models/Conversation.model.js';
import type { ConversationMemory, Message, Intent } from '../types/index.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Get or create a conversation by its ID.
 */
export async function getOrCreateConversation(
  conversationId?: string
): Promise<IConversation> {
  if (conversationId) {
    const existing = await Conversation.findOne({ conversationId });
    if (existing) {
      return existing;
    }
    logger.info({ conversationId }, 'Conversation ID provided but not found, creating new');
  }

  const newId = conversationId ?? uuidv4();
  const conversation = new Conversation({
    conversationId: newId,
    messages: [],
    memory: {},
    intentHistory: [],
  });

  await conversation.save();
  logger.info({ conversationId: newId }, 'New conversation created');

  return conversation;
}

/**
 * Add a message to the conversation history.
 */
export async function addMessage(
  conversationId: string,
  message: Omit<Message, 'timestamp'>
): Promise<void> {
  await Conversation.updateOne(
    { conversationId },
    {
      $push: {
        messages: {
          role: message.role,
          content: message.content,
          timestamp: new Date(),
        },
      },
      $set: { updatedAt: new Date() },
    }
  );
}

/**
 * Update the conversation memory snapshot.
 */
export async function updateMemory(
  conversationId: string,
  memory: ConversationMemory
): Promise<void> {
  await Conversation.updateOne(
    { conversationId },
    {
      $set: {
        memory,
        updatedAt: new Date(),
      },
    }
  );
}

/**
 * Add an intent entry to the conversation's intent history.
 */
export async function addIntentHistory(
  conversationId: string,
  intent: Intent
): Promise<void> {
  await Conversation.updateOne(
    { conversationId },
    {
      $push: {
        intentHistory: {
          level: intent.level,
          reason: intent.reason,
          timestamp: new Date(),
        },
      },
    }
  );
}

/**
 * Get a conversation by its ID.
 */
export async function getConversationById(
  conversationId: string
): Promise<IConversation> {
  const conversation = await Conversation.findOne({ conversationId });
  if (!conversation) {
    throw ApiError.notFound('Conversation');
  }
  return conversation;
}

/**
 * Get the messages from a conversation.
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  const conversation = await getConversationById(conversationId);
  return conversation.messages.map((m) => ({
    role: m.role,
    content: m.content,
    timestamp: m.timestamp,
  }));
}

/**
 * Generate a brief summary of the conversation based on the memory.
 */
export function generateConversationSummary(memory: ConversationMemory): string {
  const parts: string[] = [];

  if (memory.name) {
    parts.push(`${memory.name} is`);
  } else {
    parts.push('A customer is');
  }

  if (memory.tripType) {
    parts.push(`looking for a ${memory.tripType} trip`);
  } else {
    parts.push('exploring travel options');
  }

  if (memory.destination) {
    parts.push(`to ${memory.destination}`);
  }

  if (memory.departureCity) {
    parts.push(`from ${memory.departureCity}`);
  }

  if (memory.travelDate) {
    parts.push(`around ${memory.travelDate}`);
  }

  if (memory.duration) {
    parts.push(`for ${memory.duration}`);
  }

  if (memory.travellers) {
    parts.push(`with ${memory.travellers} traveller${memory.travellers > 1 ? 's' : ''}`);
  }

  if (memory.budget) {
    parts.push(`within a budget of ${memory.budget}`);
  }

  if (memory.specialRequirements) {
    parts.push(`with special requirements: ${memory.specialRequirements}`);
  }

  const summary = parts.join(' ') + '.';
  return summary.charAt(0).toUpperCase() + summary.slice(1);
}

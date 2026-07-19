import type { ConversationMemory, Message } from '../../types/index.js';
import { FIELD_PRIORITY_ORDER, AI_CONFIG } from '../../config/constants.js';
import { buildSystemPrompt } from '../../prompts/systemPrompt.js';
import { getFewShotExamples } from '../../prompts/fewShotExamples.js';

/**
 * Builds the complete prompt payload for the AI model.
 * Assembles: system prompt + few-shot examples + memory context + message history + new user message.
 */
export function buildPrompt(
  messages: Message[],
  memory: ConversationMemory,
  userMessage: string
): { systemInstruction: string; contents: Array<{ role: string; text: string }> } {
  const systemInstruction = buildSystemPrompt();

  // Build memory context summary
  const memoryContext = buildMemoryContext(memory);

  // Build missing fields list
  const missingFields = getMissingFields(memory);

  // Get few-shot examples
  const fewShotExamples = getFewShotExamples();

  // Construct the full system instruction with dynamic context
  const fullSystemInstruction = [
    systemInstruction,
    '',
    '--- CURRENT CONVERSATION MEMORY ---',
    memoryContext,
    '',
    '--- MISSING FIELDS (in priority order) ---',
    missingFields.length > 0
      ? missingFields.join(', ')
      : 'All key fields have been collected.',
    '',
    '--- FEW-SHOT EXAMPLES ---',
    fewShotExamples,
  ].join('\n');

  // Trim message history to the last N messages to manage token budget
  const recentMessages = messages.slice(-AI_CONFIG.MAX_HISTORY_MESSAGES);

  // Build conversation contents
  const contents: Array<{ role: string; text: string }> = [];

  for (const msg of recentMessages) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      text: msg.content,
    });
  }

  // Add the new user message
  contents.push({
    role: 'user',
    text: userMessage,
  });

  return { systemInstruction: fullSystemInstruction, contents };
}

/**
 * Serializes the current memory into a human-readable context string.
 */
function buildMemoryContext(memory: ConversationMemory): string {
  const fields: Array<{ key: string; label: string; value: string | number | undefined }> = [
    { key: 'destination', label: 'Destination', value: memory.destination },
    { key: 'departureCity', label: 'Departure City', value: memory.departureCity },
    { key: 'travelDate', label: 'Travel Date', value: memory.travelDate },
    { key: 'duration', label: 'Duration', value: memory.duration },
    { key: 'travellers', label: 'Travellers', value: memory.travellers },
    { key: 'budget', label: 'Budget', value: memory.budget },
    { key: 'tripType', label: 'Trip Type', value: memory.tripType },
    {
      key: 'specialRequirements',
      label: 'Special Requirements',
      value: memory.specialRequirements,
    },
    { key: 'name', label: 'Customer Name', value: memory.name },
    { key: 'phone', label: 'Phone', value: memory.phone },
    { key: 'email', label: 'Email', value: memory.email },
  ];

  return fields
    .map((f) => `${f.label}: ${f.value ?? '[Not yet provided]'}`)
    .join('\n');
}

/**
 * Determines which fields are still missing, in priority order.
 */
function getMissingFields(memory: ConversationMemory): string[] {
  const memoryRecord = memory as Record<string, unknown>;
  return FIELD_PRIORITY_ORDER.filter((field) => {
    const value = memoryRecord[field];
    return value === undefined || value === null || value === '' || value === 0;
  });
}

import api from './api.js';
import type { ChatResponse, ApiResponse } from '../types/index.js';

export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<ApiResponse<ChatResponse>> {
  const response = await api.post<ApiResponse<ChatResponse>>('/chat', {
    message,
    conversationId,
  });
  return response.data;
}

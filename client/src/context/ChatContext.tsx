import React, { createContext, useReducer, useEffect, type ReactNode } from 'react';
import { sendChatMessage } from '../services/chat.service.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import type { Message, ConversationMemory, Intent, LeadScoreResult } from '../types/index.js';

// ─── State Definition ────────────────────────────────────────────────────────

export interface ChatState {
  messages: Message[];
  memory: ConversationMemory;
  intent: Intent;
  leadScore: LeadScoreResult;
  summary: string;
  conversationId: string;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  memory: {},
  intent: { level: 'Low', reason: 'No conversation started yet.' },
  leadScore: { score: 0, confidence: 'Low', reasons: [] },
  summary: '',
  conversationId: '',
  loading: false,
  error: null,
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type ChatAction =
  | { type: 'START_REQUEST' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'INITIALIZE_CONVERSATION'; payload: string }
  | {
      type: 'RECEIVE_RESPONSE';
      payload: {
        reply: string;
        memory: ConversationMemory;
        intent: Intent;
        leadScore: LeadScoreResult;
        summary: string;
        userMessage: string;
      };
    }
  | { type: 'RESET_CHAT' }
  | { type: 'ADD_USER_MESSAGE'; payload: string };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'START_REQUEST':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'INITIALIZE_CONVERSATION':
      return { ...state, conversationId: action.payload };
    case 'ADD_USER_MESSAGE': {
      const userMsg: Message = {
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      };
      return {
        ...state,
        messages: [...state.messages, userMsg],
      };
    }
    case 'RECEIVE_RESPONSE': {
      const assistantMsg: Message = {
        role: 'assistant',
        content: action.payload.reply,
        timestamp: new Date().toISOString(),
      };
      return {
        ...state,
        loading: false,
        memory: action.payload.memory,
        intent: action.payload.intent,
        leadScore: action.payload.leadScore,
        summary: action.payload.summary,
        messages: [...state.messages, assistantMsg],
      };
    }
    case 'RESET_CHAT':
      return { ...initialState };
    default:
      return state;
  }
}

// ─── Context Definition ──────────────────────────────────────────────────────

export interface ChatContextProps {
  state: ChatState;
  sendMessage: (message: string) => Promise<void>;
  resetChat: () => void;
}

export const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// ─── Provider Component ──────────────────────────────────────────────────────

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Restore conversation ID from local storage if present
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.CONVERSATION_ID);
    if (savedId) {
      dispatch({ type: 'INITIALIZE_CONVERSATION', payload: savedId });
    }
  }, []);

  const sendMessage = async (message: string) => {
    // 1. Add user message locally for immediate UI update
    dispatch({ type: 'ADD_USER_MESSAGE', payload: message });
    dispatch({ type: 'START_REQUEST' });

    try {
      // 2. Send message to backend
      const convId = state.conversationId || undefined;
      const response = await sendChatMessage(message, convId);

      if (response.success && response.data) {
        const data = response.data;

        // Save conversation ID to state and local storage if new
        if (!state.conversationId) {
          localStorage.setItem(STORAGE_KEYS.CONVERSATION_ID, data.conversationId);
          dispatch({ type: 'INITIALIZE_CONVERSATION', payload: data.conversationId });
        }

        dispatch({
          type: 'RECEIVE_RESPONSE',
          payload: {
            reply: data.reply,
            memory: data.memory,
            intent: data.intent,
            leadScore: data.leadScore,
            summary: data.summary,
            userMessage: message,
          },
        });
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: response.error?.message || 'Failed to get a response from Maya',
        });
      }
    } catch (err: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.error?.message || err.message || 'Network error, please try again',
      });
    }
  };

  const resetChat = () => {
    localStorage.removeItem(STORAGE_KEYS.CONVERSATION_ID);
    dispatch({ type: 'RESET_CHAT' });
  };

  return (
    <ChatContext.Provider value={{ state, sendMessage, resetChat }}>
      {children}
    </ChatContext.Provider>
  );
};

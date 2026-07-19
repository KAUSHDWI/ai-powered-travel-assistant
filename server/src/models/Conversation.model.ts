import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { ConversationMemory, Intent, MessageRole } from '../types/index.js';

// ─── Sub-Schemas ─────────────────────────────────────────────────────────────

const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'] satisfies MessageRole[],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const memorySchema = new Schema(
  {
    destination: { type: String },
    departureCity: { type: String },
    travelDate: { type: String },
    duration: { type: String },
    travellers: { type: Number },
    budget: { type: String },
    tripType: { type: String },
    specialRequirements: { type: String },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  { _id: false }
);

const intentHistorySchema = new Schema(
  {
    level: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Very High', 'Maximum'],
      required: true,
    },
    reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ─── Conversation Document ──────────────────────────────────────────────────

export interface IConversation extends Document {
  conversationId: string;
  messages: Array<{ role: MessageRole; content: string; timestamp: Date }>;
  memory: ConversationMemory;
  intentHistory: Array<Intent & { timestamp: Date }>;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    memory: {
      type: memorySchema,
      default: {},
    },
    intentHistory: {
      type: [intentHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const anyRet = ret as any;
        delete anyRet.__v;
        return ret;
      },
    },
  }
);

conversationSchema.index({ createdAt: -1 });

export const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  'Conversation',
  conversationSchema
);

import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { Confidence } from '../types/index.js';

// ─── Sub-Schemas ─────────────────────────────────────────────────────────────

const customerSchema = new Schema(
  {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { _id: false }
);

const travelSchema = new Schema(
  {
    destination: { type: String, default: '' },
    departureCity: { type: String, default: '' },
    travelDate: { type: String, default: '' },
    travellers: { type: Number, default: 0 },
    budget: { type: String, default: '' },
    duration: { type: String, default: '' },
    tripType: { type: String, default: '' },
    specialRequirements: { type: String, default: '' },
  },
  { _id: false }
);

const qualificationSchema = new Schema(
  {
    leadScore: { type: Number, default: 0, min: 0, max: 100 },
    confidence: {
      type: String,
      enum: ['Low', 'Medium', 'High'] satisfies Confidence[],
      default: 'Low',
    },
    reason: { type: [String], default: [] },
    summary: { type: String, default: '' },
  },
  { _id: false }
);

// ─── Lead Document ───────────────────────────────────────────────────────────

export interface ILead extends Document {
  conversationId: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  travel: {
    destination: string;
    departureCity: string;
    travelDate: string;
    travellers: number;
    budget: string;
    duration: string;
    tripType: string;
    specialRequirements: string;
  };
  qualification: {
    leadScore: number;
    confidence: Confidence;
    reason: string[];
    summary: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: customerSchema,
      required: true,
      default: {},
    },
    travel: {
      type: travelSchema,
      required: true,
      default: {},
    },
    qualification: {
      type: qualificationSchema,
      required: true,
      default: {},
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

leadSchema.index({ createdAt: -1 });
leadSchema.index({ 'qualification.leadScore': -1 });
leadSchema.index({ 'qualification.confidence': 1 });

export const Lead: Model<ILead> = mongoose.model<ILead>('Lead', leadSchema);

import mongoose, { Schema, type Document, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { AdminRole } from '../types/index.js';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  role: AdminRole;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'super_admin'] satisfies AdminRole[],
      default: 'admin',
    },
    refreshTokenHash: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const anyRet = ret as any;
        delete anyRet.passwordHash;
        delete anyRet.refreshTokenHash;
        delete anyRet.__v;
        return ret;
      },
    },
  }
);

/**
 * Compare a candidate password against the stored hash.
 */
adminSchema.methods['comparePassword'] = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Hash password before saving if it has been modified.
 */
adminSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', adminSchema);

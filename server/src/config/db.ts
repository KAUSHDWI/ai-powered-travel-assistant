import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDatabase(): Promise<void> {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;
      logger.info({ attempt, maxRetries }, 'Connecting to MongoDB...');

      await mongoose.connect(env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info('✅ MongoDB connected successfully');

      mongoose.connection.on('error', (err) => {
        logger.error({ err }, 'MongoDB connection error');
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
      });

      return;
    } catch (err) {
      logger.error({ err, attempt, maxRetries }, 'MongoDB connection attempt failed');

      if (attempt >= maxRetries) {
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts`);
      }

      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      logger.info({ delay }, 'Retrying MongoDB connection...');
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected gracefully');
  } catch (err) {
    logger.error({ err }, 'Error disconnecting from MongoDB');
  }
}

import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import app from './app.js';

async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start HTTP server
    const server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV,
          model: env.GEMINI_MODEL,
        },
        `🚀 Server is running on port ${env.PORT}`
      );
    });

    // ─── Graceful Shutdown ─────────────────────────────────────────
    const shutdown = async (signal: string): Promise<void> => {
      logger.info({ signal }, 'Received shutdown signal, starting graceful shutdown...');

      server.close(async () => {
        logger.info('HTTP server closed');

        await disconnectDatabase();

        logger.info('Graceful shutdown complete');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown — could not close connections in time');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));

    // ─── Unhandled Error Handlers ──────────────────────────────────
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error({ err: reason }, 'Unhandled Promise Rejection');
      // In production, you might want to gracefully shutdown
      if (env.NODE_ENV === 'production') {
        void shutdown('unhandledRejection');
      }
    });

    process.on('uncaughtException', (err: Error) => {
      logger.fatal({ err }, 'Uncaught Exception — shutting down');
      void shutdown('uncaughtException');
    });
  } catch (err) {
    logger.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
}

void startServer();

import { logger } from '@utils/logger';
import { testUtil } from '@utils/test';

// Log application startup
logger.info('Starting application...');
logger.info('TypeScript is working!');
logger.debug('Test utility output', { result: testUtil() });

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    }
  });
  // Give logger time to write before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection', {
    reason: reason?.toString(),
    promise: promise?.toString()
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing application gracefully');
  // Here you would close database connections, etc.
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing application gracefully');
  // Here you would close database connections, etc.
  process.exit(0);
});

logger.info('Application initialized successfully');

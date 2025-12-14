import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Load configuration
const config = require('../../config');

const { combine, timestamp, errors, json, printf, colorize, align } = winston.format;

/**
 * Custom format for pretty console output (development)
 */
const prettyFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

/**
 * Create Winston logger instance with multiple transports
 */
const createLogger = () => {
  const logConfig = config.logging || {
    level: 'info',
    format: 'json',
    directory: 'logs',
    maxSize: '20m',
    maxFiles: '14d'
  };

  const logDir = path.resolve(process.cwd(), logConfig.directory);
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Base format for all logs
  const baseFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true })
  );

  // Console transport format (pretty for dev, json for prod)
  const consoleFormat = logConfig.format === 'pretty'
    ? combine(baseFormat, colorize(), align(), prettyFormat)
    : combine(baseFormat, json());

  // File transport format (always JSON for parsing)
  const fileFormat = combine(baseFormat, json());

  // Configure transports
  const transports: winston.transport[] = [];

  // Console transport (always enabled in development)
  if (isDevelopment || process.env.ENABLE_CONSOLE_LOGS === 'true') {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
        level: logConfig.level
      })
    );
  }

  // File transport - Combined logs (info and above)
  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: logConfig.maxSize,
      maxFiles: logConfig.maxFiles,
      format: fileFormat,
      level: logConfig.level
    })
  );

  // File transport - Error logs only
  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: logConfig.maxSize,
      maxFiles: logConfig.maxFiles,
      format: fileFormat,
      level: 'error'
    })
  );

  // Create logger instance
  const logger = winston.createLogger({
    level: logConfig.level,
    levels: winston.config.npm.levels,
    transports,
    exitOnError: false
  });

  // Handle uncaught exceptions and rejections
  logger.exceptions.handle(
    new DailyRotateFile({
      filename: path.join(logDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: logConfig.maxSize,
      maxFiles: logConfig.maxFiles,
      format: fileFormat
    })
  );

  logger.rejections.handle(
    new DailyRotateFile({
      filename: path.join(logDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: logConfig.maxSize,
      maxFiles: logConfig.maxFiles,
      format: fileFormat
    })
  );

  return logger;
};

// Create and export logger instance
export const logger = createLogger();

/**
 * Create a child logger with additional context
 * @param metadata - Additional metadata to include in all logs
 * @returns Child logger instance
 */
export const createChildLogger = (metadata: Record<string, any>) => {
  return logger.child(metadata);
};

/**
 * Stream object for Morgan HTTP logger integration
 */
export const logStream = {
  write: (message: string) => {
    logger.http(message.trim());
  }
};

export default logger;

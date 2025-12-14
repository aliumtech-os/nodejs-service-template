import morgan from 'morgan';
import { Request, Response } from 'express';
import { logger, logStream } from '@utils/logger';

/**
 * Custom Morgan token to get the real IP address
 */
morgan.token('real-ip', (req: Request) => {
  return req.ip || req.socket.remoteAddress || 'unknown';
});

/**
 * Custom Morgan token to get request ID (if available)
 */
morgan.token('request-id', (req: Request) => {
  return (req as any).id || '-';
});

/**
 * Custom Morgan token to get user ID (if authenticated)
 */
morgan.token('user-id', (req: Request) => {
  return (req as any).user?.id || '-';
});

/**
 * Development format - Colorized and detailed
 */
const devFormat = ':method :url :status :response-time ms - :res[content-length] :real-ip';

/**
 * Production format - Structured and includes more details
 */
const prodFormat = JSON.stringify({
  method: ':method',
  url: ':url',
  status: ':status',
  responseTime: ':response-time ms',
  contentLength: ':res[content-length]',
  ip: ':real-ip',
  userAgent: ':user-agent',
  requestId: ':request-id',
  userId: ':user-id',
  timestamp: ':date[iso]'
});

/**
 * Skip logging for certain routes (health checks, metrics, etc.)
 */
const skipRoutes = ['/health', '/metrics', '/favicon.ico'];

const shouldSkipLog = (req: Request, res: Response): boolean => {
  // Skip if route is in skipRoutes list
  if (skipRoutes.some(route => req.url.startsWith(route))) {
    return true;
  }
  
  // Skip successful health check responses
  if (req.url.includes('health') && res.statusCode === 200) {
    return true;
  }
  
  return false;
};

/**
 * Create HTTP request logger middleware
 * Uses Morgan to log HTTP requests and integrates with Winston
 */
export const httpLogger = morgan(
  process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  {
    stream: logStream,
    skip: shouldSkipLog
  }
);

/**
 * Create a detailed HTTP logger for debugging (optional)
 * Logs additional request/response details
 */
export const detailedHttpLogger = (req: Request, res: Response, next: Function) => {
  const startTime = Date.now();
  
  // Log request details
  logger.debug('Incoming request', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    ip: req.ip
  });
  
  // Capture original end function
  const originalEnd = res.end;
  
  // Override end function to log response
  res.end = function(chunk?: any, encoding?: any, callback?: any): any {
    const duration = Date.now() - startTime;
    
    logger.debug('Outgoing response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      headers: res.getHeaders()
    });
    
    // Call original end function
    return originalEnd.call(this, chunk, encoding, callback);
  };
  
  next();
};

/**
 * Error logging middleware
 * Logs errors that occur during request processing
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: Function) => {
  logger.error('Request error', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      body: req.body,
      ip: req.ip
    }
  });
  
  next(err);
};

export default httpLogger;

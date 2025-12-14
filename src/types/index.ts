import { Request } from 'express';

// Extend Express Request type
export interface CustomRequest extends Request {
  requestId?: string;
  startTime?: number;
}

// Database types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis?: number;
  ssl?: {
    rejectUnauthorized: boolean;
  };
}

// Cache types
export interface CacheConfig {
  ttl: number;
  checkPeriod: number;
}

// Server types
export interface ServerConfig {
  port: number;
  host: string;
  env: string;
}

// Application config type
export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  cache: CacheConfig;
  logging: {
    level: string;
    format: string;
    directory: string;
    maxSize?: string;
    maxFiles?: string;
  };
  security: {
    rateLimit: {
      windowMs: number;
      max: number;
    };
    cors: {
      origin: string;
      credentials: boolean;
    };
  };
}

// Health check response
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: string;
}

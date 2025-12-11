// config/development.js

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    host: 'localhost',
    env: 'development'
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'myapp_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: parseInt(process.env.DB_MAX_POOL || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: 2000
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300', 10),
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '320', 10)
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: 'pretty',
    directory: process.env.LOG_DIR || 'logs',
    maxSize: '20m',
    maxFiles: '14d'
  },
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    },
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    }
  }
};

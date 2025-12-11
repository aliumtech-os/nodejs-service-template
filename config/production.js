module.exports = {
  server: {
    port: parseInt(process.env.PORT || '8080', 10),
    host: process.env.HOST || '0.0.0.0',
    env: 'production'
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'myapp_prod',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: parseInt(process.env.DB_MAX_POOL || '50', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: 2000,
    ssl: {
      rejectUnauthorized: false
    }
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '600', 10),
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '620', 10)
  },
  logging: {
    level: process.env.LOG_LEVEL || 'error',
    format: 'json',
    directory: process.env.LOG_DIR || 'logs',
    maxSize: '50m',
    maxFiles: '30d'
  },
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 50
    },
    cors: {
      origin: process.env.CORS_ORIGIN || 'https://yourdomain.com',
      credentials: true
    }
  }
};

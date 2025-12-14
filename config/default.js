module.exports = {
  server: {
    port: 3000,
    host: 'localhost',
    env: 'development'
  },
  database: {
    host: 'localhost',
    port: 5432,
    database: 'myapp_dev',
    user: 'postgres',
    password: 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  cache: {
    ttl: 300,
    checkPeriod: 320
  },
  logging: {
    level: 'info',
    format: 'json',
    directory: 'logs',
    maxSize: '20m',
    maxFiles: '14d'
  },
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100
    },
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  }
};

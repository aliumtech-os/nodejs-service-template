module.exports = {
  server: {
    port: 3001,
    host: 'localhost',
    env: 'test'
  },
  database: {
    host: 'localhost',
    port: 5432,
    database: 'myapp_test',
    user: 'postgres',
    password: 'postgres',
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  },
  cache: {
    ttl: 60,
    checkPeriod: 70
  },
  logging: {
    level: 'silent',
    format: 'json',
    directory: 'logs',
    maxSize: '10m',
    maxFiles: '7d'
  },
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 1000
    },
    cors: {
      origin: '*',
      credentials: true
    }
  }
};

# Logging System Documentation

## Overview

This service uses **Winston** for application logging and **Morgan** for HTTP request logging. The logging system is fully configured with:

- ✅ Multiple log levels (error, warn, info, http, debug)
- ✅ Environment-specific configurations
- ✅ Automatic log rotation by date and size
- ✅ Structured JSON logging for production
- ✅ Pretty, colorized output for development
- ✅ Separate error logs
- ✅ HTTP request logging
- ✅ Uncaught exception/rejection handling

---

## Log Levels

The logger uses standard npm log levels:

- **error** (0) - Error messages
- **warn** (1) - Warning messages
- **info** (2) - Informational messages
- **http** (3) - HTTP request logs
- **debug** (4) - Debug messages

---

## Configuration

### Environment-Specific Settings

#### Development
```javascript
logging: {
  level: 'debug',              // Shows all log levels
  format: 'pretty',            // Colorized console output
  directory: 'logs',           // Log file directory
  maxSize: '20m',             // 20MB per file
  maxFiles: '14d',            // Keep for 14 days
  enableConsole: true          // Console logging enabled
}
```

#### Staging
```javascript
logging: {
  level: 'info',              // Info and above
  format: 'json',             // Structured JSON format
  directory: 'logs',
  maxSize: '30m',             // 30MB per file
  maxFiles: '21d',            // Keep for 21 days
  enableConsole: false        // Can be enabled via env var
}
```

#### Production
```javascript
logging: {
  level: 'info',              // Info and above
  format: 'json',             // Structured JSON format
  directory: 'logs',
  maxSize: '50m',             // 50MB per file
  maxFiles: '30d',            // Keep for 30 days
  enableConsole: false        // Can be enabled via env var
}
```

### Environment Variables

You can override logging settings using environment variables:

```bash
LOG_LEVEL=debug              # Set log level
LOG_DIR=/var/log/myapp       # Change log directory
ENABLE_CONSOLE_LOGS=true     # Enable console in production
```

---

## Log Files

Logs are stored in the `logs/` directory with automatic rotation:

```
logs/
├── application-2025-12-13.log    # All logs (info+)
├── error-2025-12-13.log          # Error logs only
├── exceptions-2025-12-13.log     # Uncaught exceptions
└── rejections-2025-12-13.log     # Unhandled rejections
```

Files are automatically:
- Rotated daily (new file each day)
- Rotated by size (when reaching maxSize)
- Cleaned up after retention period (maxFiles)

---

## Basic Usage

### Import the Logger

```typescript
import { logger } from '@utils/logger';
// or
import { logger } from '@utils';
```

### Simple Logging

```typescript
// Info messages
logger.info('User logged in successfully');

// Debug messages (only in development)
logger.debug('Processing request data');

// Warning messages
logger.warn('API rate limit approaching');

// Error messages
logger.error('Failed to connect to database');
```

### Logging with Metadata

Add structured data to your logs:

```typescript
logger.info('User login', {
  userId: 12345,
  username: 'john.doe',
  ipAddress: '192.168.1.1'
});

logger.error('Database query failed', {
  query: 'SELECT * FROM users',
  error: err.message,
  duration: 1500
});
```

**Output in development:**
```
2025-12-13 12:47:10 [info]: User login
{
  "userId": 12345,
  "username": "john.doe",
  "ipAddress": "192.168.1.1"
}
```

**Output in production (JSON):**
```json
{
  "level": "info",
  "message": "User login",
  "userId": 12345,
  "username": "john.doe",
  "ipAddress": "192.168.1.1",
  "timestamp": "2025-12-13 12:47:10"
}
```

### Logging Errors with Stack Traces

```typescript
try {
  // Some operation
} catch (error) {
  logger.error('Operation failed', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    }
  });
}
```

---

## Child Loggers

Create child loggers with persistent context:

```typescript
import { createChildLogger } from '@utils/logger';

// Create a child logger with context
const requestLogger = createChildLogger({
  requestId: 'abc-123',
  userId: 456
});

// All logs from this logger include the context
requestLogger.info('Processing payment');
requestLogger.error('Payment failed');
```

**Output:**
```json
{
  "level": "info",
  "message": "Processing payment",
  "requestId": "abc-123",
  "userId": 456,
  "timestamp": "2025-12-13 12:47:10"
}
```

---

## HTTP Request Logging

### Basic HTTP Logger

The HTTP logger middleware automatically logs all HTTP requests:

```typescript
import express from 'express';
import { httpLogger } from '@middlewares/httpLogger';

const app = express();

// Add HTTP logger middleware
app.use(httpLogger);
```

**Development output:**
```
GET /api/users 200 45ms - 1234 192.168.1.1
```

**Production output (JSON):**
```json
{
  "method": "GET",
  "url": "/api/users",
  "status": "200",
  "responseTime": "45 ms",
  "contentLength": "1234",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "requestId": "-",
  "userId": "-",
  "timestamp": "2025-12-13T12:47:10.000Z"
}
```

### Detailed HTTP Logger

For debugging, use the detailed HTTP logger:

```typescript
import { detailedHttpLogger } from '@middlewares/httpLogger';

// Enable in development only
if (process.env.NODE_ENV === 'development') {
  app.use(detailedHttpLogger);
}
```

This logs full request/response details including headers, body, etc.

### Error Logger Middleware

Log errors that occur during request processing:

```typescript
import { errorLogger } from '@middlewares/httpLogger';

// Add before your error handler
app.use(errorLogger);

// Then your error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal Server Error' });
});
```

### Skip Routes

Some routes are automatically skipped to reduce noise:
- `/health`
- `/metrics`
- `/favicon.ico`

Modify the `skipRoutes` array in `src/middlewares/httpLogger.ts` to customize.

---

## Advanced Usage

### Custom Log Formats

The logger uses different formats based on environment:

**Development (Pretty Format):**
- Colorized output
- Human-readable
- Great for debugging

**Production (JSON Format):**
- Structured data
- Machine-parseable
- Works with log aggregation tools (ELK, Splunk, CloudWatch)

### Integration with Express

Full example with all middleware:

```typescript
import express from 'express';
import { logger } from '@utils/logger';
import { httpLogger, errorLogger } from '@middlewares';

const app = express();

// HTTP request logging
app.use(httpLogger);

// Your routes here
app.get('/api/users', (req, res) => {
  logger.info('Fetching users');
  res.json({ users: [] });
});

// Error logging middleware
app.use(errorLogger);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
```

---

## Best Practices

### 1. Use Appropriate Log Levels

```typescript
// ❌ Don't use debug in production for common operations
logger.debug('User fetched'); // Too verbose

// ✅ Use info for important business events
logger.info('User created', { userId: 123 });

// ✅ Use error for actual errors
logger.error('Payment failed', { error: err.message });
```

### 2. Include Relevant Context

```typescript
// ❌ Not enough context
logger.error('Failed');

// ✅ Provide meaningful context
logger.error('Failed to charge customer', {
  customerId: 123,
  amount: 99.99,
  error: err.message
});
```

### 3. Don't Log Sensitive Data

```typescript
// ❌ Never log passwords, tokens, etc.
logger.info('User login', {
  username: 'john',
  password: 'secret123'  // NEVER!
});

// ✅ Log safe information only
logger.info('User login', {
  userId: 123,
  username: 'john'
});
```

### 4. Use Child Loggers for Context

```typescript
// ✅ Create request-scoped loggers
const requestLogger = createChildLogger({
  requestId: req.id,
  userId: req.user?.id
});

// All logs automatically include context
requestLogger.info('Processing request');
requestLogger.debug('Validating input');
requestLogger.info('Request completed');
```

### 5. Structure Your Metadata

```typescript
// ✅ Use consistent, well-structured metadata
logger.error('Database error', {
  error: {
    message: err.message,
    code: err.code,
    stack: err.stack
  },
  query: {
    sql: queryString,
    params: queryParams
  },
  performance: {
    duration: elapsed
  }
});
```

---

## Troubleshooting

### Logs Not Appearing

1. **Check log level:** Ensure your log level allows the message
   ```bash
   LOG_LEVEL=debug npm run dev
   ```

2. **Check console output:** In production, console might be disabled
   ```bash
   ENABLE_CONSOLE_LOGS=true npm start
   ```

3. **Check file permissions:** Ensure write access to logs directory
   ```bash
   chmod 755 logs/
   ```

### Log Files Not Rotating

1. Check `maxSize` and `maxFiles` in config
2. Verify Winston daily-rotate-file is installed
3. Check disk space

### Missing HTTP Logs

1. Ensure `httpLogger` middleware is added before routes
2. Check if route is in the skip list
3. Verify Morgan is installed

---

## Log Aggregation

The JSON format in production makes it easy to integrate with log aggregation tools:

### ELK Stack (Elasticsearch, Logstash, Kibana)
```bash
# Logstash can parse the JSON logs directly
input {
  file {
    path => "/path/to/logs/application-*.log"
    codec => "json"
  }
}
```

### AWS CloudWatch
```bash
# Use CloudWatch agent to send logs
# JSON format is automatically parsed
```

### Splunk
```bash
# Splunk can ingest JSON logs
# Set sourcetype to _json for automatic parsing
```

---

## Example Scenarios

### API Request/Response Logging
```typescript
app.post('/api/orders', async (req, res) => {
  const requestLogger = createChildLogger({ 
    requestId: req.id 
  });
  
  requestLogger.info('Creating order', {
    userId: req.user.id,
    items: req.body.items.length
  });
  
  try {
    const order = await createOrder(req.body);
    requestLogger.info('Order created', { orderId: order.id });
    res.json(order);
  } catch (error) {
    requestLogger.error('Order creation failed', {
      error: error.message,
      userId: req.user.id
    });
    res.status(500).json({ error: 'Failed to create order' });
  }
});
```

### Database Query Logging
```typescript
async function queryDatabase(sql: string, params: any[]) {
  const start = Date.now();
  
  logger.debug('Executing query', { sql, params });
  
  try {
    const result = await db.query(sql, params);
    const duration = Date.now() - start;
    
    logger.debug('Query completed', {
      sql,
      duration: `${duration}ms`,
      rowCount: result.rowCount
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    
    logger.error('Query failed', {
      sql,
      params,
      duration: `${duration}ms`,
      error: error.message
    });
    
    throw error;
  }
}
```

### Background Job Logging
```typescript
async function processJob(job: Job) {
  const jobLogger = createChildLogger({
    jobId: job.id,
    jobType: job.type
  });
  
  jobLogger.info('Job started');
  
  try {
    await job.execute();
    jobLogger.info('Job completed successfully');
  } catch (error) {
    jobLogger.error('Job failed', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
```

---

## Summary

- ✅ Use `logger.info()`, `logger.error()`, etc. for application logs
- ✅ Add `httpLogger` middleware for HTTP request logging
- ✅ Use child loggers for request-scoped context
- ✅ Include relevant metadata with all logs
- ✅ Never log sensitive information
- ✅ Use appropriate log levels
- ✅ Logs are automatically rotated and managed
- ✅ JSON format in production enables powerful log analysis

For questions or issues, refer to the Winston documentation: https://github.com/winstonjs/winston

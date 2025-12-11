# 🚀 Complete Node.js Service Template Plan

## **Project Specifications**

- **Node.js Version**: v22 (LTS)
- **Language**: TypeScript with strict mode
- **Package Manager**: npm
- **Database**: PostgreSQL with migrations
- **Configuration**: JavaScript-based config files (for dynamic secret fetching)
- **API Documentation**: Swagger/OpenAPI
- **Caching**: node-cache (in-memory)
- **Authentication**: Excluded (can be added later)

---

## **Core Features & Architecture**

### **1. Project Structure**
```
node-service-template/
├── src/
│   ├── config/
│   │   └── database.ts              # PostgreSQL connection & pool
│   ├── controllers/
│   │   └── healthController.ts      # Health check logic
│   ├── middlewares/
│   │   ├── errorHandler.ts          # Global error handler
│   │   ├── validator.ts             # Request validation
│   │   ├── cache.ts                 # Cache middleware
│   │   └── requestLogger.ts         # Request logging
│   ├── routes/
│   │   ├── index.ts                 # Route aggregator
│   │   └── v1/
│   │       ├── health.routes.ts     # Health routes
│   │       └── index.ts
│   ├── services/
│   │   ├── cacheService.ts          # Cache utilities
│   │   └── databaseService.ts       # DB utilities
│   ├── utils/
│   │   ├── logger.ts                # Winston logger setup
│   │   ├── AppError.ts              # Custom error class
│   │   └── asyncHandler.ts          # Async wrapper
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── swagger/
│   │   └── swagger.ts               # Swagger configuration
│   ├── app.ts                       # Express app setup
│   └── server.ts                    # Server entry point
├── tests/
│   ├── unit/
│   │   └── services/
│   ├── integration/
│   │   └── routes/
│   │       └── health.test.ts
│   └── setup.ts                     # Test configuration
├── migrations/                      # Database migrations
├── config/                          # Environment-based configs
│   ├── default.js
│   ├── development.js
│   ├── staging.js
│   ├── production.js
│   └── custom-environment-variables.js
├── logs/                            # Application logs
├── dist/                            # Compiled JavaScript
├── .husky/                          # Git hooks
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── .env.example
├── tsconfig.json
├── jest.config.js
├── nodemon.json
├── package.json
└── README.md
```

---

## **2. Technology Stack**

### **Core Dependencies**
- `express` - Web framework
- `typescript` - Type safety
- `config` - Environment-based configuration
- `dotenv` - Environment variables
- `pg` - PostgreSQL client
- `joi` - Request/data validation
- `node-cache` - In-memory caching
- `compression` - Response compression

### **Security Packages**
- `helmet` - Secure HTTP headers
- `cors` - CORS configuration
- `express-rate-limit` - Rate limiting
- `express-mongo-sanitize` - Input sanitization
- `hpp` - HTTP Parameter Pollution protection
- `xss-clean` - XSS protection

### **Logging**
- `winston` - Structured logging (file + console)
- `morgan` - HTTP request logging

### **API Documentation**
- `swagger-jsdoc` - Generate Swagger from JSDoc
- `swagger-ui-express` - Interactive API docs

### **Database**
- `node-pg-migrate` - PostgreSQL migrations (up/down)

### **Testing**
- `jest` - Testing framework
- `supertest` - HTTP integration testing
- `ts-jest` - TypeScript support for Jest

### **Code Quality**
- `eslint` - JavaScript/TypeScript linting
- `@typescript-eslint/parser` & `@typescript-eslint/eslint-plugin`
- `prettier` - Code formatting
- `eslint-config-prettier` - ESLint + Prettier integration
- `husky` - Git hooks
- `lint-staged` - Run linters on staged files
- `@commitlint/cli` & `@commitlint/config-conventional` - Commit message linting

### **Development Tools**
- `ts-node` - Run TypeScript directly
- `ts-node-dev` or `nodemon` - Hot reload for development

---

## **3. Configuration Management (JavaScript-based)**

### **Why JavaScript Config Files?**
- Dynamic secret fetching from GCP Secret Manager
- Conditional logic based on environment
- Code reusability and imports
- Better documentation with comments
- Type safety with TypeScript interfaces

### **Config Structure**
```javascript
// config/default.js
module.exports = {
  server: {
    port: 3000,
    host: 'localhost',
    env: process.env.NODE_ENV || 'development'
  },
  database: {
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    max: 20, // connection pool size
    idleTimeoutMillis: 30000
  },
  cache: {
    ttl: 300,           // 5 minutes
    checkPeriod: 320
  },
  logging: {
    level: 'info',
    format: 'json',
    directory: 'logs'
  },
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  }
};

// config/production.js
module.exports = {
  server: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0'
  },
  database: {
    // Can fetch from GCP Secret Manager
    password: process.env.DB_PASSWORD,
    ssl: true
  },
  logging: {
    level: 'error'
  }
};
```

### **GCP Secret Manager Integration Example**
```javascript
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

async function getSecret(secretName) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: `projects/YOUR_PROJECT/secrets/${secretName}/versions/latest`,
  });
  return version.payload.data.toString();
}
```

---

## **4. Database Setup (PostgreSQL)**

### **Migration Management**
Using `node-pg-migrate` for database migrations:

**Commands:**
- `npm run migrate:up` - Run pending migrations
- `npm run migrate:down` - Rollback last migration
- `npm run migrate:create <name>` - Create new migration file

**Migration File Example:**
```javascript
// migrations/1234567890_create_users_table.js
exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'varchar(255)', notNull: true, unique: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
```

### **Connection Pooling**
- Configured in `src/config/database.ts`
- Pool size configuration per environment
- Automatic reconnection handling
- Graceful shutdown on app termination

---

## **5. API Routes**

### **Basic Endpoints**
- **GET /ping** - Simple pong response (200 OK)
- **GET /version** - Application version from package.json
- **GET /health** - Detailed health check:
  - Database connectivity
  - Memory usage
  - Uptime
  - Environment
- **GET /api-docs** - Swagger UI documentation
- **GET /api/v1/** - Versioned API structure

### **API Versioning**
- Version prefix: `/api/v1/`
- Allows for future versions without breaking changes

---

## **6. Error Handling**

### **Global Error Handler**
- Custom `AppError` class for consistent errors
- Environment-based error responses:
  - **Development**: Detailed stack traces
  - **Production**: Generic error messages
- Async error wrapper to avoid try-catch everywhere
- Proper HTTP status codes

### **Error Types**
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

---

## **7. Logging**

### **Winston Logger**
- Multiple transports:
  - Console (development)
  - File (error.log, combined.log)
- Log rotation
- Structured JSON logging
- Different log levels per environment
- Correlation IDs for request tracking

### **Morgan HTTP Logging**
- Request/response logging
- Custom format per environment
- Integration with Winston

---

## **8. Caching (node-cache)**

### **Cache Service**
- Simple in-memory caching
- Configurable TTL
- Cache middleware for routes
- Utility methods: get, set, delete, flush

### **Use Cases**
- API response caching
- Database query caching
- Session storage (temporary)

---

## **9. Testing Strategy**

### **Unit Tests**
- Services, utilities, helpers
- Mocked dependencies
- Fast execution

### **Integration Tests**
- API endpoint testing with Supertest
- Database integration tests
- Real HTTP requests

### **Coverage**
- Minimum 80% code coverage
- Coverage reports in HTML and text
- Pre-commit hooks to ensure tests pass

### **Test Commands**
- `npm test` - Run all tests
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - Generate coverage report

---

## **10. Code Quality & Linting**

### **ESLint Configuration**
- TypeScript support
- Airbnb or Standard style guide
- Custom rules for project conventions
- Integration with Prettier

### **Prettier**
- Consistent code formatting
- Auto-format on save (IDE integration)
- Pre-commit formatting

### **Git Hooks (Husky)**
- **pre-commit**: Run lint-staged
  - Lint and format staged files
  - Run relevant tests
- **commit-msg**: Validate commit messages
  - Conventional commits format
  - Enforce standards

---

## **11. Security Best Practices**

### **HTTP Security Headers (Helmet)**
- Content Security Policy
- XSS Protection
- No Sniff
- Frame Guard

### **Rate Limiting**
- Configurable per environment
- Prevent brute force attacks
- API abuse prevention

### **Input Validation & Sanitization**
- Joi schema validation
- SQL injection prevention
- XSS attack prevention
- Parameter pollution protection

### **CORS Configuration**
- Environment-based allowed origins
- Credential support configuration
- Method and header restrictions

---

## **12. Docker Support**

### **Dockerfile (Multi-stage)**
```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
# ... build steps

# Stage 2: Production
FROM node:22-alpine
# ... production setup
```

### **docker-compose.yml**
- Node.js app service
- PostgreSQL service
- Environment variables
- Volume mounts for development
- Network configuration

---

## **13. npm Scripts**

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "migrate:up": "node-pg-migrate up",
    "migrate:down": "node-pg-migrate down",
    "migrate:create": "node-pg-migrate create",
    "prepare": "husky install"
  }
}
```

---

## **14. Environment Variables**

### **.env.example**
```
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=password

# Logging
LOG_LEVEL=info

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://localhost:3000
```

---

## **15. Documentation**

### **README.md**
- Project overview
- Features list
- Setup instructions
- Configuration guide
- API documentation
- Testing guide
- Deployment instructions

### **Swagger Documentation**
- Interactive API docs at `/api-docs`
- Request/response schemas
- Authentication details
- Example requests

---

## **Implementation Checklist**

- [ ] Initialize Node.js project with TypeScript and Node v22
- [ ] Configure TypeScript with strict settings and path aliases
- [ ] Set up project directory structure
- [ ] Install and configure core dependencies
- [ ] Install and configure security packages
- [ ] Set up Winston logger with multiple transports
- [ ] Configure Jest and Supertest for testing
- [ ] Set up ESLint and Prettier with TypeScript support
- [ ] Configure Husky, lint-staged, and commitlint
- [ ] Set up PostgreSQL connection with connection pooling
- [ ] Configure node-pg-migrate for database migrations
- [ ] Create JavaScript config files (default, dev, staging, prod)
- [ ] Set up node-cache service and middleware
- [ ] Configure Swagger with swagger-jsdoc and swagger-ui-express
- [ ] Create basic routes (ping, version, health with DB check)
- [ ] Implement global error handling middleware
- [ ] Add request validation middleware with Joi
- [ ] Add compression and security middleware
- [ ] Set up graceful shutdown handling for server and DB
- [ ] Create Docker and docker-compose configuration
- [ ] Write example unit and integration tests
- [ ] Add comprehensive npm scripts
- [ ] Create .gitignore, .env.example, and .dockerignore files
- [ ] Write comprehensive README with setup instructions

---

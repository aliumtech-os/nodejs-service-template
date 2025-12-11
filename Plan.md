## 📋 Overview

The document describes a full-featured Node.js service template with:
- **Node.js v22** with **TypeScript** (strict mode)
- **PostgreSQL** database with migrations
- **Express.js** framework
- **Swagger/OpenAPI** documentation
- **In-memory caching** (node-cache)
- Comprehensive **security**, **logging**, **testing**, and **code quality** tools

## 🎯 Step-by-Step Execution Plan

I've created a detailed execution plan organized into **logical phases** to build this template systematically:

### **Phase 1: Project Foundation** (Steps 1-5)
1. **Initialize Project**
   - Create package.json with Node v22
   - Set up npm as package manager
   - Initialize git repository

2. **Configure TypeScript**
   - Install TypeScript and @types packages
   - Create tsconfig.json with strict mode
   - Configure path aliases and output directory

3. **Create Project Structure**
   - Set up all directories (src/, tests/, config/, migrations/, logs/)
   - Create subdirectories (controllers/, services/, middlewares/, etc.)

4. **Install Core Dependencies**
   - Express, dotenv, pg, config
   - Joi for validation
   - node-cache for caching
   - compression

5. **Install Security Packages**
   - helmet, cors, express-rate-limit
   - express-mongo-sanitize, hpp, xss-clean

### **Phase 2: Configuration & Infrastructure** (Steps 6-9)
6. **Set Up Logging System**
   - Install Winston and Morgan
   - Configure logger with file and console transports
   - Set up log rotation and structured logging

7. **Configure Database**
   - Create database connection pool config
   - Set up graceful connection handling
   - Install and configure node-pg-migrate
   - Create example migration files

8. **Create Configuration Files**
   - Set up JavaScript-based config files (default.js, development.js, staging.js, production.js)
   - Configure custom-environment-variables.js
   - Create .env.example with all required variables
   - Document GCP Secret Manager integration pattern

9. **Set Up Caching Service**
   - Create cacheService.ts with get/set/delete/flush methods
   - Implement cache middleware
   - Configure TTL and check periods

### **Phase 3: Core Application** (Steps 10-14)
10. **Build Express Application**
    - Create app.ts with Express setup
    - Add middleware chain (helmet, cors, compression, etc.)
    - Set up request logging
    - Configure error handling

11. **Create Utilities**
    - Custom AppError class
    - Async handler wrapper
    - Logger utilities

12. **Implement Middlewares**
    - Global error handler
    - Request validator (Joi)
    - Cache middleware
    - Request logger

13. **Create API Routes**
    - Route aggregator (src/routes/index.ts)
    - Versioned routes structure (v1/)
    - Health check routes (ping, version, health with DB check)
    - Health controller with DB connectivity check

14. **Set Up Server**
    - Create server.ts entry point
    - Implement graceful shutdown
    - Add process signal handlers

### **Phase 4: Documentation & API** (Steps 15-16)
15. **Configure Swagger/OpenAPI**
    - Install swagger-jsdoc and swagger-ui-express
    - Create swagger.ts configuration
    - Add JSDoc comments to routes
    - Set up /api-docs endpoint

16. **Create TypeScript Types**
    - Define common type definitions
    - Create interfaces for configs, requests, responses

### **Phase 5: Testing Infrastructure** (Steps 17-18)
17. **Set Up Testing Framework**
    - Install Jest, Supertest, ts-jest
    - Create jest.config.js
    - Set up test directory structure
    - Create test setup file

18. **Write Example Tests**
    - Unit tests for services
    - Integration tests for health routes
    - Configure coverage thresholds

### **Phase 6: Code Quality** (Steps 19-20)
19. **Configure Linting & Formatting**
    - Install ESLint with TypeScript plugins
    - Create .eslintrc.js
    - Install and configure Prettier
    - Set up .prettierrc
    - Configure eslint-config-prettier

20. **Set Up Git Hooks**
    - Install Husky
    - Configure lint-staged
    - Add pre-commit hook (lint + format)
    - Install commitlint with conventional config
    - Add commit-msg hook

### **Phase 7: Containerization** (Steps 21-22)
21. **Create Docker Configuration**
    - Write multi-stage Dockerfile
    - Optimize for production builds
    - Create .dockerignore

22. **Create Docker Compose**
    - Configure app service
    - Add PostgreSQL service
    - Set up volumes and networks
    - Define environment variables

### **Phase 8: Scripts & Documentation** (Steps 23-25)
23. **Add npm Scripts**
    - Development scripts (dev with hot reload)
    - Build and start scripts
    - Test scripts (test, watch, coverage)
    - Lint and format scripts
    - Migration scripts (up, down, create)

24. **Create Configuration Files**
    - .gitignore (node_modules, dist, logs, .env)
    - .env.example with all variables
    - .dockerignore
    - nodemon.json for development

25. **Write Documentation**
    - Comprehensive README.md with:
      - Project overview and features
      - Setup instructions
      - Configuration guide
      - API documentation
      - Testing guide
      - Deployment instructions
    - Code comments and JSDoc

---

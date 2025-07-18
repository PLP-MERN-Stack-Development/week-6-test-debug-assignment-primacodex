# Test Dashboard Application

## Overview

This is a full-stack web application built as a test dashboard/monitoring system. It provides real-time monitoring of test suites, debug logs, performance metrics, and code coverage. The application uses a modern tech stack with React frontend, Express.js backend, and PostgreSQL database with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API endpoints
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **Development**: Hot reload with Vite integration

### Project Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── migrations/      # Database migrations
└── dist/           # Build output
```

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: Basic user authentication system
- **Test Suites**: Test suite management with status tracking
- **Test Results**: Individual test results linked to suites
- **Debug Logs**: Application logging with levels and metadata
- **Performance Metrics**: System performance monitoring

### Frontend Components
- **Dashboard**: Main application interface with tabs
- **TestSuiteCard**: Individual test suite display and controls
- **TestResults**: Test execution results viewer
- **DebugConsole**: Real-time debug log viewer
- **PerformanceMonitor**: System performance metrics display
- **CodeCoverage**: Code coverage analysis and reporting

### Backend Services
- **Storage Layer**: Abstracted data access with memory and database implementations
- **API Routes**: RESTful endpoints for all CRUD operations
- **Test Runner**: Test execution coordination system

## Data Flow

1. **Client Requests**: React components use TanStack Query for API calls
2. **API Layer**: Express routes validate requests and call storage layer
3. **Storage Layer**: Abstracted interface supporting both memory and database storage
4. **Database**: PostgreSQL with Drizzle ORM for type-safe queries
5. **Real-time Updates**: Polling-based updates every 2-5 seconds for live data

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI components
- **express**: Web framework
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with hot reload
- **Database**: Neon Database connection via environment variables

### Production Build
- **Frontend**: Vite build to static assets
- **Backend**: ESBuild bundle for Node.js deployment
- **Database**: Drizzle migrations for schema management

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)
- Build outputs to `dist/` directory for deployment

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types between frontend and backend
2. **Type Safety**: Full TypeScript coverage with Drizzle for database type safety
3. **Component Architecture**: shadcn/ui for consistent, accessible components
4. **Real-time Updates**: Polling approach for simplicity over WebSockets
5. **Storage Abstraction**: Interface-based storage layer for testing and flexibility
6. **Database Choice**: PostgreSQL with Drizzle ORM for type safety and performance
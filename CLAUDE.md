# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

10x Cards is a flashcard generation web application built with Astro, React, and Supabase. The app allows users to generate flashcards from text using AI models via OpenRouter API.

## Development Commands

### Core Development
```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Testing
```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with UI
npm run test:ui

# Run unit tests with coverage
npm run test:coverage

# Run API tests
npm run test:api

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

### Database & Scripts
```bash
# Clean database (test data)
npm run cleandb

# Test OpenRouter integration
npm run test:openrouter
```

## Architecture Overview

### Technology Stack
- **Frontend**: Astro (SSR) with React components
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase with Row Level Security (RLS)
- **AI Integration**: OpenRouter API with custom service layer
- **Authentication**: Supabase Auth with server-side cookies
- **Testing**: Vitest (unit), Playwright (E2E), Mocha (API)

### Core Data Model
- **generations**: AI flashcard generation sessions
- **flashcards**: Individual flashcard storage with source tracking (`ai-full`, `ai-edited`, `manual`)
- **generation_error_logs**: Error logging for generation process

### File Structure
```
src/
├── components/           # React components
│   ├── auth/            # Authentication forms
│   ├── flashcard-edit/  # Flashcard editing interface
│   ├── flashcard-generation/ # AI generation interface
│   ├── hooks/           # Custom React hooks
│   └── ui/              # shadcn/ui components
├── lib/                 # Utility libraries
│   ├── api/            # API utilities
│   ├── openrouter/     # OpenRouter service layer
│   └── supabase.ts     # Supabase client configuration
├── pages/              # Astro pages and API routes
│   ├── api/            # API endpoints
│   ├── auth/           # Authentication pages
│   └── *.astro         # Main application pages
├── types.ts            # TypeScript type definitions
└── middleware/         # Astro middleware
```

### Key Architectural Patterns

#### OpenRouter Service Layer
The OpenRouter integration includes sophisticated patterns:
- **Caching**: Response caching with cache invalidation
- **Rate Limiting**: Token bucket algorithm for API rate limiting
- **Circuit Breaker**: Automatic failure detection and recovery
- **Error Handling**: Custom error codes with contextual information

#### Type Safety
- Comprehensive DTOs and Command models in `src/types.ts`
- Separation between data transfer objects and command models
- Database types generated from Supabase schema

#### Authentication
- Server-side cookie handling with Supabase Auth
- Middleware-based authentication in `src/middleware/index.ts`
- Separate client configurations for server/client contexts

#### Component Architecture
- Hook-based state management pattern
- Separation of concerns with dedicated hooks in component directories
- shadcn/ui component library integration

## Development Guidelines

### Code Quality
- ESLint configuration with TypeScript, React, and Astro plugins
- Prettier formatting with pre-commit hooks via lint-staged
- Unused variables prefixed with `_` are ignored by linting

### Testing Strategy
- **Unit Tests**: Test components, hooks, and utilities with Vitest
- **E2E Tests**: Use Playwright with Page Object Model pattern
- **API Tests**: Test backend endpoints with Mocha/Chai
- Follow AAA pattern (Arrange, Act, Assert) for unit tests

### Database Constraints
- Source text for flashcard generation: 1000-10000 characters
- Flashcard sources must be one of: `ai-full`, `ai-edited`, `manual`
- All tables use Row Level Security with user isolation

### Environment Setup
Required environment variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Path Aliases
- `@/*` maps to `src/*`
- Use absolute imports for better maintainability

## Common Workflows

### Adding New Components
1. Create component in appropriate `src/components/` subdirectory
2. Follow existing patterns for TypeScript and styling
3. Add corresponding tests in `tests/unit/components/`
4. Use shadcn/ui components where applicable

### API Route Development
1. Create route in `src/pages/api/`
2. Use proper TypeScript types from `src/types.ts`
3. Implement proper error handling
4. Add corresponding tests in `tests/api/`

### Database Schema Changes
1. Create migration in `supabase/migrations/`
2. Update database types in `src/db/database.types.ts`
3. Update TypeScript types in `src/types.ts`
4. Test with both unit and E2E tests

### OpenRouter Integration
- Use the `OpenRouterService` class for all AI model interactions
- Leverage built-in caching and rate limiting
- Handle errors using the custom error types
- Default model is `qwen/qwen-2.5-7b-instruct`
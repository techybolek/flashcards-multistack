# 10x Cards - Refactored Architecture

This is the refactored version of 10x Cards, separated into independent frontend and backend modules for better scalability and development workflow.

## Architecture Overview

- **Backend**: Express.js API server with TypeScript
- **Frontend**: React SPA with Vite and TypeScript  
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenRouter API for flashcard generation

## Project Structure

```
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── routes/   # API route handlers
│   │   ├── services/ # Business logic services
│   │   ├── middleware/ # Express middleware
│   │   ├── types/    # TypeScript type definitions
│   │   └── lib/      # Utilities (Supabase, OpenRouter)
│   └── package.json
├── frontend/         # React SPA
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/    # Page components
│   │   ├── hooks/    # Custom React hooks
│   │   ├── lib/      # API client and utilities
│   │   └── types/    # TypeScript type definitions
│   └── package.json
└── package-refactored.json # Root package for concurrent development
```

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- OpenRouter API key

### Environment Variables

#### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENROUTER_API_KEY=your_openrouter_api_key
JWT_SECRET=your_jwt_secret_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ENABLE_TEST_CLEANUP=false
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

### Installation & Setup

1. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**:
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your values
   
   # Frontend  
   cd ../frontend
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start development servers**:
   ```bash
   # From root directory - runs both backend and frontend concurrently
   npm run dev
   
   # Or run individually:
   npm run dev:backend  # Backend only (port 3001)
   npm run dev:frontend # Frontend only (port 5173)
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `POST /api/auth/recover` - Password recovery

### Flashcards
- `GET /api/flashcards` - List user's flashcards
- `GET /api/flashcards/:id` - Get specific flashcard
- `POST /api/flashcards` - Create new flashcard
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Delete flashcard
- `PATCH /api/flashcards/:id` - Patch flashcard content
- `POST /api/flashcards/bulk` - Create multiple flashcards

### Generations
- `GET /api/generations` - List user's generations
- `GET /api/generations/:id` - Get specific generation
- `POST /api/generations` - Generate new flashcards from text
- `GET /api/generations/:id/flashcards` - Get flashcards for generation

### Testing
- `POST /api/tests/cleanup` - Clean test data (when enabled)

## Key Changes from Original

### Authentication
- **Before**: Cookie-based sessions with Supabase SSR
- **After**: JWT token-based authentication with localStorage

### API Communication  
- **Before**: Astro API routes with server-side rendering
- **After**: RESTful Express.js API with JSON responses

### Frontend Architecture
- **Before**: Astro pages with embedded React components
- **After**: Full React SPA with React Router

### Development Workflow
- **Before**: Single Astro application with SSR
- **After**: Separate frontend/backend with hot reload for both

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications for production
- `npm run test` - Run tests for both applications
- `npm run lint` - Lint both applications

### Backend Scripts
- `npm run dev` - Start Express server with hot reload (tsx)
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run test` - Run backend tests
- `npm run lint` - Lint backend code

### Frontend Scripts  
- `npm run dev` - Start Vite dev server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run test` - Run frontend tests
- `npm run lint` - Lint frontend code

## Production Deployment

### Backend Deployment
- Build: `npm run build`
- Deploy `dist/` folder to any Node.js hosting service
- Set environment variables in hosting platform

### Frontend Deployment  
- Build: `npm run build`
- Deploy `dist/` folder to any static hosting service (Vercel, Netlify, etc.)
- Set `VITE_API_URL` to your backend URL

## Testing

The refactored architecture maintains the same test coverage as the original:

- **Backend**: API endpoint testing with Vitest and Supertest
- **Frontend**: Component testing with Vitest and React Testing Library
- **E2E**: Update Playwright tests to work with new API endpoints

## Migration Notes

This refactor maintains 100% functional compatibility with the original application. All features work identically:

- User registration, login, and authentication
- Flashcard generation with AI (OpenRouter)
- Flashcard management (CRUD operations)
- Generation history and management
- Test data cleanup functionality

The user experience remains exactly the same while providing better separation of concerns, independent scaling, and improved development workflow.
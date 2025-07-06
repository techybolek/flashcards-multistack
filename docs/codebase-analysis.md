# Flashcard Management Application - Codebase Analysis

## Architecture Overview
- Frontend: React-based UI with TypeScript
- Backend: Node.js with Express
- Database: Supabase
- AI Integration: OpenRouter API for flashcard generation

## Frontend Routes

### Public Routes
```typescript
- "/" - HomePage (Landing page with login/register or dashboard links)
- "/auth/login" - LoginPage (Email/password login form)
- "/auth/register" - RegisterPage (New user registration)
- "/auth/recover" - RecoverPage (Password recovery flow)
```

### Protected Routes (require authentication)
```typescript
- "/dashboard" - DashboardPage (Main user dashboard with generations list)
- "/generate" - GeneratePage (AI flashcard generation interface)
- "/generations/:id" - GenerationDetailPage (View/edit specific flashcard generation)
```

### Special Routes
```typescript
- "*" - Redirects to "/" (Catch-all route for 404s)
```

### Route Implementation Details
1. Route Protection:
   - Uses a `ProtectedRoute` component wrapper
   - Automatically redirects to "/auth/login" if not authenticated
   - Shows loading state during auth check
   - Managed by `useAuth` hook

2. Authentication Flow:
   - Token-based authentication (JWT)
   - Stores auth token in localStorage
   - Auto-redirects to dashboard after login
   - Handles session persistence
   - Email verification support
   - Password recovery flow

3. Navigation Features:
   - Uses React Router v6
   - BrowserRouter as the router implementation
   - Nested routing within Layout component
   - Maintains consistent UI across routes
   - Toast notifications for user feedback

## Data Models

### Core Flashcard Structure
```typescript
type FlashcardDTO = {
  id: number;
  front: string;
  back: string;
  source: 'manual' | 'ai-full' | 'ai-edited';
  created_at: string;
  updated_at: string;
  generation_id?: number | null;
  user_id: string;
  display_order: number;
};
```

### Generation Error Logs
```typescript
type GenerationErrorLog = {
  id: number;
  error_code: string;
  error_message: string;
  model: string;
  source_text_hash: string;
  source_text_length: number;
  created_at: string;
  updated_at: string;
  user_id: string;
};
```

### API Response Structure
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
};
```

### Command Types
```typescript
interface CreateFlashcardCommand {
  front: string;
  back: string;
  source: 'manual' | 'ai-full' | 'ai-edited';
  generation_id: number | null;
  display_order: number;
}

interface UpdateFlashcardCommand {
  front?: string;
  back?: string;
  source?: 'manual' | 'ai-full' | 'ai-edited';
}

interface GenerateFlashcardsCommand {
  text: string; // 1,000-10,000 characters
}
```

## API Structure

### Authentication Endpoints
```
POST /api/auth/login
- Request: { email: string, password: string }
- Response: { user: User, token: string, redirectTo: string }

POST /api/auth/register
- Request: { email: string, password: string, confirmPassword: string }
- Response: { user: User, requiresEmailConfirmation: boolean, message: string }

POST /api/auth/recover
- Request: { email: string }
- Response: { message: string }

POST /api/auth/logout
- Request: {}
- Response: { success: true }
```

### Flashcard Endpoints
```
GET /api/flashcards
- Response: FlashcardDTO[]

GET /api/flashcards/:id
- Response: FlashcardDTO

POST /api/flashcards
- Request: CreateFlashcardCommand
- Response: FlashcardDTO

PUT /api/flashcards/:id
- Request: UpdateFlashcardCommand
- Response: FlashcardDTO

DELETE /api/flashcards/:id
- Response: { success: true }
```

### Generation Endpoints
```
GET /api/generations
- Response: { generations: Generation[], pagination: PaginationDTO }

GET /api/generations/:id
- Response: Generation

GET /api/generations/:id/flashcards
- Response: FlashcardDTO[]

POST /api/generations
- Request: GenerateFlashcardsCommand
- Response: Generation

PUT /api/generations/:id
- Request: { flashcards: { front: string, back: string, source: 'ai-full' | 'ai-edited' }[] }
- Response: FlashcardDTO[]

DELETE /api/generations/:id
- Response: { success: true }
```

## Key Features

### Manual Flashcard Management
- Create individual flashcards
- Edit existing flashcards
- Delete flashcards
- View flashcards in a list format
- Each flashcard has a front (question) and back (answer)
- Bulk creation support
- Display order tracking

### AI-Powered Generation
- Uses OpenRouter API (with GPT-4 mini model)
- Generates 5-10 flashcards from input text
- Text requirements: 1,000-10,000 characters
- AI generates both flashcards and a descriptive title
- Three flashcard sources:
  - 'manual': User-created
  - 'ai-full': AI-generated, unedited
  - 'ai-edited': AI-generated, user-modified
- Rate limiting and caching for API calls
- Error logging and recovery
- Input validation and sanitization

## Security Features
- User authentication required
- Per-user data isolation
- Access control checks on all operations
- Ownership verification before modifications
- Input validation using Zod schemas
- Helmet middleware for security headers
- CORS protection
- Response compression middleware
- Rate limiting for OpenRouter API calls
- Password complexity requirements
- Email verification support

## Frontend Components
- GenerationDetailPage: Displays and manages sets of flashcards
- GeneratePage: Interface for AI generation
- GenerationsTable: Lists all flashcard generations
- Rich UI components using shadcn/ui library
- Toast notifications for user feedback
- Loading states and error handling
- Form validation with react-hook-form

## Technical Features
- TypeScript throughout for type safety
- DTO pattern for data transfer
- Command pattern for operations
- Middleware for authentication
- Supabase for real-time database capabilities
- Bulk operations support
- Pagination support for large datasets
- OpenRouter API integration with:
  - Response caching
  - Token bucket rate limiting
  - Error handling and logging
  - Model selection
  - Circuit breaker pattern
- Development-only test endpoints
- Comprehensive error handling
- Input validation with Zod
- Environment-based configuration
- Vite development server with API proxy 
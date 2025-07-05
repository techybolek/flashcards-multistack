# Flashcard Management Application - Codebase Analysis

## Architecture Overview
- Frontend: React-based UI with TypeScript
- Backend: Node.js with Express
- Database: Supabase
- AI Integration: OpenRouter API for flashcard generation

## Frontend Routes

### Public Routes
```typescript
- "/" - HomePage (Landing page)
- "/auth/login" - LoginPage
- "/auth/register" - RegisterPage
- "/auth/recover" - RecoverPage
```

### Protected Routes (require authentication)
```typescript
- "/dashboard" - DashboardPage (Main user dashboard)
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

3. Navigation Features:
   - Uses React Router v6
   - BrowserRouter as the router implementation
   - Nested routing within Layout component
   - Maintains consistent UI across routes

## Data Model

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
};
```

## Key Features

### Manual Flashcard Management
- Create individual flashcards
- Edit existing flashcards
- Delete flashcards
- View flashcards in a list format
- Each flashcard has a front (question) and back (answer)

### AI-Powered Generation
- Uses OpenRouter API (with GPT-4 mini model)
- Generates 5-10 flashcards from input text
- Text requirements: 1,000-10,000 characters
- AI generates both flashcards and a descriptive title
- Three flashcard sources:
  - 'manual': User-created
  - 'ai-full': AI-generated, unedited
  - 'ai-edited': AI-generated, user-modified

### Generation Management
- Tracks generation metadata:
  - Source text hash for deduplication
  - Generation duration
  - Number of cards generated
  - Acceptance stats (edited vs. unedited)
- Groups flashcards by generation

## Security Features
- User authentication required
- Per-user data isolation
- Access control checks on all operations
- Ownership verification before modifications

## Frontend Components
- GenerationDetailPage: Displays and manages sets of flashcards
- GeneratePage: Interface for AI generation
- GenerationsTable: Lists all flashcard generations
- Rich UI components using shadcn/ui library

## API Structure

### Endpoints
```
- GET    /api/flashcards
- GET    /api/flashcards/:id
- POST   /api/flashcards
- POST   /api/flashcards/bulk
- GET    /api/generations
- POST   /api/generations
- GET    /api/generations/:id/flashcards
```

## Error Handling
- Comprehensive error handling throughout
- User-friendly error messages
- Proper HTTP status codes
- Input validation on all endpoints

## Technical Features
- TypeScript throughout for type safety
- DTO pattern for data transfer
- Command pattern for operations
- Middleware for authentication
- Supabase for real-time database capabilities
- Bulk operations support
- Pagination support for large datasets 
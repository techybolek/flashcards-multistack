# API Endpoint Implementation Plan: Flashcards Endpoints

## 1. Przegląd punktu końcowego
Opis: This set of REST API endpoints is designed to manage flashcards, providing complete CRUD operations as well as AI-generated flashcard proposals. The endpoints include listing flashcards, retrieving a single flashcard, creating, updating, deleting flashcards, bulk creation, and generating flashcards from text.

## 2. Szczegóły żądania
- **Metody HTTP**:
  - GET: List flashcards, Get flashcard
  - POST: Create flashcard, Bulk create flashcards, Generate flashcards
  - PUT: Update flashcard
  - DELETE: Delete flashcard
- **URL Patterns**:
  - List Flashcards: `/api/flashcards`
  - Get Flashcard: `/api/flashcards/{id}`
  - Create Flashcard: `/api/flashcards`
  - Update Flashcard: `/api/flashcards/{id}`
  - Delete Flashcard: `/api/flashcards/{id}`
  - Bulk Create Flashcards: `/api/flashcards/bulk`
  - Generate Flashcards: `/api/generations`
- **Parametry**:
  - **Query Parameters**:
    - `page` (optional, default: 1)
    - `limit` (optional, default: 20)
    - `source` (optional, filter by 'ai-full', 'ai-edited', or 'manual')
  - **Path Parameters**:
    - `id`: Identifier of the flashcard
- **Request Body**:
  - For **creation/updating** endpoints:
    - `front`: string, maximum length 200 characters
    - `back`: string, maximum length 500 characters
    - `source`: string (allowed values: for creation: 'manual' or 'ai-full'; for update: 'manual' or 'ai-edited')
    - `generation_id`: number (optional, null for manual flashcards)
  - For **bulk creation**:
    - A JSON object with an array of flashcards following the above structure
  - For **generation** endpoint:
    - `text`: string between 1000 and 10000 characters

## 3. Wykorzystywane typy
- `FlashcardDTO`
- `CreateFlashcardCommand`
- `UpdateFlashcardCommand`
- `ListFlashcardsResponseDTO`
- `PaginationDTO`
- `FlashcardProposalDTO`
- `GenerationStatsDTO`
- `GenerationResultDTO`
- `GenerateFlashcardsCommand`

## 4. Szczegóły odpowiedzi
- **GET `/api/flashcards`**: HTTP 200, returns a JSON with an array of flashcards (`data`) and pagination info (`pagination`).
- **GET `/api/flashcards/{id}`**: HTTP 200, returns a single flashcard; HTTP 404 if not found.
- **POST `/api/flashcards`**: HTTP 201, returns the created flashcard; HTTP 400 for invalid input.
- **PUT `/api/flashcards/{id}`**: HTTP 200, returns the updated flashcard; HTTP 400 or 404 on error.
- **DELETE `/api/flashcards/{id}`**: HTTP 204, no content in response.
- **POST `/api/flashcards/bulk`**: HTTP 201, returns an array of created flashcards.
- **POST `/api/generations`**: HTTP 201, returns a generation result containing flashcard proposals and generation statistics.

## 5. Przepływ danych
1. The client sends a request with a valid JWT token in the `Authorization` header.
2. Middleware validates the token and attaches the user context to the request.
3. Request data is validated using Zod schemas, ensuring compliance with length and type restrictions (e.g., `front`, `back`, and `text` for generation).
4. The controller calls the appropriate service:
   - **CRUD Operations**: Service interacts with Supabase to perform database operations, leveraging RLS policies for user-based access.
   - **Flashcard Generation**: Service validates the text, calls the AI model (via Openrouter.ai) for flashcard proposals, and logs generation statistics alongside errors if they occur.
5. The service returns the result, and the controller sends the appropriate HTTP response with status codes and JSON data.

## 6. Względy bezpieczeństwa
- **Autoryzacja**: JWT-based authentication with tokens sent in the `Authorization` header.
- **Dostęp do danych**: Row Level Security (RLS) in PostgreSQL ensures users can only access their own records.
- **Walidacja**: All incoming data is validated using Zod schemas to prevent invalid data and injection attacks.
- **Bezpieczne logowanie błędów**: Error messages are logged internally without exposing sensitive details to the client.

## 7. Obsługa błędów
- **400 Bad Request**: Returned when input validation fails (e.g., string length violations, invalid JSON structure).
- **401 Unauthorized**: Returned when the JWT token is missing, invalid, or expired.
- **404 Not Found**: Returned when the requested flashcard does not exist.
- **500 Internal Server Error**: Returned for unexpected server errors; these are logged for further investigation.
- **Specjalne logowanie**: Flashcard generation errors are recorded in the `generation_error_logs` table with detailed error info.

## 8. Rozważania dotyczące wydajności
- **Pagination**: Implement pagination on the listing endpoint to limit data load.
- **Indeksacja**: Ensure database indexes on `user_id` and `generation_id` to speed up queries.
- **Caching**: Consider using caching strategies for frequently accessed flashcards.
- **Optymalizacja walidacji**: Keep validation and error handling efficient to minimize overhead.

## 9. Etapy wdrożenia
1. **Route Definitions**: Create API routes for flashcards in `./src/pages/api/flashcards` and for generation in `./src/pages/api/generations`.
2. **Validation Schemas**: Develop Zod schemas based on the type definitions in `src/types.ts` for request validation.
3. **JWT Middleware**: Implement middleware to validate JWT tokens and enforce RLS policies via Supabase.
4. **Service Layer**: Create service modules in `./src/lib/services` to handle business logic for flashcard CRUD operations, bulk creation, and AI-driven generation.
5. **Database Integration**: Ensure all database operations use the Supabase client from `src/db/supabase.client.ts` with proper error handling and prepared statements.
6. **Error Logging**: Set up comprehensive error logging, especially for generation errors, storing logs in the `generation_error_logs` table.
7. **Testing**: Write unit and integration tests to cover all endpoints, edge cases, and error scenarios.
8. **Code Review & Optimization**: Perform code reviews and facilitate performance benchmarking.
9. **Deployment**: Deploy to staging, run end-to-end tests, and finally deploy to production. 
# Flashcard Generator Expressjs Backend

## Features

- **JWT Authentication**: User registration, login, logout, and password recovery
- **Flashcard Management**: Create, read, update, and delete flashcards
- **AI-Powered Generation**: Generate flashcards from text using OpenAI GPT
- **Generation Management**: Manage flashcard generation sessions
- **Database Integration**: JPA with H2 (development) and PostgreSQL (production)
- **Security**: Spring Security with JWT token validation
- **CORS Support**: Configured for frontend integration

## Prerequisites

All endpoints return responses in the format:
```json
{
  "success": boolean,
  "data": T,
  "error": string?,
  "message": string?
}
```

### Authentication (`/api/auth`)

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `POST /api/auth/recover` - Password recovery

### Flashcards (`/api/flashcards`)

- `POST /api/flashcards` - Create flashcard
- `PUT /api/flashcards/{id}` - Update flashcard
- `DELETE /api/flashcards/{id}` - Delete flashcard

### Generations (`/api/generations`)

- `POST /api/generations` - Generate flashcards from text
- `GET /api/generations` - List user generations
- `GET /api/generations/{id}` - Get generation details
- `PUT /api/generations/{id}` - Update generation flashcards
- `DELETE /api/generations/{id}` - Delete generation

## Frontend Integration

The backend is configured to work with the React frontend:

- **Port**: 3001 (matches frontend proxy configuration)
- **CORS**: Allows requests from localhost:5173 and localhost:3000
- **API Contract**: Exactly matches TypeScript interfaces in the frontend

## Technology Stack

- **expressjs**: Application framework
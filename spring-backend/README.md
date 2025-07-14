# 10x Cards Spring Boot Backend

This is a Spring Boot implementation of the backend for the 10x Cards flashcard application. It provides a REST API that exactly matches the frontend's API contract defined in the TypeScript interfaces.

## Features

- **JWT Authentication**: User registration, login, logout, and password recovery
- **Flashcard Management**: Create, read, update, and delete flashcards
- **AI-Powered Generation**: Generate flashcards from text using OpenAI GPT
- **Generation Management**: Manage flashcard generation sessions
- **Database Integration**: JPA with H2 (development) and PostgreSQL (production)
- **Security**: Spring Security with JWT token validation
- **CORS Support**: Configured for frontend integration

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- OpenAI API key or OPENROUTER api key

## Configuration

### Environment Variables

### Application Profiles

- **Default (dev)**: Uses H2 in-memory database
- **prod**: Uses PostgreSQL database

## Running the Application

### Development Mode

```bash
cd spring-backend
mvn spring-boot:run
```

The application will start on port 3001 and create an H2 in-memory database.

### Production Mode

```bash
cd spring-backend
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Database

### H2 Console (Development)

Access the H2 console at: http://localhost:3001/h2-console

- URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

### Database Schema

The application automatically creates the following tables:

- `users`: User accounts with UUID primary keys
- `generations`: Flashcard generation sessions
- `flashcards`: Individual flashcards with source tracking

## API Endpoints

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

## Testing

Run tests with:

```bash
mvn test
```

## Building for Production

```bash
mvn clean package
java -jar target/flashcards-backend-1.0.0.jar --spring.profiles.active=prod
```

## Technology Stack

- **Spring Boot 3.2**: Application framework
- **Spring Security 6**: Authentication and authorization
- **Spring Data JPA**: Database access layer
- **JWT**: Token-based authentication
- **H2 Database**: Development database
- **PostgreSQL**: Production database
- **OpenAI API**: AI flashcard generation
- **Maven**: Build and dependency management

## Architecture

The application follows a layered architecture:

- **Controllers**: REST API endpoints
- **Services**: Business logic layer
- **Repositories**: Data access layer
- **Entities**: JPA entities matching database schema
- **DTOs**: Data transfer objects matching frontend interfaces
- **Security**: JWT authentication and Spring Security configuration

## Error Handling

The application includes comprehensive error handling:

- Input validation with Bean Validation
- Custom error responses in API format
- Security exception handling
- Database constraint violation handling

## Logging

Configured logging levels:

- **Development**: DEBUG for application code
- **Production**: INFO level with minimal security logging
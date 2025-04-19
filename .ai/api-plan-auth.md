# REST API Plan for 10x-cards

## 1. Resources

### Flashcards
- Table: `flashcards`
- Primary key: `id` (BIGSERIAL)
- Related to: `users` (user_id), `generations` (generation_id)

### Generations
- Table: `generations`
- Primary key: `id` (BIGSERIAL)
- Related to: `users` (user_id)

### Generation Error Logs
- Table: `generation_error_logs`
- Primary key: `id` (BIGSERIAL)
- Related to: `users` (user_id)

## 2. Endpoints

#### Login User
- **Method**: POST
- **URL**: `/api/auth/login`
- **Description**: Authenticate a user and return a JWT token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response Body**:
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized

#### List Flashcards
- **Method**: GET
- **URL**: `/api/flashcards`
- **Description**: Get a paginated list of user's flashcards
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `source`: Filter by source ('ai-full', 'ai-edited', 'manual')
- **Response Body**:
  ```json
  {
    "data": [
      {
        "id": 1,
        "front": "What is the capital of France?",
        "back": "Paris",
        "source": "manual",
        "created_at": "2023-06-01T12:00:00Z",
        "updated_at": "2023-06-01T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized

#### Get Flashcard
- **Method**: GET
- **URL**: `/api/flashcards/{id}`
- **Description**: Get a specific flashcard by ID
- **Headers**: Authorization: Bearer {token}
- **Response Body**:
  ```json
  {
    "id": 1,
    "front": "What is the capital of France?",
    "back": "Paris",
    "source": "manual",
    "created_at": "2023-06-01T12:00:00Z",
    "updated_at": "2023-06-01T12:00:00Z"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 404 Not Found

#### Create Flashcard
- **Method**: POST
- **URL**: `/api/flashcards`
- **Description**: Create a new flashcard
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "front": "What is the capital of France?",
    "back": "Paris",
    "source": "manual"
  }
  ```
- **Response Body**:
  ```json
  {
    "id": 1,
    "front": "What is the capital of France?",
    "back": "Paris",
    "source": "manual",
    "created_at": "2023-06-01T12:00:00Z",
    "updated_at": "2023-06-01T12:00:00Z"
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized
- **Validations**:
    `front` maximum length: 200 characters.
    `back`  maximum length: 500 characters.
    `source`: `manual`


#### Update Flashcard
- **Method**: PUT
- **URL**: `/api/flashcards/{id}`
- **Description**: Update an existing flashcard
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "front": "What is the capital of France?",
    "back": "Paris is the capital of France",
    "source": "manual"
  }
  ```
- **Response Body**:
  ```json
  {
    "id": 1,
    "front": "What is the capital of France?",
    "back": "Paris is the capital of France",
    "source": "manual",
    "created_at": "2023-06-01T12:00:00Z",
    "updated_at": "2023-06-01T12:30:00Z"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found
- **Validations**:
    `front` maximum length: 200 characters.
    `back`  maximum length: 500 characters.
    `source` Must be one of `ai-edited` or  `manual`

#### Delete Flashcard
- **Method**: DELETE
- **URL**: `/api/flashcards/{id}`
- **Description**: Delete a flashcard
- **Headers**: Authorization: Bearer {token}
- **Response Body**: Empty
- **Success Codes**: 204 No Content
- **Error Codes**: 401 Unauthorized, 404 Not Found

#### Bulk Create Flashcards
- **Method**: POST
- **URL**: `/api/flashcards/bulk`
- **Description**: Create multiple flashcards (manual and/or AI-generated) in a single request
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "flashcards": [
      {
        "front": "What is the capital of France?",
        "back": "Paris",
        "source": "manual",
        "generation_id": null
      },
      {
        "front": "What is the largest city in France?",
        "back": "Paris",
        "source": "ai-full",
        "generation_id": 1,
      }
    ]
  }
  ```
- **Response Body**:
  ```json
  {
    "data": [
      {
        "id": 1,
        "front": "What is the capital of France?",
        "back": "Paris",
        "source": "manual",
        "created_at": "2023-06-01T12:00:00Z",
        "updated_at": "2023-06-01T12:00:00Z"
      },
      {
        "id": 2,
        "front": "What is the largest city in France?",
        "back": "Paris",
        "source": "ai-full",
        "created_at": "2023-06-01T12:00:00Z",
        "updated_at": "2023-06-01T12:00:00Z",
        "generation_id": 1
      }
    ]
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized
- **Validations**:
    Each flashcard must meet the same validation rules as single create:
    - `front` maximum length: 200 characters.
    - `back`  maximum length: 500 characters.
    - `source` Must be one of `ai-full`, `ai-edited`, or `manual`
    - `generation_id`: populared for ai generated, null for manual

### Flashcard Generation

#### Generate Flashcards
- **Method**: POST
- **URL**: `/api/generations`
- **Description**: Generate flashcard proposals from provided text using AI
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "text": "Long text content for flashcard generation..."
  }
  ```
- **Response Body**:
  ```json
  {
    "generation_id": 1,
    "flashcardProposals": [
      {
        "front": "What is the capital of France?",
        "back": "Paris",
        "source": "ai-full"
      },
      {
        "front": "What is the largest city in France?",
        "back": "Paris",
        "source": "ai-full"
      }
    ],
    "stats": {
      "generated_count": 2,
      "generation_duration": "PT2S"
    }
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

## 3. Authentication and Authorization

### Authentication Mechanism
- JWT (JSON Web Token) based authentication
- Tokens are issued upon successful login
- Tokens include user ID and expiration time
- Tokens are validated on each request to protected endpoints

### Authorization
- Row Level Security (RLS) in PostgreSQL ensures users can only access their own data
- All API endpoints (except registration and login) require a valid JWT token
- Token must be included in the Authorization header as: `Authorization: Bearer {token}`
- Invalid or expired tokens return 401 Unauthorized

## 4. Validation and Business Logic

### Data Validation
- Flashcard front: Required, max 200 characters
- Flashcard back: Required, max 500 characters
- Flashcard source: Must be one of 'ai-full', 'ai-edited', 'manual'
- Generation text: Required, between 1000 and 10000 characters
- Study rating: Integer between 1 and 5

### Business Logic Implementation

#### Flashcard Generation
1. User submits text for generation
2. API validates text length (1000-10000 characters)
3. API sends text to AI model via Openrouter.ai
4. AI model generates flashcard suggestions
5. API stores generation record with statistics
6. User reviews and accepts/rejects/edits suggestions
7. API updates generation statistics based on user actions

#### Error Handling
- API logs generation errors in the `generation_error_logs` table
- Detailed error messages are returned to the client for debugging
- Rate limiting is implemented to prevent abuse of the AI generation endpoint 
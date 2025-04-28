# OpenRouter Service Implementation Guide

## 1. Service Description

The OpenRouter service is a TypeScript-based integration layer that facilitates communication with the OpenRouter API for LLM-powered chat functionality. It provides a robust, type-safe interface for managing chat interactions, model selection, and response handling.

## 2. Constructor

```typescript
class OpenRouterService {
  constructor(config: OpenRouterConfig) {
    this.config = config;
    this.client = new OpenRouterClient(config);
    this.cache = new ResponseCache();
    this.rateLimiter = new TokenBucketRateLimiter();
  }
}
```

## 3. Public Methods and Fields

### Methods

```typescript
interface OpenRouterService {
  // Core chat functionality
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;
  
  // Model management
  getAvailableModels(): Promise<ModelInfo[]>;
  selectModel(criteria: ModelSelectionCriteria): Promise<string>;
  
  // Configuration
  updateConfig(newConfig: Partial<OpenRouterConfig>): void;
  
  // Utility methods
  validateResponse(response: unknown): boolean;
  formatSystemMessage(context: ChatContext): string;
}
```

### Fields

```typescript
interface OpenRouterService {
  readonly config: OpenRouterConfig;
  readonly client: OpenRouterClient;
  readonly cache: ResponseCache;
  readonly rateLimiter: TokenBucketRateLimiter;
}
```

## 4. Private Methods and Fields

```typescript
interface OpenRouterService {
  private readonly _validateMessage(message: ChatMessage): void;
  private readonly _handleRateLimit(): Promise<void>;
  private readonly _retryWithBackoff<T>(operation: () => Promise<T>): Promise<T>;
  private readonly _cacheKey(messages: ChatMessage[], options: ChatOptions): string;
}
```

## 5. Error Handling

### Error Types

```typescript
class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly details?: unknown
  ) {
    super(message);
  }
}

enum ErrorCode {
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED'
}
```

### Error Handling Strategy

1. Implement retry mechanism with exponential backoff
2. Log errors with appropriate context
3. Provide user-friendly error messages
4. Handle rate limiting gracefully
5. Implement circuit breaker pattern for API calls

## 6. Security Considerations

1. API Key Management
   - Store keys in environment variables
   - Implement key rotation mechanism
   - Use encryption for key storage

2. Request Validation
   - Sanitize user input
   - Validate message format
   - Implement request size limits

3. Response Handling
   - Validate response format
   - Implement timeout mechanisms
   - Handle sensitive data appropriately

## 7. Implementation Steps

### Step 1: Project Setup

1. Create service directory structure:
```bash
src/
  services/
    openrouter/
      index.ts
      types.ts
      config.ts
      errors.ts
      client.ts
      cache.ts
      rate-limiter.ts
```

2. Install dependencies:
```bash
npm install axios redis @types/node
```

### Step 2: Core Implementation

1. Create configuration interface:
```typescript
interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
  maxRetries: number;
  timeout: number;
  cacheEnabled: boolean;
}
```

2. Implement client class:
```typescript
class OpenRouterClient {
  constructor(private config: OpenRouterConfig) {}
  
  async chat(messages: ChatMessage[], options: ChatOptions): Promise<ChatResponse> {
    // Implementation
  }
}
```

3. Implement rate limiter:
```typescript
class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefill: number;
  
  async acquireToken(): Promise<void> {
    // Implementation
  }
}
```

### Step 3: Response Format Implementation

1. Define JSON schema for responses:
```typescript
const responseSchema = {
  type: 'json_schema',
  json_schema: {
    name: 'ChatResponse',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        model: { type: 'string' },
        usage: {
          type: 'object',
          properties: {
            prompt_tokens: { type: 'number' },
            completion_tokens: { type: 'number' },
            total_tokens: { type: 'number' }
          }
        }
      },
      required: ['content', 'model', 'usage']
    }
  }
};
```

2. Implement response validation:
```typescript
function validateResponse(response: unknown): boolean {
  // Implementation using JSON Schema validation
}
```

### Step 4: Error Handling Implementation

1. Create error handling middleware:
```typescript
class ErrorHandler {
  static handle(error: unknown): never {
    // Implementation
  }
}
```

2. Implement retry mechanism:
```typescript
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number
): Promise<T> {
  // Implementation
}
```

### Step 5: Testing and Validation

1. Create unit tests for each component
2. Implement integration tests
3. Create error scenario tests
4. Validate rate limiting behavior
5. Test caching mechanism

### Step 6: Documentation

1. Create API documentation
2. Document error codes and handling
3. Create usage examples
4. Document configuration options
5. Create troubleshooting guide

## Usage Example

```typescript
const config: OpenRouterConfig = {
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: 'https://api.openrouter.ai/v1',
  defaultModel: 'gpt-3.5-turbo',
  maxRetries: 3,
  timeout: 30000,
  cacheEnabled: true
};

const openRouter = new OpenRouterService(config);

const response = await openRouter.chat([
  {
    role: 'system',
    content: 'You are a helpful assistant.'
  },
  {
    role: 'user',
    content: 'Hello, how are you?'
  }
], {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  max_tokens: 1000
});
``` 
# OpenRouter Service Simplification Plan

## Current Implementation
The current OpenRouter service implementation includes:
- Complex error handling with custom error types
- Caching system for responses
- Rate limiting with token bucket algorithm
- Circuit breaker pattern
- Model selection capabilities
- Complex configuration options

## Simplification Goals
1. Remove unnecessary complexity
2. Keep only essential functionality
3. Maintain basic error handling
4. Keep the core chat completion functionality

## Implementation Plan

### 1. Simplified Types
```typescript
interface OpenRouterConfig {
  apiKey: string;
  defaultModel?: string;
}

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatResponse {
  content: string;
}
```

### 2. Simplified OpenRouter Service
```typescript
export class OpenRouterService {
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly baseURL = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(config: OpenRouterConfig) {
    this.apiKey = config.apiKey;
    this.defaultModel = config.defaultModel || 'gpt-4o-mini';
  }

  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: this.defaultModel,
          messages: messages
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        content: response.data.choices[0].message.content
      };
    } catch (error) {
      throw new Error('Failed to get response from OpenRouter API');
    }
  }

  formatSystemMessage(systemPrompt: string): string {
    return systemPrompt || 'You are a helpful assistant.';
  }
}
```

### 3. Changes Required
1. Delete the following files:
   - `lib/openrouter/cache.ts`
   - `lib/openrouter/circuit-breaker.ts`
   - `lib/openrouter/rate-limiter.ts`
   - `lib/openrouter/errors.ts`
   - `lib/openrouter/client.ts`

2. Replace `lib/openrouter/types.ts` with simplified types

3. Replace `lib/openrouter/index.ts` with new simplified implementation

4. Update `services/generationService.ts` to use simplified interface

### 4. Migration Steps
1. Back up existing files
2. Delete unnecessary files
3. Create new simplified implementation
4. Update service usage in generation service
5. Test basic functionality
6. Deploy changes

### 5. Testing Plan
1. Test basic chat completion
2. Verify error handling
3. Check system message formatting
4. Validate response parsing

## Impact
- Reduced code complexity
- Easier maintenance
- Simpler error handling
- Removed potential points of failure
- More straightforward debugging

## Limitations
- No caching (might increase API costs)
- No rate limiting (rely on OpenRouter's limits)
- No circuit breaker (less resilient to failures)
- Basic error handling only

## Future Considerations
If needed, individual features can be added back:
1. Rate limiting
2. Caching
3. Circuit breaker
4. Advanced error handling 
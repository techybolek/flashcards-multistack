import { OpenRouterClient } from './client';
import { ResponseCache } from './cache';
import { TokenBucketRateLimiter } from './rate-limiter';
import { OpenRouterError, ErrorCode } from './errors';
import type {
  ChatMessage,
  ChatResponse,
  ChatOptions,
  ChatContext,
  ModelInfo,
  ModelSelectionCriteria
} from './types';

export interface OpenRouterConfig {
  apiKey: string;
  defaultModel?: string;
  maxRetries?: number;
  timeout?: number;
  cacheEnabled?: boolean;
}

interface OpenRouterClientConfig {
  apiKey: string;
  defaultModel: string;
  maxRetries: number;
  timeout: number;
  cacheEnabled: boolean;
}

export class OpenRouterService {
  private readonly client: OpenRouterClient;
  private readonly cache: ResponseCache;
  private readonly rateLimiter: TokenBucketRateLimiter;
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly maxRetries: number;
  private readonly timeout: number;
  private readonly cacheEnabled: boolean;

  constructor(config: OpenRouterConfig) {
    this.apiKey = config.apiKey;
    this.defaultModel = config.defaultModel || 'qwen/qwen-2.5-7b-instruct'; // Use the model from the successful test
    this.maxRetries = config.maxRetries || 3;
    this.timeout = config.timeout || 60000;
    this.cacheEnabled = config.cacheEnabled ?? true;
    
    const clientConfig: OpenRouterClientConfig = {
      apiKey: this.apiKey,
      defaultModel: this.defaultModel,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      cacheEnabled: this.cacheEnabled
    };
    
    this.client = new OpenRouterClient(clientConfig);
    this.cache = new ResponseCache();
    this.rateLimiter = new TokenBucketRateLimiter();
  }

  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResponse> {
    try {
      // Check cache if enabled
      if (this.cacheEnabled) {
        const cachedResponse = await this.getCachedResponse(messages, options);
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      // Acquire rate limit token
      await this.rateLimiter.acquireToken();

      // Make API request
      const response = await this.client.chat(messages, options);

      // Cache response if enabled
      if (this.cacheEnabled) {
        await this.setCachedResponse(messages, options, response);
      }

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAvailableModels(): Promise<ModelInfo[]> {
    try {
      await this.rateLimiter.acquireToken();
      return await this.client.getAvailableModels();
    } catch (error) {
      return this.handleError(error);
    }
  }

  async selectModel(criteria: ModelSelectionCriteria): Promise<string> {
    try {
      const models = await this.getAvailableModels();
      
      // Filter models based on criteria
      const filteredModels = models.filter(model => {
        if (criteria.maxTokens && model.context_length < criteria.maxTokens) {
          return false;
        }
        if (criteria.preferredModels && !criteria.preferredModels.includes(model.id)) {
          return false;
        }
        return true;
      });

      if (filteredModels.length === 0) {
        throw new OpenRouterError(
          'No models match the selection criteria',
          ErrorCode.MODEL_UNAVAILABLE
        );
      }

      // Return the first matching model
      return filteredModels[0].id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  formatSystemMessage(context: ChatContext): string {
    let systemMessage = context.systemPrompt || 'You are a helpful assistant.';
    
    if (context.temperature !== undefined) {
      systemMessage += `\nTemperature: ${context.temperature}`;
    }
    
    if (context.maxTokens !== undefined) {
      systemMessage += `\nMax Tokens: ${context.maxTokens}`;
    }
    
    return systemMessage;
  }

  private async getCachedResponse(messages: ChatMessage[], options: ChatOptions): Promise<ChatResponse | null> {
    if (!this.cacheEnabled) return null;
    return this.cache.get(messages, options);
  }

  private async setCachedResponse(messages: ChatMessage[], options: ChatOptions, response: ChatResponse): Promise<void> {
    if (!this.cacheEnabled) return;
    await this.cache.set(messages, options, response);
  }

  private async handleError(error: unknown): Promise<never> {
    if (error instanceof OpenRouterError) {
      // Add additional context to the error if available
      const errorWithContext = new OpenRouterError(
        error.message,
        error.code,
        {
          ...(error.details as Record<string, unknown> || {}),
          timestamp: new Date().toISOString(),
          model: this.defaultModel
        }
      );
      throw errorWithContext;
    }
    if (error instanceof Error) {
      throw new OpenRouterError(
        `OpenRouter API error: ${error.message}`,
        ErrorCode.UNKNOWN_ERROR,
        { 
          cause: error,
          timestamp: new Date().toISOString(),
          model: this.defaultModel
        }
      );
    }
    throw new OpenRouterError(
      'An unknown error occurred while calling the OpenRouter API',
      ErrorCode.UNKNOWN_ERROR,
      {
        timestamp: new Date().toISOString(),
        model: this.defaultModel
      }
    );
  }
} 
import { ChatMessage, ChatOptions, ChatResponse } from './types';

export class ResponseCache {
  private cache: Map<string, { response: ChatResponse; timestamp: number }>;
  private readonly ttl: number;

  constructor(ttlSeconds: number = 3600) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
  }

  get(messages: ChatMessage[], options: ChatOptions): ChatResponse | null {
    const key = this.generateCacheKey(messages, options);
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.response;
  }

  set(messages: ChatMessage[], options: ChatOptions, response: ChatResponse): void {
    const key = this.generateCacheKey(messages, options);
    this.cache.set(key, {
      response,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }

  private generateCacheKey(messages: ChatMessage[], options: ChatOptions): string {
    const messageString = JSON.stringify(messages);
    const optionsString = JSON.stringify(options);
    return `${messageString}|${optionsString}`;
  }
} 
export interface OpenRouterConfig {
  apiKey: string;
  defaultModel?: string;
  maxRetries?: number;
  timeout?: number;
  cacheEnabled?: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  [key: string]: unknown;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelInfo {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

export interface ModelSelectionCriteria {
  maxTokens?: number;
  maxCost?: number;
  preferredModels?: string[];
}

export interface ChatContext {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
} 
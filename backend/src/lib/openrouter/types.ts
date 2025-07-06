export interface OpenRouterConfig {
  apiKey: string;
  defaultModel?: string;
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatResponse {
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
} 
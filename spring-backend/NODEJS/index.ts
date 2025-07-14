import axios from 'axios';
import type { OpenRouterConfig, ChatMessage, ChatResponse, ChatOptions } from './types';

export class OpenRouterService {
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly baseURL = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(config: OpenRouterConfig) {
    this.apiKey = config.apiKey;
    this.defaultModel = config.defaultModel || 'gpt-4o-mini';
  }

  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResponse> {
    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: this.defaultModel,
          messages: messages,
          ...options
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
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to get response from OpenRouter API');
    }
  }

  formatSystemMessage(systemPrompt: string): string {
    return systemPrompt || 'You are a helpful assistant.';
  }
} 
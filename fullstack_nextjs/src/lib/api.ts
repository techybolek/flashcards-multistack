import type {
  LoginUserCommand,
  RegisterUserCommand,
  RecoverPasswordCommand,
  LoginUserResponseDTO,
  FlashcardDTO,
  CreateFlashcardCommand,
  UpdateFlashcardCommand,
  GenerateFlashcardsCommand,
  GenerationResultDTO,
  ApiResponse
} from '@/types';

const API_BASE_URL = ''; // API routes are on the same domain

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(command: LoginUserCommand): Promise<LoginUserResponseDTO> {
    const url = `${API_BASE_URL}/api/auth/login`;
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log('API Client - Received response:', data);
      // Token is handled by http-only cookie, no need to store in local storage
      return data;
    } catch (error) {
      console.error('Login API request failed:', error);
      throw error;
    }
  }

  async register(command: RegisterUserCommand): Promise<any> {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(command),
    });

    return response.data;
  }

  async logout(): Promise<void> {
    await this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async recover(command: RecoverPasswordCommand): Promise<any> {
    const response = await this.request('/api/auth/recover', {
      method: 'POST',
      body: JSON.stringify(command),
    });

    return response.data;
  }

  async createFlashcard(command: CreateFlashcardCommand): Promise<FlashcardDTO> {
    const response = await this.request<FlashcardDTO>('/api/flashcards', {
      method: 'POST',
      body: JSON.stringify(command),
    });

    return response.data!;
  }

  async updateFlashcard(id: number, command: UpdateFlashcardCommand): Promise<FlashcardDTO> {
    const response = await this.request<FlashcardDTO>(`/api/flashcards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(command),
    });

    return response.data!;
  }

  async deleteFlashcard(id: number): Promise<void> {
    await this.request(`/api/flashcards/${id}`, {
      method: 'DELETE',
    });
  }

  // Generation endpoints
  async generateFlashcards(command: GenerateFlashcardsCommand): Promise<GenerationResultDTO> {
    const response = await this.request<GenerationResultDTO>('/api/generations', {
      method: 'POST',
      body: JSON.stringify(command),
    });

    return response.data!;
  }

  async getGenerations(): Promise<any> {
    const response = await this.request('/api/generations');
    return response.data;
  }

  async getGeneration(id: number): Promise<any> {
    const response = await this.request(`/api/generations/${id}`);
    return response.data;
  }

  async deleteGeneration(id: number): Promise<void> {
    await this.request(`/api/generations/${id}`, {
      method: 'DELETE',
    });
  }

  async updateGeneration(id: number, data: { flashcards: Array<{ front: string; back: string; source: 'ai-full' | 'ai-edited' }> }) {
    const response = await this.request<ApiResponse>(`/api/generations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

}

export const apiClient = new ApiClient();

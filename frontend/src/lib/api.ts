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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    const response = await this.request<LoginUserResponseDTO>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(command),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data!;
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

    localStorage.removeItem('authToken');
  }

  async recover(command: RecoverPasswordCommand): Promise<any> {
    const response = await this.request('/api/auth/recover', {
      method: 'POST',
      body: JSON.stringify(command),
    });

    return response.data;
  }

  // Flashcard endpoints
  async getFlashcards(): Promise<FlashcardDTO[]> {
    const response = await this.request<FlashcardDTO[]>('/api/flashcards');
    return response.data!;
  }

  async getFlashcard(id: number): Promise<FlashcardDTO> {
    const response = await this.request<FlashcardDTO>(`/api/flashcards/${id}`);
    return response.data!;
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

  async patchFlashcard(id: number, front: string, back: string): Promise<void> {
    await this.request(`/api/flashcards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ front, back }),
    });
  }

  async createBulkFlashcards(flashcards: CreateFlashcardCommand[]): Promise<void> {
    await this.request('/api/flashcards/bulk', {
      method: 'POST',
      body: JSON.stringify(flashcards),
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

  async getGenerationFlashcards(id: number): Promise<FlashcardDTO[]> {
    const response = await this.request<FlashcardDTO[]>(`/api/generations/${id}/flashcards`);
    return response.data!;
  }

  async deleteGeneration(id: number): Promise<void> {
    await this.request(`/api/generations/${id}`, {
      method: 'DELETE',
    });
  }

  // Test cleanup endpoint
  async cleanupTestData(): Promise<any> {
    const response = await this.request('/api/tests/cleanup', {
      method: 'POST',
    });

    return response.data;
  }
}

export const apiClient = new ApiClient();
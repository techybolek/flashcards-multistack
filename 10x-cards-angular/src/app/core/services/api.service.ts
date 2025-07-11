import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  FlashcardDTO, 
  CreateFlashcardCommand, 
  UpdateFlashcardCommand,
  GenerateFlashcardsCommand,
  GenerationResultDTO,
  ApiResponse 
} from '../types/index';

export interface Generation {
  id: number;
  generation_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  flashcard_count?: number;
}

export interface GenerationDetail {
  id: number;
  generation_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  flashcards: FlashcardDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // TODO: Move to environment variable
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  // Generation endpoints
  generateFlashcards(command: GenerateFlashcardsCommand): Observable<GenerationResultDTO> {
    return this.http.post<GenerationResultDTO>(`${this.apiUrl}/api/generations`, command);
  }

  getGenerations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/generations`);
  }

  getGeneration(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/generations/${id}`);
  }

  deleteGeneration(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/generations/${id}`);
  }

  updateGeneration(id: number, data: { flashcards: Array<{ front: string; back: string; source: 'ai-full' | 'ai-edited' }> }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/generations/${id}`, data);
  }

  // Flashcard endpoints
  createFlashcard(command: CreateFlashcardCommand): Observable<FlashcardDTO> {
    return this.http.post<FlashcardDTO>(`${this.apiUrl}/api/flashcards`, command);
  }

  updateFlashcard(id: number, command: UpdateFlashcardCommand): Observable<FlashcardDTO> {
    return this.http.put<FlashcardDTO>(`${this.apiUrl}/api/flashcards/${id}`, command);
  }

  deleteFlashcard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/flashcards/${id}`);
  }
}

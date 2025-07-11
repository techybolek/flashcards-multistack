import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Generation } from '../../shared/components/generations-table/generations-table.component';
import { GenerationDetail } from '../../features/generations/generation-detail/generation-detail.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // TODO: Move to environment variable
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  getGenerations(): Observable<Generation[]> {
    return this.http.get<Generation[]>(`${this.apiUrl}/generations`);
  }

  getGeneration(id: string): Observable<GenerationDetail> {
    return this.http.get<GenerationDetail>(`${this.apiUrl}/generations/${id}`);
  }
}

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // TODO: Move to environment variable
  private apiUrl = 'http://localhost:3000';
  private _isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  private hasToken(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { email, password }).pipe(
      tap(response => {
        // Assuming the token is in response.access_token
        this.login(response.access_token);
      })
    );
  }

  login(token: string): void {
    localStorage.setItem('auth_token', token);
    this._isAuthenticated.next(true);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this._isAuthenticated.next(false);
  }
}

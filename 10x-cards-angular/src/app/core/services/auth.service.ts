import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { 
  LoginUserCommand, 
  RegisterUserCommand, 
  RecoverPasswordCommand, 
  LoginUserResponseDTO, 
  User,
  ApiResponse 
} from '../types/index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // TODO: Move to environment variable
  private apiUrl = 'http://localhost:3000';
  
  private _user = new BehaviorSubject<User | null>(null);
  private _isLoading = new BehaviorSubject<boolean>(true);
  
  public user$ = this._user.asObservable();
  public isLoading$ = this._isLoading.asObservable();
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.checkAuthToken();
  }

  private checkAuthToken(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Decode JWT token to get user info (simple decode, in production use a proper JWT library)
        const payload = JSON.parse(atob(token.split('.')[1]));
        this._user.next({
          id: payload.userId,
          email: payload.email,
          name: payload.name || ''
        });
        this.isAuthenticated$.next(true);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('authToken');
        this.isAuthenticated$.next(false);
      }
    }
    this._isLoading.next(false);
  }

  login(command: LoginUserCommand): Observable<any> {
    return this.http.post<LoginUserResponseDTO>(`${this.apiUrl}/auth/login`, command).pipe(
      tap(response => {
        // Store the token
        localStorage.setItem('authToken', response.token);
        
        // Decode the token to get user info
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        
        const user: User = {
          id: payload.userId,
          email: payload.email,
          name: payload.name || ''
        };
        
        this._user.next(user);
        this.isAuthenticated$.next(true);
      })
    );
  }

  register(command: RegisterUserCommand): Observable<any> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/register`, command);
  }

  recover(command: RecoverPasswordCommand): Observable<any> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/recover`, command);
  }

  logout(): Observable<any> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap({
        next: () => {
          this.clearAuthState();
        },
        error: (error) => {
          // Even if the API call fails, clear local state
          console.error('Logout error:', error);
          this.clearAuthState();
        }
      })
    );
  }

  private clearAuthState(): void {
    this._user.next(null);
    this.isAuthenticated$.next(false);
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.value;
  }

  get user(): User | null {
    return this._user.value;
  }

  get isLoading(): boolean {
    return this._isLoading.value;
  }
}

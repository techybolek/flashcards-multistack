/**
 * Authentication service for handling API calls related to user authentication
 */

interface AuthResponse {
  status: 'success' | 'error';
  error?: string;
  message?: string;
  redirectTo?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RecoverData {
  email: string;
}

/**
 * Login a user with email and password
 */
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include', // Important: This ensures cookies are sent with the request
  });
  
  return await response.json();
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return await response.json();
}

/**
 * Request password recovery
 */
export async function recoverPassword(data: RecoverData): Promise<AuthResponse> {
  const response = await fetch('/api/auth/recover', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return await response.json();
}

/**
 * Logout the current user
 */
export async function logoutUser(): Promise<AuthResponse> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  
  return await response.json();
} 
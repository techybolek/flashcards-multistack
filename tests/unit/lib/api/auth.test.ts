import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loginUser, registerUser, recoverPassword, logoutUser } from '@/lib/api/auth';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Auth API Service', () => {
  const mockResponse = (status: 'success' | 'error', data: object = {}) => {
    return Promise.resolve({
      json: () => Promise.resolve({ status, ...data }),
    });
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loginUser', () => {
    it('should call fetch with correct parameters', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      mockFetch.mockResolvedValueOnce(mockResponse('success'));

      await loginUser(loginData);

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include',
      });
    });

    it('should return success response correctly', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const mockData = {
        status: 'success',
        redirectTo: '/dashboard',
        message: 'Login successful',
      };
      mockFetch.mockResolvedValueOnce(mockResponse('success', { 
        redirectTo: '/dashboard', 
        message: 'Login successful'
      }));

      const result = await loginUser(loginData);

      expect(result).toEqual(mockData);
    });

    it('should return error response correctly', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const mockData = {
        status: 'error',
        error: 'Invalid credentials',
      };
      mockFetch.mockResolvedValueOnce(mockResponse('error', { error: 'Invalid credentials' }));

      const result = await loginUser(loginData);

      expect(result).toEqual(mockData);
    });
  });

  describe('registerUser', () => {
    it('should call fetch with correct parameters', async () => {
      const registerData = { 
        email: 'test@example.com', 
        password: 'password123',
        confirmPassword: 'password123'
      };
      mockFetch.mockResolvedValueOnce(mockResponse('success'));

      await registerUser(registerData);

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
    });

    it('should return success response correctly', async () => {
      const registerData = { 
        email: 'test@example.com', 
        password: 'password123',
        confirmPassword: 'password123'
      };
      const mockData = {
        status: 'success',
        message: 'Registration successful',
      };
      mockFetch.mockResolvedValueOnce(mockResponse('success', { message: 'Registration successful' }));

      const result = await registerUser(registerData);

      expect(result).toEqual(mockData);
    });
  });

  describe('recoverPassword', () => {
    it('should call fetch with correct parameters', async () => {
      const recoverData = { email: 'test@example.com' };
      mockFetch.mockResolvedValueOnce(mockResponse('success'));

      await recoverPassword(recoverData);

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recoverData),
      });
    });
  });

  describe('logoutUser', () => {
    it('should call fetch with correct parameters', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse('success'));

      await logoutUser();

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    });
  });
}); 
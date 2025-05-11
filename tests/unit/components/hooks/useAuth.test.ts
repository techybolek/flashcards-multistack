import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/components/hooks/useAuth';
import * as authApi from '@/lib/api/auth';

// Define the response type locally to match the one in auth.ts
interface MockResponse {
  status: 'success' | 'error';
  error?: string;
  message?: string;
  redirectTo?: string;
}

// Mock the API functions
vi.mock('@/lib/api/auth', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  recoverPassword: vi.fn(),
  logoutUser: vi.fn(),
}));

// Mock the useToast hook
vi.mock('@/components/ui', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('useAuth hook', () => {
  const mockSuccessResponse: MockResponse = {
    status: 'success',
    message: 'Operation successful',
    redirectTo: '/dashboard',
  };
  
  const mockErrorResponse: MockResponse = {
    status: 'error',
    error: 'Invalid credentials',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockLocation.href = '';

    // Mock setTimeout to execute immediately
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('login function', () => {
    it('should set loading state correctly', async () => {
      vi.mocked(authApi.loginUser).mockResolvedValueOnce(mockSuccessResponse);
      
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.isLoading).toBe(false);
      
      const loginPromise = act(async () => {
        await result.current.login('test@example.com', 'password123');
      });
      
      // Since we're using fake timers, we need to manually advance them
      vi.runAllTimers();
      await loginPromise;
      
      // Should be false after login completes
      expect(result.current.isLoading).toBe(false);
    });

    it('should return true on successful login', async () => {
      vi.mocked(authApi.loginUser).mockResolvedValueOnce(mockSuccessResponse);
      
      const { result } = renderHook(() => useAuth());
      
      let success;
      await act(async () => {
        success = await result.current.login('test@example.com', 'password123');
      });
      
      expect(success).toBe(true);
      vi.runAllTimers();
      expect(mockLocation.href).toBe('/dashboard');
    });

    it('should return false on failed login', async () => {
      vi.mocked(authApi.loginUser).mockResolvedValueOnce(mockErrorResponse);
      
      const { result } = renderHook(() => useAuth());
      
      let success;
      await act(async () => {
        success = await result.current.login('test@example.com', 'wrong-password');
      });
      
      expect(success).toBe(false);
      expect(mockLocation.href).toBe('');
    });
  });

  describe('register function', () => {
    it('should return true on successful registration', async () => {
      vi.mocked(authApi.registerUser).mockResolvedValueOnce(mockSuccessResponse);
      
      const { result } = renderHook(() => useAuth());
      
      let success;
      await act(async () => {
        success = await result.current.register('test@example.com', 'password123');
      });
      
      // Verify registerUser was called with correct params including confirmPassword
      expect(authApi.registerUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
      
      expect(success).toBe(true);
      // Registration doesn't redirect
      expect(mockLocation.href).toBe('');
    });

    it('should return false on failed registration', async () => {
      vi.mocked(authApi.registerUser).mockResolvedValueOnce(mockErrorResponse);
      
      const { result } = renderHook(() => useAuth());
      
      let success;
      await act(async () => {
        success = await result.current.register('test@example.com', 'password123');
      });
      
      expect(success).toBe(false);
    });
  });

  describe('recoverPassword function', () => {
    it('should return true on successful password recovery request', async () => {
      vi.mocked(authApi.recoverPassword).mockResolvedValueOnce(mockSuccessResponse);
      
      const { result } = renderHook(() => useAuth());
      
      let success;
      await act(async () => {
        success = await result.current.recoverPassword('test@example.com');
      });
      
      expect(success).toBe(true);
    });
  });

  describe('logout function', () => {
    it('should redirect to login page on successful logout', async () => {
      vi.mocked(authApi.logoutUser).mockResolvedValueOnce(mockSuccessResponse);
      
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.logout();
      });
      
      expect(mockLocation.href).toBe('/auth/login');
    });
  });
}); 
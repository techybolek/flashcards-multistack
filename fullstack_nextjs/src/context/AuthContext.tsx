"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import type { LoginUserCommand, LoginUserResponseDTO, RegisterUserCommand, RecoverPasswordCommand, User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (command: LoginUserCommand) => Promise<LoginUserResponseDTO>;
  register: (command: RegisterUserCommand) => Promise<any>;
  logout: () => Promise<void>;
  recover: (command: RecoverPasswordCommand) => Promise<any>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkUser = async () => {
    try {
      console.log('AuthContext - Calling /api/auth/me from:', window.location.pathname);
      
      // Check if we have a token in localStorage as fallback
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('AuthContext - Including token from localStorage in Authorization header');
      }
      
      const response = await fetch('/api/auth/me', { headers });
      console.log('AuthContext - /api/auth/me response status:', response.status);
      if (response.ok) {
        const { data } = await response.json();
        console.log('AuthContext - User data received:', data);
        setUser(data);
        setIsAuthenticated(true);
      } else {
          console.log('AuthContext - /api/auth/me failed, clearing user');
          setUser(null);
          setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('AuthContext - /api/auth/me error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // Protect routes based on authentication state
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const protectedRoutes = ['/dashboard', '/generate', '/generations'];
      const currentPath = window.location.pathname;
      
      if (protectedRoutes.some(path => currentPath.startsWith(path))) {
        console.log('AuthContext - Redirecting unauthenticated user to login');
        router.push('/auth/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  const login = async (command: LoginUserCommand) => {
    const response = await apiClient.login(command);
    console.log('AuthContext - Login response:', response);
    if (response) {
      setIsAuthenticated(true);
      setUser(response.user);
      console.log('AuthContext - User set as authenticated');
      
      // Refresh the auth check to ensure cookie is working
      setTimeout(() => {
        console.log('AuthContext - Refreshing auth check after login');
        checkUser();
      }, 100);
    }
    return response;
  };

  const register = async (command: RegisterUserCommand) => {
    return await apiClient.register(command);
  };

  const recover = async (command: RecoverPasswordCommand) => {
    return await apiClient.recover(command);
  };

  const logout = async () => {
    await apiClient.logout();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, recover, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
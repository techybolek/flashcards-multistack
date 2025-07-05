import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import type { User, LoginUserCommand, RegisterUserCommand, RecoverPasswordCommand } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (command: LoginUserCommand) => Promise<any>;
  register: (command: RegisterUserCommand) => Promise<any>;
  recover: (command: RecoverPasswordCommand) => Promise<any>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Decode JWT token to get user info (simple decode, in production use a proper JWT library)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.userId,
          email: payload.email,
          name: payload.name || ''
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (command: LoginUserCommand) => {
    try {
      const response = await apiClient.login(command);
      
      // Decode the token to get user info
      const token = response.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      setUser({
        id: payload.userId,
        email: payload.email,
        name: payload.name || ''
      });

      return {
        user: response.user,
        status: 'success',
        redirectTo: '/dashboard'
      };
    } catch (error) {
      throw error;
    }
  };

  const register = async (command: RegisterUserCommand) => {
    try {
      const response = await apiClient.register(command);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const recover = async (command: RecoverPasswordCommand) => {
    try {
      const response = await apiClient.recover(command);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
    } catch (error) {
      // Even if the API call fails, clear local state
      console.error('Logout error:', error);
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const value = {
    user,
    login,
    register,
    recover,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
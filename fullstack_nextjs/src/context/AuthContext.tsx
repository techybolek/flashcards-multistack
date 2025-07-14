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

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const { data } = await response.json();
          setUser(data);
          setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (command: LoginUserCommand) => {
    const response = await apiClient.login(command);
    if (response) {
      setIsAuthenticated(true);
      setUser(response.user);
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
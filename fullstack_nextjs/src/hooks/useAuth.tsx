"use client";

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import type { LoginUserCommand, LoginUserResponseDTO, RegisterUserCommand, RecoverPasswordCommand } from '@/types';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{email: string} | null>(null);
    const router = useRouter();

    const login = async (command: LoginUserCommand): Promise<LoginUserResponseDTO> => {
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

    return { isAuthenticated, user, login, register, recover, logout };
};

import { supabase } from '@/lib/supabase';
import type { 
  LoginUserCommand, 
  RegisterUserCommand, 
  RecoverPasswordCommand,
  LoginUserResponseDTO 
} from '@/types';
import jwt from 'jsonwebtoken';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  async login(command: LoginUserCommand): Promise<LoginUserResponseDTO> {
    const { email, password } = command;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Authentication failed');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: data.user.id, 
        email: data.user.email 
      },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: data.user.id,
        email: data.user.email || '',
      },
    };
  }

  async register(command: RegisterUserCommand): Promise<{ 
    user: any; 
    requiresEmailConfirmation: boolean; 
    message: string; 
  }> {
    const { email, password } = command;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Check if email confirmation is needed
    if (data?.user?.identities?.length === 0) {
      throw new Error('This email is already registered. Please check your email for the confirmation link or try logging in.');
    }

    // Check if email confirmation is required
    if (data?.user?.confirmed_at) {
      return {
        user: data.user,
        requiresEmailConfirmation: false,
        message: 'Registration successful! You can now log in.'
      };
    }

    return {
      user: data.user,
      requiresEmailConfirmation: true,
      message: 'Please check your email for a confirmation link to complete your registration.'
    };
  }

  async recover(command: RecoverPasswordCommand): Promise<{ message: string }> {
    // For now, just return success message
    // TODO: Implement actual password reset functionality
    return {
      message: 'If an account exists with that email, password reset instructions have been sent.'
    };
  }

  async logout(): Promise<{ message: string }> {
    // With JWT tokens, logout is handled client-side by removing the token
    return {
      message: 'Logged out successfully'
    };
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
import { Router } from 'express';
import { z } from 'zod';
import { AuthService } from '@/services/authService';
import type { ApiResponse } from '@/types';

const router = Router();
const authService = new AuthService();

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const recoverSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  console.log('login request begin');
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await authService.login({ email, password });

    const response: ApiResponse = {
      success: true,
      data: {
        ...result,
        redirectTo: '/dashboard'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }

    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    console.log('Starting registration for:', email);

    const result = await authService.register({ email, password });

    const response: ApiResponse = {
      success: true,
      data: {
        user: result.user,
        requiresEmailConfirmation: result.requiresEmailConfirmation,
        message: result.message
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }

    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const result = await authService.logout();

    const response: ApiResponse = {
      success: true,
      data: result
    };

    res.json(response);
  } catch (error) {
    console.error('Logout error:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

// POST /api/auth/recover
router.post('/recover', async (req, res) => {
  try {
    const { email } = recoverSchema.parse(req.body);

    console.log('Password recovery requested for:', email);

    const result = await authService.recover({ email });

    const response: ApiResponse = {
      success: true,
      data: result
    };

    res.json(response);
  } catch (error) {
    console.error('Password recovery error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

export default router;
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/authService';
import type { User } from '@/types';

const authService = new AuthService();

// Extend the Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided'
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Invalid token format'
      });
    }

    // Verify the JWT token
    const decoded = authService.verifyToken(token);
    
    // Add user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name || ''
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid token'
    });
  }
};
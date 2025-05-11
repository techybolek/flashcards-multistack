import { useState } from 'react';
import { useToast } from "@/components/ui";
import { loginUser, registerUser, recoverPassword, logoutUser } from '@/lib/api/auth';

interface AuthHookResult {
  isLoading: boolean;
  // Login functionality
  login: (email: string, password: string) => Promise<boolean>;
  // Register functionality
  register: (email: string, password: string) => Promise<boolean>;
  // Password recovery
  recoverPassword: (email: string) => Promise<boolean>;
  // Logout functionality
  logout: () => Promise<boolean>;
}

export function useAuth(): AuthHookResult {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Handle login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await loginUser({ email, password });
      
      if (response.status === 'error') {
        toast({
          variant: "destructive",
          title: "Login Error",
          description: response.error,
        });
        return false;
      }
      
      toast({
        title: "Login Successful",
        description: "You've been logged in successfully!",
      });
      
      // Redirect to dashboard (or specified redirect)
      setTimeout(() => {
        window.location.href = response.redirectTo || '/dashboard';
      }, 1000);
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const register = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await registerUser({ 
        email, 
        password, 
        confirmPassword: password 
      });
      
      if (response.status === 'error') {
        toast({
          variant: "destructive",
          title: "Registration Error",
          description: response.error,
        });
        return false;
      }
      
      toast({
        title: "Registration Successful",
        description: response.message || "Account created successfully!",
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password recovery
  const recover = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await recoverPassword({ email });
      
      if (response.status === 'error') {
        toast({
          variant: "destructive",
          title: "Password Recovery Error",
          description: response.error,
        });
        return false;
      }
      
      toast({
        title: "Email Sent",
        description: response.message || "If an account exists with that email, password reset instructions have been sent.",
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password Recovery Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await logoutUser();
      
      if (response.status === 'error') {
        toast({
          variant: "destructive",
          title: "Logout Error",
          description: response.error,
        });
        return false;
      }
      
      toast({
        title: "Logged Out",
        description: "You've been logged out successfully.",
      });
      
      // Redirect to login page
      window.location.href = '/auth/login';
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    login,
    register,
    recoverPassword: recover,
    logout
  };
} 
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    setError, 
    formState: { errors } 
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      console.log('Login Page - Final result:', result);
      console.log('Login Page - About to redirect to:', result.redirectTo || '/dashboard');
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      // Store token in localStorage as fallback
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
        console.log('Login Page - Token stored in localStorage');
      }
      
      // Check if cookie is accessible via document.cookie (since httpOnly is false)
      setTimeout(() => {
        console.log('Login Page - Checking document.cookie:', document.cookie);
        const hasCookie = document.cookie.includes('token=');
        console.log('Login Page - Cookie found in document.cookie:', hasCookie);
        
        // Store the result in localStorage for persistence
        localStorage.setItem('debug_cookie_check', JSON.stringify({
          timestamp: new Date().toISOString(),
          documentCookie: document.cookie,
          hasCookie: hasCookie,
          tokenInResponse: !!result.token
        }));
        
        console.log('Login Page - Calling router.push...');
        const redirectPath = result.redirectTo || '/dashboard';
        
        // Use Next.js router instead of window.location.href to avoid full page reload
        console.log('Login Page - Using router.push for redirect to:', redirectPath);
        
        try {
          router.push(redirectPath);
          console.log('Login Page - router.push called successfully');
          
          // Add a timeout to check if navigation actually happened
          setTimeout(() => {
            console.log('Login Page - Current pathname after redirect:', window.location.pathname);
            if (window.location.pathname === '/auth/login') {
              console.log('Login Page - Still on login page, router.push may have failed');
              console.log('Login Page - Trying window.location.href as fallback');
              window.location.href = redirectPath;
            }
          }, 1000);
        } catch (error) {
          console.error('Login Page - router.push failed:', error);
          console.log('Login Page - Falling back to window.location.href');
          window.location.href = redirectPath;
        }
      }, 500); // Increased delay to 500ms
      
    } catch (error) {
      setError('password', { 
        type: 'server', 
        message: error instanceof Error ? error.message : 'Invalid email or password' 
      });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Login failed',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password', { 
                required: 'Password is required' 
              })}
              className="w-full"
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Link href="/auth/recover" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
            <Link href="/auth/register" className="text-sm text-primary hover:underline">
              Don't have an account?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

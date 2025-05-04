import { useState } from 'react';
import { Button, Input, Label, useToast } from "@/components/ui";

interface FormData {
  email: string;
  password: string;
}

interface ApiResponse {
  status: 'success' | 'error';
  error?: string;
  redirectTo?: string;
}

export function LoginForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Important: This ensures cookies are sent with the request
      });

      const data: ApiResponse = await response.json();

      if (data.status === 'error') {
        setErrors({ password: data.error });
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error,
        });
        return;
      }

      // Show success toast
      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
      });

      // Redirect to generate page after a short delay to allow the toast to be seen
      setTimeout(() => {
        window.location.href = data.redirectTo || '/generate';
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          className="w-full"
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          required
          className="w-full"
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <a href="/auth/recover" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Forgot your password?
        </a>
        <a href="/auth/register" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Don't have an account?
        </a>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
} 
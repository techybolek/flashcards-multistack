import { useForm } from 'react-hook-form';
import { Button, Input, Label, useToast } from "@/components/ui";
import { registerUser } from '@/lib/api/auth';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const { toast } = useToast();
  const { 
    register, 
    handleSubmit, 
    setError, 
    watch,
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>();
  
  // Get password value for confirmation validation
  const password = watch('password');
  
  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      });

      if (response.status === 'error') {
        // Set error based on message content
        if (response.error?.toLowerCase().includes('password')) {
          setError('password', { 
            type: 'server', 
            message: response.error 
          });
        } else {
          setError('email', { 
            type: 'server', 
            message: response.error 
          });
        }
        
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
        return;
      }

      // Show success message
      toast({
        title: "Success",
        description: response.message || "Registration successful! Please check your email to verify your account.",
      });

      // Clear form
      reset();

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
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
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Choose a password"
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
          className="w-full"
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          {...register('confirmPassword', { 
            required: 'Please confirm your password',
            validate: (value: string) => value === password || "Passwords don't match"
          })}
          className="w-full"
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="text-center">
        <a href="/auth/login" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Already have an account?
        </a>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
} 
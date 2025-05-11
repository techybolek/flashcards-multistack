import { useForm } from 'react-hook-form';
import { Button, Input, Label, useToast } from "@/components/ui";
import { recoverPassword } from '@/lib/api/auth';
import { useState } from 'react';
import { Loader2 } from "lucide-react";

interface FormData {
  email: string;
}

export function RecoverForm() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    try {
      setIsSuccess(false);
      const response = await recoverPassword(data);

      if (response.status === 'error') {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
        return;
      }

      setIsSuccess(true);
      // Show success message
      toast({
        title: "Email Sent",
        description: response.message || "If an account exists with that email, password reset instructions have been sent.",
      });
    } catch (error) {
      setIsSuccess(false);
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
          className={`w-full ${isSuccess ? 'border-green-500 focus:ring-green-500' : ''}`}
          aria-invalid={errors.email ? 'true' : 'false'}
          disabled={isSubmitting || isSuccess}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="text-center">
        <a href="/auth/login" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Remember your password?
        </a>
      </div>

      <Button 
        type="submit" 
        className={`w-full ${isSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
        disabled={isSubmitting || isSuccess}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isSuccess ? (
          'Email Sent!'
        ) : (
          'Reset Password'
        )}
      </Button>

      {isSuccess && (
        <p className="text-sm text-center text-green-600">
          Check your email for reset instructions
        </p>
      )}
    </form>
  );
} 
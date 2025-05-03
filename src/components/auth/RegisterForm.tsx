import { useState } from 'react';
import { Button, Input, Label } from "@/components/ui";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission will be handled later
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Choose a password"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData(prev => ({ ...prev, password: e.target.value }))}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          required
          className="w-full"
        />
      </div>

      <div className="text-center">
        <a href="/login" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Already have an account?
        </a>
      </div>

      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>
  );
} 
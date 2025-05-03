import { useState } from 'react';
import { Button, Input, Label } from "@/components/ui";

interface FormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData(prev => ({ ...prev, password: e.target.value }))}
          required
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between">
        <a href="/recover" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Forgot your password?
        </a>
        <a href="/register" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Don't have an account?
        </a>
      </div>

      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
} 
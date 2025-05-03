import { useState } from 'react';
import { Button, Input, Label } from "@/components/ui";

export function RecoverForm() {
  const [email, setEmail] = useState('');

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
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div className="text-center">
        <a href="/login" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Remember your password?
        </a>
      </div>

      <Button type="submit" className="w-full">
        Reset Password
      </Button>
    </form>
  );
} 
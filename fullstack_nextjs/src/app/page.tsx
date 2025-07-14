"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">10x Cards</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Generate flashcards from text using AI
      </p>
      
      {isAuthenticated ? (
        <div className="space-x-4">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/generate">Generate Flashcards</Link>
          </Button>
        </div>
      ) : (
        <div className="space-x-4">
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/register">Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
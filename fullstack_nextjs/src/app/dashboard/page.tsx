"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import GenerationsTable from '@/components/GenerationsTable';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);


  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-50 shadow-lg rounded-2xl p-8 mt-10 transition-all">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-gray-600 mt-1 text-lg">Welcome back, {user?.email}</p>
        </div>
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="transition-colors hover:bg-blue-100 hover:text-blue-700"
        >
          Logout
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex flex-col gap-2 animate-in fade-in">
          <p className="text-red-700 font-medium">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setError(null)}
            className="self-end mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      <GenerationsTable onError={handleError} />
    </div>
  );
}

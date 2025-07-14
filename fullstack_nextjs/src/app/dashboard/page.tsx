"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import GenerationsTable from '@/components/GenerationsTable';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Check for debug information from localStorage
    const debugData = localStorage.getItem('debug_cookie_check');
    if (debugData) {
      setDebugInfo(JSON.parse(debugData));
    }
  }, []);

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
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setError(null)}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      {debugInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Information</h3>
          <p className="text-sm text-blue-700">
            <strong>Timestamp:</strong> {debugInfo.timestamp}
          </p>
          <p className="text-sm text-blue-700">
            <strong>Cookie Found:</strong> {debugInfo.hasCookie ? 'Yes' : 'No'}
          </p>
          <p className="text-sm text-blue-700">
            <strong>Document Cookie:</strong> {debugInfo.documentCookie}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDebugInfo(null)}
            className="mt-2"
          >
            Clear Debug
          </Button>
        </div>
      )}

      <GenerationsTable onError={handleError} />
    </div>
  );
}

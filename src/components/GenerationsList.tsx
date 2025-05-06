import { useState, useEffect } from 'react';

interface Generation {
  id: string;
  created_at: string;
  generated_count: number;
}

function formatDate(dateString: string): string {
  try {
    // Supabase returns timestamps in ISO 8601 format: "2024-01-19T12:34:56.789"
    // We can directly create a Date object from this format
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Date not available';
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Date not available';
  }
}

export function GenerationsList() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGenerations();
  }, []);

  const loadGenerations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/generations', {
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load generations');
      }

      const data = await response.json();
      setGenerations(data.generations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load generations');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error loading generations: {error}
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No generations found. Start by generating some flashcards!
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Flashcards
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {generations.map((generation) => (
            <tr 
              key={generation.id}
              onClick={() => window.location.href = `/generations/${generation.id}`}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                #{generation.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(generation.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {generation.generated_count} cards
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
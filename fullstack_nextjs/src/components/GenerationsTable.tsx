"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Generation {
  id: number;
  generation_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  flashcard_count?: number;
}

interface GenerationsTableProps {
  onError?: (error: string) => void;
}

export default function GenerationsTable({ onError }: GenerationsTableProps) {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadGenerations();
  }, []);

  const loadGenerations = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getGenerations();
      
      console.log('API response for generations:', data); // Debug log
      
      // Handle different possible response formats
      if (Array.isArray(data)) {
        setGenerations(data);
      } else if (data && Array.isArray(data.generations)) {
        setGenerations(data.generations);
      } else if (data && Array.isArray(data.data)) {
        setGenerations(data.data);
      } else {
        console.warn('Unexpected API response format:', data);
        setGenerations([]);
        onError?.(`Unexpected response format: ${typeof data}`);
      }
    } catch (err) {
      console.error('Error loading generations:', err); // Debug log
      const errorMessage = err instanceof Error ? err.message : 'Failed to load generations';
      onError?.(errorMessage);
      setGenerations([]); // Ensure we always have an array
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGeneration = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the generation "${name}"? This will also delete all associated flashcards.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await apiClient.deleteGeneration(id);
      setGenerations(generations.filter(g => g.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete generation';
      onError?.(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading generations...</p>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          You haven't generated any flashcards yet.
        </p>
        <Button asChild>
          <Link href="/generate">Generate Your First Flashcards</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Generations</h2>
        <Button asChild className="transition-colors hover:bg-blue-100 hover:text-blue-700">
          <Link href="/generate">Generate New Flashcards</Link>
        </Button>
      </div>
      
      <div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-x-auto transition-all">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-lg font-semibold">Name</TableHead>
              <TableHead className="text-lg font-semibold">Created</TableHead>
              <TableHead className="text-lg font-semibold">Flashcards</TableHead>
              <TableHead className="text-right text-lg font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(generations || []).map((generation) => (
              <TableRow key={generation.id} className="hover:bg-blue-50 transition-colors">
                <TableCell>
                  <Link 
                    href={`/generations/${generation.id}`}
                    className="font-medium hover:underline text-blue-700 transition-colors"
                  >
                    {generation.generation_name}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-500">
                  {new Date(generation.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-700">
                    {generation.flashcard_count || 0} cards
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="transition-colors hover:bg-blue-100 hover:text-blue-700"
                    >
                      <Link href={`/generations/${generation.id}`}>
                        Manage
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGeneration(generation.id, generation.generation_name)}
                      disabled={deletingId === generation.id}
                      className="transition-colors hover:bg-red-100 hover:text-red-700"
                    >
                      {deletingId === generation.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import type { FlashcardDTO } from '@/types';

interface Generation {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface GenerationData {
  generation: Generation | null;
  flashcards: FlashcardDTO[];
  isLoading: boolean;
  error: string | null;
  timestamps: {
    created: string;
    updated: string;
  };
}

export function useGenerationData(generationId: number | null) {
  const [data, setData] = useState<GenerationData>({
    generation: null,
    flashcards: [],
    isLoading: true,
    error: null,
    timestamps: {
      created: '',
      updated: ''
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    if (generationId === null) return;
    loadGenerationData(generationId);
  }, [generationId]);

  const loadGenerationData = async (id: number) => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const generationData = await apiClient.getGeneration(id);
      
      setData({
        generation: generationData,
        flashcards: generationData.flashcards || [],
        isLoading: false,
        error: null,
        timestamps: {
          created: generationData.created_at,
          updated: generationData.updated_at
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load generation data';
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const refreshData = () => {
    if (generationId) {
      loadGenerationData(generationId);
    }
  };

  return {
    ...data,
    refreshData
  };
} 
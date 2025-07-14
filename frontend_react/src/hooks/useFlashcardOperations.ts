import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import type { CreateFlashcardCommand, UpdateFlashcardCommand } from '@/types';

export type FlashcardSource = 'manual' | 'ai-full' | 'ai-edited';

interface UseFlashcardOperationsProps {
  onSuccess?: () => void;
}

export function useFlashcardOperations({ onSuccess }: UseFlashcardOperationsProps = {}) {
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleEdit = async (flashcardId: number, command: UpdateFlashcardCommand) => {
    try {
      setSavingIds(prev => new Set([...prev, flashcardId]));
      await apiClient.updateFlashcard(flashcardId, command);
      
      toast({
        title: "Success",
        description: "Flashcard updated successfully.",
      });
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update flashcard';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      throw error;
    } finally {
      setSavingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(flashcardId);
        return newSet;
      });
    }
  };

  const handleDelete = async (flashcardId: number, name: string) => {
    if (!confirm(`Are you sure you want to delete this flashcard "${name}"?`)) {
      return;
    }

    try {
      setSavingIds(prev => new Set([...prev, flashcardId]));
      await apiClient.deleteFlashcard(flashcardId);
      
      toast({
        title: "Success",
        description: "Flashcard deleted successfully.",
      });
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete flashcard';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      throw error;
    } finally {
      setSavingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(flashcardId);
        return newSet;
      });
    }
  };

  const handleAdd = async (command: CreateFlashcardCommand) => {
    try {
      await apiClient.createFlashcard(command);
      
      toast({
        title: "Success",
        description: "Flashcard created successfully.",
      });
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create flashcard';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      throw error;
    }
  };

  const getSourceBadgeVariant = (source: string) => {
    switch (source) {
      case 'manual': return 'default';
      case 'ai-full': return 'secondary';
      case 'ai-edited': return 'outline';
      default: return 'default';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'manual': return 'Manual';
      case 'ai-full': return 'AI Generated';
      case 'ai-edited': return 'AI Edited';
      default: return source;
    }
  };

  return {
    handleEdit,
    handleDelete,
    handleAdd,
    getSourceBadgeVariant,
    getSourceLabel,
    savingIds
  };
} 
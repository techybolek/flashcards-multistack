import { useState, useCallback } from 'react';
import { FlashcardProposalDTO, GenerationStatsDTO, CreateFlashcardCommand } from '../../../types';

// Type for proposal status
type ProposalStatus = 'pending' | 'accepted' | 'edited' | 'rejected';

// Type for edited flashcard
interface EditedFlashcard {
  index: number;
  front: string;
  back: string;
}

export function useFlashcardGeneration() {
  // State for form
  const [text, setText] = useState<string>('');
  const [isTextValid, setIsTextValid] = useState<boolean>(false);
  const [textError, setTextError] = useState<string | null>(null);

  // State for generation
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // State for proposals
  const [proposals, setProposals] = useState<FlashcardProposalDTO[]>([]);
  const [proposalStatuses, setProposalStatuses] = useState<Record<number, ProposalStatus>>({});
  const [editedFlashcards, setEditedFlashcards] = useState<EditedFlashcard[]>([]);

  // State for stats and generation ID
  const [stats, setStats] = useState<GenerationStatsDTO | null>(null);
  const [generationId, setGenerationId] = useState<number | null>(null);
  const [generationName, setGenerationName] = useState<string | null>(null);

  // Validate text
  const validateText = useCallback((text: string) => {
    if (text.length < 1000) {
      setIsTextValid(false);
      setTextError('Text must be at least 1000 characters long');
      return false;
    }
    
    if (text.length > 10000) {
      setIsTextValid(false);
      setTextError('Text cannot exceed 10000 characters');
      return false;
    }
    
    setIsTextValid(true);
    setTextError(null);
    return true;
  }, []);

  // Handle text change
  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
    validateText(newText);
  }, [validateText]);

  // Generate flashcards
  const handleGenerate = useCallback(async () => {
    if (!isTextValid) return;
    
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'An error occurred while generating flashcards');
      }
      
      const result = await response.json();
      
      setProposals(result.flashcardProposals);
      setStats(result.stats);
      setGenerationId(result.generation_id);
      setGenerationName(result.generation_name);
      
      // Initialize statuses for all proposals
      const initialStatuses: Record<number, ProposalStatus> = {};
      result.flashcardProposals.forEach((_: FlashcardProposalDTO, index: number) => {
        initialStatuses[index] = 'pending';
      });
      setProposalStatuses(initialStatuses);
      
      // Clear edited flashcards
      setEditedFlashcards([]);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, [text, isTextValid]);

  // Accept a flashcard
  const handleAccept = useCallback((index: number) => {
    setProposalStatuses(prev => ({
      ...prev,
      [index]: 'accepted'
    }));
  }, []);

  // Edit a flashcard
  const handleEdit = useCallback((index: number, front: string, back: string) => {
    // Update the edited flashcard
    setEditedFlashcards(prev => {
      const existingIndex = prev.findIndex(item => item.index === index);
      
      if (existingIndex >= 0) {
        // Update existing edited flashcard
        const updated = [...prev];
        updated[existingIndex] = { index, front, back };
        return updated;
      } else {
        // Add new edited flashcard
        return [...prev, { index, front, back }];
      }
    });
    
    // Update the status
    setProposalStatuses(prev => ({
      ...prev,
      [index]: 'edited'
    }));
  }, []);

  // Reject a flashcard
  const handleReject = useCallback((index: number) => {
    setProposalStatuses(prev => ({
      ...prev,
      [index]: 'rejected'
    }));
  }, []);

  // Reset a flashcard to pending state
  const handleReset = useCallback((index: number) => {
    // Reset the status to pending
    setProposalStatuses(prev => ({
      ...prev,
      [index]: 'pending'
    }));

    // Remove any edited content for this flashcard
    setEditedFlashcards(prev => prev.filter(item => item.index !== index));
  }, []);

  // Save accepted flashcards
  const handleSaveAccepted = useCallback(async () => {
    const acceptedIndices = Object.entries(proposalStatuses)
      .filter(([_, status]) => status === 'accepted' || status === 'edited')
      .map(([index]) => parseInt(index));
    
    if (acceptedIndices.length === 0) return;
    
    const flashcardsToSave: CreateFlashcardCommand[] = acceptedIndices.map(index => {
      // Check if the flashcard was edited
      const editedFlashcard = editedFlashcards.find(item => item.index === index);
      
      if (editedFlashcard) {
        return {
          front: editedFlashcard.front,
          back: editedFlashcard.back,
          source: 'ai-edited',
          generation_id: generationId
        };
      } else {
        return {
          front: proposals[index].front,
          back: proposals[index].back,
          source: 'ai-full',
          generation_id: generationId
        };
      }
    });
    
    try {
      const response = await fetch('/api/flashcards/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flashcardsToSave),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'An error occurred while saving flashcards');
      }
      
      // Clear the proposals after successful save
      setProposals([]);
      setProposalStatuses({});
      setEditedFlashcards([]);
      setStats(null);
      setGenerationId(null);
      
      return true;
    } catch (error) {
      console.error('Error saving flashcards:', error);
      return false;
    }
  }, [proposals, proposalStatuses, editedFlashcards, generationId]);

  // Save all flashcards
  const handleSaveAll = useCallback(async () => {
    if (proposals.length === 0) return;
    
    const flashcardsToSave: CreateFlashcardCommand[] = proposals.map((proposal, index) => {
      // Check if the flashcard was edited
      const editedFlashcard = editedFlashcards.find(item => item.index === index);
      
      if (editedFlashcard) {
        return {
          front: editedFlashcard.front,
          back: editedFlashcard.back,
          source: 'ai-edited',
          generation_id: generationId
        };
      } else {
        return {
          front: proposal.front,
          back: proposal.back,
          source: 'ai-full',
          generation_id: generationId
        };
      }
    });
    
    try {
      const response = await fetch('/api/flashcards/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flashcardsToSave),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'An error occurred while saving flashcards');
      }
      
      // Clear the proposals after successful save
      setProposals([]);
      setProposalStatuses({});
      setEditedFlashcards([]);
      setStats(null);
      setGenerationId(null);
      
      return true;
    } catch (error) {
      console.error('Error saving flashcards:', error);
      return false;
    }
  }, [proposals, editedFlashcards, generationId]);

  return {
    // Form state
    text,
    setText: handleTextChange,
    isTextValid,
    textError,
    
    // Generation state
    isGenerating,
    generationError,
    
    // Proposals state
    proposals,
    proposalStatuses,
    
    // Stats and generation ID
    stats,
    generationId,
    generationName,
    
    // Handlers
    handleGenerate,
    handleAccept,
    handleEdit,
    handleReject,
    handleReset,
    handleSaveAccepted,
    handleSaveAll
  };
} 
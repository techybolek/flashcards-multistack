import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGenerationData } from '@/hooks/useGenerationData';
import { useFlashcardOperations } from '@/hooks/useFlashcardOperations';
import { GenerationHeader } from '@/components/generation/GenerationHeader';
import { NewFlashcardForm } from '@/components/generation/NewFlashcardForm';
import { FlashcardList } from '@/components/generation/FlashcardList';
import type { CreateFlashcardCommand } from '@/types';

export default function GenerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  
  const {
    generation,
    flashcards,
    isLoading,
    error,
    refreshData
  } = useGenerationData(id ? parseInt(id) : null);

  const {
    handleEdit,
    handleDelete,
    handleAdd,
    savingIds
  } = useFlashcardOperations({
    onSuccess: refreshData
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !generation) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-red-500">{error || 'Generation not found.'}</p>
      </div>
    );
  }

  const handleAddSubmit = async (command: CreateFlashcardCommand) => {
    try {
      setIsAddingCard(true);
      await handleAdd(command);
      setShowAddForm(false);
    } finally {
      setIsAddingCard(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <GenerationHeader
        name={generation.name}
        flashcardCount={flashcards.length}
        createdAt={generation.created_at}
        onAddClick={() => setShowAddForm(true)}
      />

      {showAddForm && (
        <NewFlashcardForm
          generationId={generation.id}
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
          isSubmitting={isAddingCard}
        />
      )}

      <FlashcardList
        flashcards={flashcards}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddClick={() => setShowAddForm(true)}
        savingIds={savingIds}
      />
    </div>
  );
}
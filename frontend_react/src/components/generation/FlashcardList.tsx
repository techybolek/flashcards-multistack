import { Button } from '@/components/ui/button';
import { FlashcardCard } from './FlashcardCard';
import type { FlashcardDTO, UpdateFlashcardCommand } from '@/types';

interface FlashcardListProps {
  flashcards: FlashcardDTO[];
  onEdit: (id: number, command: UpdateFlashcardCommand) => Promise<void>;
  onDelete: (id: number, name: string) => Promise<void>;
  onAddClick: () => void;
  savingIds: Set<number>;
}

export function FlashcardList({
  flashcards,
  onEdit,
  onDelete,
  onAddClick,
  savingIds
}: FlashcardListProps) {
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No flashcards found for this generation.</p>
        <Button onClick={onAddClick}>
          Add Your First Flashcard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flashcards.map((flashcard, index) => (
        <FlashcardCard
          key={flashcard.id}
          flashcard={flashcard}
          index={index}
          onEdit={onEdit}
          onDelete={(id) => onDelete(id, flashcard.front)}
          isSaving={savingIds.has(flashcard.id)}
        />
      ))}
    </div>
  );
} 
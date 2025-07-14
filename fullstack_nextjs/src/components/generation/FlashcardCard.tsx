"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { FlashcardDTO, UpdateFlashcardCommand } from '@/types';
import { useFlashcardOperations } from '@/hooks/useFlashcardOperations';

interface FlashcardCardProps {
  flashcard: FlashcardDTO;
  index: number;
  onEdit: (id: number, command: UpdateFlashcardCommand) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isSaving?: boolean;
}

export function FlashcardCard({
  flashcard,
  index,
  onEdit,
  onDelete,
  isSaving = false
}: FlashcardCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ front: flashcard.front, back: flashcard.back });
  const { getSourceBadgeVariant, getSourceLabel } = useFlashcardOperations({});

  const handleEditSubmit = async () => {
    if (!editForm.front.trim() || !editForm.back.trim()) return;

    const command: UpdateFlashcardCommand = {
      front: editForm.front,
      back: editForm.back,
      source: flashcard.source === 'ai-full' ? 'ai-edited' : flashcard.source
    };

    await onEdit(flashcard.id, command);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditForm({ front: flashcard.front, back: flashcard.back });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Flashcard {index + 1}</h3>
            <Badge variant={getSourceBadgeVariant(flashcard.source)}>
              {getSourceLabel(flashcard.source)}
            </Badge>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleEditSubmit}
                  disabled={isSaving}
                  size="sm"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleEditCancel}
                  disabled={isSaving}
                  size="sm"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  size="sm"
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onDelete(flashcard.id)}
                  size="sm"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Question (Front)</h4>
            {isEditing ? (
              <Textarea
                value={editForm.front}
                onChange={(e) => setEditForm(prev => ({ ...prev, front: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            ) : (
              <div className="border rounded p-3 bg-muted/50 min-h-[100px]">
                <p className="whitespace-pre-wrap">{flashcard.front}</p>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Answer (Back)</h4>
            {isEditing ? (
              <Textarea
                value={editForm.back}
                onChange={(e) => setEditForm(prev => ({ ...prev, back: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            ) : (
              <div className="border rounded p-3 bg-muted/50 min-h-[100px]">
                <p className="whitespace-pre-wrap">{flashcard.back}</p>
              </div>
            )}
          </div>
        </div>
        {!isEditing && (
          <div className="mt-4 text-xs text-muted-foreground">
            Created: {new Date(flashcard.created_at).toLocaleDateString()}
            {flashcard.updated_at !== flashcard.created_at && (
              <span> • Updated: {new Date(flashcard.updated_at).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 

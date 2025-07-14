"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CreateFlashcardCommand } from '@/types';

interface NewFlashcardFormProps {
  generationId: number;
  onSubmit: (command: CreateFlashcardCommand) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function NewFlashcardForm({ generationId, onSubmit, onCancel, isSubmitting = false }: NewFlashcardFormProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    const command: CreateFlashcardCommand = {
      front: front.trim(),
      back: back.trim(),
      source: 'manual',
      generation_id: generationId,
      display_order: 1 // This will be overridden by GenerationDetailPage
    };

    onSubmit(command);
    setFront('');
    setBack('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Flashcard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-front">Question (Front)</Label>
              <Textarea
                id="new-front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            <div>
              <Label htmlFor="new-back">Answer (Back)</Label>
              <Textarea
                id="new-back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !front.trim() || !back.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add Flashcard'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
} 

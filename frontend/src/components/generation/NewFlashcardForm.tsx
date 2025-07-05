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

export function NewFlashcardForm({
  generationId,
  onSubmit,
  onCancel,
  isSubmitting = false
}: NewFlashcardFormProps) {
  const [form, setForm] = useState({ front: '', back: '' });

  const handleSubmit = async () => {
    if (!form.front.trim() || !form.back.trim()) return;

    const command: CreateFlashcardCommand = {
      front: form.front,
      back: form.back,
      source: 'manual',
      generation_id: generationId
    };

    await onSubmit(command);
    setForm({ front: '', back: '' }); // Reset form after successful submission
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Flashcard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-front">Question (Front)</Label>
            <Textarea
              id="new-front"
              value={form.front}
              onChange={(e) => setForm(prev => ({ ...prev, front: e.target.value }))}
              rows={4}
              className="resize-none"
              placeholder="Enter the question..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-back">Answer (Back)</Label>
            <Textarea
              id="new-back"
              value={form.back}
              onChange={(e) => setForm(prev => ({ ...prev, back: e.target.value }))}
              rows={4}
              className="resize-none"
              placeholder="Enter the answer..."
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !form.front.trim() || !form.back.trim()}
          >
            {isSubmitting ? 'Adding...' : 'Add Flashcard'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
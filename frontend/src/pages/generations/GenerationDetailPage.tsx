import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import type { FlashcardDTO, UpdateFlashcardCommand, CreateFlashcardCommand } from '@/types';

interface Generation {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface EditingFlashcard {
  id: number;
  front: string;
  back: string;
}

export default function GenerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCards, setEditingCards] = useState<Set<number>>(new Set());
  const [editForms, setEditForms] = useState<Record<number, EditingFlashcard>>({});
  const [savingCards, setSavingCards] = useState<Set<number>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCardForm, setNewCardForm] = useState({ front: '', back: '' });
  const [addingCard, setAddingCard] = useState(false);

  useEffect(() => {
    if (id) {
      loadGenerationData(parseInt(id));
    }
  }, [id]);

  const loadGenerationData = async (generationId: number) => {
    try {
      setIsLoading(true);
      
      const [flashcardsData, generationData] = await Promise.all([
        apiClient.getGenerationFlashcards(generationId),
        apiClient.getGeneration(generationId)
      ]);
      
      setFlashcards(flashcardsData);
      setGeneration(generationData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load generation data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStart = (flashcard: FlashcardDTO) => {
    setEditingCards(prev => new Set([...prev, flashcard.id]));
    setEditForms(prev => ({
      ...prev,
      [flashcard.id]: {
        id: flashcard.id,
        front: flashcard.front,
        back: flashcard.back
      }
    }));
  };

  const handleEditCancel = (flashcardId: number) => {
    setEditingCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(flashcardId);
      return newSet;
    });
    setEditForms(prev => {
      const newForms = { ...prev };
      delete newForms[flashcardId];
      return newForms;
    });
  };

  const handleEditSave = async (flashcardId: number) => {
    const editForm = editForms[flashcardId];
    if (!editForm) return;

    try {
      setSavingCards(prev => new Set([...prev, flashcardId]));
      
      const originalFlashcard = flashcards.find(f => f.id === flashcardId);
      if (!originalFlashcard) return;

      const command: UpdateFlashcardCommand = {
        front: editForm.front,
        back: editForm.back,
        source: originalFlashcard.source === 'ai-full' ? 'ai-edited' : 'manual'
      };

      const updatedFlashcard = await apiClient.updateFlashcard(flashcardId, command);
      
      setFlashcards(prev => prev.map(f => 
        f.id === flashcardId ? updatedFlashcard : f
      ));
      
      handleEditCancel(flashcardId);
      
      toast({
        title: "Success",
        description: "Flashcard updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update flashcard.",
      });
    } finally {
      setSavingCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(flashcardId);
        return newSet;
      });
    }
  };

  const handleDelete = async (flashcardId: number) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;

    try {
      await apiClient.deleteFlashcard(flashcardId);
      setFlashcards(prev => prev.filter(f => f.id !== flashcardId));
      
      toast({
        title: "Success",
        description: "Flashcard deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete flashcard.",
      });
    }
  };

  const handleAddCard = async () => {
    if (!newCardForm.front.trim() || !newCardForm.back.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Both front and back content are required.",
      });
      return;
    }

    try {
      setAddingCard(true);
      
      const command: CreateFlashcardCommand = {
        front: newCardForm.front,
        back: newCardForm.back,
        source: 'manual',
        generation_id: generation?.id || null
      };

      const newFlashcard = await apiClient.createFlashcard(command);
      setFlashcards(prev => [...prev, newFlashcard]);
      setNewCardForm({ front: '', back: '' });
      setShowAddForm(false);
      
      toast({
        title: "Success",
        description: "Flashcard added successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add flashcard.",
      });
    } finally {
      setAddingCard(false);
    }
  };

  const updateEditForm = (flashcardId: number, field: 'front' | 'back', value: string) => {
    setEditForms(prev => ({
      ...prev,
      [flashcardId]: {
        ...prev[flashcardId],
        [field]: value
      }
    }));
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

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!generation) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-red-500">Generation not found.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{generation.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-muted-foreground">
              {flashcards.length} flashcard{flashcards.length !== 1 ? 's' : ''}
            </p>
            <span className="text-sm text-muted-foreground">
              Created: {new Date(generation.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            variant="outline"
          >
            Add Flashcard
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      {showAddForm && (
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
                  value={newCardForm.front}
                  onChange={(e) => setNewCardForm({ ...newCardForm, front: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-back">Answer (Back)</Label>
                <Textarea
                  id="new-back"
                  value={newCardForm.back}
                  onChange={(e) => setNewCardForm({ ...newCardForm, back: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddCard} disabled={addingCard}>
                {addingCard ? 'Adding...' : 'Add Flashcard'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {flashcards.map((flashcard, index) => {
          const isEditing = editingCards.has(flashcard.id);
          const editForm = editForms[flashcard.id];
          const isSaving = savingCards.has(flashcard.id);

          return (
            <Card key={flashcard.id}>
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
                          onClick={() => handleEditSave(flashcard.id)}
                          disabled={isSaving}
                          size="sm"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleEditCancel(flashcard.id)}
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
                          onClick={() => handleEditStart(flashcard)}
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleDelete(flashcard.id)}
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
                        value={editForm?.front || ''}
                        onChange={(e) => updateEditForm(flashcard.id, 'front', e.target.value)}
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
                        value={editForm?.back || ''}
                        onChange={(e) => updateEditForm(flashcard.id, 'back', e.target.value)}
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
        })}
      </div>

      {flashcards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No flashcards found for this generation.</p>
          <Button onClick={() => setShowAddForm(true)}>
            Add Your First Flashcard
          </Button>
        </div>
      )}
    </div>
  );
}
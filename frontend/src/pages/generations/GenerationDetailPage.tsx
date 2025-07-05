import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import type { FlashcardDTO } from '@/types';

export default function GenerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!id) return;
      
      try {
        const data = await apiClient.getGenerationFlashcards(parseInt(id));
        setFlashcards(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load flashcards.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, [id, toast]);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Generated Flashcards</h1>
          <p className="text-muted-foreground">
            {flashcards.length} flashcards generated
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {flashcards.map((flashcard, index) => (
          <div key={flashcard.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Flashcard {index + 1}</h3>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                {flashcard.source}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Front</h4>
                <p className="border rounded p-3 bg-muted/50">{flashcard.front}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Back</h4>
                <p className="border rounded p-3 bg-muted/50">{flashcard.back}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {flashcards.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No flashcards found for this generation.</p>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export default function GeneratePage() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.length < 1000) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Text must be at least 1000 characters long.",
      });
      return;
    }

    if (text.length > 10000) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Text cannot exceed 10000 characters.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiClient.generateFlashcards({ text });
      
      toast({
        title: "Success",
        description: `Generated ${result.stats.generated_count} flashcards!`,
      });
      
      navigate(`/generations/${result.generation_id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate flashcards. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Generate Flashcards</h1>
        <p className="text-muted-foreground">
          Paste your text below and we'll create flashcards for you using AI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="text">Your Text</Label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here (minimum 1000 characters, maximum 10000)..."
            className="w-full min-h-[400px] p-3 border rounded-md resize-y"
            disabled={isLoading}
          />
          <div className="text-sm text-muted-foreground">
            Characters: {text.length} / 10000 (minimum: 1000)
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading || text.length < 1000}>
            {isLoading ? 'Generating...' : 'Generate Flashcards'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
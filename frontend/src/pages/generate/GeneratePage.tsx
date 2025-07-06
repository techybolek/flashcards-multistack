import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface FlashcardProposal {
  front: string;
  back: string;
  approved: boolean;
  edited: boolean;
}

export default function GeneratePage() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [proposals, setProposals] = useState<FlashcardProposal[]>([]);
  const [generationId, setGenerationId] = useState<number | null>(null);
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
      
      // Transform the proposals to include approval state
      const proposalsWithState = result.flashcardProposals.map(proposal => ({
        ...proposal,
        approved: true, // Default to approved
        edited: false
      }));
      
      setProposals(proposalsWithState);
      setGenerationId(result.generation_id);
      setStep('review');
      
      toast({
        title: "Success",
        description: `Generated ${result.stats.generated_count} flashcards! Please review them.`,
      });
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

  const handleSave = async () => {
    if (!generationId) return;

    setIsLoading(true);
    try {
      const approvedCards = proposals
        .filter(p => p.approved)
        .map(p => ({
          front: p.front,
          back: p.back,
          source: p.edited ? 'ai-edited' as const : 'ai-full' as const
        }));

      await apiClient.updateGeneration(generationId, { flashcards: approvedCards });
      
      toast({
        title: "Success",
        description: "Flashcards saved successfully!",
      });
      
      navigate(`/generations/${generationId}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save flashcards. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProposalUpdate = (index: number, updates: Partial<FlashcardProposal>) => {
    setProposals(current => 
      current.map((proposal, i) => 
        i === index ? { ...proposal, ...updates } : proposal
      )
    );
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    setProposals(current =>
      current.map(proposal => ({
        ...proposal,
        approved: action === 'approve'
      }))
    );
  };

  if (step === 'review') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Review Flashcards</h1>
          <p className="text-muted-foreground">
            Review and edit the generated flashcards before saving
          </p>
        </div>

        <div className="mb-4 flex gap-4">
          <Button onClick={() => handleBulkAction('approve')} variant="outline">
            Approve All
          </Button>
          <Button onClick={() => handleBulkAction('reject')} variant="outline">
            Reject All
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          {proposals.map((proposal, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={proposal.approved}
                    onChange={(e) => handleProposalUpdate(index, { approved: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">Card {index + 1}</span>
                </div>
              </div>
              <div className="space-y-2">
                <textarea
                  value={proposal.front}
                  onChange={(e) => handleProposalUpdate(index, { front: e.target.value, edited: true })}
                  className="w-full p-2 border rounded"
                  placeholder="Front side"
                />
                <textarea
                  value={proposal.back}
                  onChange={(e) => handleProposalUpdate(index, { back: e.target.value, edited: true })}
                  className="w-full p-2 border rounded"
                  placeholder="Back side"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Approved Cards'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setStep('input')}>
            Back to Input
          </Button>
        </div>
      </div>
    );
  }

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
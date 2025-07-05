import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface GenerationHeaderProps {
  name: string;
  flashcardCount: number;
  createdAt: string;
  onAddClick: () => void;
}

export function GenerationHeader({
  name,
  flashcardCount,
  createdAt,
  onAddClick
}: GenerationHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-muted-foreground">
            {flashcardCount} flashcard{flashcardCount !== 1 ? 's' : ''}
          </p>
          <span className="text-sm text-muted-foreground">
            Created: {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onAddClick}
          variant="outline"
        >
          Add Flashcard
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
} 
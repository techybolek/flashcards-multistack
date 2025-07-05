import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Generate Flashcards</h2>
          <p className="text-muted-foreground mb-4">
            Create new flashcards from your text using AI
          </p>
          <Button asChild>
            <Link to="/generate">Start Generating</Link>
          </Button>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Previous Generations</h2>
          <p className="text-muted-foreground mb-4">
            View and manage your previous flashcard generations
          </p>
          <Button variant="outline" asChild>
            <Link to="/generations">View History</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
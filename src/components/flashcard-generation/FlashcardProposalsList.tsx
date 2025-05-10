import { FlashcardProposalDTO } from '../../types';
import FlashcardProposalItem from './FlashcardProposalItem';
import EmptyState from './EmptyState';

// Type for proposal status
type ProposalStatus = 'pending' | 'accepted' | 'edited' | 'rejected';

interface FlashcardProposalsListProps {
  proposals: FlashcardProposalDTO[];
  proposalStatuses: Record<number, ProposalStatus>;
  onAccept: (index: number) => void;
  onEdit: (index: number, front: string, back: string) => void;
  onReject: (index: number) => void;
  onReset: (index: number) => void;
}

export default function FlashcardProposalsList({
  proposals,
  proposalStatuses,
  onAccept,
  onEdit,
  onReject,
  onReset
}: FlashcardProposalsListProps) {
  if (proposals.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Generated Flashcards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proposals.map((proposal, index) => (
          <FlashcardProposalItem
            key={index}
            proposal={proposal}
            index={index}
            status={proposalStatuses[index] || 'pending'}
            onAccept={() => onAccept(index)}
            onEdit={(front, back) => onEdit(index, front, back)}
            onReject={() => onReject(index)}
            onReset={() => onReset(index)}
          />
        ))}
      </div>
    </div>
  );
} 
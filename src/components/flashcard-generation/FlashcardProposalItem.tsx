import { useState } from 'react';
import { FlashcardProposalDTO } from '../../types';
import FlashcardContent from './FlashcardContent';
import ProposalActionButtons from './ProposalActionButtons';
import EditForm from './EditForm';
// Type for proposal status
type ProposalStatus = 'pending' | 'accepted' | 'edited' | 'rejected';

interface FlashcardProposalItemProps {
  proposal: FlashcardProposalDTO;
  index: number;
  status: ProposalStatus;
  onAccept: () => void;
  onEdit: (front: string, back: string) => void;
  onReject: () => void;
  onReset: () => void;
}

export default function FlashcardProposalItem({
  proposal,
  index,
  status,
  onAccept,
  onEdit,
  onReject,
  onReset
}: FlashcardProposalItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFront, setEditedFront] = useState(proposal.front);
  const [editedBack, setEditedBack] = useState(proposal.back);
  const [frontError, setFrontError] = useState<string | null>(null);
  const [backError, setBackError] = useState<string | null>(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedFront(proposal.front);
    setEditedBack(proposal.back);
    setFrontError(null);
    setBackError(null);
  };

  const validateFields = () => {
    let isValid = true;
    
    if (editedFront.length > 200) {
      setFrontError('Front text cannot exceed 200 characters');
      isValid = false;
    } else {
      setFrontError(null);
    }
    
    if (editedBack.length > 500) {
      setBackError('Back text cannot exceed 500 characters');
      isValid = false;
    } else {
      setBackError(null);
    }
    
    return isValid;
  };

  const handleSaveEdit = () => {
    if (!validateFields()) return;
    
    onEdit(editedFront, editedBack);
    setIsEditing(false);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'accepted':
        return 'border-green-500 bg-green-50';
      case 'edited':
        return 'border-blue-500 bg-blue-50';
      case 'rejected':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      {isEditing ? (
        <EditForm
          front={editedFront}
          back={editedBack}
          onFrontChange={setEditedFront}
          onBackChange={setEditedBack}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          frontError={frontError}
          backError={backError}
        />
      ) : (
        <>
          <FlashcardContent front={proposal.front} back={proposal.back} />
          <ProposalActionButtons
            status={status}
            onAccept={onAccept}
            onEdit={handleEditClick}
            onReject={onReject}
            onReset={onReset}
          />
        </>
      )}
    </div>
  );
} 
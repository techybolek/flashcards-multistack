interface ProposalActionButtonsProps {
  status: 'pending' | 'accepted' | 'edited' | 'rejected';
  onAccept: () => void;
  onEdit: () => void;
  onReject: () => void;
}

export default function ProposalActionButtons({
  status,
  onAccept,
  onEdit,
  onReject
}: ProposalActionButtonsProps) {
  const isDisabled = status !== 'pending';
  
  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={onAccept}
        disabled={isDisabled}
        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Accept
      </button>
      <button
        onClick={onEdit}
        disabled={isDisabled}
        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Edit
      </button>
      <button
        onClick={onReject}
        disabled={isDisabled}
        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reject
      </button>
    </div>
  );
} 
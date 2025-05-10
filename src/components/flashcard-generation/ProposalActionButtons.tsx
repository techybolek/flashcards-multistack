interface ProposalActionButtonsProps {
  status: 'pending' | 'accepted' | 'edited' | 'rejected';
  onAccept: () => void;
  onEdit: () => void;
  onReject: () => void;
  onReset: () => void;
}

export default function ProposalActionButtons({
  status,
  onAccept,
  onEdit,
  onReject,
  onReset
}: ProposalActionButtonsProps) {
  const isDisabled = status !== 'pending';
  const showReset = status !== 'pending';
  
  return (
    <div className="flex gap-2 mt-4">
      {!showReset ? (
        <>
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
        </>
      ) : (
        <button
          onClick={onReset}
          className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center gap-1"
          title="Reset this flashcard to make it available for actions again"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>
      )}
    </div>
  );
} 
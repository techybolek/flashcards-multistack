interface ActionButtonsProps {
  hasAccepted: boolean;
  hasProposals: boolean;
  onSaveAccepted: () => Promise<boolean | undefined>;
  onSaveAll: () => Promise<boolean | undefined>;
}

export default function ActionButtons({ 
  hasAccepted,
  hasProposals,
  onSaveAccepted,
  onSaveAll
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={onSaveAccepted}
        disabled={!hasAccepted}
        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Accepted
      </button>
      <button
        onClick={onSaveAll}
        disabled={!hasProposals}
        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save All
      </button>
    </div>
  );
} 
import { useState, useEffect } from 'react';

interface EditFormProps {
  front: string;
  back: string;
  onFrontChange: (value: string) => void;
  onBackChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  frontError?: string | null;
  backError?: string | null;
}

export default function EditForm({
  front,
  back,
  onFrontChange,
  onBackChange,
  onSave,
  onCancel,
  frontError,
  backError
}: EditFormProps) {
  const [localFront, setLocalFront] = useState(front);
  const [localBack, setLocalBack] = useState(back);

  useEffect(() => {
    setLocalFront(front);
    setLocalBack(back);
  }, [front, back]);

  const handleFrontChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalFront(e.target.value);
    onFrontChange(e.target.value);
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalBack(e.target.value);
    onBackChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-1">
          Front
        </label>
        <textarea
          id="front"
          value={localFront}
          onChange={handleFrontChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            frontError ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={3}
          placeholder="Enter the front of the flashcard"
        />
        {frontError && <p className="mt-1 text-sm text-red-600">{frontError}</p>}
      </div>

      <div>
        <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-1">
          Back
        </label>
        <textarea
          id="back"
          value={localBack}
          onChange={handleBackChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            backError ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={5}
          placeholder="Enter the back of the flashcard"
        />
        {backError && <p className="mt-1 text-sm text-red-600">{backError}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </div>
  );
} 
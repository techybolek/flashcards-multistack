import { useState } from 'react';

interface FlashcardContentProps {
  front: string;
  back: string;
}

export default function FlashcardContent({ front, back }: FlashcardContentProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="relative h-48 cursor-pointer [perspective:1000px]"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleFlip();
        }
      }}
      aria-label={isFlipped ? 'Show front of flashcard' : 'Show back of flashcard'}
    >
      <div 
        className={`absolute w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-white border border-gray-200 rounded-md p-4 flex items-center justify-center text-center">
          <div className="text-lg font-medium">{front}</div>
        </div>
        
        {/* Back of card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-gray-50 border border-gray-200 rounded-md p-4 flex items-center justify-center text-center [transform:rotateY(180deg)]">
          <div className="text-lg">{back}</div>
        </div>
      </div>
      
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {isFlipped ? 'Front' : 'Back'}
      </div>
    </div>
  );
} 
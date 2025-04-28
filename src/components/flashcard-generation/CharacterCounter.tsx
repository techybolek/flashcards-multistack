interface CharacterCounterProps {
  count: number;
  min: number;
  max: number;
}

export default function CharacterCounter({ count, min, max }: CharacterCounterProps) {
  const isTooShort = count < min;
  const isTooLong = count > max;
  const isInRange = count >= min && count <= max;
  
  return (
    <div className="text-sm">
      <span className={isTooShort ? 'text-red-500' : isTooLong ? 'text-red-500' : 'text-green-500'}>
        {count}
      </span>
      <span className="text-gray-500"> / {max} characters</span>
      {isTooShort && (
        <span className="text-red-500 ml-2">
          (minimum {min} characters required)
        </span>
      )}
      {isTooLong && (
        <span className="text-red-500 ml-2">
          (maximum {max} characters allowed)
        </span>
      )}
      {isInRange && (
        <span className="text-green-500 ml-2">
          (valid length)
        </span>
      )}
    </div>
  );
} 
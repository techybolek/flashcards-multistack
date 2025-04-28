import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import CharacterCounter from './CharacterCounter';
import GenerateButton from './GenerateButton';

interface TextInputFormProps {
  text: string;
  setText: (text: string) => void;
  isTextValid: boolean;
  textError: string | null;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function TextInputForm({
  text,
  setText,
  isTextValid,
  textError,
  onGenerate,
  isGenerating
}: TextInputFormProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="text-input" className="text-lg font-medium">
          Enter text to generate flashcards
        </label>
        <Textarea
          id="text-input"
          value={text}
          onChange={handleTextChange}
          placeholder="Paste or type your text here (1000-10000 characters)"
          className={`min-h-[200px] ${textError ? 'border-red-500' : ''}`}
          aria-invalid={!!textError}
          aria-describedby={textError ? 'text-error' : undefined}
        />
        {textError && (
          <p id="text-error" className="text-sm text-red-500">
            {textError}
          </p>
        )}
        <CharacterCounter count={text.length} min={1000} max={10000} />
      </div>
      
      <div className="flex justify-end">
        <GenerateButton
          onClick={onGenerate}
          isLoading={isGenerating}
          isDisabled={!isTextValid || isGenerating}
        />
      </div>
    </div>
  );
} 
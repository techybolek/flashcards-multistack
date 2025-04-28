import { useState } from 'react';
import TextInputForm from './TextInputForm';
import GenerationStatus from './GenerationStatus';
import FlashcardProposalsList from './FlashcardProposalsList';
import ActionButtons from './ActionButtons';
import ToastNotifications from './ToastNotifications';
import { useFlashcardGeneration } from './hooks/useFlashcardGeneration';

// Types for notifications
interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export default function FlashcardGenerationView() {
  // State for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Use the custom hook for flashcard generation logic
  const {
    text,
    setText,
    isTextValid,
    textError,
    isGenerating,
    generationError,
    proposals,
    proposalStatuses,
    stats,
    generationId,
    handleGenerate,
    handleAccept,
    handleEdit,
    handleReject,
    handleSaveAccepted,
    handleSaveAll
  } = useFlashcardGeneration();

  // Function to add a notification
  const addNotification = (type: 'success' | 'error' | 'info', message: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, type, message, duration }]);
    
    // Auto-dismiss notification after duration
    setTimeout(() => {
      dismissNotification(id);
    }, duration);
  };

  // Function to dismiss a notification
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <TextInputForm 
        text={text}
        setText={setText}
        isTextValid={isTextValid}
        textError={textError}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
      
      <GenerationStatus 
        isLoading={isGenerating}
        error={generationError}
      />
      
      {proposals.length > 0 && (
        <>
          <FlashcardProposalsList 
            proposals={proposals}
            proposalStatuses={proposalStatuses}
            onAccept={handleAccept}
            onEdit={handleEdit}
            onReject={handleReject}
          />
          
          <ActionButtons 
            hasAccepted={Object.values(proposalStatuses).some(status => status === 'accepted')}
            hasProposals={proposals.length > 0}
            onSaveAccepted={handleSaveAccepted}
            onSaveAll={handleSaveAll}
          />
        </>
      )}
      
      <ToastNotifications 
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
} 
# Flashcard Edit Source Update Plan

## Problem Statement
When editing an AI-generated flashcard, the source field remains as 'ai-full' instead of being updated to 'ai-edited' to reflect user modifications.

## Data Model Context
From codebase analysis:
```typescript
type FlashcardDTO = {
  source: 'manual' | 'ai-full' | 'ai-edited';  // Current field not being updated
};
```

## Required Changes

### 1. Frontend Changes
1. Update `useFlashcardOperations` hook:
   - Modify the `handleEdit` function to include source update logic
   - When editing a flashcard with source 'ai-full', change it to 'ai-edited'
   - Keep source unchanged for 'manual' or already 'ai-edited' cards

2. Update types:
   - Ensure EditFlashcardCommand includes the source field
   - Add source field to any relevant interfaces/types for edit operations

### 2. Backend Changes
1. Update flashcard edit endpoint:
   - Add source field validation in the request schema
   - Implement logic to verify and update source field
   - Ensure source change is persisted to database

### 3. Testing Plan
1. Frontend Tests:
   - Test editing AI-generated flashcard updates source
   - Test editing manual flashcard keeps source
   - Test editing already-edited AI flashcard keeps 'ai-edited'

2. Backend Tests:
   - Test source field validation
   - Test source update persistence
   - Test invalid source transitions are blocked

## Implementation Steps

1. Frontend Implementation:
   ```typescript
   // Update handleEdit in useFlashcardOperations
   const handleEdit = async (id: number, updates: EditFlashcardCommand) => {
     const flashcard = flashcards.find(f => f.id === id);
     if (flashcard?.source === 'ai-full') {
       updates.source = 'ai-edited';
     }
     // Proceed with update
   };
   ```

2. Backend Implementation:
   ```typescript
   // Update validation schema
   const editFlashcardSchema = z.object({
     source: z.enum(['manual', 'ai-full', 'ai-edited']).optional(),
     // other fields...
   });
   ```

## Success Criteria
1. Editing an 'ai-full' flashcard changes its source to 'ai-edited'
2. Source changes persist after page refresh
3. Source field properly displays in UI
4. Manual and already-edited cards maintain their source value

## Rollback Plan
1. Maintain current source values in a temporary table
2. If issues occur, restore original source values
3. Include source field in edit history if available 
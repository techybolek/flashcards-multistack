# Fix Display Order Constraint Violation

## Current Situation
The database already has a `display_order` column in the flashcards table (as evidenced by the constraint error), but it's not reflected in our TypeScript types or handled in our code.

## Required Changes

### 1. Update Database Types
First, we need to update `backend/src/types/database.types.ts` to include display_order in the flashcards table type:

```typescript
flashcards: {
  Row: {
    // ... existing fields ...
    display_order: number;
  }
  Insert: {
    // ... existing fields ...
    display_order: number;
  }
  Update: {
    // ... existing fields ...
    display_order?: number;
  }
}
```

### 2. Update Command Types
In both frontend and backend `types/index.ts`:
```typescript
type CreateFlashcardCommand = {
  front: string;
  back: string;
  source: 'manual' | 'ai-full' | 'ai-edited';
  generation_id?: number | null;
  display_order: number;
};
```

### 3. Frontend Changes
In `GenerationDetailPage.tsx`:
```typescript
const handleAddSubmit = async (command: CreateFlashcardCommand) => {
  try {
    setIsAddingCard(true);
    // Calculate next display order from existing flashcards
    const nextDisplayOrder = flashcards.length > 0 
      ? Math.max(...flashcards.map(f => f.display_order)) + 1 
      : 1;
    
    await handleAdd({
      ...command,
      display_order: nextDisplayOrder
    });
    setShowAddForm(false);
  } finally {
    setIsAddingCard(false);
  }
};
```

### 4. Backend Service Update
In `FlashcardService.createFlashcard`:
```typescript
const flashcardToInsert: TablesInsert<'flashcards'> = {
  front,
  back,
  source,
  user_id: userId,
  generation_id: generation_id !== undefined ? Number(generation_id) : null,
  display_order
};
```

## Next Steps
1. Would you like me to proceed with these changes?
2. Do you need to provide access to modify the database schema?
3. Should we handle the display_order differently? 
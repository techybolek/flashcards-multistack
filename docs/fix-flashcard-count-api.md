# Fix Flashcard Count - API-Only Solution

## Current Understanding
- We have a `flashcards` table that contains a `generation_id` field linking to generations
- We can count flashcards directly using a JOIN or subquery
- Frontend is already properly handling the flashcard count display
- No database schema changes needed

## Solution Steps

### 1. Backend API Changes
1. Modify the generations endpoint to include a count from the flashcards table:
```sql
SELECT 
  g.*,
  (SELECT COUNT(*) FROM flashcards f WHERE f.generation_id = g.id) as flashcard_count
FROM generations g
WHERE g.user_id = :user_id;
```

### 2. Testing Plan
1. Test API response:
   - Verify count is accurate for generations with flashcards
   - Verify count is 0 for generations without flashcards
   - Verify count updates when flashcards are added/deleted

2. Test frontend display:
   - Verify the existing frontend correctly displays the counts
   - Verify the counts update after operations that modify flashcards

## Implementation Order
1. Backend API modifications
2. Testing

## Notes
- No database schema changes required
- No frontend changes needed (frontend already handles the count properly)
- Count is calculated on-the-fly during API calls
- Solution is backwards compatible
- No migration needed
- Existing frontend fallback to 0 provides robustness 
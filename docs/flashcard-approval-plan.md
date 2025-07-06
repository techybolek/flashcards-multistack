# Flashcard Approval Implementation Plan

## Current Issues
1. Flashcards are generated but not saved to database
2. User has no opportunity to review/approve generated flashcards
3. Immediate redirect prevents review process
4. No UI for flashcard approval

## Implementation Plan

### 1. Backend Changes (generationService.ts)
1. Split the generation process into two phases:
   - Phase 1: Generate and return proposals
   - Phase 2: Save approved flashcards

2. Add new endpoint:
   ```typescript
   POST /api/generations/:id/approve
   Body: {
     flashcards: Array<{
       front: string;
       back: string;
       approved: boolean;
       edited?: boolean;
     }>
   }
   ```

3. Update database schema:
   - Add `status` column to `generations` table:
     - 'pending_approval'
     - 'approved'
     - 'rejected'

### 2. Frontend Changes (GeneratePage.tsx)

1. Update State Management:
   ```typescript
   interface FlashcardProposal {
     front: string;
     back: string;
     approved: boolean;
     edited: boolean;
   }

   const [generationId, setGenerationId] = useState<number | null>(null);
   const [proposals, setProposals] = useState<FlashcardProposal[]>([]);
   const [step, setStep] = useState<'input' | 'review'>('input');
   ```

2. UI Components:
   - Create FlashcardProposalCard component
   - Add approval checkboxes
   - Add edit capability
   - Add bulk approve/reject buttons

3. Review Flow:
   - After generation, show review interface instead of redirecting
   - Allow editing individual flashcards
   - Provide bulk actions (approve all, reject all)
   - Show final confirmation before saving

### 3. Implementation Phases

#### Phase 1: Backend Foundation
1. Update generation service to handle two-phase process
2. Add new approval endpoint
3. Update database schema
4. Add validation for approval requests

#### Phase 2: Frontend Review UI
1. Create FlashcardProposalCard component
2. Update GeneratePage to handle review state
3. Add editing capabilities
4. Implement approval/rejection logic

#### Phase 3: Integration
1. Connect frontend review UI to backend approval endpoint
2. Add loading states and error handling
3. Implement success/failure notifications
4. Add final confirmation step

#### Phase 4: Testing & Refinement
1. Test full generation-to-approval flow
2. Add error recovery mechanisms
3. Implement undo/redo for approvals
4. Add progress saving (in case user leaves page)

### 4. User Flow

1. Initial Generation:
   - User inputs text
   - Clicks generate
   - Backend generates proposals
   - Frontend displays review interface

2. Review Process:
   - User sees all generated flashcards
   - Can approve/reject individual cards
   - Can edit card content
   - Bulk actions available

3. Final Approval:
   - User confirms final selection
   - Backend saves approved cards
   - Success notification
   - Redirect to dashboard/detail page

### 5. Error Handling

1. Generation Errors:
   - Show retry option
   - Allow partial text preservation

2. Approval Errors:
   - Save progress locally
   - Allow retry of failed approvals
   - Provide manual save option

3. Navigation Protection:
   - Warn before leaving page
   - Save draft state
   - Allow resume of interrupted process

### 6. Future Enhancements

1. Preview Mode:
   - Study mode preview
   - Card formatting options

2. Batch Processing:
   - Save multiple review sessions
   - Bulk import/export

3. Templates:
   - Save successful edits as templates
   - Apply templates to new generations 
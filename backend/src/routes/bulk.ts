import { Router } from 'express';
import { FlashcardService } from '@/services/flashcardService';
import { authenticate } from '@/middleware/auth';
import type { ApiResponse, CreateFlashcardCommand } from '@/types';

const router = Router();
const flashcardService = new FlashcardService();

// Apply authentication middleware
router.use(authenticate);

// POST /api/flashcards/bulk
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    if (!Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        error: 'Request body must be an array of flashcards'
      });
    }

    // Validate each flashcard in the array
    for (const flashcard of body) {
      if (!flashcard.front || !flashcard.back) {
        return res.status(400).json({
          success: false,
          error: "Each flashcard must include a 'front' and a 'back'"
        });
      }
    }

    const flashcards: CreateFlashcardCommand[] = body.map(flashcard => ({
      front: flashcard.front,
      back: flashcard.back,
      source: flashcard.source || 'ai-full',
      generation_id: flashcard.generation_id
    }));

    await flashcardService.createBulkFlashcards(flashcards, req.user!.id);

    console.log('Bulk flashcards created successfully');

    const response: ApiResponse = {
      success: true,
      data: null
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating bulk flashcards:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

export default router;
import { Router } from 'express';
import { FlashcardService } from '@/services/flashcardService';
import { authenticate } from '@/middleware/auth';
import type { ApiResponse, CreateFlashcardCommand, UpdateFlashcardCommand } from '@/types';

const router = Router();
const flashcardService = new FlashcardService();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/flashcards
router.get('/', async (req, res) => {
  try {
    const flashcards = await flashcardService.getFlashcards(req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: flashcards
    };

    res.json(response);
  } catch (error) {
    console.error('Error retrieving flashcards:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// GET /api/flashcards/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'id' is required"
      });
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'id' must be a valid number"
      });
    }

    const flashcard = await flashcardService.getFlashcard(numericId, req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: flashcard
    };

    res.json(response);
  } catch (error) {
    console.error('Error retrieving flashcard:', error);
    if (error instanceof Error && error.message === 'Flashcard not found') {
      return res.status(404).json({
        success: false,
        error: 'Flashcard not found'
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// POST /api/flashcards
router.post('/', async (req, res) => {
  try {
    const { front, back, source, generation_id } = req.body;

    // Validate required fields
    if (!front || !back || !source) {
      return res.status(400).json({
        success: false,
        error: "Fields 'front', 'back', and 'source' are required"
      });
    }

    const command: CreateFlashcardCommand = {
      front,
      back,
      source,
      generation_id: generation_id !== undefined ? Number(generation_id) : null
    };

    const newFlashcard = await flashcardService.createFlashcard(command, req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: newFlashcard
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/flashcards/:id
router.put('/:id', async (req, res) => {
  console.log('PUT request received', req.params);
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'id' is required"
      });
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'id' must be a valid number"
      });
    }

    const { front, back } = req.body;
    if (!front && !back) {
      return res.status(400).json({
        success: false,
        error: "At least one field ('front' or 'back') is required to update"
      });
    }

    const command: UpdateFlashcardCommand = {
      front,
      back,
      source: 'ai-edited' // When updating, it becomes ai-edited
    };

    const updatedFlashcard = await flashcardService.updateFlashcard(numericId, command, req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: updatedFlashcard
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    if (error instanceof Error && error.message === 'Flashcard not found or access denied') {
      return res.status(404).json({
        success: false,
        error: 'Flashcard not found or access denied'
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/flashcards/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'id' is required"
      });
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'id' must be a valid number"
      });
    }

    await flashcardService.deleteFlashcard(numericId, req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: null
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    if (error instanceof Error && error.message === 'Flashcard not found or access denied') {
      return res.status(404).json({
        success: false,
        error: 'Flashcard not found or access denied'
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// PATCH /api/flashcards/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { front, back } = req.body;

    if (!front || !back) {
      return res.status(400).json({
        success: false,
        error: 'Front and back are required'
      });
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'id' must be a valid number"
      });
    }

    await flashcardService.patchFlashcard(numericId, front, back, req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: null
    };

    res.json(response);
  } catch (error) {
    console.error('Error patching flashcard:', error);
    if (error instanceof Error && error.message === 'Flashcard not found') {
      return res.status(404).json({
        success: false,
        error: 'Flashcard not found'
      });
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

export default router;
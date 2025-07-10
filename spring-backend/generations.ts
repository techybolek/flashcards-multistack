import { Router } from 'express';
import { z } from 'zod';
import { GenerationService } from '@/services/generationService';
import { authenticate } from '@/middleware/auth';
import type { ApiResponse, GenerateFlashcardsCommand } from '@/types';

const router = Router();
const generationService = new GenerationService();

const commandSchema = z.object({
  text: z.string()
    .min(1000, { message: "Text must be at least 1000 characters long" })
    .max(10000, { message: "Text cannot exceed 10000 characters" })
    .transform((text) => text.trim()) // Trim whitespace before validation
});

// Apply authentication middleware to all routes
router.use(authenticate);

// POST /api/generations
router.post('/', async (req, res) => {
  try {
    // Parse request body
    let body: GenerateFlashcardsCommand;
    try {
      body = req.body;
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON format'
      });
    }

    // Validate request body
    const parseResult = commandSchema.safeParse(body);
    if (!parseResult.success) {
      console.log('Generate API - parseResult.error.errors', parseResult.error.errors);
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message,
        details: parseResult.error.errors
      });
    }

    const result = await generationService.generateFlashcards(
      { text: parseResult.data.text }, 
      req.user!.id
    );

    const response: ApiResponse = {
      success: true,
      data: result
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error during generation:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// GET /api/generations
router.get('/', async (req, res) => {
  console.log('GET /api/generations, userid:', req.user!.id);
  try {
    const result = await generationService.getGenerations(req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: result
    };

    res.json(response);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// GET /api/generations/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'id' must be a valid number"
      });
    }

    const generation = await generationService.getGeneration(numericId, req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: generation
    };

    res.json(response);
  } catch (error) {
    console.error('Error retrieving generation:', error);
    if (error instanceof Error && error.message === 'Generation not found') {
      return res.status(404).json({
        success: false,
        error: 'Generation not found'
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/generations/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'id' must be a valid number"
      });
    }

    await generationService.deleteGeneration(numericId, req.user!.id);

    res.json({
      success: true,
      data: null
    });
  } catch (error) {
    console.error('Error deleting generation:', error);
    if (error instanceof Error && error.message === 'Generation not found') {
      return res.status(404).json({
        success: false,
        error: 'Generation not found'
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/generations/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        error: "Parameter 'id' must be a valid number"
      });
    }

    // Validate request body
    const updateSchema = z.object({
      flashcards: z.array(z.object({
        front: z.string().min(1, "Front side cannot be empty"),
        back: z.string().min(1, "Back side cannot be empty"),
        source: z.enum(['ai-full', 'ai-edited'])
      }))
    });

    const parseResult = updateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message,
        details: parseResult.error.errors
      });
    }

    const updatedFlashcards = await generationService.updateGeneration(
      numericId,
      req.user!.id,
      parseResult.data.flashcards
    );

    const response: ApiResponse = {
      success: true,
      data: updatedFlashcards
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating generation:', error);
    if (error instanceof Error && error.message === 'Generation not found') {
      return res.status(404).json({
        success: false,
        error: 'Generation not found'
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

export default router;
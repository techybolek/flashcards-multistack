import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { GenerationService } from '@/lib-server/generationService';
import { extractUserIdFromRequest } from '@/lib-server/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Extract userId using shared utility
    const userId = await extractUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate id param
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: "Parameter 'id' must be a valid number" }, { status: 400 });
    }

    // 3. Use GenerationService to get the generation
    const generationService = new GenerationService();
    try {
      const generation = await generationService.getGeneration(numericId, userId);
      return NextResponse.json({
        success: true,
        data: generation
      });
    } catch (error: any) {
      if (error.message === 'Generation not found') {
        return NextResponse.json({ success: false, error: 'Generation not found' }, { status: 404 });
      }
      console.error('API error:', error);
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Extract userId using shared utility
    const userId = await extractUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate id param
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: "Parameter 'id' must be a valid number" }, { status: 400 });
    }

    // 3. Use GenerationService to delete the generation
    const generationService = new GenerationService();
    try {
      await generationService.deleteGeneration(numericId, userId);
      return NextResponse.json({ success: true, data: null });
    } catch (error: any) {
      if (error.message === 'Generation not found') {
        return NextResponse.json({ success: false, error: 'Generation not found' }, { status: 404 });
      }
      if (error.message === 'Error deleting associated flashcards') {
        return NextResponse.json({ success: false, error: 'Error deleting associated flashcards' }, { status: 500 });
      }
      if (error.message === 'Error deleting generation') {
        return NextResponse.json({ success: false, error: 'Error deleting generation' }, { status: 500 });
      }
      console.error('API error:', error);
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Extract userId using shared utility
    const userId = await extractUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate id param
    const { id } = params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: "Parameter 'id' must be a valid number" }, { status: 400 });
    }

    // 3. Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid JSON format' }, { status: 400 });
    }

    // Validate flashcards array
    if (!body || !Array.isArray(body.flashcards)) {
      return NextResponse.json({ success: false, error: "Request body must have a 'flashcards' array" }, { status: 400 });
    }

    // Validate each flashcard
    for (const card of body.flashcards) {
      if (
        typeof card.front !== 'string' || card.front.trim().length === 0 ||
        typeof card.back !== 'string' || card.back.trim().length === 0 ||
        (card.source !== 'ai-full' && card.source !== 'ai-edited')
      ) {
        return NextResponse.json({ success: false, error: 'Each flashcard must have non-empty front, back, and valid source (ai-full or ai-edited)' }, { status: 400 });
      }
    }

    // 4. Use GenerationService to update the generation
    const generationService = new GenerationService();
    try {
      const updatedFlashcards = await generationService.updateGeneration(
        numericId,
        userId,
        body.flashcards
      );
      return NextResponse.json({
        success: true,
        data: updatedFlashcards
      });
    } catch (error: any) {
      if (error.message === 'Generation not found') {
        return NextResponse.json({ success: false, error: 'Generation not found' }, { status: 404 });
      }
      if (error.message === 'Failed to save flashcards') {
        return NextResponse.json({ success: false, error: 'Failed to save flashcards' }, { status: 500 });
      }
      if (error.message === 'Failed to update generation stats') {
        return NextResponse.json({ success: false, error: 'Failed to update generation stats' }, { status: 500 });
      }
      console.error('API error:', error);
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 
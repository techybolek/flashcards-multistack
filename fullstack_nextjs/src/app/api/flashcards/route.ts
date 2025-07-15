import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { extractUserIdFromRequest } from '@/lib-server/auth';
import type { TablesInsert } from '@/types/database.types';

export async function POST(req: NextRequest) {
  try {
    // 1. Extract userId using shared utility
    const userId = await extractUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse and validate body
    const body = await req.json();
    const { front, back, source, generation_id, display_order } = body;
    if (!front || !back || !source || display_order === undefined) {
      return NextResponse.json({
        success: false,
        error: "Fields 'front', 'back', 'source', and 'display_order' are required"
      }, { status: 400 });
    }

    // 3. Prepare insert data
    const flashcardToInsert: TablesInsert<'flashcards'> = {
      front,
      back,
      source,
      user_id: userId,
      display_order: Number(display_order),
      generation_id: generation_id !== undefined ? Number(generation_id) : null
    };

    // 4. Insert flashcard
    const { data: newFlashcard, error } = await supabaseService
      .from('flashcards')
      .insert(flashcardToInsert)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: `Error creating flashcard: ${error.message}`
      }, { status: 500 });
    }

    if (!newFlashcard) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create flashcard, no data returned'
      }, { status: 500 });
    }

    // 5. Return the created flashcard
    return NextResponse.json({
      success: true,
      data: newFlashcard
    }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 
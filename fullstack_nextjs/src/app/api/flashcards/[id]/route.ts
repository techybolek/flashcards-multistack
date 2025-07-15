import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate user (reuse logic from generations)
    const cookieStore = await cookies();
    let token = cookieStore.get('token')?.value;

    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    let userId: string | undefined;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
      } catch {
        userId = undefined;
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate id param
    const { id } = await params;
    console.log('Update flashcard: id', id);
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: "Parameter 'id' must be a valid number" }, { status: 400 });
    }

    // 3. Parse and validate body
    const body = await req.json();
    const { front, back, source } = body;
    if (!front && !back) {
      return NextResponse.json({
        success: false,
        error: "At least one field ('front' or 'back') is required to update"
      }, { status: 400 });
    }

    // 4. Check if flashcard exists and belongs to user
    const { data: existingFlashcard, error: checkError } = await supabaseService
      .from('flashcards')
      .select('id')
      .eq('id', numericId)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingFlashcard) {
      return NextResponse.json({
        success: false,
        error: 'Flashcard not found or access denied'
      }, { status: 404 });
    }

    // 5. Update the flashcard
    const updateData: Record<string, any> = {};
    if (front) updateData.front = front;
    if (back) updateData.back = back;
    if (source) updateData.source = source;

    const { data: updatedFlashcard, error } = await supabaseService
      .from('flashcards')
      .update(updateData)
      .eq('id', numericId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Error updating flashcard'
      }, { status: 500 });
    }

    // 6. Return the updated flashcard
    return NextResponse.json({
      success: true,
      data: updatedFlashcard
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate user (reuse logic from generations)
    const cookieStore = await cookies();
    let token = cookieStore.get('token')?.value;

    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    let userId: string | undefined;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
      } catch {
        userId = undefined;
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate id param
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: "Parameter 'id' must be a valid number" }, { status: 400 });
    }

    // 3. Check if flashcard exists and belongs to user
    const { data: existingFlashcard, error: checkError } = await supabaseService
      .from('flashcards')
      .select('id')
      .eq('id', numericId)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingFlashcard) {
      return NextResponse.json({
        success: false,
        error: 'Flashcard not found or access denied'
      }, { status: 404 });
    }

    // 4. Delete the flashcard
    const { error: deleteError } = await supabaseService
      .from('flashcards')
      .delete()
      .eq('id', numericId)
      .eq('user_id', userId);

    if (deleteError) {
      return NextResponse.json({
        success: false,
        error: 'Error deleting flashcard'
      }, { status: 500 });
    }

    // 5. Return success response
    return NextResponse.json({
      success: true,
      message: 'Flashcard deleted successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 
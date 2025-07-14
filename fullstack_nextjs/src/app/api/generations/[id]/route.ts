import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate user (reuse logic from /api/generations)
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

    // 3. Query the generation with flashcards
    const { data: generation, error } = await supabaseService
      .from('generations')
      .select(`*, flashcards(*)`)
      .eq('id', numericId)
      .eq('user_id', userId)
      .single();

    if (error || !generation) {
      return NextResponse.json({ success: false, error: 'Generation not found' }, { status: 404 });
    }

    // 4. Return the generation data (including flashcards)
    return NextResponse.json({
      success: true,
      data: generation
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate user (reuse logic from GET)
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

    // 3. Check if generation exists and belongs to user
    const { data: generation, error: genError } = await supabaseService
      .from('generations')
      .select('id')
      .eq('id', numericId)
      .eq('user_id', userId)
      .single();

    if (genError || !generation) {
      return NextResponse.json({ success: false, error: 'Generation not found' }, { status: 404 });
    }

    // 4. Delete associated flashcards first
    const { error: flashcardsError } = await supabaseService
      .from('flashcards')
      .delete()
      .eq('generation_id', numericId)
      .eq('user_id', userId);
    if (flashcardsError) {
      return NextResponse.json({ success: false, error: 'Error deleting associated flashcards' }, { status: 500 });
    }

    // 5. Delete the generation
    const { error: generationError } = await supabaseService
      .from('generations')
      .delete()
      .eq('id', numericId)
      .eq('user_id', userId);
    if (generationError) {
      return NextResponse.json({ success: false, error: 'Error deleting generation' }, { status: 500 });
    }

    // 6. Return success
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 
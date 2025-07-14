// src/app/api/generations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // 1. Try to get token from cookies (using cookies() API)
    const cookieStore = await cookies();
    let token = cookieStore.get('token')?.value;

    // 2. Fallback to Authorization header
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // 3. Try to decode token and extract userId
    let userId: string | undefined;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        userId = decoded.userId;
      } catch {
        userId = undefined;
      }
    }

    // 4. If no userId, return 401
    if (!userId) {
      console.log('Generations: Unauthorized');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 5. Query generations with flashcard count (left join)
    const { data: generations, error: generationsError } = await supabaseService
      .from('generations')
      .select(`
        id,
        created_at,
        generated_count,
        generation_name,
        flashcards(count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (generationsError) {
      console.error('Database error:', generationsError);
      return NextResponse.json({ success: false, error: 'Failed to load generations' }, { status: 500 });
    }

    // Transform the count from { count: X } to just X
    const transformedGenerations = generations?.map((gen: any) => ({
      ...gen,
      flashcard_count: gen.flashcards?.[0]?.count || 0
    }));

    return NextResponse.json({
      success: true,
      data: { generations: transformedGenerations }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

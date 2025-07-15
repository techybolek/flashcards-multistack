// src/app/api/generations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { GenerateFlashcardsCommand } from '@/types';
import { z } from 'zod';
import { GenerationService } from '@/lib-server/generationService';
import { extractUserIdFromRequest } from '@/lib-server/auth';


const generationService = new GenerationService();

const commandSchema = z.object({
  text: z.string()
    .min(1000, { message: "Text must be at least 1000 characters long" })
    .max(10000, { message: "Text cannot exceed 10000 characters" })
    .transform((text) => text.trim()) // Trim whitespace before validation
});

export async function POST(req: NextRequest) {
  try {
    // 1. Extract userId using shared utility
    const userId = await extractUserIdFromRequest(req);

    // 2. If no userId, return 401
    if (!userId) {
      console.log('Generations: Unauthorized');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Parse request body
    const body: GenerateFlashcardsCommand = await req.json();
    console.log('Generations: body', body);

    // 4. Validate request body
    const parseResult = commandSchema.safeParse(body);
    if (!parseResult.success) {
      //@ts-ignore
      console.log('Generate API - parseResult.error.errors', parseResult.error.errors);
      //@ts-ignore
      return NextResponse.json({ success: false, error: parseResult.error.errors[0].message, details: parseResult.error.errors }, { status: 400 });
    }

    const result = await generationService.generateFlashcards(
      { text: parseResult.data.text }, 
      userId
    );

    const response = {
      success: true,
      data: result
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1. Extract userId using shared utility
    const userId = await extractUserIdFromRequest(req);

    // 2. If no userId, return 401
    if (!userId) {
      console.log('Generations: Unauthorized');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Use GenerationService to get generations
    const { generations } = await generationService.getGenerations(userId);

    return NextResponse.json({
      success: true,
      data: { generations }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

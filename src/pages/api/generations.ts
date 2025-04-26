import type { APIRoute } from 'astro';
import { z } from 'zod';
import type { GenerateFlashcardsCommand, GenerationResultDTO } from '../../types';
import { DEFAULT_USER_ID, supabaseClient } from '../../db/supabase.client';
import { createHash } from 'crypto';

export const prerender = false;

const commandSchema = z.object({
  text: z.string().min(1000, { message: "Tekst jest za krótki" }).max(10000, { message: "Tekst jest za długi" })
});

// Function to generate flashcards using AI
const generateFlashcards = async (text: string) => {
  // In a real implementation, this would call an external AI service
  // For now, we'll simulate the AI generation with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    flashcardProposals: [
      { front: "Przykładowa karta 1", back: "Przykładowa odpowiedź 1", source: "ai-full" as "ai-full" },
      { front: "Przykładowa karta 2", back: "Przykładowa odpowiedź 2", source: "ai-full" as "ai-full" }
    ],
    stats: {
      generated_count: 2,
      generation_duration: "PT1S"
    }
  };
};

// Function to calculate text hash
const calculateTextHash = (text: string): string => {
  return createHash('sha256').update(text).digest('hex');
};

export const POST: APIRoute = async ({ request, locals }) => {
  // Use a default user id as authentication is not handled at this stage
  const userId = DEFAULT_USER_ID;

  // Parse request body
  let body: GenerateFlashcardsCommand;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Nieprawidłowy format JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate request body
  const parseResult = commandSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(JSON.stringify({ error: parseResult.error.issues }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Calculate text hash for deduplication
    const sourceTextHash = calculateTextHash(body.text);
    
    // Generate flashcards using AI
    const aiResponse = await generateFlashcards(body.text);
    
    // Save generation record to database
    console.log('inserting with userId', userId);
    const { data: generationData, error: generationError } = await supabaseClient
      .from('generations')
      .insert({
        user_id: userId,
        model: 'deepseek-reasoner',
        source_text_hash: sourceTextHash,
        source_text_length: body.text.length,
        generated_count: aiResponse.stats.generated_count,
        generation_duration: aiResponse.stats.generation_duration,
        accepted_unedited_count: 0,
        accepted_edited_count: 0
      })
      .select()
      .single();

    if (generationError) {
      console.error('Error saving generation to database:', generationError);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const generation_id = generationData.id;

    const generationResult: GenerationResultDTO = {
      generation_id,
      flashcardProposals: aiResponse.flashcardProposals,
      stats: aiResponse.stats
    };

    return new Response(JSON.stringify(generationResult), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error during generation:', error);
    
    // Log error to generation_error_logs table
    try {
      await supabaseClient
        .from('generation_error_logs')
        .insert({
          user_id: userId,
          model: 'deepseek-reasoner',
          source_text_hash: calculateTextHash(body.text),
          source_text_length: body.text.length,
          error_code: 'GENERATION_ERROR',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });
    } catch (logError) {
      console.error('Error logging generation error:', logError);
    }
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
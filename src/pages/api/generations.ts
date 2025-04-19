import type { APIRoute } from 'astro';
import { z } from 'zod';
import type { GenerateFlashcardsCommand, GenerationResultDTO } from '../../types';
import { DEFAULT_USER_ID } from '../../db/supabase.client';

export const prerender = false;

const commandSchema = z.object({
  text: z.string().min(1000, { message: "Tekst jest za krótki" }).max(10000, { message: "Tekst jest za długi" })
});

// Mock function to simulate external AI generation
const simulateAIGeneration = async (text: string) => {
  // Simulate network delay
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
    // Simulate AI generation service
    const aiResponse = await simulateAIGeneration(body.text);

    // Simulate database insertion for generation record using userId
    // In a real implementation, this would involve inserting into the 'generations' table
    const generation_id = 123; // dummy generation id

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
    // Simulate error logging to generation_error_logs table
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
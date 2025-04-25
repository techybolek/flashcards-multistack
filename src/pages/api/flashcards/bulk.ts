import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabaseClient';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return new Response(JSON.stringify({ error: 'Request body must be an array of flashcards' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate each flashcard in the array
    for (const flashcard of body) {
      if (!flashcard.question || !flashcard.answer) {
        return new Response(JSON.stringify({ error: "Each flashcard must include a 'question' and an 'answer'" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Insert bulk flashcards into database
    const { data: newFlashcards, error: dbError } = await supabase
      .from('flashcards')
      .insert(body);

    if (dbError) {
      console.error(dbError);
      return new Response(JSON.stringify({ error: 'Error creating flashcards' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ data: newFlashcards }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
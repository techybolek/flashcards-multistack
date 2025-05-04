import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '@/lib/supabase';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  try {
    // Create server client with cookie support
    const supabase = createServerSupabaseClient(cookies);

    // Check authentication
    if (!locals.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();

    if (!Array.isArray(body)) {
      return new Response(JSON.stringify({ error: 'Request body must be an array of flashcards' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate each flashcard in the array
    for (const flashcard of body) {
      if (!flashcard.front || !flashcard.back) {
        return new Response(JSON.stringify({ error: "Each flashcard must include a 'front' and a 'back'" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Add user_id to each flashcard
    body.forEach(flashcard => {
      // @ts-ignore
      flashcard.user_id = locals.user.id;
    });

    // Insert bulk flashcards into database
    const response = await supabase
      .from('flashcards')
      .insert(body);

    if (response.error) {
      console.error(response.error);
      return new Response(JSON.stringify({ error: 'Error creating flashcards' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('response', response);

    return new Response(JSON.stringify({ data: null }), {
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
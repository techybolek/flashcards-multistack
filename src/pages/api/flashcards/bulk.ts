import type { APIRoute } from 'astro';
import { supabaseClient, DEFAULT_USER_ID } from '../../../db/supabase.client';

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
      if (!flashcard.front || !flashcard.back) {
        return new Response(JSON.stringify({ error: "Each flashcard must include a 'front' and a 'back'" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    //add default user_id
    body.forEach(flashcard => {
      flashcard.user_id = DEFAULT_USER_ID;
    });

    // Insert bulk flashcards into database
    const response = await supabaseClient
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
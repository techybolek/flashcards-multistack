import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '@/lib/supabase';

export const GET: APIRoute = async ({ params, locals, cookies }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Parameter 'id' is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create server client with cookie support
    const supabase = createServerSupabaseClient(cookies);

    // Check authentication
    if (!locals.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate that id is a number
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return new Response(JSON.stringify({ error: "Parameter 'id' must be a valid number" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch flashcard from database using Supabase
    const { data: flashcard, error: dbError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', numericId)
      .eq('user_id', locals.user.id) // Ensure user can only access their own flashcards
      .single();

    if (dbError) {
      console.error(dbError);
      return new Response(JSON.stringify({ error: 'Error retrieving flashcard' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!flashcard) {
      return new Response(JSON.stringify({ error: 'Flashcard not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ data: flashcard }), {
      status: 200,
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

export const PUT: APIRoute = async ({ params, request, locals, cookies }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Parameter 'id' is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create server client with cookie support
    const supabase = createServerSupabaseClient(cookies);

    // Check authentication
    if (!locals.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate that id is a number
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return new Response(JSON.stringify({ error: "Parameter 'id' must be a valid number" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { front, back } = body;
    if (!front && !back) {
      return new Response(JSON.stringify({ error: "At least one field ('front' or 'back') is required to update" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: Record<string, string> = {};
    if (front) updateData.front = front;
    if (back) updateData.back = back;

    // First check if the flashcard belongs to the user
    const { data: existingFlashcard, error: checkError } = await supabase
      .from('flashcards')
      .select('id')
      .eq('id', numericId)
      .eq('user_id', locals.user.id)
      .single();

    if (checkError || !existingFlashcard) {
      return new Response(JSON.stringify({ error: 'Flashcard not found or access denied' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update the flashcard
    const { data: updatedFlashcard, error: dbError } = await supabase
      .from('flashcards')
      .update(updateData)
      .eq('id', numericId)
      .eq('user_id', locals.user.id)
      .select()
      .single();

    if (dbError) {
      console.error(dbError);
      return new Response(JSON.stringify({ error: 'Error updating flashcard' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ data: updatedFlashcard }), {
      status: 200,
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

export const DELETE: APIRoute = async ({ params, locals, cookies }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Parameter 'id' is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create server client with cookie support
    const supabase = createServerSupabaseClient(cookies);

    // Check authentication
    if (!locals.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate that id is a number
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return new Response(JSON.stringify({ error: "Parameter 'id' must be a valid number" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // First check if the flashcard belongs to the user
    const { data: existingFlashcard, error: checkError } = await supabase
      .from('flashcards')
      .select('id')
      .eq('id', numericId)
      .eq('user_id', locals.user.id)
      .single();

    if (checkError || !existingFlashcard) {
      return new Response(JSON.stringify({ error: 'Flashcard not found or access denied' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the flashcard
    const { error: dbError } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', numericId)
      .eq('user_id', locals.user.id);

    if (dbError) {
      console.error(dbError);
      return new Response(JSON.stringify({ error: 'Error deleting flashcard' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ data: null }), {
      status: 200,
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
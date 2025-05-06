import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '@/lib/supabase';

export const DELETE: APIRoute = async ({ params, locals, cookies }) => {
  try {
    const generationId = params.id;
    
    if (!generationId) {
      return new Response(JSON.stringify({ error: 'Generation ID is required' }), {
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

    // Start a transaction by deleting flashcards first (due to foreign key constraint)
    const { error: flashcardsError } = await supabase
      .from('flashcards')
      .delete()
      .eq('generation_id', generationId)
      .eq('user_id', locals.user.id); // Extra safety check

    if (flashcardsError) {
      console.error('Error deleting flashcards:', flashcardsError);
      return new Response(JSON.stringify({ error: 'Failed to delete flashcards' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Then delete the generation
    const { error: generationError } = await supabase
      .from('generations')
      .delete()
      .eq('id', generationId)
      .eq('user_id', locals.user.id); // Extra safety check

    if (generationError) {
      console.error('Error deleting generation:', generationError);
      return new Response(JSON.stringify({ error: 'Failed to delete generation' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
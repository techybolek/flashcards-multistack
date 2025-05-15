import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '@/lib/supabase';

// Environment validation to prevent running in production
const isProduction = import.meta.env.PROD && !import.meta.env.DEV;

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  // Safety check: Don't allow in production
  if (isProduction) {
    console.error('Test cleanup endpoint is not available in production');
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Test cleanup endpoint is not available in production' 
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
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

  try {
    // Get the authenticated user's ID
    const userId = locals.user.id;

    // Delete records from all three tables in a specific order to respect foreign key constraints
    const { error: flashcardsError, count: flashcardsCount } = await supabase
      .from('flashcards')
      .delete({ count: 'exact' })
      .eq('user_id', userId);

    const { error: generationsError, count: generationsCount } = await supabase
      .from('generations')
      .delete({ count: 'exact' })
      .eq('user_id', userId);

    const { error: errorLogsError, count: errorLogsCount } = await supabase
      .from('generation_error_logs')
      .delete({ count: 'exact' })
      .eq('user_id', userId);

    // Collect any errors
    const errors = [];
    if (flashcardsError) errors.push(`Flashcards: ${flashcardsError.message}`);
    if (generationsError) errors.push(`Generations: ${generationsError.message}`);
    if (errorLogsError) errors.push(`Error Logs: ${errorLogsError.message}`);

    return new Response(
      JSON.stringify({
        success: errors.length === 0,
        deleted: {
          flashcards: flashcardsCount || 0,
          generations: generationsCount || 0,
          generation_error_logs: errorLogsCount || 0
        },
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Test cleanup error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during test cleanup' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 
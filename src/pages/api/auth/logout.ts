import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '@/lib/supabase';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const supabase = createServerSupabaseClient(cookies);
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error during logout:', error);
      return new Response(
        JSON.stringify({ 
          error: error.message,
          status: 'error'
        }), 
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        status: 'success',
        message: 'Logged out successfully'
      }), 
      { status: 200 }
    );
  } catch (err) {
    console.error('Unexpected error during logout:', err);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        status: 'error'
      }), 
      { status: 500 }
    );
  }
}; 
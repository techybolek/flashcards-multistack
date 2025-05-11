import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '@/lib/supabase';
import { z } from 'zod';

const recoverSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email } = recoverSchema.parse(body);

    console.log('Password recovery requested for:', email);

    // Create server client with cookie support
    const supabase = createServerSupabaseClient(cookies);

    // For now, we'll just return a success response
    // TODO: Implement actual password reset functionality with Supabase
    // const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    //   redirectTo: `${new URL(request.url).origin}/auth/reset-password`,
    // });

    return new Response(
      JSON.stringify({ 
        status: 'success',
        message: 'If an account exists with that email, password reset instructions have been sent.',
      }), 
      { status: 200 }
    );
  } catch (err) {
    console.error('Password recovery error:', err);
    
    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: err.errors[0].message,
          status: 'error'
        }), 
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        status: 'error'
      }), 
      { status: 500 }
    );
  }
}; 
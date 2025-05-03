import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({ 
          error: error.message,
          status: 'error'
        }), 
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ 
        user: data.user,
        status: 'success',
        redirectTo: '/generate'
      }), 
      { status: 200 }
    );
  } catch (err) {
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
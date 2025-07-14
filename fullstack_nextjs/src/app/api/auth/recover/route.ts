import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const recoverSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = recoverSchema.parse(body);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/auth/reset-password`,
    });

    if (error) {
      // Do not expose the error to the client to prevent user enumeration
      console.error('Password recovery error:', error);
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'If an account exists with that email, password reset instructions have been sent.',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error('Password recovery error:', error);
    // Return a generic message here as well
    return NextResponse.json({ 
        success: true, 
        data: { 
            message: 'If an account exists with that email, password reset instructions have been sent.'
        } 
    });
  }
}

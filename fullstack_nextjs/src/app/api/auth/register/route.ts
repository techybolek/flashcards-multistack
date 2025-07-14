import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = registerSchema.parse(body);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Check if email confirmation is needed
    if (data?.user?.identities?.length === 0) {
        return NextResponse.json({ success: false, error: 'This email is already registered. Please check your email for the confirmation link or try logging in.' }, { status: 400 });
    }

    let message: string;
    if (data?.user?.confirmed_at) {
        message = 'Registration successful! You can now log in.';
    } else {
        message = 'Please check your email for a confirmation link to complete your registration.';
    }

    return NextResponse.json({
      success: true,
      data: {
        user: data.user,
        requiresEmailConfirmation: !data?.user?.confirmed_at,
        message,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}

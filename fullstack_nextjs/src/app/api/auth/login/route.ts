import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 400 });
    }

    const token = jwt.sign(
      {
        userId: data.user.id,
        email: data.user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      },
      process.env.JWT_SECRET!
    );

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        redirectTo: '/dashboard',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}

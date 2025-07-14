import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

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

    const responseData = {
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      status: 'success',
      redirectTo: '/dashboard',
      token: token, // Include token in response for localStorage fallback
    };
    
    console.log('API Route - Returning response:', responseData);
    console.log('Setting cookie with token:', token.substring(0, 20) + '...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Cookie will be secure:', process.env.NODE_ENV !== 'development');
    
    // Create response with cookie using Set-Cookie header
    const response = NextResponse.json(responseData);
    
    // Try setting cookie manually with header
    const cookieString = `token=${token}; Path=/; Max-Age=86400; SameSite=lax`;
    console.log('Setting cookie manually:', cookieString);
    response.headers.set('Set-Cookie', cookieString);
    
    // Also try the Next.js way
    response.cookies.set('token', token, {
      httpOnly: false, // Temporarily disable HttpOnly for debugging
      secure: false, // Force to false for development
      sameSite: 'lax', // Change from 'strict' to 'lax' for better compatibility
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    
    console.log('Cookie set with Next.js response.cookies.set');
    
    console.log('Cookie should be set now');
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // @ts-ignore
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}

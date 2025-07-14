import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import type { User } from '@/types';

export async function GET(request: Request) {
  try {
    console.log('ME route - checking for token');
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log('ME route - all cookies:', allCookies);
    
    // Also try to get token from headers
    const cookieHeader = request.headers.get('cookie');
    console.log('ME route - cookie header:', cookieHeader);
    
    // Also check Authorization header for localStorage fallback
    const authHeader = request.headers.get('authorization');
    console.log('ME route - auth header:', authHeader);
    
    let token = cookieStore.get('token')?.value;
    
    // Fallback to Authorization header
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('ME route - token found in auth header:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    }
    
    console.log('ME route - final token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');

    if (!token) {
      console.log('ME route - No token found, returning 401');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };
    
    const user: User = {
      id: decoded.userId,
      email: decoded.email,
      name: '' // name is not in the token
    };

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}

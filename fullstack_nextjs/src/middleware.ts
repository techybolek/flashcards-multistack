import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const protectedRoutes = ['/dashboard', '/generate', '/generations'];

export function middleware(request: NextRequest) {
  let token = request.cookies.get('token')?.value;
  
  // Fallback to Authorization header if cookie is not available
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  const { pathname } = request.nextUrl;

  console.log('Middleware - pathname:', pathname);
  console.log('Middleware - token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');

  // Temporarily disable middleware protection - let AuthContext handle it
  // if (protectedRoutes.some(path => pathname.startsWith(path)) && !token) {
  //   console.log('Middleware - No token for protected route, redirecting to login');
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // }

  if (token) {
    try {
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET!);
      
      // If the user is authenticated and tries to access login/register, redirect to dashboard
      if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

    } catch (error) {
      // If token is invalid, clear the cookie and redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.set('token', '', { expires: new Date(0) });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

import type { MiddlewareHandler } from 'astro';
import { createServerSupabaseClient } from '../lib/supabase';

// Define routes that require authentication
const PROTECTED_ROUTES = ['/generate', '/api/generations'];

// Define routes that are always public
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/callback', '/', '/about'];

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Create server client with cookie support
  const supabase = createServerSupabaseClient(context.cookies);
  context.locals.supabase = supabase;
  
  // Get the session from the request
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Auth error:', error);
  }
  
  // Add the user to locals if authenticated
  if (session?.user) {
    context.locals.user = session.user;
  }

  // Check if the current path requires authentication
  const currentPath = new URL(context.request.url).pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some(route => currentPath.startsWith(route));
  const isPublicRoute = PUBLIC_ROUTES.some(route => currentPath === route);

  // If it's a protected route and there's no session, redirect to login
  if (isProtectedRoute && !session && !isPublicRoute) {
    return context.redirect('/auth/login');
  }
  
  return next();
}; 
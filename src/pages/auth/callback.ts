import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect('/auth/login?error=missing_code');
  }

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirect(`/auth/login?error=${error.message}`);
    }

    return redirect('/generate?verified=true');
  } catch (error) {
    return redirect('/auth/login?error=unknown_error');
  }
}; 
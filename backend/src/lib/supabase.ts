import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a standard supabase client for regular operations
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Create a service client for admin operations (bypassing RLS)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey)
  : null;

// Create a client for a specific user (for API routes)
export function createUserSupabaseClient(accessToken: string) {
  return createClient<Database>(supabaseUrl!, supabaseKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
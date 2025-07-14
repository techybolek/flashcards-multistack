import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a standard supabase client for non-auth operations
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Create a service client that bypasses RLS (for server-side operations)
export const supabaseService = createClient<Database>(supabaseUrl, supabaseKey);

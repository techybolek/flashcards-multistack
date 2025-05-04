import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment variables.');
}

console.log('supabaseUrl', supabaseUrl);
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Service role client that bypasses RLS policies
export const supabaseServiceClient = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey)
  : null;
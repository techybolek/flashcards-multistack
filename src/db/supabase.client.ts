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

export const DEFAULT_USER_ID = '0b0cc9de-fb3d-4015-b7b4-d42a37bbe90c'
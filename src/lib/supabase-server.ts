import { createClient } from '@supabase/supabase-js';

/**
 * SERVER-SIDE SUPABASE CLIENT for AURA COMMERCE
 * 
 * use this for Server Components, API Routes, and Server Actions.
 * It strictly uses process.env and includes caching.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseServerClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseServer() {
  if (supabaseServerClient) return supabaseServerClient;

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is missing in server environment');
  }

  supabaseServerClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });

  return supabaseServerClient;
}

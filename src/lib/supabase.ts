import { createClient } from '@supabase/supabase-js';

/**
 * PRODUCTION SUPABASE CLIENT for AURA COMMERCE
 * 
 * This file has been fixed to use process.env for Next.js compatibility.
 * It works on both Client and Server components.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validation with clear production logging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing. Check Vercel Settings > Environment Variables.');
} else {
  console.log('✅ Supabase environment variables loaded successfully.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

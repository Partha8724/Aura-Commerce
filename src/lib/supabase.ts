import { createClient } from '@supabase/supabase-js';

/**
 * PRODUCTION SUPABASE CLIENT for AURA COMMERCE
 * 
 * This file has been fixed to use process.env for Next.js and Vercel compatibility.
 * It works across both Client and Server components.
 * 
 * CRITICAL: Uses a safe fallback to prevent "supabaseUrl is required" runtime crashes.
 */

// Accessing via process.env (Vercel/Next.js standard)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Diagnostic logging for production debugging (British English)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('❌ Supabase environment variables are missing. Please check your Vercel Environment Variable settings.');
} else {
  console.log('✅ Supabase environment correctly initialised.');
}

// Fallback values to prevent application-wide crash if variables are missing during cold start
const safeUrl = supabaseUrl || 'https://placeholder-project.supabase.co';
const safeKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

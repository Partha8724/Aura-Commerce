/**
 * ENVIRONMENT DIAGNOSTIC UTILITY for AURA COMMERCE
 * 
 * checks for required variables without exposed values.
 */

export interface EnvStatus {
  allPresent: boolean;
  missing: string[];
  present: string[];
}

export function checkEnvironment(): EnvStatus {
  const isServer = typeof window === 'undefined';
  
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  // Specific server-side checks
  if (isServer) {
    required.push('CJ_BASE_URL', 'CJ_API_KEY', 'CJ_EMAIL');
  }

  const missing: string[] = [];
  const present: string[] = [];

  required.forEach((key) => {
    if (process.env[key] || (isServer && process.env[key])) {
      present.push(key);
    } else {
      missing.push(key);
    }
  });

  return {
    allPresent: missing.length === 0,
    missing,
    present,
  };
}

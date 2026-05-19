'use client';

import { useEffect, useState } from 'react';
import { checkEnvironment, EnvStatus } from '../../src/lib/env-check';

/**
 * PRODUCTION DEBUG PAGE for AURA COMMERCE
 * 
 * Path: /debug
 * Verifies system health and environment variable status.
 */

export default function DebugPage() {
  const [status, setStatus] = useState<EnvStatus | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState<'pending' | 'yes' | 'no'>('pending');

  useEffect(() => {
    const envStatus = checkEnvironment();
    setStatus(envStatus);

    // Dynamic import to avoid SSR issues if necessary
    import('../../src/lib/supabase').then(async ({ supabase }) => {
      try {
        const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });
        setSupabaseConnected(error ? 'no' : 'yes');
      } catch (e) {
        setSupabaseConnected('no');
      }
    });
  }, []);

  if (!status) return <div className="p-10">Running diagnostics...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold text-blue-400">AURA COMMERCE // SYSTEM DIAGNOSTICS</h1>
          <p className="text-gray-400 text-sm mt-1">Environment: {process.env.NODE_ENV}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-l-4 border-blue-500 pl-3">Environment Variables</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {status.present.map(key => (
              <div key={key} className="bg-gray-800 p-3 rounded border border-green-900/50 flex justify-between items-center">
                <span className="text-gray-300 text-sm">{key}</span>
                <span className="text-green-400 text-xs font-bold uppercase">Ready</span>
              </div>
            ))}
            {status.missing.map(key => (
              <div key={key} className="bg-gray-800 p-3 rounded border border-red-900/50 flex justify-between items-center">
                <span className="text-gray-300 text-sm">{key}</span>
                <span className="text-red-400 text-xs font-bold uppercase">Missing</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-l-4 border-purple-500 pl-3">Service Connectivity</h2>
          <div className="bg-gray-800 p-6 rounded border border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <span>Supabase (Database)</span>
              {supabaseConnected === 'yes' ? (
                <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs border border-green-500/50">CONNECTED</span>
              ) : supabaseConnected === 'no' ? (
                <span className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-xs border border-red-500/50">FAILED</span>
              ) : (
                <span className="text-gray-500 text-xs">TESTING...</span>
              )}
            </div>
            <div className="text-xs text-gray-500 italic">
              * Note: CJ API can only be tested from server-side. Use /api/cj/test for CJ health checks.
            </div>
          </div>
        </section>

        <footer className="text-xs text-center text-gray-600 pt-10">
          AURA COMMERCE TECHNICAL SEO & ARCHITECTURE // 2025
        </footer>
      </div>
    </div>
  );
}

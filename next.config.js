/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimisations for AURA COMMERCE
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Next.js 14 App Router ignores import.meta.env; we rely strictly on process.env.
  // Variables prefixed with NEXT_PUBLIC_ are automatically exposed to the browser.

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cjdropshipping.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
  
  // Manual passthrough for environments that might need it
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
};

module.exports = nextConfig;

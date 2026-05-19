/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production Optimisations for AURA COMMERCE
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Environment variables are automatically handled by Next.js if prefixed with NEXT_PUBLIC_
  // No extra env configuration is required for Vercel deployments.

  // SEO Headers for Sitemap and Robots
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=59',
          },
        ],
      },
    ];
  },

  // SEO Redirects
  async redirects() {
    return [
      // Add standard e-commerce redirects here if needed
    ];
  },

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
};

module.exports = nextConfig;

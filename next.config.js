/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production Optimisations for AURA COMMERCE
  reactStrictMode: true,
  poweredByHeader: false,
  
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

  // SEO Redirects (e.g. from old paths or www to non-www if needed)
  async redirects() {
    return [
      // Example: Redirecting legacy category page if it existed
      // {
      //   source: '/old-category',
      //   destination: '/shop',
      //   permanent: true,
      // },
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

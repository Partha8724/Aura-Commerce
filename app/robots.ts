import type { MetadataRoute } from 'next';

/**
 * PRODUCTION ROBOTS.TXT GENERATOR for AURA COMMERCE
 * Path: app/robots.ts
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://aura-commerce-833j.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/checkout/',
          '/cart/',
          '/account/',
          '/dashboard/',
          '/_next/',
          '/private/'
        ],
        crawlDelay: 5,
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

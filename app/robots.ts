import type { MetadataRoute } from 'next';

/**
 * File 1: The Automated Global Robot Rules
 * Configures crawl access and security boundaries for Luxe Doow.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxedoow.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/partner-central/',
          '/admin/',
          '/api/auth/',
          '/_next/',
          '/private/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

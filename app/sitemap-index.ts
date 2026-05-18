import type { MetadataRoute } from 'next';

/**
 * PRODUCTION SITEMAP INDEX (ALTERNATIVE) for AURA COMMERCE
 * 
 * Path: app/sitemap-index.ts
 * Description: Use this if you want to split your static and dynamic sitemaps
 */

export default function sitemapIndex(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aura-commerce-833j.vercel.app';
  
  return [
    {
      url: `${baseUrl}/sitemap-static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-products.xml`,
      lastModified: new Date(),
    }
  ];
}

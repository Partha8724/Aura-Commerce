import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/checkout/', '/cart/'],
    },
    sitemap: 'https://aura-commerce-833j.vercel.app/sitemap.xml',
  };
}

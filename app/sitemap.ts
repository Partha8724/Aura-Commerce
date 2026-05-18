import type { MetadataRoute } from 'next';
import { supabase } from '../src/lib/supabase';

/**
 * PRODUCTION DYNAMIC SITEMAP GENERATOR for AURA COMMERCE
 * 
 * Path: app/sitemap.ts
 * Description: Generates a real-time sitemap by combining static routes 
 * with dynamic product records from Supabase.
 */

export const revalidate = 3600; // Force revalidation every 1 hour (3600 seconds)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aura-commerce-833j.vercel.app';
  
  console.log('[Sitemap Builder]: Generating production sitemap...');

  // 1. Static Routes Configuration
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/men`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/women`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/electronics`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/home`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/delivery-information`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/returns-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  try {
    // 2. Fetch Dynamic Product Slugs from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[Sitemap Builder Error]: Supabase query failed:', error.message);
      return staticRoutes; // Graceful fallback to static routes
    }

    if (!products || products.length === 0) {
      console.warn('[Sitemap Builder Warning]: No products found in database.');
      return staticRoutes;
    }

    // 3. Map Products to Sitemap Format
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    console.log(`[Sitemap Builder Success]: Generated ${productRoutes.length} dynamic product entries.`);

    return [...staticRoutes, ...productRoutes];

  } catch (err: any) {
    console.error('[Sitemap Builder Fatal Error]:', err.message);
    return staticRoutes; // Maximum reliability: never return 404
  }
}

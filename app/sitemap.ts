import type { MetadataRoute } from 'next';
import { supabase } from '../src/lib/supabase';

/**
 * File 2: The Self-Updating Dynamic Sitemap
 * Generates structural paths and dynamic product inventory blocks.
 */
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxedoow.com';

  // 1. Static Channel Sections
  const staticRoutes = [
    '',
    '/men',
    '/women',
    '/electronics',
    '/home',
    '/shop'
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic Product Sections
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    const productRoutes = (products || []).map((product) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error('[Sitemap Generation Error]:', error);
    return staticRoutes;
  }
}

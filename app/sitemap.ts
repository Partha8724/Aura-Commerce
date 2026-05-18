import type { MetadataRoute } from 'next';
import { supabase } from '../src/lib/supabase';

/**
 * Dynamic Sitemap for AURA COMMERCE
 * Generates static routes and dynamic product pages.
 * Revalidates every hour.
 */
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aura-commerce-833j.vercel.app';

  // 1. Static Routes
  const staticRoutes = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/men', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/women', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/electronics', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/home', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/shop', priority: 0.9, changeFreq: 'daily' as const },
  ].map(({ path, priority, changeFreq }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority: priority,
  }));

  // 2. Dynamic Product Routes
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5000); // Prevents timeout

    if (error) {
      console.error('[Supabase Query Error]:', error.message);
    }

    if (products && products.length > 0) {
      productRoutes = products.map((product) => ({
        url: `${siteUrl}/shop/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error(
      '[Sitemap Generation Error]:',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

  // Always returns static routes even if Supabase fails
  return [...staticRoutes, ...productRoutes];
}

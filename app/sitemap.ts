import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://www.dasilife.store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // ============================================
  // STATIC PAGES
  // ============================================
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/track-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // ============================================
  // DYNAMIC PRODUCT PAGES
  // ============================================
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true);

  const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(p.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ============================================
  // DYNAMIC CATEGORY PAGES
  // ============================================
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at');

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(c.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ============================================
  // COMBINE ALL
  // ============================================
  return [...staticPages, ...productPages, ...categoryPages];
}
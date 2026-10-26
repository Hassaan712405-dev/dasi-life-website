import { createPublicClient } from '@/lib/supabase/public';
import type { Product } from '@/types/database';

// ============================================
// GET PRODUCTS
// ============================================
export async function getProducts(options: {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popularity' | 'price-asc' | 'price-desc' | 'newest';
  limit?: number;
} = {}): Promise<Product[]> {
  const supabase = createPublicClient();

  // ✅ Base query — product_images MUST be included
  let query = supabase
    .from('products')
    .select(`
      *,
      product_images ( id, url, alt, sort_order, is_primary )
    `)
    .eq('is_active', true);

  // Category filter
  if (options.categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.categorySlug)
      .single();

    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  // Price filter
  if (options.minPrice !== undefined) {
    query = query.gte('price', options.minPrice);
  }
  if (options.maxPrice !== undefined) {
    query = query.lte('price', options.maxPrice);
  }

  // Sort
  switch (options.sortBy) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popularity':
    default:
      query = query.order('is_featured', { ascending: false });
      break;
  }

  // Limit
  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('getProducts error:', error);
    return [];
  }

  return (data || []) as Product[];
}

// ============================================
// GET PRODUCT BY SLUG
// ============================================
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images ( id, url, alt, sort_order, is_primary ),
      product_variants ( * )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('getProductBySlug error:', error);
    return null;
  }

  return data as Product;
}

// ============================================
// GET FEATURED PRODUCTS
// ============================================
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images ( id, url, alt, sort_order, is_primary )
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(limit);

  if (error) {
    console.error('getFeaturedProducts error:', error);
    return [];
  }

  return (data || []) as Product[];
}

// ============================================
// GET PRODUCTS BY CATEGORY
// ============================================
export async function getProductsByCategory(
  categorySlug: string,
  limit = 20
): Promise<Product[]> {
  return getProducts({ categorySlug, limit });
}
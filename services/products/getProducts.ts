import { createPublicClient } from '@/lib/supabase/public';
import type { Product } from '@/types/database';

interface GetProductsOptions {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popularity' | 'price-asc' | 'price-desc' | 'newest';
  limit?: number;
  featuredOnly?: boolean;
}

// ============================================
// FETCH PRODUCTS
// ============================================
export async function getProducts(options?: GetProductsOptions): Promise<Product[]> {
  const supabase = createPublicClient();

  let query = supabase
    .from('products')
    .select('*, product_images(url, alt, sort_order)')
    .eq('is_active', true);

  if (options?.featuredOnly) {
    query = query.eq('is_featured', true);
  }

  if (options?.categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.categorySlug)
      .single();

    if (category) {
      query = query.eq('category_id', category.id);
    } else {
      return [];
    }
  }

  if (options?.minPrice !== undefined) {
    query = query.gte('price', options.minPrice);
  }
  if (options?.maxPrice !== undefined) {
    query = query.lte('price', options.maxPrice);
  }

  switch (options?.sortBy) {
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
      query = query.order('rating_count', { ascending: false });
      break;
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []) as Product[];
}

// ============================================
// FETCH SINGLE PRODUCT
// ============================================
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(url, alt, sort_order)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data as Product;
}
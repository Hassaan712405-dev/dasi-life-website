import { createPublicClient } from '@/lib/supabase/public';
import type { Product } from '@/types/database';

// ============================================
// HELPER: Clean slug for URL
// ============================================
function formatSlug(slug: string): string {
  return decodeURIComponent(slug)
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images ( id, url, alt, sort_order, is_primary )
    `)
    .eq('is_active', true);

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

  if (options.minPrice !== undefined) {
    query = query.gte('price', options.minPrice);
  }
  if (options.maxPrice !== undefined) {
    query = query.lte('price', options.maxPrice);
  }

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
  const cleanSlug = formatSlug(slug);

  // ✅ 1. Pehle product fetch karein (bina images ke) taake details load hon
  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('slug', cleanSlug)
    .eq('is_active', true)
    .maybeSingle(); // maybeSingle use karein taake error na aaye agar 0 rows hon

  if (productError) {
    console.error('getProductBySlug error:', productError);
    return null;
  }

  // Agar clean slug se nahi mila, to fallback try karein
  if (!productData) {
    const originalSlug = decodeURIComponent(slug).toLowerCase();
    const { data: fallbackData } = await supabase
      .from('products')
      .select('*')
      .eq('slug', originalSlug)
      .eq('is_active', true)
      .maybeSingle();

    if (fallbackData) {
      return await attachImagesAndVariants(supabase, fallbackData);
    }
    return null;
  }

  return await attachImagesAndVariants(supabase, productData);
}

// ============================================
// HELPER: Attach Images & Variants Safely
// ============================================
async function attachImagesAndVariants(supabase: any, product: any): Promise<Product> {
  // 1. Fetch Images
  const { data: images } = await supabase
    .from('product_images')
    .select('id, url, alt, sort_order, is_primary')
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true });

  // 2. Fetch Variants
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true });

  return {
    ...product,
    product_images: images || [],
    product_variants: variants || [],
  } as Product;
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
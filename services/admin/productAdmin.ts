import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/types/database';

export interface ProductFormData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  ingredients: string;
  usage_instructions: string;
  price: number;
  compare_at_price: number;
  stock: number;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string | null;
}

// ============================================
// GET ALL PRODUCTS (Admin)
// ============================================
export async function getAllProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(url, alt, sort_order)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get products error:', error);
    return [];
  }

  return (data || []) as Product[];
}

// ============================================
// GET SINGLE PRODUCT BY ID
// ============================================
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(url, alt, sort_order)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Get product error:', error);
    return null;
  }

  return data as Product;
}

// ============================================
// GET ALL CATEGORIES
// ============================================
export async function getAllCategories(): Promise<
  { id: string; name: string; slug: string }[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order');

  if (error) return [];
  return data || [];
}

// ============================================
// CREATE PRODUCT
// ============================================
export async function createProduct(
  data: ProductFormData
): Promise<{ success: boolean; error?: string; productId?: string }> {
  const supabase = createClient();

  const { image_url, ...productData } = data;

  // Check if slug exists, append timestamp if needed
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productData.slug)
    .single();

  if (existing) {
    productData.slug = `${productData.slug}-${Date.now().toString().slice(-5)}`;
  }

  const { data: created, error } = await supabase
    .from('products')
    .insert(productData)
    .select('id')
    .single();

  if (error) {
    console.error('Create product error:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }

  // Save image
  if (image_url) {
    const { error: imageError } = await supabase
      .from('product_images')
      .insert({
        product_id: created.id,
        url: image_url,
        alt: data.name,
        sort_order: 0,
      });

    if (imageError) {
      console.error('Save image error:', JSON.stringify(imageError, null, 2));
    }
  }

  return { success: true, productId: created.id };
}

// ============================================
// UPDATE PRODUCT
// ============================================
export async function updateProduct(
  id: string,
  data: Partial<ProductFormData>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { image_url, ...productData } = data;

  const { error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id);

  if (error) {
    console.error('Update product error:', error);
    return { success: false, error: error.message };
  }

  if (image_url) {
    await supabase.from('product_images').delete().eq('product_id', id);
    await supabase.from('product_images').insert({
      product_id: id,
      url: image_url,
      alt: data.name || '',
      sort_order: 0,
    });
  }

  return { success: true };
}

// ============================================
// DELETE PRODUCT
// ============================================
export async function deleteProduct(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    console.error('Delete product error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// SLUG GENERATOR
// ============================================
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
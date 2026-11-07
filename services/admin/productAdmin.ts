import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/types/database';

// ============================================
// TYPES
// ============================================
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

export interface ProductImageData {
  id?: string;
  url: string;
  alt?: string;
  sort_order: number;
  is_primary: boolean;
  isNew?: boolean;
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

  if (image_url) {
    const { error: imageError } = await supabase
      .from('product_images')
      .insert({
        product_id: created.id,
        url: image_url,
        alt: data.name,
        sort_order: 0,
        is_primary: true,
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

  // NOTE: Image updates are handled separately via updateProductImages()
  // This keeps the logic clean and prevents accidental deletion

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
// BULK ACTIVATE PRODUCTS
// ============================================
export async function bulkActivateProducts(
  ids: string[]
): Promise<{ success: boolean; error?: string; count?: number }> {
  if (ids.length === 0) return { success: true, count: 0 };

  const supabase = createClient();

  const { error, count } = await supabase
    .from('products')
    .update({ is_active: true })
    .in('id', ids);

  if (error) {
    console.error('Bulk activate error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, count: count || ids.length };
}

// ============================================
// BULK DEACTIVATE PRODUCTS
// ============================================
export async function bulkDeactivateProducts(
  ids: string[]
): Promise<{ success: boolean; error?: string; count?: number }> {
  if (ids.length === 0) return { success: true, count: 0 };

  const supabase = createClient();

  const { error, count } = await supabase
    .from('products')
    .update({ is_active: false })
    .in('id', ids);

  if (error) {
    console.error('Bulk deactivate error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, count: count || ids.length };
}

// ============================================
// BULK DELETE PRODUCTS
// ============================================
export async function bulkDeleteProducts(
  ids: string[]
): Promise<{ success: boolean; error?: string; count?: number }> {
  if (ids.length === 0) return { success: true, count: 0 };

  const supabase = createClient();

  // Delete images first (foreign key)
  await supabase.from('product_images').delete().in('product_id', ids);

  // Delete products
  const { error, count } = await supabase
    .from('products')
    .delete()
    .in('id', ids);

  if (error) {
    console.error('Bulk delete error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, count: count || ids.length };
}

// ============================================
// ✅ NEW: GET PRODUCT IMAGES (Multiple)
// ============================================
export async function getProductImages(productId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('product_images')
    .select('id, url, alt, sort_order, is_primary')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Get images error:', error);
    return [];
  }

  return data || [];
}

// ============================================
// ✅ NEW: UPDATE PRODUCT IMAGES (Multiple)
// ============================================
export async function updateProductImages(
  productId: string,
  images: ProductImageData[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    // Delete all existing images for this product
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId);

    if (deleteError) {
      console.error('Delete old images error:', deleteError);
      return { success: false, error: deleteError.message };
    }

    // Insert new images
    if (images.length > 0) {
      // Ensure at least one is primary
      const hasPrimary = images.some((img) => img.is_primary);
      const imagesToInsert = images.map((img, index) => ({
        product_id: productId,
        url: img.url,
        alt: img.alt || '',
        sort_order: index,
        is_primary: hasPrimary ? img.is_primary : index === 0,
      }));

      const { error: insertError } = await supabase
        .from('product_images')
        .insert(imagesToInsert);

      if (insertError) {
        console.error('Insert images error:', insertError);
        return { success: false, error: insertError.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Update images error:', err);
    return { success: false, error: err.message };
  }
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
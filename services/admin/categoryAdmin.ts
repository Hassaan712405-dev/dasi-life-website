import { createClient } from '@/lib/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithCount extends Category {
  product_count: number;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  sort_order: number;
}

// ============================================
// GET ALL CATEGORIES (with product count)
// ============================================
export async function getAllCategoriesWithCount(): Promise<CategoryWithCount[]> {
  const supabase = createClient();

  // 1. Get categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Get categories error:', JSON.stringify(error, null, 2));
    return [];
  }

  if (!categories || categories.length === 0) return [];

  // 2. Get product counts
  const { data: products } = await supabase
    .from('products')
    .select('category_id')
    .eq('is_active', true);

  const countMap: Record<string, number> = {};
  (products || []).forEach((p) => {
    if (p.category_id) {
      countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
    }
  });

  // 3. Combine
  return categories.map((cat) => ({
    ...cat,
    product_count: countMap[cat.id] || 0,
  }));
}

// ============================================
// GET SINGLE CATEGORY BY ID
// ============================================
export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Get category error:', error);
    return null;
  }

  return data as Category;
}

// ============================================
// CREATE CATEGORY
// ============================================
export async function createCategory(
  data: CategoryFormData
): Promise<{ success: boolean; error?: string; categoryId?: string }> {
  const supabase = createClient();

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', data.slug)
    .single();

  if (existing) {
    return { success: false, error: 'This slug already exists. Please use a different one.' };
  }

  const { data: created, error } = await supabase
    .from('categories')
    .insert(data)
    .select('id')
    .single();

  if (error) {
    console.error('Create category error:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }

  return { success: true, categoryId: created.id };
}

// ============================================
// UPDATE CATEGORY
// ============================================
export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Update category error:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// DELETE CATEGORY
// ============================================
export async function deleteCategory(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // Check if category has products
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (count && count > 0) {
    return {
      success: false,
      error: `Cannot delete: ${count} product(s) are in this category. Move them first.`,
    };
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    console.error('Delete category error:', JSON.stringify(error, null, 2));
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
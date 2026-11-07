import { createClient } from '@/lib/supabase/client';
import type { HeroPoster, HeroPosterWithProduct } from '@/types/hero-poster';

const TABLE = 'hero_posters';
const BUCKET = 'hero-posters';

// ============================================
// READ — all posters (admin)
// ============================================
export async function listAllPosters(): Promise<HeroPosterWithProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      id, title_internal, image_url, mobile_image_url, storage_path,
      product_id, button_label, sort_order, is_active, is_published,
      created_at, updated_at, heading, description, button_link,
      product:products ( id, name, slug, price, is_active )
    `)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('List posters error:', error);
    return [];
  }

  if (!data) return [];

  return data.map((row: any) => {
    const prod = Array.isArray(row.product)
      ? row.product[0] ?? null
      : row.product ?? null;

    return {
      id: row.id,
      title_internal: row.title_internal,
      image_url: row.image_url,
      mobile_image_url: row.mobile_image_url,
      storage_path: row.storage_path,
      product_id: row.product_id,
      button_label: row.button_label,
      heading: row.heading,
      description: row.description,
      button_link: row.button_link,
      sort_order: row.sort_order,
      is_active: row.is_active,
      is_published: row.is_published,
      created_at: row.created_at,
      updated_at: row.updated_at,
      product: prod
        ? {
            id: prod.id,
            name: prod.name,
            slug: prod.slug,
            price: prod.price,
            is_active: prod.is_active,
          }
        : null,
    };
  }) as HeroPosterWithProduct[];
}

// ============================================
// UPLOAD IMAGE
// ============================================
export async function uploadHeroImage(
  file: File,
  kind: 'desktop' | 'mobile'
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
  const supabase = createClient();

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return { success: false, error: 'Only JPG, PNG, or WebP allowed.' };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { success: false, error: 'Image must be under 8 MB.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const timestamp = Date.now();
  const random = crypto.randomUUID().slice(0, 8);
  const path = `${kind}/${timestamp}-${random}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Hero upload error:', error);
    return { success: false, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return {
    success: true,
    url: urlData.publicUrl,
    path: data.path,
  };
}

// ============================================
// UPSERT — Insert or Update poster
// ============================================
export async function upsertPoster(
  data: Partial<HeroPoster> & { id?: string }
): Promise<{ success: boolean; error?: string; id?: string }> {
  const supabase = createClient();
  const { id, ...payload } = data;

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  );

  if (id) {
    const { error } = await supabase
      .from(TABLE)
      .update(cleanPayload)
      .eq('id', id);

    if (error) {
      console.error('Update poster error:', error);
      return { success: false, error: error.message };
    }
    return { success: true, id };
  }

  const { data: created, error } = await supabase
    .from(TABLE)
    .insert(cleanPayload)
    .select('id')
    .single();

  if (error) {
    console.error('Insert poster error:', error);
    return { success: false, error: error.message };
  }
  return { success: true, id: created.id };
}

// ============================================
// DELETE — Poster + storage file
// ============================================
export async function deletePoster(
  id: string,
  storagePaths: (string | null | undefined)[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    console.error('Delete poster error:', error);
    return { success: false, error: error.message };
  }

  const paths = storagePaths.filter((p): p is string => !!p);
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove(paths);

    if (storageError) {
      console.warn('Storage cleanup warning (non-fatal):', storageError);
    }
  }

  return { success: true };
}

// ============================================
// REORDER
// ============================================
export async function reorderPosters(
  ordered: { id: string; sort_order: number }[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const results = await Promise.all(
    ordered.map((p) =>
      supabase.from(TABLE).update({ sort_order: p.sort_order }).eq('id', p.id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error('Reorder error:', failed.error);
    return { success: false, error: failed.error.message };
  }
  return { success: true };
}

// ============================================
// PUBLISH — Force activate all + publish all
// ============================================
export async function publishPosters(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = createClient();

  // Step 1: Force is_active = true for ALL rows
  const { error: activeError } = await supabase
    .from(TABLE)
    .update({ is_active: true })
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (activeError) {
    console.error('Activate all error:', activeError);
    return { success: false, error: activeError.message };
  }

  // Step 2: Publish all active rows
  const { error: publishError } = await supabase
    .from(TABLE)
    .update({ is_published: true })
    .eq('is_active', true);

  if (publishError) {
    console.error('Publish error:', publishError);
    return { success: false, error: publishError.message };
  }

  // Step 3: Verify count
  const { count } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  console.log(`[publish] ${count || 0} posters published`);

  if (!count || count < 4) {
    return {
      success: false,
      error: `Only ${count || 0} posters are published. Need at least 4.`,
    };
  }

  return { success: true };
}

// ============================================
// PRODUCT OPTIONS (for dropdown)
// ============================================
export async function listProductOptions(): Promise<
  { id: string; name: string; slug: string }[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('List products error:', error);
    return [];
  }
  return data ?? [];
}
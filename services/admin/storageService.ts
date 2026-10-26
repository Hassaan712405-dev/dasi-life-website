import { createClient } from '@/lib/supabase/client';

// ============================================
// UPLOAD PRODUCT IMAGE
// ============================================
export async function uploadProductImage(
  file: File,
  productSlug: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = createClient();

  // Generate unique filename
  const ext = file.name.split('.').pop();
  const filename = `${productSlug}-${Date.now()}.${ext}`;
  const path = filename;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return { success: true, url: publicUrl };
}

// ============================================
// DELETE PRODUCT IMAGE
// ============================================
export async function deleteProductImage(url: string): Promise<boolean> {
  const supabase = createClient();

  const path = url.split('/product-images/')[1];
  if (!path) return false;

  const { error } = await supabase.storage
    .from('product-images')
    .remove([path]);

  return !error;
}
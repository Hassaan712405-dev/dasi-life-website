import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types/database';

// Search products by name, slug, or description
export async function searchProducts(query: string, limit = 8): Promise<Product[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const supabase = await createClient();
  const searchTerm = `%${query.trim()}%`;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .or(
      `name.ilike.${searchTerm},slug.ilike.${searchTerm},short_description.ilike.${searchTerm}`
    )
    .limit(limit);

  if (error) {
    console.error('Search error:', error);
    return [];
  }

  return data as Product[];
}
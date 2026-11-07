import { createPublicClient } from '@/lib/supabase/public';
import type { HeroPosterWithProduct } from '@/types/hero-poster';

/**
 * Public fetch for homepage hero posters.
 * Strategy:
 * - Only fetch published posters (is_published = true)
 * - Order by sort_order
 * - Limit 4
 */
export async function getHeroPosters(): Promise<HeroPosterWithProduct[]> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('hero_posters')
      .select(`
        id, title_internal, image_url, mobile_image_url, storage_path,
        product_id, button_label, sort_order, is_active, is_published,
        created_at, updated_at, heading, description, button_link,
        product:products ( id, name, slug, price, is_active )
      `)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(4);

    if (error) {
      console.error('[hero] fetch failed:', error.message, error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('[hero] No published posters found.');
      return [];
    }

    console.log(`[hero] Fetched ${data.length} published posters`);

    const normalized: (HeroPosterWithProduct | null)[] = (data as any[]).map(
      (row: any): HeroPosterWithProduct | null => {
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
      }
    );

    return normalized.filter((p): p is HeroPosterWithProduct => p !== null);
  } catch (e) {
    console.error('[hero] unexpected error:', e);
    return [];
  }
}
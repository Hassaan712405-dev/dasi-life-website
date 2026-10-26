import type { Product } from '@/types/database';

/**
 * Returns the product's image URL from Supabase Storage.
 * Priority: primary image > first by sort_order > placeholder
 */
export function getProductImageUrl(product: any): string {
  // 1. Try Supabase product_images array
  if (
    product?.product_images &&
    Array.isArray(product.product_images) &&
    product.product_images.length > 0
  ) {
    // Sort: primary first, then by sort_order
    const sorted = [...product.product_images].sort((a: any, b: any) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

    const url = sorted[0]?.url;

    if (url && typeof url === 'string' && url.trim()) {
      return url;
    }
  }

  // 2. Try direct image_url field
  if (product?.image_url && typeof product.image_url === 'string') {
    return product.image_url;
  }

  // 3. Placeholder fallback
  return '/images/placeholder-product.png';
}

export function getPrimaryProductImage(product: any): string {
  return getProductImageUrl(product);
}
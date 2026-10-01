import type { Product } from '@/types/database';

// ============================================
// GET PRODUCT IMAGE URL
// - Client-safe (no server imports)
// ============================================
export function getProductImageUrl(product: Product): string {
  // 1. Try Supabase image
  if (product.product_images && product.product_images.length > 0) {
    const sorted = [...product.product_images].sort(
      (a, b) => a.sort_order - b.sort_order
    );
    return sorted[0].url;
  }

  // 2. Fallback to hardcoded images
  const map: Record<string, string> = {
    'sultani-herbal-majoon': '/images/product-majoon.png',
    'sultani-herbal-hair-oil': '/images/product-hair-oil.png',
    'sultani-herbal-capsule-joint-bone': '/images/product-joint-bone.png',
    'sultani-herbal-capsule-weight-loss': '/images/product-weight-loss.png',
  };
  return map[product.slug] || '/images/product-majoon.png';
}
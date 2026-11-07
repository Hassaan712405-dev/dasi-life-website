import { getProductBySlug, getProducts } from './getProducts';
import type { Product } from '@/types/database';

// Get a single product by slug with related products
export async function getProductWithRelated(slug: string): Promise<{
  product: Product | null;
  relatedProducts: Product[];
}> {
  const product = await getProductBySlug(slug);

  if (!product) {
    return { product: null, relatedProducts: [] };
  }

  // Fetch related products (same category, excluding current)
  const allInCategory = await getProducts({
    categorySlug: product.category_id ? undefined : undefined,
  });

  const relatedProducts = allInCategory
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return { product, relatedProducts };
}
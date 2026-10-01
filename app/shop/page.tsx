import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import ShopSidebar from '@/components/products/ShopSidebar';
import { getProducts } from '@/services/products/getProducts';
import { getProductImageUrl } from '@/lib/utils/productImage';
import { createClient } from '@/lib/supabase/server';
import FadeIn from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  }>;
}) {
  const { category, minPrice, maxPrice, sortBy } = await searchParams;

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order');

  const products = await getProducts({
    categorySlug: category,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy: (sortBy as any) || 'popularity',
    limit: 100,
  });

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8">
        {/* Breadcrumb */}
        <FadeIn>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs md:text-sm text-brand-text-muted mb-3 sm:mb-4">
            <Link href="/" className="hover:text-brand-green transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-brand-green font-medium">Shop</span>
          </div>
        </FadeIn>

        {/* Heading */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
              {category
                ? categories?.find((c) => c.slug === category)?.name || 'Shop'
                : 'Our Products'}
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted">
              Showing {products.length} of {products.length} results
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="container-custom pb-10 sm:pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          <ShopSidebar
            categories={categories || []}
            activeCategory={category}
          />

          <div>
            {products.length === 0 ? (
              <FadeIn>
                <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
                  <p className="text-xs sm:text-sm text-brand-text-muted mb-4">
                    No products found matching your filters.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-brand-green hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
                  >
                    Reset Filters
                  </Link>
                </div>
              </FadeIn>
            ) : (
              <Stagger
                staggerDelay={0.1}
                className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6"
              >
                {products.map((product) => (
                  <StaggerItem key={product.id}>
                    <ProductCard
                      name={product.name}
                      slug={product.slug}
                      shortDescription={product.short_description || ''}
                      price={product.price}
                      compareAtPrice={product.compare_at_price || product.price}
                      imageUrl={getProductImageUrl(product)}
                      productId={product.id}
                    />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
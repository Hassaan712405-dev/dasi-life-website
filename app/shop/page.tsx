import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { getProducts } from '@/services/products/getProducts';
import { getProductImageUrl } from '@/lib/utils/productImage';
import { createPublicClient } from '@/lib/supabase/public';
import FadeIn from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

export const revalidate = 600;

export default async function ShopPage() {
  const supabase = createPublicClient();

  const [products, totalCountResult] = await Promise.all([
    getProducts({ limit: 100 }),
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
  ]);

  const totalCount = totalCountResult.count || 0;

  return (
    <div className="bg-brand-cream min-h-screen relative overflow-hidden">
      {/* Botanical Accent */}
      <div className="absolute top-20 right-0 w-64 h-64 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#1B5E20">
          <path d="M50 10 Q30 30 30 50 Q30 70 50 90 Q70 70 70 50 Q70 30 50 10 Z" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="container-custom pt-6 md:pt-10 pb-16 sm:pb-20 relative z-10">
        {/* Breadcrumb */}
        <FadeIn>
          <nav
            className="flex items-center gap-2 text-[11px] sm:text-xs md:text-sm text-brand-text-muted mb-4 sm:mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-brand-green transition-colors duration-300">
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-brand-green font-semibold">Shop</span>
          </nav>
        </FadeIn>

        {/* Header Section */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 sm:mb-10 md:mb-12 pb-6 sm:pb-8 border-b border-[#EBE4D6]">
            <div>
              <p className="text-[#C9A961] font-semibold text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-2">
                Discover
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-brand-green leading-tight">
                Our Products
              </h1>
              <p className="text-sm text-brand-text-muted mt-3 max-w-lg">
                Discover our curated collection of premium herbal wellness
                products — thoughtfully crafted for your everyday care.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#EBE4D6] px-4 py-2.5 rounded-full shadow-sm shrink-0">
              <Package size={16} className="text-brand-green" />
              <span className="text-xs sm:text-sm text-brand-text-dark font-medium">
                Showing <strong className="text-brand-green">{products.length}</strong> products
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Products Grid */}
        {products.length === 0 ? (
          <FadeIn>
            <div className="bg-white rounded-2xl border border-[#EBE4D6] p-12 sm:p-16 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-brand-green/10 flex items-center justify-center">
                <Package size={28} className="text-brand-green" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-green mb-3">
                No Products Available
              </h3>
              <p className="text-sm text-brand-text-muted mb-6 max-w-sm mx-auto">
                Our collection is being refreshed. Please check back soon for
                our latest herbal wellness products.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
              >
                Back to Home
              </Link>
            </div>
          </FadeIn>
        ) : (
          <Stagger
            staggerDelay={0.08}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  compareAtPrice={product.compare_at_price || undefined}
                  imageUrl={getProductImageUrl(product)}
                  rating={product.rating_avg}
                  reviewCount={product.rating_count}
                />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}
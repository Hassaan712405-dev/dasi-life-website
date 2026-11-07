'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { getProductImageUrl } from '@/lib/utils/productImage';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/types/database';

export default function BestsellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(url, alt, sort_order)')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Failed to fetch featured products:', error);
      }

      if (data) {
        setProducts((data as Product[]).filter(Boolean));
      }
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-[#FDFBF7]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-xl h-72 sm:h-80 border border-[#EBE4D6]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#FDFBF7]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-[#1B5E20] mb-3">
            Our Products
          </h2>
          <p className="text-brand-text-muted text-xs sm:text-sm md:text-base max-w-md mx-auto px-2">
            &ldquo;Pure herbal care, naturally sourced&rdquo;
          </p>
          <div className="w-16 h-[2px] bg-[#C9A961] mx-auto mt-5 sm:mt-6" />
        </div>

        {/* Product Grid — mobile: 2 cols, tablet: 2, desktop: 4 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) =>
            product ? (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                compareAtPrice={product.compare_at_price || undefined}
                imageUrl={getProductImageUrl(product)}
                rating={product.rating_avg}
                reviewCount={product.rating_count}
              />
            ) : null
          )}
        </div>

        {/* Explore All Products Button */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 min-h-[48px] border-2 border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white font-medium rounded-md transition-all duration-300 text-sm sm:text-base group w-full sm:w-auto"
          >
            Explore All Products
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
    </section>
  );
}
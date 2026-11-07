import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { getProductImageUrl } from '@/lib/utils/productImage';

import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductBenefits from '@/components/products/ProductBenefits';
import ReviewSection from '@/components/products/ReviewSection';
import ProductCard from '@/components/products/ProductCard';

import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// ✅ Metadata generate karein
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('name, short_description, product_images(url)')
    .eq('slug', slug)
    .maybeSingle();

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const imageUrl = getProductImageUrl(product as any);

  return {
    title: `${product.name} | Dasi Life`,
    description: product.short_description || `Buy ${product.name} online at Dasi Life`,
    openGraph: {
      title: product.name,
      description: product.short_description || '',
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // ✅ Product fetch karein
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images ( id, url, alt, sort_order, is_primary ),
      categories ( name, slug )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  // ✅ Related products fetch karein (same category, alag product)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*, product_images(url, alt, sort_order)')
    .eq('is_active', true)
    .neq('id', product.id)
    .eq('category_id', product.category_id)
    .limit(4);

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8 pb-12 md:pb-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-brand-text-muted mb-6 md:mb-8 flex-wrap">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-brand-green transition-colors">
            Shop
          </Link>
          {product.categories && (
            <>
              <ChevronRight size={14} />
              <Link
                href={`/category/${(product.categories as any).slug}`}
                className="hover:text-brand-green transition-colors"
              >
                {(product.categories as any).name}
              </Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="text-brand-green font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Main Section — Client component jisme Add to Cart, review button etc hain */}
        <ProductInfo product={product} />

        {/* Benefits */}
        <ProductBenefits />

        {/* Reviews Section */}
        <div className="mt-12 md:mt-16">
          <ReviewSection
            productId={product.id}         // ✅ Review submit ke liye zaroori
            productName={product.name}     // ✅ Sirf dikhane ke liye
          />
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-green mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard
                  key={rp.id}
                  id={rp.id}
                  name={rp.name}
                  slug={rp.slug}
                  price={rp.price}
                  compareAtPrice={rp.compare_at_price || undefined}
                  imageUrl={getProductImageUrl(rp as any)}
                  rating={rp.rating_avg}
                  reviewCount={rp.rating_count}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
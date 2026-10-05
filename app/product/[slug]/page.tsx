import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductCard from '@/components/products/ProductCard';
import ReviewSection from '@/components/products/ReviewSection';
import ProductTabs from '@/components/products/ProductTabs';
import { getProductBySlug, getProducts } from '@/services/products/getProducts';
import { getProductImageUrl } from '@/lib/utils/productImage';
import FadeIn from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import type { Metadata } from 'next';

// ✅ 1 hour cache
export const revalidate = 3600;

// ✅ Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.short_description || product.description || '',
    openGraph: {
      title: product.name,
      description: product.short_description || product.description || '',
      images: [getProductImageUrl(product)],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ✅ Product aur related products parallel laao
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProducts({
    limit: 3,
    // agar related products ke liye category filter hai to:
    // categorySlug: product.category_slug
  });

  const imageUrl = getProductImageUrl(product);
  const images = [imageUrl, imageUrl, imageUrl, imageUrl];

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8">
        <FadeIn>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs md:text-sm text-brand-text-muted mb-4 sm:mb-6 flex-wrap">
            <Link href="/" className="hover:text-brand-green transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link href="/shop" className="hover:text-brand-green transition-colors">
              Shop
            </Link>
            <ChevronRight size={12} />
            <span className="text-brand-green font-medium truncate max-w-[150px] sm:max-w-none">
              {product.name}
            </span>
          </div>
        </FadeIn>
      </div>

      <div className="container-custom pb-10 sm:pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-10 sm:mb-12 md:mb-16">
          <FadeIn delay={0.1}>
            <ProductGallery images={images} alt={product.name} />
          </FadeIn>
          <FadeIn delay={0.2}>
            <ProductInfo
              name={product.name}
              slug={product.slug}
              price={product.price}
              compareAtPrice={product.compare_at_price || product.price}
              description={product.description || product.short_description || ''}
              rating={product.rating_avg || 5}
              reviewCount={product.rating_count || 0}
              imageUrl={imageUrl}
              productId={product.id}
            />
          </FadeIn>
        </div>

        {/* ✅ Tabs — client component */}
        <ProductTabs product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <FadeIn>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-5 sm:mb-6 md:mb-8">
                Related Essentials
              </h2>
            </FadeIn>
            <Stagger
              staggerDelay={0.08}
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
            >
              {relatedProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 3)
                .map((p) => (
                  <StaggerItem key={p.id}>
                    <ProductCard
                      name={p.name}
                      slug={p.slug}
                      shortDescription={p.short_description || ''}
                      price={p.price}
                      compareAtPrice={p.compare_at_price || p.price}
                      imageUrl={getProductImageUrl(p)}
                      productId={p.id}
                    />
                  </StaggerItem>
                ))}
            </Stagger>
          </div>
        )}
      </div>
    </div>
  );
}
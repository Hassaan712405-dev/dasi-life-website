import Link from 'next/link';
import { ChevronRight, Package, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductCard from '@/components/products/ProductCard';
import ProductVideo from '@/components/products/ProductVideo';
import ReviewSection from '@/components/products/ReviewSection';
import StickyCTA from '@/components/products/StickyCTA';
import { getProductBySlug, getProducts } from '@/services/products/getProducts';
import { getProductImageUrl } from '@/lib/utils/productImage';
import FadeIn from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import type { Metadata } from 'next';

export const revalidate = 3600;

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

  const imageUrl = getProductImageUrl(product);

  return {
    title: product.name,
    description: product.short_description || product.description || '',
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.short_description || product.description || '',
      images: [imageUrl],
      url: `https://www.dasilife.store/product/${product.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.short_description || product.description || '',
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProducts({
    limit: 4,
    categorySlug: product.category_id ? undefined : undefined,
  });

  // ✅ Multi-image support (primary first)
  const images =
    product.product_images && product.product_images.length > 0
      ? [...product.product_images]
          .sort((a: any, b: any) => {
            if (a.is_primary && !b.is_primary) return -1;
            if (!a.is_primary && b.is_primary) return 1;
            return (a.sort_order || 0) - (b.sort_order || 0);
          })
          .map((img: any) => img.url)
      : [getProductImageUrl(product)];

  const imageUrl = images[0];

  // ✅ Product Schema
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || product.description || '',
    image: images,
    sku: product.sku || product.id,
    brand: { '@type': 'Brand', name: 'Dasi Life' },
    offers: {
      '@type': 'Offer',
      url: `https://www.dasilife.store/product/${product.slug}`,
      priceCurrency: 'PKR',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  // ✅ Breadcrumb Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dasilife.store' },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://www.dasilife.store/shop' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://www.dasilife.store/product/${product.slug}` },
    ],
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <div className="container-custom pt-6 md:pt-8">
        <FadeIn>
          <nav
            className="flex items-center gap-2 text-[10px] sm:text-xs md:text-sm text-brand-text-muted mb-4 sm:mb-6 flex-wrap"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/shop" className="hover:text-brand-green transition-colors">Shop</Link>
            <ChevronRight size={12} />
            <span className="text-brand-green font-medium truncate max-w-[150px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </FadeIn>
      </div>

      {/* Main Product Section */}
      <div className="container-custom pb-10 sm:pb-12 md:pb-16 pb-24 lg:pb-16">
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
              stock={product.stock}
              sku={product.sku}
              variants={product.product_variants || []}
            />
          </FadeIn>
        </div>

        {/* ✅ Video Section — Moved up, right after gallery */}
        <ProductVideo
          videoUrl={product.video_url}
          posterUrl={imageUrl}
          productName={product.name}
        />

        {/* ✅ Description Section */}
        {product.description && (
          <FadeIn>
            <section className="mb-10 sm:mb-12 md:mb-16">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-brand-green">
                  Description
                </h2>
              </div>
              <div className="w-16 h-[2px] bg-[#C9A961] mb-5" />
              <div className="bg-white rounded-xl border border-[#EBE4D6] p-5 sm:p-6 md:p-8">
                <p className="text-sm sm:text-base text-brand-text-dark leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </section>
          </FadeIn>
        )}

        {/* ✅ How to Use Section */}
        {product.usage_instructions && (
          <FadeIn>
            <section className="mb-10 sm:mb-12 md:mb-16">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-brand-green">
                  How to Use
                </h2>
              </div>
              <div className="w-16 h-[2px] bg-[#C9A961] mb-5" />
              <div className="bg-white rounded-xl border border-[#EBE4D6] p-5 sm:p-6 md:p-8">
                <ol className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-brand-text-dark leading-relaxed list-decimal list-inside">
                  {product.usage_instructions
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((step, index) => (
                      <li key={index} className="pl-2">
                        {step.replace(/^\d+\.\s*/, '')}
                      </li>
                    ))}
                </ol>
              </div>
            </section>
          </FadeIn>
        )}

        {/* ✅ Specifications — Only Expire Life */}
        {product.shelf_life && (
          <FadeIn>
            <section className="mb-10 sm:mb-12 md:mb-16">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-brand-green">
                  Product Details
                </h2>
              </div>
              <div className="w-16 h-[2px] bg-[#C9A961] mb-5" />
              <div className="bg-white rounded-xl border border-[#EBE4D6] p-5 sm:p-6 md:p-8">
                <ul className="space-y-3 text-sm sm:text-base text-brand-text-dark leading-relaxed">
                  <li className="flex items-start gap-2">
                    <strong className="text-brand-green shrink-0">Expire Life:</strong>
                    <span>{product.shelf_life}</span>
                  </li>
                </ul>
              </div>
            </section>
          </FadeIn>
        )}

        {/* ✅ Reviews Section */}
        <FadeIn>
          <section id="reviews" className="mb-10 sm:mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-brand-green">
                Customer Reviews
              </h2>
            </div>
            <div className="w-16 h-[2px] bg-[#C9A961] mb-5" />
            <div className="bg-white rounded-xl border border-[#EBE4D6] p-5 sm:p-6 md:p-8">
              <ReviewSection productId={product.id} productName={product.name} />
            </div>
          </section>
        </FadeIn>

        {/* ✅ Related Products */}
        {relatedProducts.filter((p) => p.id !== product.id).length > 0 && (
          <FadeIn>
            <section>
              <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6 md:mb-8 flex-wrap">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green">
                    Related Essentials
                  </h2>
                  <div className="w-16 h-[2px] bg-[#C9A961] mt-3" />
                </div>
                <Link
                  href="/shop"
                  className="text-xs sm:text-sm font-medium text-brand-green hover:text-black transition-colors"
                >
                  View All →
                </Link>
              </div>
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
            </section>
          </FadeIn>
        )}
      </div>

      {/* ✅ Sticky CTA (mobile only) */}
      <StickyCTA
        productId={product.id}
        name={product.name}
        slug={product.slug}
        price={product.price}
        imageUrl={imageUrl}
        stock={product.stock}
      />
    </div>
  );
}
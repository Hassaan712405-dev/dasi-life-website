import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductCard from '@/components/products/ProductCard';
import ProductTabs from '@/components/products/ProductTabs';
import ProductBenefits from '@/components/products/ProductBenefits';
import StickyCTA from '@/components/products/StickyCTA';
import ProductVideo from '@/components/products/ProductVideo';
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

  const images =
    product.product_images && product.product_images.length > 0
      ? [...product.product_images]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => img.url)
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
    brand: {
      '@type': 'Brand',
      name: 'Dasi Life',
    },
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
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.dasilife.store',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://www.dasilife.store/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://www.dasilife.store/product/${product.slug}`,
      },
    ],
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* ✅ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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

        {/* ✅ Product Video */}
        <ProductVideo
          videoUrl={product.video_url}
          posterUrl={imageUrl}
          productName={product.name}
        />

        {/* ✅ Product Benefits */}
        <ProductBenefits />

        {/* ✅ Tabs */}
        <ProductTabs product={product} />

        {/* Related Products */}
        {relatedProducts.filter((p) => p.id !== product.id).length > 0 && (
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
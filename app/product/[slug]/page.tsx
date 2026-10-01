'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useParams, notFound } from 'next/navigation';
import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductCard from '@/components/products/ProductCard';
import ReviewSection from '@/components/products/ReviewSection';
import { createClient } from '@/lib/supabase/client';
import { getProductImageUrl } from '@/lib/utils/productImage';
import type { Product } from '@/types/database';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: productData, error } = await supabase
        .from('products')
        .select('*, product_images(url, alt, sort_order)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error || !productData) {
        setLoading(false);
        return;
      }

      setProduct(productData as Product);

      const { data: relatedData } = await supabase
        .from('products')
        .select('*, product_images(url, alt, sort_order)')
        .eq('is_active', true)
        .neq('id', productData.id)
        .limit(3);

      setRelatedProducts((relatedData as Product[]) || []);
      setLoading(false);
    }

    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-brand-cream min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-brand-green" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const imageUrl = getProductImageUrl(product);
  const images = [imageUrl, imageUrl, imageUrl, imageUrl];

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8">
        <div className="flex items-center gap-2 text-xs md:text-sm text-brand-text-muted mb-6">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-brand-green transition-colors">
            Shop
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-green font-medium">{product.name}</span>
        </div>
      </div>

      <div className="container-custom pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-12 md:mb-16">
          <ProductGallery images={images} alt={product.name} />
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
        </div>

        <div className="border-b border-gray-300 mb-8">
          <div className="flex items-center gap-8 text-sm md:text-base">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 transition-colors ${
                activeTab === 'description'
                  ? 'font-semibold text-brand-green border-b-2 border-brand-green'
                  : 'text-brand-text-muted hover:text-brand-green'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors ${
                activeTab === 'reviews'
                  ? 'font-semibold text-brand-green border-b-2 border-brand-green'
                  : 'text-brand-text-muted hover:text-brand-green'
              }`}
            >
              Reviews ({product.rating_count || 0})
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 transition-colors ${
                activeTab === 'shipping'
                  ? 'font-semibold text-brand-green border-b-2 border-brand-green'
                  : 'text-brand-text-muted hover:text-brand-green'
              }`}
            >
              Shipping Info
            </button>
          </div>
        </div>

        {activeTab === 'description' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:mb-16">
            <div>
              <h3 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-3">
                Ingredients & Traditional Preparation
              </h3>
              <p className="text-sm text-brand-text-muted leading-relaxed">
                {product.ingredients ||
                  'Premium natural ingredients crafted according to authentic Unani scriptures.'}
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-3">
                Recommended Usage
              </h3>
              <p className="text-sm text-brand-text-muted leading-relaxed">
                {product.usage_instructions ||
                  'Use as directed by your physician. Store in a cool, dry place.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="mb-12 md:mb-16">
            <ReviewSection
              productId={product.id}
              productName={product.name}
            />
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="mb-12 md:mb-16 max-w-3xl">
            <h3 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              Shipping Information
            </h3>
            <ul className="space-y-3 text-sm text-brand-text-muted leading-relaxed">
              <li>
                <strong className="text-brand-text-dark">Delivery Time:</strong> 3-5 business days for major cities, 5-7 days for remote areas.
              </li>
              <li>
                <strong className="text-brand-text-dark">Shipping Fee:</strong> Free on orders above Rs 3,000. Rs 200 for orders below.
              </li>
              <li>
                <strong className="text-brand-text-dark">Payment:</strong> Cash on Delivery (COD) nationwide.
              </li>
              <li>
                <strong className="text-brand-text-dark">Tracking:</strong> You'll receive a tracking link via SMS after dispatch.
              </li>
            </ul>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-brand-green mb-6 md:mb-8">
              Related Essentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  slug={p.slug}
                  shortDescription={p.short_description || ''}
                  price={p.price}
                  compareAtPrice={p.compare_at_price || p.price}
                  imageUrl={getProductImageUrl(p)}
                  productId={p.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import ReviewSection from '@/components/products/ReviewSection';
import FadeIn from '@/components/motion/FadeIn';
import type { Product } from '@/types/database';

export default function ProductTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>(
    'description'
  );

  return (
    <>
      {/* Tabs */}
      <FadeIn>
        <div className="border-b border-gray-300 mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex items-center gap-5 sm:gap-8 text-xs sm:text-sm md:text-base whitespace-nowrap">
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
      </FadeIn>

      {/* Tab Content */}
      {activeTab === 'description' && (
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12 md:mb-16">
            <div>
              <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-3">
                Ingredients & Traditional Preparation
              </h3>
              <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                {product.ingredients ||
                  'Premium natural ingredients crafted according to authentic Unani scriptures.'}
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-3">
                Recommended Usage
              </h3>
              <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                {product.usage_instructions ||
                  'Use as directed by your physician. Store in a cool, dry place.'}
              </p>
            </div>
          </div>
        </FadeIn>
      )}

      {activeTab === 'reviews' && (
        <div className="mb-10 sm:mb-12 md:mb-16">
          <ReviewSection productId={product.id} productName={product.name} />
        </div>
      )}

      {activeTab === 'shipping' && (
        <FadeIn>
          <div className="mb-10 sm:mb-12 md:mb-16 max-w-3xl">
            <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-4">
              Shipping Information
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-brand-text-muted leading-relaxed">
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
        </FadeIn>
      )}
    </>
  );
}
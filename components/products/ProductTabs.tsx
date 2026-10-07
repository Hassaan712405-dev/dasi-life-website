'use client';

import { useState } from 'react';
import ReviewSection from '@/components/products/ReviewSection';
import FadeIn from '@/components/motion/FadeIn';
import type { Product } from '@/types/database';

export default function ProductTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<
    'description' | 'reviews' | 'shipping'
  >('description');

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
            {/* Ingredients */}
            <div>
              <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-3">
                Ingredients
              </h3>
              <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed whitespace-pre-line">
                {product.ingredients ||
                  'Premium natural ingredients crafted according to authentic Unani scriptures.'}
              </p>
            </div>

            {/* How to Use — Numbered */}
            <div>
              <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-3">
                How to Use
              </h3>
              {product.usage_instructions ? (
                <ol className="space-y-2 text-xs sm:text-sm text-brand-text-muted leading-relaxed list-decimal list-inside">
                  {product.usage_instructions
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((step, index) => (
                      <li key={index}>{step.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                </ol>
              ) : (
                <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                  Use as directed by your physician. Store in a cool, dry place.
                </p>
              )}
            </div>

            {/* Specifications — Agar data hai toh */}
            {(product.storage_instructions ||
              product.shelf_life ||
              product.suitable_for) && (
              <div className="md:col-span-2">
                <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-3">
                  Specifications
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                  {product.storage_instructions && (
                    <li>
                      <strong className="text-brand-text-dark">Storage:</strong>{' '}
                      {product.storage_instructions}
                    </li>
                  )}
                  {product.shelf_life && (
                    <li>
                      <strong className="text-brand-text-dark">Shelf Life:</strong>{' '}
                      {product.shelf_life}
                    </li>
                  )}
                  {product.suitable_for && (
                    <li>
                      <strong className="text-brand-text-dark">Suitable For:</strong>{' '}
                      {product.suitable_for}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Warnings — Agar data hai toh */}
            {product.warnings && (
              <div className="md:col-span-2">
                <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-3">
                  Warnings
                </h3>
                <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                  {product.warnings}
                </p>
              </div>
            )}
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
                <strong className="text-brand-text-dark">Delivery Time:</strong>{' '}
                3-5 business days for major cities, 5-7 days for remote areas.
              </li>
              <li>
                <strong className="text-brand-text-dark">Shipping Fee:</strong>{' '}
                Free Shipping
              </li>
              <li>
                <strong className="text-brand-text-dark">Payment:</strong> Cash
                on Delivery (COD) nationwide.
              </li>
              <li>
                <strong className="text-brand-text-dark">Tracking:</strong>{' '}
                You'll receive a tracking link via SMS after dispatch.
              </li>
            </ul>
          </div>
        </FadeIn>
      )}
    </>
  );
}
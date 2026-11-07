'use client';

import { motion } from 'framer-motion';
import type { ProductVariant } from '@/types/database';

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variant: ProductVariant) => void;
}

export default function ProductVariants({
  variants,
  selectedVariantId,
  onSelect,
}: ProductVariantsProps) {
  // ✅ Agar variants nahi hain, kuch bhi render nahi karo
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 sm:mb-5">
      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-2">
        Select Option
      </label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isOutOfStock = variant.stock === 0;

          return (
            <motion.button
              key={variant.id}
              type="button"
              onClick={() => !isOutOfStock && onSelect(variant)}
              disabled={isOutOfStock}
              whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
              className={`relative px-3 sm:px-4 py-2 rounded-md border-2 text-xs sm:text-sm font-medium transition-all ${
                isOutOfStock
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                  : isSelected
                  ? 'border-brand-green bg-brand-green text-white'
                  : 'border-gray-300 text-brand-text-dark hover:border-brand-green'
              }`}
            >
              {variant.name}
              {isOutOfStock && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] sm:text-[10px] px-1 py-0.5 rounded-full">
                  ✕
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
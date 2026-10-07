'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Leaf,
  Truck,
  ShieldCheck,
  Check,
  Heart,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductVariants from './ProductVariants';
import { trackAddToCart, trackViewContent } from '@/lib/analytics/events';
import type { ProductVariant } from '@/types/database';

interface ProductInfoProps {
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number;
  description: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  productId?: string;
  stock: number;
  sku?: string | null;
  variants?: ProductVariant[];
}

export default function ProductInfo({
  name,
  slug,
  price,
  compareAtPrice,
  description,
  rating,
  reviewCount,
  imageUrl,
  productId,
  stock,
  sku,
  variants = [],
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const id = productId || slug;
  const inWishlist = isInWishlist(id);

  const sortedVariants = useMemo(() => {
    if (!variants || variants.length === 0) return [];
    return [...variants].sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );
  }, [variants]);

  const hasVariants = sortedVariants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants ? sortedVariants[0] : null
  );

  const activePrice = selectedVariant ? selectedVariant.price : price;
  const activeCompareAtPrice = selectedVariant
    ? selectedVariant.compare_at_price || selectedVariant.price
    : compareAtPrice;
  const activeStock = selectedVariant ? selectedVariant.stock : stock;
  const activeSku = selectedVariant ? selectedVariant.sku : sku;

  // ✅ ViewContent — sirf page load pe ek baar
  useEffect(() => {
    trackViewContent({
      id,
      name,
      price: activePrice,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?.id]);

  const cartItemId = selectedVariant
    ? `${id}::${selectedVariant.id}`
    : id;
  const inCart = isInCart(cartItemId);
  const isOutOfStock = activeStock === 0;

  const discountPercent =
    activeCompareAtPrice > activePrice
      ? Math.round(
          ((activeCompareAtPrice - activePrice) / activeCompareAtPrice) * 100
        )
      : 0;

  const increaseQty = () => {
    if (quantity < activeStock) setQuantity((q) => q + 1);
  };
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      {
        productId: id,
        variantId: selectedVariant?.id,
        name,
        variantName: selectedVariant?.name,
        slug,
        price: activePrice,
        imageUrl: imageUrl || '/images/product-majoon.png',
      },
      quantity
    );

    // ✅ AddToCart tracking
    trackAddToCart({
      id,
      name,
      price: activePrice,
      quantity,
      variantName: selectedVariant?.name,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(
      {
        productId: id,
        variantId: selectedVariant?.id,
        name,
        variantName: selectedVariant?.name,
        slug,
        price: activePrice,
        imageUrl: imageUrl || '/images/product-majoon.png',
      },
      quantity
    );

    trackAddToCart({
      id,
      name,
      price: activePrice,
      quantity,
      variantName: selectedVariant?.name,
    });

    router.push('/checkout');
  };

  const handleWishlistToggle = async () => {
    if (inWishlist) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green leading-tight mb-2 sm:mb-3">
        {name}
      </h1>

      {activeSku && (
        <p className="text-[10px] sm:text-xs text-brand-text-muted mb-2">
          SKU: {activeSku}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(rating)
                    ? 'text-brand-gold fill-brand-gold'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-brand-text-muted">
            ({reviewCount} Reviews)
          </span>
        </div>

        <motion.button
          type="button"
          onClick={handleWishlistToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all ${
            inWishlist
              ? 'border-red-500 bg-red-50 text-red-500'
              : 'border-gray-300 text-brand-text-muted hover:border-red-500 hover:text-red-500'
          }`}
        >
          <Heart
            size={14}
            className={inWishlist ? 'fill-red-500 text-red-500' : ''}
          />
          <span className="text-xs sm:text-sm font-medium">
            {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </span>
        </motion.button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-green">
          Rs {activePrice.toLocaleString()}
        </span>
        {activeCompareAtPrice > activePrice && (
          <>
            <span className="text-sm sm:text-base md:text-lg text-brand-text-muted line-through">
              Rs {activeCompareAtPrice.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm font-bold bg-red-500 text-white px-2 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      <div className="mb-4">
        {activeStock > 10 ? (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            In Stock
          </span>
        ) : activeStock > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-orange-600">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Only {activeStock} left in stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-red-600">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Out of Stock
          </span>
        )}
      </div>

      <p className="text-xs sm:text-sm md:text-base text-brand-text-muted leading-relaxed mb-4 sm:mb-6">
        {description}
      </p>

      <ProductVariants
        variants={sortedVariants}
        selectedVariantId={selectedVariant?.id || null}
        onSelect={(v) => setSelectedVariant(v)}
      />

      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-4 sm:mb-5">
        <div className="flex items-center border-2 border-gray-300 rounded-md overflow-hidden self-start">
          <button
            type="button"
            onClick={decreaseQty}
            disabled={isOutOfStock}
            className="w-9 sm:w-10 h-10 sm:h-12 flex items-center justify-center text-brand-green hover:bg-brand-cream transition-colors disabled:opacity-50"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center font-medium text-brand-text-dark text-sm sm:text-base">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increaseQty}
            disabled={isOutOfStock || quantity >= activeStock}
            className="w-9 sm:w-10 h-10 sm:h-12 flex items-center justify-center text-brand-green hover:bg-brand-cream transition-colors disabled:opacity-50"
          >
            <Plus size={14} />
          </button>
        </div>

        <motion.button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          whileTap={{ scale: isOutOfStock ? 1 : 0.97 }}
          className={`flex-1 inline-flex items-center justify-center gap-2 font-medium px-5 sm:px-6 py-3 rounded-md transition-colors text-xs sm:text-sm ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : justAdded
              ? 'bg-green-600 text-white'
              : 'bg-brand-green hover:bg-black text-white'
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : justAdded ? (
            <>
              <Check size={16} strokeWidth={3} />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              {inCart ? 'Add More' : 'Add to Cart'}
            </>
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          whileTap={{ scale: isOutOfStock ? 1 : 0.97 }}
          className={`flex-1 font-medium px-5 sm:px-6 py-3 rounded-md transition-colors text-xs sm:text-sm ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-brand-gold hover:bg-black text-white'
          }`}
        >
          Buy It Now
        </motion.button>
      </div>

      <div className="bg-brand-cream/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-5">
        <div className="flex items-start gap-2 mb-2">
          <Truck size={16} className="text-brand-green shrink-0 mt-0.5" />
          <div>
            <p className="text-xs sm:text-sm font-medium text-brand-text-dark">
              Delivery in 3-5 business days
            </p>
            <p className="text-[10px] sm:text-xs text-brand-text-muted">
              Free shipping
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-brand-cream rounded-lg p-2.5 sm:p-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Leaf size={14} className="text-brand-green shrink-0" />
          <span className="text-[10px] sm:text-xs md:text-sm text-brand-text-dark">
            100% Organic
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Truck size={14} className="text-brand-green shrink-0" />
          <span className="text-[10px] sm:text-xs md:text-sm text-brand-text-dark">
            Cash on Delivery
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ShieldCheck size={14} className="text-brand-green shrink-0" />
          <span className="text-[10px] sm:text-xs md:text-sm text-brand-text-dark">
            Secure Ordering
          </span>
        </div>
      </div>
    </motion.div>
  );
}
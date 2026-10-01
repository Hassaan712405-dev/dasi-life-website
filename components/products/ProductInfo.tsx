'use client';

import { useState } from 'react';
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
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const id = productId || slug;
  const inCart = isInCart(id);
  const inWishlist = isInWishlist(id);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart(
      {
        productId: id,
        name,
        slug,
        price,
        imageUrl: imageUrl || '/images/product-majoon.png',
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(
      {
        productId: id,
        name,
        slug,
        price,
        imageUrl: imageUrl || '/images/product-majoon.png',
      },
      quantity
    );
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
      {/* Product Name */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green leading-tight mb-2 sm:mb-3">
        {name}
      </h1>

      {/* Rating + Wishlist */}
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

      {/* Price */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-green">
          Rs {price.toLocaleString()}
        </span>
        <span className="text-sm sm:text-base md:text-lg text-brand-text-muted line-through">
          Rs {compareAtPrice.toLocaleString()}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm md:text-base text-brand-text-muted leading-relaxed mb-4 sm:mb-6">
        {description}
      </p>

      {/* Quantity + Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-4 sm:mb-5">
        {/* Quantity Selector */}
        <div className="flex items-center border-2 border-gray-300 rounded-md overflow-hidden self-start">
          <button
            type="button"
            onClick={decreaseQty}
            className="w-9 sm:w-10 h-10 sm:h-12 flex items-center justify-center text-brand-green hover:bg-brand-cream transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center font-medium text-brand-text-dark text-sm sm:text-base">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increaseQty}
            className="w-9 sm:w-10 h-10 sm:h-12 flex items-center justify-center text-brand-green hover:bg-brand-cream transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Add to Cart */}
        <motion.button
          type="button"
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 inline-flex items-center justify-center gap-2 font-medium px-5 sm:px-6 py-3 rounded-md transition-colors text-xs sm:text-sm ${
            justAdded
              ? 'bg-green-600 text-white'
              : 'bg-brand-green hover:bg-black text-white'
          }`}
        >
          {justAdded ? (
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

        {/* Buy It Now */}
        <motion.button
          type="button"
          onClick={handleBuyNow}
          whileTap={{ scale: 0.97 }}
          className="flex-1 bg-brand-gold hover:bg-black text-white font-medium px-5 sm:px-6 py-3 rounded-md transition-colors text-xs sm:text-sm"
        >
          Buy It Now
        </motion.button>
      </div>

      {/* Trust Badges */}
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
            Free Shipping
          </span>
        </div>
      </div>
    </motion.div>
  );
}
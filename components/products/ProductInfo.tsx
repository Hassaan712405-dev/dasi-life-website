'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="w-full">
      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green leading-tight mb-3">
        {name}
      </h1>

      {/* Rating + Wishlist */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(rating)
                    ? 'text-brand-gold fill-brand-gold'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-sm text-brand-text-muted">
            ({reviewCount} Customer Reviews)
          </span>
        </div>

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            inWishlist
              ? 'border-red-500 bg-red-50 text-red-500'
              : 'border-gray-300 text-brand-text-muted hover:border-red-500 hover:text-red-500'
          }`}
        >
          <Heart
            size={16}
            className={inWishlist ? 'fill-red-500 text-red-500' : ''}
          />
          <span className="text-sm font-medium">
            {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </span>
        </button>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl md:text-3xl font-bold text-brand-green">
          Rs {price.toLocaleString()}
        </span>
        <span className="text-base md:text-lg text-brand-text-muted line-through">
          Rs {compareAtPrice.toLocaleString()}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm md:text-base text-brand-text-muted leading-relaxed mb-6">
        {description}
      </p>

      {/* Quantity + Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Quantity Selector */}
        <div className="flex items-center border-2 border-gray-300 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={decreaseQty}
            className="w-10 h-12 flex items-center justify-center text-brand-green hover:bg-brand-cream transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 h-12 flex items-center justify-center font-medium text-brand-text-dark">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increaseQty}
            className="w-10 h-12 flex items-center justify-center text-brand-green hover:bg-brand-cream transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`btn-primary flex-1 ${
            justAdded ? '!bg-green-600 !border-green-600' : ''
          }`}
        >
          {justAdded ? (
            <>
              <Check size={18} strokeWidth={3} />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              {inCart ? 'Add More' : 'Add to Cart'}
            </>
          )}
        </button>

        {/* Buy It Now */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 bg-brand-gold hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors flex items-center justify-center"
        >
          Buy It Now
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 bg-brand-cream rounded-lg p-3 md:p-4">
        <div className="flex items-center gap-2">
          <Leaf size={16} className="text-brand-green shrink-0" />
          <span className="text-xs md:text-sm text-brand-text-dark">
            100% Organic
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-brand-green shrink-0" />
          <span className="text-xs md:text-sm text-brand-text-dark">
            Cash on Delivery
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-brand-green shrink-0" />
          <span className="text-xs md:text-sm text-brand-text-dark">
            Free Shipping
          </span>
        </div>
      </div>
    </div>
  );
}
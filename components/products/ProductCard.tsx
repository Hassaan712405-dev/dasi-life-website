'use client';

import Link from 'next/link';
import { ShoppingCart, Check, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number;
  imageUrl: string;
  productId?: string;
}

export default function ProductCard({
  name,
  slug,
  shortDescription,
  price,
  compareAtPrice,
  imageUrl,
  productId,
}: ProductCardProps) {
  const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const id = productId || slug;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: id,
      name,
      slug,
      price,
      imageUrl,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(id)) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id);
    }
  };

  const inCart = isInCart(id);
  const inWishlist = isInWishlist(id);

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:border-brand-green/30 transition-all duration-500 flex flex-col">
      {/* Image */}
      <Link
        href={`/product/${slug}`}
        className="block relative overflow-hidden bg-brand-cream"
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-brand-gold text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md shadow-md">
            {discount}% OFF
          </span>
        )}

        {inCart && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-brand-green text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md flex items-center gap-1">
            <Check size={10} strokeWidth={3} />
            <span className="hidden sm:inline">In Cart</span>
          </span>
        )}
      </Link>

      {/* Wishlist Heart */}
      <button
        type="button"
        onClick={handleWishlistToggle}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10"
      >
        <Heart
          size={14}
          className={
            inWishlist
              ? 'text-red-500 fill-red-500'
              : 'text-brand-text-muted sm:hidden'
          }
        />
        <Heart
          size={16}
          className={
            inWishlist
              ? 'text-red-500 fill-red-500 hidden sm:block'
              : 'text-brand-text-muted hidden sm:block'
          }
        />
      </button>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <Link href={`/product/${slug}`}>
          <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg text-brand-green hover:text-brand-green-light transition-colors line-clamp-2 mb-1.5 sm:mb-2">
            {name}
          </h3>
        </Link>

        <p className="text-[11px] sm:text-xs md:text-sm text-brand-text-muted leading-relaxed line-clamp-2 mb-2.5 sm:mb-3">
          {shortDescription}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
            <span className="text-sm sm:text-base md:text-lg font-bold text-brand-green">
              Rs {price.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted line-through">
              Rs {compareAtPrice.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium py-2 sm:py-2.5 rounded-md transition-colors border-2 ${
              justAdded
                ? 'bg-green-600 border-green-600 text-white'
                : 'bg-brand-green border-brand-green text-white hover:bg-black hover:border-black'
            }`}
          >
            {justAdded ? (
              <>
                <Check size={14} strokeWidth={3} />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
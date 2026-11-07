'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id?: string;
  productId?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
}

export default function ProductCard({
  id,
  productId,
  name,
  slug,
  price,
  compareAtPrice,
  imageUrl,
  rating = 0,
  reviewCount = 0,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const itemId = id || productId || slug;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(
      {
        productId: itemId,
        variantId: undefined,
        name,
        variantName: undefined,
        slug,
        price,
        imageUrl,
      },
      1
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars)
        stars.push(
          <Star key={i} size={12} className="fill-[#C9A961] text-[#C9A961]" />
        );
      else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star size={12} className="text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={12} className="fill-[#C9A961] text-[#C9A961]" />
            </div>
          </div>
        );
      } else stars.push(<Star key={i} size={12} className="text-gray-300" />);
    }
    return stars;
  };

  // ✅ Same design + same slide-fill hover effect on both buttons
  const btnClass =
    "relative overflow-hidden w-full bg-[#1B5E20] text-white text-xs sm:text-sm font-medium py-2.5 rounded-md transition-all duration-300 text-center block z-[1] " +
    "before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-full before:w-0 before:bg-black before:transition-all before:duration-300 before:rounded-md before:z-[-1] " +
    "hover:before:w-full";

  return (
    <div className="group bg-white rounded-xl border border-[#EBE4D6] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square bg-[#F8F6EF] overflow-hidden">
        <Link href={`/product/${slug}`} className="block w-full h-full relative">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${slug}`} className="mb-1 block">
          <h3 className="text-sm sm:text-base font-heading font-semibold text-brand-text-dark group-hover:text-brand-green transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-[2px]">{renderStars()}</div>
          <span className="text-[11px] text-brand-text-muted font-medium">
            {rating > 0
              ? `${rating.toFixed(1)} (${reviewCount} reviews)`
              : 'No reviews yet'}
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto mb-4 flex items-end gap-2">
          <span className="text-base sm:text-lg font-bold text-brand-green">
            Rs. {price.toLocaleString()}
          </span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-xs text-brand-text-muted line-through mb-0.5">
              Rs. {compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* ✅ 2 Buttons — same design + same hover effect */}
        <div className="grid grid-cols-2 gap-2">
          {/* View Details */}
          <Link href={`/product/${slug}`} className={btnClass}>
            <span className="relative z-10">View Details</span>
          </Link>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={btnClass}
          >
            <span className="relative z-10">
              {added ? '✓ Added' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
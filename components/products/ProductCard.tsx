'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/contexts/WishlistContext';
import { motion } from 'framer-motion';

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
  shortDescription,
  price,
  compareAtPrice,
  imageUrl,
  rating = 0,
  reviewCount = 0,
}: ProductCardProps) {
  const router = useRouter();
  const wishlist: any = useWishlist();

  // ✅ Support both `id` and `productId`
  const itemId = id || productId || slug;

  const isInWishlist = wishlist?.isInWishlist?.(itemId) ?? false;
  const toggleWishlist = wishlist?.toggleWishlist;
  const addToWishlist = wishlist?.addToWishlist;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();

    const item = {
      id: itemId,
      name,
      slug,
      price,
      imageUrl,
    };

    try {
      if (typeof toggleWishlist === 'function') {
        const result = await toggleWishlist(item);
        if (result?.success === false && result.reason === 'NOT_LOGGED_IN') {
          router.push('/login');
          return;
        }
      } else if (typeof addToWishlist === 'function') {
        const result = await addToWishlist(item);
        if (result?.success === false && result.reason === 'NOT_LOGGED_IN') {
          router.push('/login');
          return;
        }
      }
    } catch (err) {
      console.error('Wishlist Error:', err);
    }
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

        {/* Heart Icon */}
        <motion.button
          onClick={handleWishlist}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 z-10"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <motion.div
            key={isInWishlist ? 'filled' : 'empty'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            <Heart
              size={22}
              strokeWidth={2.2}
              className={`transition-all duration-300 ${
                isInWishlist
                  ? 'fill-[#1B5E20] text-[#1B5E20] drop-shadow-md'
                  : 'fill-transparent text-white drop-shadow-lg'
              }`}
            />
          </motion.div>
        </motion.button>
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

        {/* View Details Button */}
        <Link
          href={`/product/${slug}`}
          className="w-full bg-[#1B5E20] hover:bg-black text-white text-xs sm:text-sm font-medium py-2.5 rounded-md transition-colors text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
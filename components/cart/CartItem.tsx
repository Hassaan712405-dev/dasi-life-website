'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const subtotal = item.price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-[1fr_100px_140px_100px] gap-3 md:gap-4 items-center bg-white rounded-xl border border-gray-200 p-3 sm:p-4"
    >
      {/* Product Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href={`/product/${item.slug}`}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-brand-cream rounded-lg overflow-hidden shrink-0 relative"
        >
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/product/${item.slug}`}>
            <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg text-brand-green hover:text-brand-green-light transition-colors line-clamp-2 mb-1">
              {item.name}
            </h3>
          </Link>

          {item.variantName && (
            <p className="text-[10px] sm:text-xs text-brand-text-muted mb-1">
              Option: {item.variantName}
            </p>
          )}

          <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted mb-1">
            Rs {item.price.toLocaleString()}
          </p>
          <motion.button
            type="button"
            onClick={handleRemove}
            whileHover={{ x: 2 }}
            className="text-[10px] sm:text-xs md:text-sm text-brand-gold hover:text-red-500 transition-colors font-medium inline-flex items-center gap-1"
          >
            <Trash2 size={12} />
            Remove
          </motion.button>
        </div>
      </div>

      {/* Price */}
      <div className="text-center md:text-left">
        <span className="md:hidden text-[10px] text-brand-text-muted mr-2">
          Price:
        </span>
        <span className="text-xs sm:text-sm md:text-base font-medium text-brand-text-dark">
          Rs {item.price.toLocaleString()}
        </span>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-center">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <motion.button
            type="button"
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            whileTap={{ scale: 0.9 }}
            className="w-7 sm:w-8 h-8 sm:h-9 flex items-center justify-center text-brand-text-dark hover:bg-brand-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus size={12} />
          </motion.button>
          <span className="w-8 sm:w-10 h-8 sm:h-9 flex items-center justify-center text-xs sm:text-sm font-medium text-brand-text-dark">
            {item.quantity}
          </span>
          <motion.button
            type="button"
            onClick={handleIncrease}
            whileTap={{ scale: 0.9 }}
            className="w-7 sm:w-8 h-8 sm:h-9 flex items-center justify-center text-brand-text-dark hover:bg-brand-cream transition-colors"
          >
            <Plus size={12} />
          </motion.button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-center md:text-right">
        <span className="md:hidden text-[10px] text-brand-text-muted mr-2">
          Subtotal:
        </span>
        <span className="text-xs sm:text-sm md:text-base font-bold text-brand-green">
          Rs {subtotal.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}
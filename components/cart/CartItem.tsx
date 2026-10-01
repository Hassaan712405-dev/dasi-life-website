'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrease = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_140px_100px] gap-4 items-center bg-white rounded-xl border border-gray-200 p-4">
      {/* Product Info */}
      <div className="flex items-center gap-4">
        <Link
          href={`/product/${item.slug}`}
          className="w-20 h-20 md:w-24 md:h-24 bg-brand-cream rounded-lg overflow-hidden shrink-0"
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="min-w-0">
          <Link href={`/product/${item.slug}`}>
            <h3 className="font-heading font-semibold text-base md:text-lg text-brand-green hover:text-brand-green-light transition-colors line-clamp-2 mb-1">
              {item.name}
            </h3>
          </Link>
          <p className="text-xs md:text-sm text-brand-text-muted mb-1">
            Rs {item.price.toLocaleString()}
          </p>
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs md:text-sm text-brand-gold hover:text-red-500 transition-colors font-medium inline-flex items-center gap-1"
          >
            <Trash2 size={12} />
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-center md:text-left">
        <span className="md:hidden text-xs text-brand-text-muted mr-2">
          Price:
        </span>
        <span className="text-sm md:text-base font-medium text-brand-text-dark">
          Rs {item.price.toLocaleString()}
        </span>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-center">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            className="w-8 h-9 flex items-center justify-center text-brand-text-dark hover:bg-brand-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 h-9 flex items-center justify-center text-sm font-medium text-brand-text-dark">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            className="w-8 h-9 flex items-center justify-center text-brand-text-dark hover:bg-brand-cream transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-center md:text-right">
        <span className="md:hidden text-xs text-brand-text-muted mr-2">
          Subtotal:
        </span>
        <span className="text-sm md:text-base font-bold text-brand-green">
          Rs {subtotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
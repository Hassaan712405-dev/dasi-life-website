'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useSettings } from '@/contexts/SettingsContext';
import { calculateShippingFee } from '@/services/settings/settingsService';

export default function CartSummary() {
  const { getSubtotal, getTotalItems } = useCart();
  const { settings } = useSettings();

  const subtotal = getSubtotal();
  const shippingFee = settings
    ? calculateShippingFee(subtotal, settings)
    : 0;
  const total = subtotal + shippingFee;

  const freeThreshold = settings?.free_shipping_threshold || 3000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#F0EDE6] rounded-xl border border-gray-300 p-4 sm:p-6 lg:sticky lg:top-24"
    >
      <h2 className="font-heading font-semibold text-xl sm:text-2xl text-brand-green mb-4 sm:mb-5">
        Order Summary
      </h2>

      {/* Subtotal */}
      <div className="flex items-center justify-between py-2 sm:py-2.5 text-xs sm:text-sm md:text-base">
        <span className="text-brand-text-muted">
          Subtotal ({getTotalItems()} items)
        </span>
        <span className="font-medium text-brand-text-dark">
          Rs {subtotal.toLocaleString()}
        </span>
      </div>

      {/* Shipping */}
      <div className="flex items-center justify-between py-2 sm:py-2.5 text-xs sm:text-sm md:text-base border-b border-gray-300">
        <span className="text-brand-text-muted">Shipping</span>
        <span className="font-medium text-brand-green">
          {shippingFee === 0 ? 'FREE' : `Rs ${shippingFee.toLocaleString()}`}
        </span>
      </div>

      {/* Free Shipping Hint */}
      {subtotal > 0 && shippingFee > 0 && (
        <p className="text-[10px] sm:text-xs text-brand-gold mt-2 mb-1">
          Add Rs {(freeThreshold - subtotal).toLocaleString()} more for FREE delivery
        </p>
      )}

      {/* Total */}
      <div className="flex items-center justify-between py-3 sm:py-4">
        <span className="font-heading font-semibold text-base sm:text-lg md:text-xl text-brand-green">
          Total
        </span>
        <span className="font-heading font-bold text-base sm:text-lg md:text-xl text-brand-green">
          Rs {total.toLocaleString()}
        </span>
      </div>

      {/* Checkout Button */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Link
          href="/checkout"
          className="block w-full text-center bg-brand-green hover:bg-black text-white font-medium py-3 sm:py-3.5 rounded-md transition-colors mb-3 text-xs sm:text-sm"
        >
          Proceed to Checkout
        </Link>
      </motion.div>

      {/* Continue Shopping */}
      <div className="text-center">
        <Link
          href="/shop"
          className="text-xs sm:text-sm text-brand-gold hover:text-brand-green transition-colors underline"
        >
          Continue Shopping
        </Link>
      </div>
    </motion.div>
  );
}
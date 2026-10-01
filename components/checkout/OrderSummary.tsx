'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  onPlaceOrder: () => void;
  loading?: boolean;
}

export default function OrderSummary({
  items,
  subtotal,
  shippingFee,
  total,
  onPlaceOrder,
  loading,
}: OrderSummaryProps) {
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

      {/* Items */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs sm:text-sm text-brand-text-dark line-clamp-2">
                {item.name}
              </p>
              <p className="text-[10px] sm:text-xs text-brand-text-muted">
                Qty: {item.quantity} • Rs {item.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 pt-3 sm:pt-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between py-1.5 sm:py-2 text-xs sm:text-sm md:text-base">
          <span className="text-brand-text-muted">Subtotal</span>
          <span className="font-medium text-brand-text-dark">
            Rs {subtotal.toLocaleString()}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border-b border-gray-300 pb-2.5 sm:pb-3">
          <span className="text-brand-text-muted">Shipping</span>
          <span className="font-medium text-brand-green">
            {shippingFee === 0 ? 'FREE' : `Rs ${shippingFee.toLocaleString()}`}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-3 sm:py-4">
          <span className="font-heading font-semibold text-base sm:text-lg md:text-xl text-brand-green">
            Total
          </span>
          <span className="font-heading font-bold text-base sm:text-lg md:text-xl text-brand-green">
            Rs {total.toLocaleString()}
          </span>
        </div>

        {/* Place Order Button */}
        <motion.button
          type="button"
          onClick={onPlaceOrder}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-black text-white font-medium py-3.5 sm:py-4 rounded-md transition-colors text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Placing order...
            </>
          ) : (
            'Place Order (COD)'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
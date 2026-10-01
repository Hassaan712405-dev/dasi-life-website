'use client';

import { Loader2 } from 'lucide-react';

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
    <div className="bg-[#F0EDE6] rounded-xl border border-gray-300 p-6 sticky top-24">
      <h2 className="font-heading font-semibold text-2xl text-brand-green mb-5">
        Order Summary
      </h2>

      {/* Items */}
      <div className="space-y-4 mb-5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-brand-text-dark line-clamp-2">
                {item.name}
              </p>
              <p className="text-xs text-brand-text-muted">
                Qty: {item.quantity} • Rs {item.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 pt-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between py-2 text-sm md:text-base">
          <span className="text-brand-text-muted">Subtotal</span>
          <span className="font-medium text-brand-text-dark">
            Rs {subtotal.toLocaleString()}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between py-2 text-sm md:text-base border-b border-gray-300 pb-3">
          <span className="text-brand-text-muted">Shipping</span>
          <span className="font-medium text-brand-green">
            {shippingFee === 0 ? 'FREE' : `Rs ${shippingFee.toLocaleString()}`}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-4">
          <span className="font-heading font-semibold text-lg md:text-xl text-brand-green">
            Total
          </span>
          <span className="font-heading font-bold text-lg md:text-xl text-brand-green">
            Rs {total.toLocaleString()}
          </span>
        </div>

        {/* Place Order Button */}
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={loading}
          className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Placing order...
            </>
          ) : (
            'Place Order (COD)'
          )}
        </button>
      </div>
    </div>
  );
}
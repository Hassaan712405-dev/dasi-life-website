'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { OrderWithItems } from '@/types/order';

// ✅ YEH LINE ZAROORI HAI — page ko static prerender hone se rokegi
export const dynamic = 'force-dynamic';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      if (!orderNumber) {
        setError('No order number provided.');
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', orderNumber)
        .single();

      if (fetchError || !data) {
        setError('Order not found. Please check your order number.');
        setLoading(false);
        return;
      }

      setOrder(data as OrderWithItems);
      setLoading(false);
    }

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="bg-brand-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-brand-green mx-auto mb-4" />
          <p className="text-sm text-brand-text-muted">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="container-custom py-12 sm:py-20 text-center">
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-6 sm:p-10">
            <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-brand-green mb-3">
              Order Not Found
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-muted mb-6">
              {error}
            </p>
            <Link
              href="/"
              className="inline-block bg-brand-green hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-10 sm:py-12 md:py-20">
        {/* Success Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-brand-green mb-4 sm:mb-6">
            <Check size={36} className="text-white sm:hidden" strokeWidth={3} />
            <Check
              size={44}
              className="text-white hidden sm:block"
              strokeWidth={3}
            />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green mb-3 sm:mb-4"
          >
            Order Placed Successfully!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xs sm:text-sm md:text-base text-brand-text-muted max-w-xl mx-auto"
          >
            Thank you for shopping with Dasi Life. Your order is being processed.
          </motion.p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8 mb-8 sm:mb-10"
        >
          {/* Top Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200">
            <div>
              <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted mb-0.5 sm:mb-1">
                Order Number
              </p>
              <p className="font-semibold text-xs sm:text-sm md:text-base text-brand-green">
                #{order.order_number}
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted mb-0.5 sm:mb-1">
                Date
              </p>
              <p className="font-semibold text-xs sm:text-sm md:text-base text-brand-text-dark">
                {orderDate}
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted mb-0.5 sm:mb-1">
                Payment
              </p>
              <p className="font-semibold text-[10px] sm:text-xs md:text-sm text-brand-gold tracking-wide">
                COD
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="py-4 sm:py-6 border-b border-gray-200">
            <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg text-brand-green mb-3 sm:mb-4">
              Items Ordered
            </h3>
            <div className="space-y-2.5 sm:space-y-3">
              {order.order_items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="flex items-center justify-between gap-3 sm:gap-4"
                >
                  <p className="text-xs sm:text-sm text-brand-text-dark">
                    <span className="font-medium">{item.quantity}x</span>{' '}
                    {item.product_name}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-brand-text-dark shrink-0">
                    Rs {item.subtotal.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-200">
            <p className="text-xs sm:text-sm text-brand-text-muted">
              Estimated Delivery
            </p>
            <p className="text-xs sm:text-sm font-semibold text-brand-text-dark">
              3-5 Business Days
            </p>
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between py-2.5 sm:py-3 border-b border-gray-200">
            <p className="text-xs sm:text-sm text-brand-text-muted">Subtotal</p>
            <p className="text-xs sm:text-sm font-medium text-brand-text-dark">
              Rs {order.subtotal.toLocaleString()}
            </p>
          </div>

          {/* Shipping */}
          <div className="flex items-center justify-between py-2.5 sm:py-3 border-b border-gray-200">
            <p className="text-xs sm:text-sm text-brand-text-muted">Shipping</p>
            <p className="text-xs sm:text-sm font-medium text-brand-green">
              {order.shipping_fee === 0
                ? 'FREE'
                : `Rs ${order.shipping_fee.toLocaleString()}`}
            </p>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-200">
            <p className="font-heading font-semibold text-sm sm:text-base md:text-lg text-brand-green">
              Total Amount
            </p>
            <p className="font-heading font-bold text-sm sm:text-base md:text-lg text-brand-green">
              Rs {order.total.toLocaleString()}
            </p>
          </div>

          {/* Address */}
          <div className="pt-4 sm:pt-6">
            <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg text-brand-green mb-2 sm:mb-3">
              Delivery Address
            </h3>
            <p className="text-xs sm:text-sm text-brand-text-dark leading-relaxed">
              <span className="font-medium">{order.customer_name}</span>
              {' • '}
              <span>{order.customer_phone}</span>
            </p>
            <p className="text-xs sm:text-sm text-brand-text-muted mt-1 leading-relaxed">
              {order.shipping_address}, {order.shipping_city},{' '}
              {order.shipping_state} {order.shipping_postal_code},{' '}
              {order.shipping_country}
            </p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href={`/track-order?order=${order.order_number}`}
            className="w-full sm:w-auto text-center bg-brand-green hover:bg-black text-white font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-md transition-colors text-sm"
          >
            Track Your Order
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto text-center bg-white border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-md transition-colors text-sm"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-brand-cream min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin text-brand-green mx-auto mb-4" />
            <p className="text-brand-text-muted">Loading...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
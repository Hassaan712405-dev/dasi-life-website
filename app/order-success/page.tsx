'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { OrderWithItems } from '@/types/order';

// ============================================
// INNER COMPONENT (uses useSearchParams)
// ============================================
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
        .select(
          `
          *,
          order_items (*)
        `
        )
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

  // Loading state
  if (loading) {
    return (
      <div className="bg-brand-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-brand-green mx-auto mb-4"
          />
          <p className="text-brand-text-muted">Loading your order...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="container-custom py-20 text-center">
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-10">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-brand-green mb-3">
              Order Not Found
            </h1>
            <p className="text-sm text-brand-text-muted mb-6">{error}</p>
            <Link href="/" className="btn-primary inline-flex">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format date
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-12 md:py-20">
        {/* Success Icon + Heading */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-green mb-6">
            <Check size={44} className="text-white" strokeWidth={3} />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-sm md:text-base text-brand-text-muted max-w-xl mx-auto">
            Thank you for shopping with Dasi Life. Your order is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-10">
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-200">
            <div>
              <p className="text-xs md:text-sm text-brand-text-muted mb-1">
                Order Number
              </p>
              <p className="font-semibold text-sm md:text-base text-brand-green">
                #{order.order_number}
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-brand-text-muted mb-1">
                Date
              </p>
              <p className="font-semibold text-sm md:text-base text-brand-text-dark">
                {orderDate}
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-brand-text-muted mb-1">
                Payment Method
              </p>
              <p className="font-semibold text-xs md:text-sm text-brand-gold tracking-wide">
                {order.payment_method} — CASH ON DELIVERY
              </p>
            </div>
          </div>

          {/* Items Ordered */}
          <div className="py-6 border-b border-gray-200">
            <h3 className="font-heading font-semibold text-base md:text-lg text-brand-green mb-4">
              Items Ordered
            </h3>
            <div className="space-y-3">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <p className="text-sm text-brand-text-dark">
                    <span className="font-medium">{item.quantity}x</span>{' '}
                    {item.product_name}
                  </p>
                  <p className="text-sm font-semibold text-brand-text-dark shrink-0">
                    Rs {item.subtotal.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <p className="text-sm text-brand-text-muted">Estimated Delivery</p>
            <p className="text-sm font-semibold text-brand-text-dark">
              3-5 Business Days
            </p>
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <p className="text-sm text-brand-text-muted">Subtotal</p>
            <p className="text-sm font-medium text-brand-text-dark">
              Rs {order.subtotal.toLocaleString()}
            </p>
          </div>

          {/* Shipping */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <p className="text-sm text-brand-text-muted">Shipping</p>
            <p className="text-sm font-medium text-brand-green">
              {order.shipping_fee === 0
                ? 'FREE'
                : `Rs ${order.shipping_fee.toLocaleString()}`}
            </p>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <p className="font-heading font-semibold text-base md:text-lg text-brand-green">
              Total Amount
            </p>
            <p className="font-heading font-bold text-base md:text-lg text-brand-green">
              Rs {order.total.toLocaleString()}
            </p>
          </div>

          {/* Delivery Address */}
          <div className="pt-6">
            <h3 className="font-heading font-semibold text-base md:text-lg text-brand-green mb-3">
              Delivery Address
            </h3>
            <p className="text-sm text-brand-text-dark leading-relaxed">
              <span className="font-medium">{order.customer_name}</span>
              {' • '}
              <span>{order.customer_phone}</span>
            </p>
            <p className="text-sm text-brand-text-muted mt-1 leading-relaxed">
              {order.shipping_address}, {order.shipping_city},{' '}
              {order.shipping_state} {order.shipping_postal_code},{' '}
              {order.shipping_country}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/track-order?order=${order.order_number}`}
            className="btn-primary w-full sm:w-auto px-8 py-3.5"
          >
            Track Your Order
          </Link>
          <Link
            href="/shop"
            className="btn-secondary w-full sm:w-auto px-8 py-3.5"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE WITH SUSPENSE
// ============================================
export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-brand-cream min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2
              size={40}
              className="animate-spin text-brand-green mx-auto mb-4"
            />
            <p className="text-brand-text-muted">Loading...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
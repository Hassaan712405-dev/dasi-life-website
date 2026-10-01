'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Package, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { OrderWithItems, OrderStatus } from '@/types/order';

const timelineSteps: { status: OrderStatus; title: string; description: string }[] = [
  { status: 'pending', title: 'Order Placed', description: 'Received and confirmed at Lahore central dispatch.' },
  { status: 'confirmed', title: 'Order Confirmed', description: 'Order verified by our team and being prepared.' },
  { status: 'processing', title: 'Processing Formulation', description: 'Organic compound processed under lab supervision.' },
  { status: 'shipped', title: 'Shipped (In Transit)', description: 'Handed over to nationwide delivery network courier.' },
  { status: 'delivered', title: 'Delivered', description: 'Receive packet. Payment method Cash on Delivery active.' },
];

const statusToStepIndex: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
};

function getStatusBadgeColor(status: OrderStatus): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'confirmed': return 'bg-blue-100 text-blue-700';
    case 'processing': return 'bg-orange-100 text-orange-700';
    case 'shipped': return 'bg-blue-100 text-blue-700';
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = useCallback(async (num: string) => {
    setError('');
    setLoading(true);

    const normalized = num.trim().toUpperCase().replace(/^#/, '');
    const searchNumber = normalized.startsWith('DL-')
      ? normalized
      : `DL-${normalized}`;

    const supabase = createClient();

    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', searchNumber)
      .single();

    if (fetchError || !data) {
      setError('Order not found. Please check your order number.');
      setOrder(null);
      setLoading(false);
      return;
    }

    setOrder(data as OrderWithItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialOrder) {
      handleTrack(initialOrder);
    }
  }, [initialOrder, handleTrack]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      handleTrack(orderNumber);
    }
  };

  const currentStepIndex = order ? statusToStepIndex[order.status] ?? 0 : -1;

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-10"
        >
          {/* Heading */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2 sm:mb-3">
              Track Your Order
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-brand-text-muted max-w-md mx-auto leading-relaxed">
              Enter your tracking identifier or order code to instantly check
              real-time processing and delivery stages.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6 sm:mb-8">
            <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
              Order ID / Tracking Number
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="DL-12345"
                className="flex-1 bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="bg-brand-gold hover:bg-black text-white font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Track Now'
                )}
              </motion.button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4 flex items-start gap-2 sm:gap-3 mb-5 sm:mb-6"
            >
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          {/* Order Result */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="border-t border-gray-200 mb-5 sm:mb-6"></div>

              <div className="mb-6 sm:mb-8">
                <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted mb-0.5 sm:mb-1">
                  Active shipment code
                </p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2 className="font-heading font-semibold text-base sm:text-lg md:text-xl text-brand-green">
                    Order {order.order_number}
                  </h2>
                  <span
                    className={`${getStatusBadgeColor(order.status)} text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full`}
                  >
                    {capitalize(order.status)}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                {timelineSteps.map((step, index) => {
                  const isLast = index === timelineSteps.length - 1;
                  const isCompleted = index < currentStepIndex;
                  const isActive = index === currentStepIndex;

                  const dateText = isActive
                    ? 'Current'
                    : isCompleted
                    ? 'Completed'
                    : 'Pending';

                  return (
                    <motion.div
                      key={step.status}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex gap-3 sm:gap-4 pb-5 sm:pb-6 relative"
                    >
                      {!isLast && (
                        <div
                          className={`absolute left-3 top-7 sm:top-8 w-0.5 h-full ${
                            isCompleted ? 'bg-brand-green' : 'bg-gray-300'
                          }`}
                        ></div>
                      )}

                      <div className="shrink-0 relative z-10">
                        {isCompleted ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-green flex items-center justify-center">
                            <Check size={12} className="text-white" strokeWidth={3} />
                          </div>
                        ) : isActive ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-gold border-2 border-white shadow-md"
                          />
                        ) : (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-gray-300"></div>
                        )}
                      </div>

                      <div className="flex-1 pb-1.5 sm:pb-2">
                        <div className="flex items-baseline gap-2 flex-wrap mb-0.5 sm:mb-1">
                          <h3
                            className={`font-semibold text-xs sm:text-sm md:text-base ${
                              isCompleted || isActive
                                ? 'text-brand-green'
                                : 'text-brand-text-dark'
                            }`}
                          >
                            {step.title}
                          </h3>
                          <span className="text-[10px] sm:text-xs text-brand-text-muted">
                            {dateText}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs md:text-sm text-brand-text-muted leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Status Info */}
              <div className="mt-3 sm:mt-4 bg-brand-cream rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                <Package size={18} className="text-brand-green shrink-0 mt-0.5" />
                <div>
                  {order.status === 'delivered' ? (
                    <>
                      <p className="font-semibold text-xs sm:text-sm md:text-base text-brand-text-dark mb-0.5 sm:mb-1">
                        Order Delivered Successfully
                      </p>
                      <p className="text-[11px] sm:text-xs md:text-sm text-brand-text-muted">
                        Thank you for shopping with Dasi Life.
                      </p>
                    </>
                  ) : order.status === 'cancelled' ? (
                    <>
                      <p className="font-semibold text-xs sm:text-sm md:text-base text-red-600 mb-0.5 sm:mb-1">
                        Order Cancelled
                      </p>
                      <p className="text-[11px] sm:text-xs md:text-sm text-brand-text-muted">
                        This order has been cancelled. Please contact support.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-xs sm:text-sm md:text-base text-brand-text-dark mb-0.5 sm:mb-1">
                        Estimated Delivery: 3-5 Business Days
                      </p>
                      <p className="text-[11px] sm:text-xs md:text-sm text-brand-text-muted">
                        Please keep Rs {order.total.toLocaleString()} cash ready
                        for courier handoff.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
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
      <TrackOrderContent />
    </Suspense>
  );
}
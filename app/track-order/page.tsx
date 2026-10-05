'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Check,
  Package,
  Loader2,
  AlertCircle,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  User,
  ShoppingBag,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { OrderStatus } from '@/types/order';

// ============================================
// TIMELINE STEPS
// ============================================
const timelineSteps: {
  status: OrderStatus;
  title: string;
  description: string;
  icon: any;
}[] = [
  {
    status: 'pending',
    title: 'Order Placed',
    description: 'Aap ka order receive ho gaya hai aur confirm hone ka intezar hai.',
    icon: Clock,
  },
  {
    status: 'confirmed',
    title: 'Order Confirmed',
    description: 'Order verify ho gaya hai aur tayyari shuru ho gayi hai.',
    icon: CheckCircle2,
  },
  {
    status: 'processing',
    title: 'Processing',
    description: 'Aap ka order pack kiya ja raha hai.',
    icon: Package,
  },
  {
    status: 'shipped',
    title: 'Shipped',
    description: 'Order courier ko de diya gaya hai. Jald pahuchega.',
    icon: Truck,
  },
  {
    status: 'delivered',
    title: 'Delivered',
    description: 'Order successfully deliver ho gaya. Shukriya!',
    icon: CheckCircle2,
  },
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
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'confirmed':
      return 'bg-blue-100 text-blue-700';
    case 'processing':
      return 'bg-orange-100 text-orange-700';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-700';
    case 'delivered':
      return 'bg-green-100 text-green-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [realtimeStatus, setRealtimeStatus] = useState<
    'connecting' | 'live' | 'off'
  >('off');

  // ✅ FETCH ORDER
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
      .select('*, order_items(*), order_status_history(*)')
      .eq('order_number', searchNumber)
      .single();

    if (fetchError || !data) {
      setError('Order not found. Please check your order number.');
      setOrder(null);
      setLoading(false);
      return;
    }

    if (data.order_status_history) {
      data.order_status_history.sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      );
    }

    setOrder(data);
    setLoading(false);
  }, []);

  // ✅ REALTIME SUBSCRIPTION
  useEffect(() => {
    if (!order?.order_number) return;

    setRealtimeStatus('connecting');
    const supabase = createClient();

    const channel = supabase
      .channel(`order-${order.order_number}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `order_number=eq.${order.order_number}`,
        },
        (payload: any) => {
          console.log('Order updated:', payload);
          setOrder((prev: any) =>
            prev ? { ...prev, ...payload.new } : prev
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_history',
          filter: `order_id=eq.${order.id}`,
        },
        (payload: any) => {
          console.log('Status history added:', payload);
          setOrder((prev: any) => {
            if (!prev) return prev;
            const newHistory = [
              ...(prev.order_status_history || []),
              payload.new,
            ].sort(
              (a: any, b: any) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            );
            return { ...prev, order_status_history: newHistory };
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('live');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setRealtimeStatus('off');
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setRealtimeStatus('off');
    };
  }, [order?.order_number, order?.id]);

  // Auto-track if URL has order number
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

  const currentStepIndex = order
    ? statusToStepIndex[order.status as OrderStatus] ?? 0
    : -1;

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* HEADER CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-10 mb-5">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2 sm:mb-3">
                Track Your Order
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-brand-text-muted max-w-md mx-auto leading-relaxed">
                Apna order number daalein aur real-time status check karein.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-2">
                Order Number
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) =>
                    setOrderNumber(e.target.value.toUpperCase())
                  }
                  placeholder="DL-802925621"
                  className="flex-1 bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green font-mono"
                />
                <motion.button
                  type="submit"
                  disabled={loading || !orderNumber.trim()}
                  whileTap={{ scale: 0.97 }}
                  className="bg-brand-green hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm whitespace-nowrap inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Track Now'
                  )}
                </motion.button>
              </div>
            </form>

            {/* ERROR */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2"
              >
                <AlertCircle
                  size={16}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <p className="text-xs sm:text-sm text-red-600">{error}</p>
              </motion.div>
            )}
          </div>

          {/* ORDER RESULT */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* STATUS CARD */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-5">
                  <div>
                    <p className="text-[10px] sm:text-xs text-brand-text-muted mb-1">
                      Order Number
                    </p>
                    <p className="font-mono font-bold text-base sm:text-lg text-brand-green">
                      {order.order_number}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {realtimeStatus === 'live' && (
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Live
                      </span>
                    )}
                    <span
                      className={`${getStatusBadgeColor(
                        order.status as OrderStatus
                      )} text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full`}
                    >
                      {capitalize(order.status)}
                    </span>
                  </div>
                </div>

                {/* CURRENT STATUS HIGHLIGHT */}
                {(() => {
                  const step = timelineSteps[currentStepIndex];
                  if (!step || currentStepIndex === -1) return null;
                  const Icon = step.icon;
                  return (
                    <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center shrink-0">
                        <Icon size={22} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-brand-text-muted mb-0.5">
                          Current Status
                        </p>
                        <p className="font-heading font-bold text-base sm:text-lg text-brand-green">
                          {step.title}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {order.status === 'cancelled' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                      <XCircle size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-red-600 mb-0.5">
                        Status
                      </p>
                      <p className="font-heading font-bold text-base sm:text-lg text-red-600">
                        Order Cancelled
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* TIMELINE */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
                <h2 className="font-heading font-semibold text-lg sm:text-xl text-brand-green mb-5 pb-3 border-b border-gray-100">
                  Order Timeline
                </h2>

                <div className="relative">
                  {timelineSteps.map((step, index) => {
                    const isLast = index === timelineSteps.length - 1;
                    const isCompleted = index < currentStepIndex;
                    const isActive = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                      <motion.div
                        key={step.status}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="flex gap-3 sm:gap-4 pb-6 relative"
                      >
                        {!isLast && (
                          <div
                            className={`absolute left-[19px] sm:left-[23px] top-11 sm:top-12 w-0.5 h-full ${
                              isCompleted
                                ? 'bg-brand-green'
                                : 'bg-gray-200'
                            }`}
                          />
                        )}

                        <div className="shrink-0 relative z-10">
                          {isCompleted ? (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-green flex items-center justify-center">
                              <Check
                                size={18}
                                className="text-white"
                                strokeWidth={3}
                              />
                            </div>
                          ) : isActive ? (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold flex items-center justify-center ring-4 ring-brand-gold/20"
                            >
                              <Icon size={18} className="text-white" />
                            </motion.div>
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                              <Icon size={18} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 pt-1.5">
                          <div className="flex items-baseline gap-2 flex-wrap mb-1">
                            <h3
                              className={`font-semibold text-sm sm:text-base ${
                                isCompleted || isActive
                                  ? 'text-brand-green'
                                  : 'text-gray-500'
                              }`}
                            >
                              {step.title}
                            </h3>
                            {isActive && (
                              <span className="text-[10px] sm:text-xs text-brand-gold font-semibold uppercase tracking-wide">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* CUSTOMER + SHIPPING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                    <User size={16} className="text-brand-green" />
                    <h3 className="font-heading font-semibold text-sm sm:text-base text-brand-green">
                      Customer
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] sm:text-xs text-brand-text-muted">
                        Name
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-brand-text-dark">
                        {order.customer_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-brand-text-muted flex items-center gap-1">
                        <Phone size={10} />
                        Phone
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-brand-text-dark">
                        {order.customer_phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                    <MapPin size={16} className="text-brand-green" />
                    <h3 className="font-heading font-semibold text-sm sm:text-base text-brand-green">
                      Shipping
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-text-dark leading-relaxed">
                    {order.shipping_address}
                    <br />
                    {order.shipping_city}, {order.shipping_state}
                    {order.shipping_postal_code &&
                      `, ${order.shipping_postal_code}`}
                    <br />
                    {order.shipping_country}
                  </p>
                </div>
              </div>

              {/* ORDER ITEMS */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                    <ShoppingBag size={16} className="text-brand-green" />
                    <h2 className="font-heading font-semibold text-lg sm:text-xl text-brand-green">
                      Items ({order.order_items.length})
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {order.order_items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-brand-text-dark">
                            {item.product_name}
                          </p>
                          {item.variant_name && (
                            <p className="text-[10px] sm:text-xs text-brand-text-muted">
                              {item.variant_name}
                            </p>
                          )}
                          <p className="text-[10px] sm:text-xs text-brand-text-muted mt-0.5">
                            Qty: {item.quantity} × Rs{' '}
                            {Number(item.price).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-brand-text-dark shrink-0">
                          Rs {Number(item.subtotal).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-brand-text-muted">Subtotal</span>
                      <span className="font-medium text-brand-text-dark">
                        Rs {Number(order.subtotal).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-brand-text-muted">Shipping</span>
                      <span className="font-medium text-brand-green">
                        {Number(order.shipping_fee) === 0
                          ? 'FREE'
                          : `Rs ${Number(
                              order.shipping_fee
                            ).toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="font-heading font-semibold text-sm sm:text-base text-brand-green">
                        Total
                      </span>
                      <span className="font-heading font-bold text-base sm:text-lg text-brand-green">
                        Rs {Number(order.total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
            <Loader2
              size={40}
              className="animate-spin text-brand-green mx-auto mb-4"
            />
            <p className="text-brand-text-muted">Loading...</p>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
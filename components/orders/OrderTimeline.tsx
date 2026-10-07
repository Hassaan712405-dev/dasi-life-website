'use client';

import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { OrderStatus } from '@/types/order';

// ============================================
// TIMELINE STEPS
// ============================================
const TIMELINE_STEPS: {
  status: OrderStatus;
  title: string;
  description: string;
  icon: any;
}[] = [
  {
    status: 'pending',
    title: 'Order Placed',
    description: 'Your order has been received and is awaiting confirmation.',
    icon: Clock,
  },
  {
    status: 'confirmed',
    title: 'Order Confirmed',
    description: 'Your order has been verified and preparation has started.',
    icon: CheckCircle2,
  },
  {
    status: 'processing',
    title: 'Processing',
    description: 'Your order is being carefully packed.',
    icon: Package,
  },
  {
    status: 'shipped',
    title: 'Shipped',
    description: 'Your order has been handed to the courier.',
    icon: Truck,
  },
  {
    status: 'delivered',
    title: 'Delivered',
    description: 'Your order has been successfully delivered. Thank you!',
    icon: CheckCircle2,
  },
];

const STATUS_TO_STEP_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
};

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  className?: string;
}

export default function OrderTimeline({
  currentStatus,
  className = '',
}: OrderTimelineProps) {
  const currentStepIndex = STATUS_TO_STEP_INDEX[currentStatus] ?? 0;

  // Cancelled order
  if (currentStatus === 'cancelled') {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shrink-0">
          <XCircle size={22} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-red-600 mb-0.5">Status</p>
          <p className="font-heading font-bold text-base sm:text-lg text-red-600">
            Order Cancelled
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {TIMELINE_STEPS.map((step, index) => {
        const isLast = index === TIMELINE_STEPS.length - 1;
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
                  isCompleted ? 'bg-brand-green' : 'bg-gray-200'
                }`}
              />
            )}

            <div className="shrink-0 relative z-10">
              {isCompleted ? (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-green flex items-center justify-center">
                  <Check size={18} className="text-white" strokeWidth={3} />
                </div>
              ) : isActive ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
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
  );
}
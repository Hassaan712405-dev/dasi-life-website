'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Eye, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';
import { getUserOrders } from '@/services/orders/orderService';
import type { OrderWithItems } from '@/types/order';

const filters = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function getStatusColor(status: string): string {
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

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const data = await getUserOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      fetchOrders();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const filteredOrders =
    activeFilter === 'All'
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === activeFilter.toLowerCase()
        );

  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'U';

  // ✅ Dynamic joined date
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Jan 2026';

  if (!authLoading && !user) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="container-custom py-12 sm:py-20 text-center">
          <Package size={40} className="text-brand-text-muted mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-green mb-3">
            Please Log In
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted mb-6">
            You need to be logged in to view your orders.
          </p>
          <Link
            href="/login"
            className="inline-block bg-brand-green hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          <AccountSidebar
            userName={user?.email?.split('@')[0] || 'User'}
            userInitials={userInitials}
            userEmail={user?.email}
            joinedDate={joinedDate}
          />

          <div className="space-y-5 sm:space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
            >
              <div>
                <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">
                  Order History
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2 sm:mb-3">
                  My Orders
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-brand-text-muted leading-relaxed">
                  View and track all your Unani wellness orders.
                </p>
              </div>

              {!loading && orders.length > 0 && (
                <motion.button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-green border border-brand-green rounded-md px-3 sm:px-4 py-2 hover:bg-brand-green hover:text-white transition-colors disabled:opacity-60 self-start sm:self-end"
                >
                  <RefreshCw
                    size={14}
                    className={refreshing ? 'animate-spin' : ''}
                  />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </motion.button>
              )}
            </motion.div>

            {/* Loading */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center"
              >
                <Loader2 size={28} className="animate-spin text-brand-green mx-auto mb-3" />
                <p className="text-xs sm:text-sm text-brand-text-muted">
                  Loading your orders...
                </p>
              </motion.div>
            )}

            {/* ✅ Filters — Confirmed added */}
            {!loading && orders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center gap-2 overflow-x-auto pb-1"
              >
                {filters.map((filter) => {
                  const count =
                    filter === 'All'
                      ? orders.length
                      : orders.filter(
                          (o) => o.status.toLowerCase() === filter.toLowerCase()
                        ).length;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                        activeFilter === filter
                          ? 'bg-brand-green text-white'
                          : 'bg-white border border-gray-200 text-brand-text-dark hover:border-brand-green hover:text-brand-green'
                      }`}
                    >
                      {filter}
                      <span
                        className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                          activeFilter === filter
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-brand-text-muted'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* Orders List */}
            {!loading && (
              <>
                {filteredOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center"
                  >
                    <Package size={40} className="text-brand-text-muted mx-auto mb-4" />
                    <p className="text-xs sm:text-sm text-brand-text-muted mb-4">
                      {orders.length === 0
                        ? "You haven't placed any orders yet."
                        : 'No orders found in this category.'}
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block bg-brand-green hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
                    >
                      Browse Products
                    </Link>
                  </motion.div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-md transition-shadow duration-300"
                      >
                        {/* Top Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg text-brand-green">
                              #{order.order_number}
                            </h3>
                            <span className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span
                              className={`${getStatusColor(order.status)} text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full`}
                            >
                              {capitalize(order.status)}
                            </span>
                          </div>
                          <Link
                            href={`/order-success?order=${order.order_number}`}
                            className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium text-brand-gold hover:text-brand-green transition-colors"
                          >
                            <Eye size={12} />
                            View Details
                          </Link>
                        </div>

                        {/* Items */}
                        <div className="py-3 sm:py-4 space-y-1.5 sm:space-y-2">
                          {order.order_items.slice(0, 3).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-3 text-xs sm:text-sm"
                            >
                              <p className="text-brand-text-dark">
                                <span className="font-medium">{item.quantity}x</span>{' '}
                                {item.product_name}
                              </p>
                              <p className="text-brand-text-muted shrink-0">
                                Rs {item.price.toLocaleString()}
                              </p>
                            </div>
                          ))}
                          {order.order_items.length > 3 && (
                            <p className="text-[10px] sm:text-xs text-brand-text-muted">
                              +{order.order_items.length - 3} more items
                            </p>
                          )}
                        </div>

                        {/* Bottom Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-[10px] sm:text-xs text-brand-text-muted mb-0.5">
                              Total Amount
                            </p>
                            <p className="font-heading font-bold text-base sm:text-lg text-brand-green">
                              Rs {order.total.toLocaleString()}
                            </p>
                          </div>

                          <Link
                            href={`/track-order?order=${order.order_number}`}
                            className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-brand-green border border-brand-green rounded-md px-3 py-1.5 sm:py-2 hover:bg-brand-green hover:text-white transition-colors"
                          >
                            Track Order
                            <ChevronRight size={12} />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Eye, Loader2, RefreshCw } from 'lucide-react';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';
import { getUserOrders } from '@/services/orders/orderService';
import type { OrderWithItems } from '@/types/order';

const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'confirmed':
      return 'bg-blue-100 text-blue-700';
    case 'processing':
      return 'bg-orange-100 text-orange-700';
    case 'shipped':
      return 'bg-blue-100 text-blue-700';
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

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Fetch orders
  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const data = await getUserOrders();
    setOrders(data);
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      fetchOrders();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const filteredOrders =
    activeFilter === 'All'
      ? orders
      : orders.filter(
          (order) =>
            order.status.toLowerCase() === activeFilter.toLowerCase()
        );

  // User initials
  const userInitials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'U';

  // If not logged in
  if (!authLoading && !user) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="container-custom py-20 text-center">
          <Package size={48} className="text-brand-text-muted mx-auto mb-4" />
          <h1 className="text-3xl font-heading font-bold text-brand-green mb-3">
            Please Log In
          </h1>
          <p className="text-sm text-brand-text-muted mb-6">
            You need to be logged in to view your orders.
          </p>
          <Link href="/login" className="btn-primary inline-flex">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <AccountSidebar
            userName={user?.email?.split('@')[0] || 'User'}
            userInitials={userInitials}
            userEmail={user?.email}
            joinedDate="Jan 2026"
          />

          {/* Right Content */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-3">
                  Order History
                </p>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-3">
                  My Orders
                </h1>
                <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
                  View and track all your Unani wellness orders.
                </p>
              </div>

              {/* Refresh Button */}
              {!loading && orders.length > 0 && (
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-green border border-brand-green rounded-md px-4 py-2 hover:bg-brand-green hover:text-white transition-colors disabled:opacity-60 self-start sm:self-end"
                >
                  <RefreshCw
                    size={14}
                    className={refreshing ? 'animate-spin' : ''}
                  />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Loader2 size={32} className="animate-spin text-brand-green mx-auto mb-3" />
                <p className="text-sm text-brand-text-muted">Loading your orders...</p>
              </div>
            )}

            {/* Filter Tabs */}
            {!loading && orders.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                        activeFilter === filter
                          ? 'bg-brand-green text-white'
                          : 'bg-white border border-gray-200 text-brand-text-dark hover:border-brand-green hover:text-brand-green'
                      }`}
                    >
                      {filter}
                      <span
                        className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
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
              </div>
            )}

            {/* Orders List */}
            {!loading && (
              <>
                {filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Package size={48} className="text-brand-text-muted mx-auto mb-4" />
                    <p className="text-brand-text-muted mb-4">
                      {orders.length === 0
                        ? "You haven't placed any orders yet."
                        : 'No orders found in this category.'}
                    </p>
                    <Link href="/shop" className="btn-primary inline-flex">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-md transition-shadow duration-300"
                      >
                        {/* Top Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-heading font-semibold text-base md:text-lg text-brand-green">
                              #{order.order_number}
                            </h3>
                            <span className="text-xs md:text-sm text-brand-text-muted">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span
                              className={`${getStatusColor(order.status)} text-xs font-semibold px-3 py-1 rounded-full`}
                            >
                              {capitalize(order.status)}
                            </span>
                          </div>
                          <Link
                            href={`/order-success?order=${order.order_number}`}
                            className="flex items-center gap-1 text-xs md:text-sm font-medium text-brand-gold hover:text-brand-green transition-colors"
                          >
                            <Eye size={14} />
                            View Details
                          </Link>
                        </div>

                        {/* Items */}
                        <div className="py-4 space-y-2">
                          {order.order_items.slice(0, 3).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-3 text-sm"
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
                            <p className="text-xs text-brand-text-muted">
                              +{order.order_items.length - 3} more items
                            </p>
                          )}
                        </div>

                        {/* Bottom Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-brand-text-muted mb-0.5">
                              Total Amount
                            </p>
                            <p className="font-heading font-bold text-lg text-brand-green">
                              Rs {order.total.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/track-order?order=${order.order_number}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-brand-green border border-brand-green rounded-md px-3 py-2 hover:bg-brand-green hover:text-white transition-colors"
                            >
                              Track Order
                              <ChevronRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </div>
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
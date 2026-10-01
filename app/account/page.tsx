    'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Heart, Truck, ChevronRight, Phone, Mail, Loader2 } from 'lucide-react';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';
import { getUserOrders } from '@/services/orders/orderService';
import type { OrderWithItems } from '@/types/order';

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700';
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

export default function AccountDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      const data = await getUserOrders();
      setOrders(data);
      setLoading(false);
    }
    if (!authLoading) fetchOrders();
  }, [user, authLoading]);

  // Not logged in
  if (!authLoading && !user) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="container-custom py-20 text-center">
          <Package size={48} className="text-brand-text-muted mx-auto mb-4" />
          <h1 className="text-3xl font-heading font-bold text-brand-green mb-3">
            Please Log In
          </h1>
          <p className="text-sm text-brand-text-muted mb-6">
            You need to be logged in to access your account.
          </p>
          <Link href="/login" className="btn-primary inline-flex">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'U';
  const displayName = user?.email?.split('@')[0] || 'User';

  // Real stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped'
  ).length;
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: 'TOTAL ORDERS',
      value: `${totalOrders} Orders`,
      subtitle: 'All-time Unani purchases',
      icon: Package,
    },
    {
      label: 'ACTIVE ORDERS',
      value: `${activeOrders} Active`,
      subtitle: 'Currently being processed',
      icon: Truck,
    },
    {
      label: 'TOTAL SPENT',
      value: `Rs ${totalSpent.toLocaleString()}`,
      subtitle: 'Across all your orders',
      icon: Heart,
    },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          <AccountSidebar
            userName={displayName}
            userInitials={userInitials}
            userEmail={user?.email}
            joinedDate="Jan 2026"
          />

          <div className="space-y-8">
            {/* Welcome */}
            <div>
              <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-3">
                Welcome Back
              </p>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-3">
                Assalam-o-Alaikum, {capitalize(displayName)}
              </h1>
              <p className="text-sm md:text-base text-brand-text-muted leading-relaxed max-w-2xl">
                From your account dashboard you can view your recent orders,
                manage your shipping and billing addresses, and edit your
                password.
              </p>
            </div>

            {/* Stats Cards */}
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Loader2 size={32} className="animate-spin text-brand-green mx-auto mb-3" />
                <p className="text-sm text-brand-text-muted">Loading...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-brand-gold tracking-wide">
                            {stat.label}
                          </p>
                          <Icon size={20} className="text-brand-green" />
                        </div>
                        <p className="text-2xl md:text-3xl font-heading font-bold text-brand-green mb-1">
                          {stat.value}
                        </p>
                        <p className="text-xs text-brand-text-muted">
                          {stat.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-7">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green">
                      Recent Orders
                    </h2>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-1 text-sm font-medium text-brand-gold hover:text-brand-green transition-colors"
                    >
                      View All Orders
                      <ChevronRight size={14} />
                    </Link>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="text-center py-10">
                      <Package size={40} className="text-brand-text-muted mx-auto mb-3" />
                      <p className="text-sm text-brand-text-muted mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Link href="/shop" className="btn-primary inline-flex">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="bg-brand-cream-dark text-xs font-semibold text-brand-text-dark uppercase tracking-wide">
                            <th className="text-left px-4 py-3 rounded-l-md">Order ID</th>
                            <th className="text-left px-4 py-3">Date</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-left px-4 py-3">Total Price</th>
                            <th className="text-right px-4 py-3 rounded-r-md">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr
                              key={order.id}
                              className="border-b border-gray-100 last:border-b-0 text-sm"
                            >
                              <td className="px-4 py-4 font-medium text-brand-text-dark">
                                #{order.order_number}
                              </td>
                              <td className="px-4 py-4 text-brand-text-muted">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </td>
                              <td className="px-4 py-4">
                                <span
                                  className={`${getStatusColor(order.status)} text-xs font-semibold px-3 py-1 rounded-full`}
                                >
                                  {capitalize(order.status)}
                                </span>
                              </td>
                              <td className="px-4 py-4 font-semibold text-brand-text-dark">
                                Rs {order.total.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 text-right">
                                <Link
                                  href={`/order-success?order=${order.order_number}`}
                                  className="inline-flex items-center justify-center text-xs font-medium text-brand-green border border-brand-green rounded-md px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors"
                                >
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Need Assistance */}
            <div>
              <h2 className="font-heading font-semibold text-lg md:text-xl text-brand-green mb-4">
                Need Assistance?
              </h2>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/923422544495"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 pr-5 hover:border-brand-green hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
                    <Phone size={18} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-text-dark">
                      Order Support on WhatsApp
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      0342 2544495
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:dasilife@gmail.com"
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 pr-5 hover:border-brand-green hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
                    <Mail size={18} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-text-dark">
                      Email Support
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      dasilife@gmail.com
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Calendar,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  getDashboardStats,
  getRecentOrders,
  getLowStockProducts,
  getMonthlyRevenue,
  DashboardStats,
  RecentOrder,
  LowStockProduct,
  MonthlyRevenue,
} from '@/services/admin/adminService';

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      const [statsData, ordersData, stockData, revenueData] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(5),
        getLowStockProducts(),
        getMonthlyRevenue(),
      ]);

      setStats(statsData);
      setRecentOrders(ordersData);
      setLowStock(stockData);
      setMonthlyRevenue(revenueData);
      setLoading(false);
    }
    loadAll();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand-green" />
      </div>
    );
  }

  // Stats cards
  const statCards = [
    {
      label: 'TOTAL REVENUE',
      value: `Rs ${stats.totalRevenue.toLocaleString()}`,
      change: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}%`,
      subtitle: 'vs last month',
      icon: DollarSign,
      positive: stats.revenueChange >= 0,
    },
    {
      label: 'TOTAL ORDERS',
      value: stats.totalOrders.toString(),
      change: `${stats.ordersChange >= 0 ? '+' : ''}${stats.ordersChange}%`,
      subtitle: 'vs last month',
      icon: ShoppingCart,
      positive: stats.ordersChange >= 0,
    },
    {
      label: 'TOTAL CUSTOMERS',
      value: stats.totalCustomers.toString(),
      change: 'Registered users',
      subtitle: '',
      icon: Users,
      positive: true,
    },
    {
      label: 'ACTIVE PRODUCTS',
      value: stats.activeProducts.toString(),
      change: 'In catalog',
      subtitle: '',
      icon: Package,
      positive: true,
    },
  ];

  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

  // Generate chart points
  const chartPoints = monthlyRevenue
    .map((m, i) => {
      const x = (i / (monthlyRevenue.length - 1 || 1)) * 100;
      const y = 100 - (m.revenue / maxRevenue) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
            Dashboard Overview
          </h1>
          <p className="text-sm text-brand-text-muted">
            Real-time snapshot of your wildcrafted organic inventory and
            nationwide Unani orders.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2 text-sm font-medium text-brand-text-dark hover:border-brand-green transition-colors"
        >
          <Calendar size={14} />
          This Month
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-brand-text-muted tracking-wide">
                  {stat.label}
                </p>
                <Icon size={18} className="text-brand-text-muted" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-brand-text-dark mb-2">
                {stat.value}
              </p>
              <p
                className={`text-xs font-medium flex items-center gap-1 ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.subtitle && <TrendingUp size={12} />}
                {stat.change} {stat.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-heading font-semibold text-lg text-brand-text-dark mb-1">
                Monthly Revenue Trend
              </h2>
              <p className="text-xs text-brand-text-muted">
                Showing gross sales volume (Rs) across recent monthly periods.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-text-muted">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              Revenue
            </div>
          </div>

          {/* Simple Line Chart */}
          <div className="relative h-48 border-l border-b border-gray-200">
            {monthlyRevenue.length > 0 ? (
              <>
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                >
                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="#1F4A2C"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  {monthlyRevenue.map((m, i) => {
                    const x = (i / (monthlyRevenue.length - 1 || 1)) * 100;
                    const y = 100 - (m.revenue / maxRevenue) * 100;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="2"
                        fill="#1F4A2C"
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </svg>
                {monthlyRevenue.length > 0 && (
                  <div className="absolute top-2 right-2 bg-brand-green text-white text-xs px-2 py-1 rounded shadow-md">
                    Rs{' '}
                    {monthlyRevenue[
                      monthlyRevenue.length - 1
                    ].revenue.toLocaleString()}
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-brand-text-muted">
                No revenue data yet
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-brand-text-muted mt-3">
            {monthlyRevenue.map((m, i) => (
              <span key={i}>{m.month}</span>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-lg text-brand-text-dark">
              Low Stock Alerts
            </h2>
            {lowStock.filter((p) => p.status !== 'Healthy').length > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {lowStock.filter((p) => p.status !== 'Healthy').length} Warnings
              </span>
            )}
          </div>
          <p className="text-xs text-brand-text-muted mb-4">
            Below minimum threshold levels.
          </p>
          <div className="space-y-4">
            {lowStock.length === 0 ? (
              <p className="text-sm text-brand-text-muted text-center py-4">
                No products
              </p>
            ) : (
              lowStock.map((item) => {
                const statusColor =
                  item.status === 'Critical'
                    ? 'bg-red-100 text-red-700'
                    : item.status === 'Low Stock'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700';
                return (
                  <div
                    key={item.id}
                    className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className="text-sm font-medium text-brand-text-dark line-clamp-1">
                        {item.name}
                      </p>
                      <span
                        className={`${statusColor} text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-brand-text-muted">
                      Current Stock:{' '}
                      <strong className="text-brand-text-dark">
                        {item.stock}
                      </strong>{' '}
                      / Min: {item.minStock}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading font-semibold text-lg text-brand-text-dark mb-1">
                Recent Orders
              </h2>
              <p className="text-xs text-brand-text-muted">
                Latest customer orders from across Pakistan.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-medium text-brand-gold hover:text-brand-green transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-brand-text-muted text-center py-8">
                No orders yet
              </p>
            ) : (
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-brand-text-muted uppercase tracking-wide">
                    <th className="text-left px-3 py-2.5 rounded-l-md">
                      Order ID
                    </th>
                    <th className="text-left px-3 py-2.5">Customer</th>
                    <th className="text-left px-3 py-2.5">Total</th>
                    <th className="text-left px-3 py-2.5">Status</th>
                    <th className="text-left px-3 py-2.5 rounded-r-md">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-b-0 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-3.5 font-medium text-brand-text-dark">
                        #{order.order_number}
                      </td>
                      <td className="px-3 py-3.5 text-brand-text-muted">
                        {order.customer_name}
                      </td>
                      <td className="px-3 py-3.5 font-semibold text-brand-text-dark">
                        Rs {order.total.toLocaleString()}
                      </td>
                      <td className="px-3 py-3.5">
                        <span
                          className={`${getStatusColor(order.status)} text-xs font-semibold px-2.5 py-1 rounded-full`}
                        >
                          {capitalize(order.status)}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-brand-text-muted">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-heading font-semibold text-lg text-brand-text-dark">
            Quick Actions
          </h2>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                <span className="text-brand-green font-bold text-lg leading-none">
                  +
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-text-dark mb-0.5">
                  Add New Product
                </p>
                <p className="text-xs text-brand-text-muted">
                  List a new Unani formulation or premium wildcrafted oil
                </p>
              </div>
            </div>
            <Link
              href="/admin/products/new"
              className="block w-full text-center bg-brand-green hover:bg-black text-white text-sm font-medium py-2.5 rounded-md transition-colors"
            >
              Launch Product Form
            </Link>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                <span className="text-brand-green text-lg leading-none">%</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-text-dark mb-0.5">
                  Create Promo Coupon
                </p>
                <p className="text-xs text-brand-text-muted">
                  Setup a discount campaign for active seasonal buyers
                </p>
              </div>
            </div>
            <Link
              href="/admin/coupons"
              className="block w-full text-center bg-brand-green hover:bg-black text-white text-sm font-medium py-2.5 rounded-md transition-colors"
            >
              Generate Coupon Code
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
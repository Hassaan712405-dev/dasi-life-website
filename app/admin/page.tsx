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
} from 'lucide-react';
import { motion } from 'framer-motion';
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

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
  const chartPoints = monthlyRevenue
    .map((m, i) => {
      const x = (i / (monthlyRevenue.length - 1 || 1)) * 100;
      const y = 100 - (m.revenue / maxRevenue) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-start justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">
            Real-time snapshot of your wildcrafted organic inventory and nationwide Unani orders.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-brand-text-dark hover:border-brand-green transition-colors"
        >
          <Calendar size={14} />
          This Month
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-[10px] sm:text-xs font-semibold text-brand-text-muted tracking-wide">
                  {stat.label}
                </p>
                <Icon size={16} className="text-brand-text-muted" />
              </div>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-brand-text-dark mb-1 sm:mb-2 truncate">
                {stat.value}
              </p>
              <p
                className={`text-[10px] sm:text-xs font-medium flex items-center gap-1 ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.subtitle && <TrendingUp size={10} />}
                <span className="truncate">{stat.change} {stat.subtitle}</span>
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
        >
          <div className="flex items-start justify-between mb-4 sm:mb-5">
            <div>
              <h2 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark mb-1">
                Monthly Revenue Trend
              </h2>
              <p className="text-[10px] sm:text-xs text-brand-text-muted">
                Gross sales volume (Rs) across recent months.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-brand-text-muted">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              Revenue
            </div>
          </div>

          <div className="relative h-40 sm:h-48 border-l border-b border-gray-200">
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
                <div className="absolute top-2 right-2 bg-brand-green text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow-md">
                  Rs {monthlyRevenue[monthlyRevenue.length - 1].revenue.toLocaleString()}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm text-brand-text-muted">
                No revenue data yet
              </div>
            )}
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-brand-text-muted mt-2 sm:mt-3">
            {monthlyRevenue.map((m, i) => (
              <span key={i}>{m.month}</span>
            ))}
          </div>
        </motion.div>

        {/* Low Stock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark">
              Low Stock Alerts
            </h2>
            {lowStock.filter((p) => p.status !== 'Healthy').length > 0 && (
              <span className="bg-red-100 text-red-700 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                {lowStock.filter((p) => p.status !== 'Healthy').length}
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-brand-text-muted mb-3 sm:mb-4">
            Below minimum threshold levels.
          </p>
          <div className="space-y-3 sm:space-y-4">
            {lowStock.length === 0 ? (
              <p className="text-xs sm:text-sm text-brand-text-muted text-center py-4">
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
                    className="pb-3 sm:pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs sm:text-sm font-medium text-brand-text-dark line-clamp-1">
                        {item.name}
                      </p>
                      <span
                        className={`${statusColor} text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-brand-text-muted">
                      Stock: <strong className="text-brand-text-dark">{item.stock}</strong> / Min: {item.minStock}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-[10px] sm:text-xs font-medium text-brand-gold hover:text-brand-green transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="text-xs sm:text-sm text-brand-text-muted text-center py-6">
                No orders yet
              </p>
            ) : (
              <table className="w-full min-w-[550px]">
                <thead>
                  <tr className="bg-gray-50 text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide">
                    <th className="text-left px-2 sm:px-3 py-2 rounded-l-md">Order</th>
                    <th className="text-left px-2 sm:px-3 py-2">Customer</th>
                    <th className="text-left px-2 sm:px-3 py-2">Total</th>
                    <th className="text-left px-2 sm:px-3 py-2">Status</th>
                    <th className="text-left px-2 sm:px-3 py-2 rounded-r-md">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-b-0 text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 sm:px-3 py-2.5 sm:py-3.5 font-medium text-brand-text-dark">
                        #{order.order_number}
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 sm:py-3.5 text-brand-text-muted truncate">
                        {order.customer_name}
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 sm:py-3.5 font-semibold text-brand-text-dark">
                        Rs {order.total.toLocaleString()}
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 sm:py-3.5">
                        <span
                          className={`${getStatusColor(order.status)} text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full`}
                        >
                          {capitalize(order.status)}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 sm:py-3.5 text-brand-text-muted whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          <h2 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark">
            Quick Actions
          </h2>

          <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2.5 sm:gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                <span className="text-brand-green font-bold text-base leading-none">+</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-brand-text-dark mb-0.5">
                  Add New Product
                </p>
                <p className="text-[10px] sm:text-xs text-brand-text-muted">
                  List a new Unani formulation
                </p>
              </div>
            </div>
            <Link
              href="/admin/products/new"
              className="block w-full text-center bg-brand-green hover:bg-black text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 rounded-md transition-colors"
            >
              Launch Product Form
            </Link>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2.5 sm:gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                <span className="text-brand-green text-base leading-none">%</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-brand-text-dark mb-0.5">
                  Create Promo Coupon
                </p>
                <p className="text-[10px] sm:text-xs text-brand-text-muted">
                  Setup a discount campaign
                </p>
              </div>
            </div>
            <Link
              href="/admin/coupons"
              className="block w-full text-center bg-brand-green hover:bg-black text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 rounded-md transition-colors"
            >
              Generate Coupon Code
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
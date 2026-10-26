'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Loader2, X, Users, Phone, ShoppingCart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllCustomers,
  getCustomerOrders,
  CustomerWithStats,
} from '@/services/admin/customerAdmin';

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

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingCustomer, setViewingCustomer] = useState<CustomerWithStats | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    async function loadOrders() {
      if (!viewingCustomer) {
        setCustomerOrders([]);
        return;
      }
      setLoadingOrders(true);
      const data = await getCustomerOrders(viewingCustomer.id);
      setCustomerOrders(data);
      setLoadingOrders(false);
    }
    loadOrders();
  }, [viewingCustomer]);

  const filteredCustomers = customers.filter((customer) => {
    const q = searchQuery.toLowerCase();
    return (
      searchQuery === '' ||
      (customer.full_name || '').toLowerCase().includes(q) ||
      (customer.phone || '').includes(searchQuery)
    );
  });

  const totalCustomers = customers.length;
  const customersWithOrders = customers.filter((c) => c.orders_count > 0).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
          Customers
        </h1>
        <p className="text-xs sm:text-sm text-brand-text-muted">
          View and manage all registered customers.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {[
          { label: 'TOTAL', value: totalCustomers, icon: Users },
          { label: 'WITH ORDERS', value: customersWithOrders, icon: ShoppingCart },
          { label: 'REVENUE', value: `Rs ${totalRevenue.toLocaleString()}`, icon: ShoppingCart, green: true },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-[10px] sm:text-xs font-semibold text-brand-text-muted tracking-wide">
                  {stat.label}
                </p>
                <Icon size={14} className="text-brand-text-muted" />
              </div>
              <p
                className={`text-base sm:text-2xl md:text-3xl font-bold truncate ${
                  stat.green ? 'text-brand-green' : 'text-brand-text-dark'
                }`}
              >
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4"
      >
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={28} className="animate-spin text-brand-green mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-brand-text-muted">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <Users size={40} className="text-brand-text-muted mx-auto mb-4" />
            <p className="text-xs sm:text-sm text-brand-text-muted">
              {customers.length === 0 ? 'No customers yet.' : 'No customers found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide border-b border-gray-200">
                  <th className="text-left px-3 sm:px-4 py-3">Customer</th>
                  <th className="text-left px-3 sm:px-4 py-3">Phone</th>
                  <th className="text-left px-3 sm:px-4 py-3">Orders</th>
                  <th className="text-left px-3 sm:px-4 py-3">Total Spent</th>
                  <th className="text-left px-3 sm:px-4 py-3">Joined</th>
                  <th className="text-right px-3 sm:px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => {
                  const initials = customer.full_name
                    ? customer.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'U';

                  return (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-green text-white flex items-center justify-center text-[10px] sm:text-xs font-semibold shrink-0">
                            {initials}
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-brand-text-dark truncate">
                            {customer.full_name || 'Anonymous'}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-brand-text-muted">
                        {customer.phone || '—'}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-brand-text-dark">
                        {customer.orders_count}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-brand-green whitespace-nowrap">
                        Rs {customer.total_spent.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-brand-text-muted whitespace-nowrap">
                        {new Date(customer.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setViewingCustomer(customer)}
                            className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-brand-green border border-brand-green rounded-md px-2.5 sm:px-3 py-1 sm:py-1.5 hover:bg-brand-green hover:text-white transition-colors"
                          >
                            <Eye size={11} />
                            View
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <p className="text-[10px] sm:text-xs text-brand-text-muted text-center">
        Showing {filteredCustomers.length} of {customers.length} customers
      </p>

      {/* View Customer Modal */}
      <AnimatePresence>
        {viewingCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-xl max-w-2xl w-full my-4 sm:my-8"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 rounded-t-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-green text-white flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0">
                    {viewingCustomer.full_name
                      ? viewingCustomer.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                      : 'U'}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-heading font-semibold text-sm sm:text-lg text-brand-green truncate">
                      {viewingCustomer.full_name || 'Anonymous'}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-brand-text-muted">
                      Customer since{' '}
                      {new Date(viewingCustomer.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingCustomer(null)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Contact */}
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2 sm:mb-3">
                    Contact Information
                  </p>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    {viewingCustomer.phone && (
                      <p className="flex items-center gap-2 text-brand-text-muted">
                        <Phone size={12} className="text-brand-green" />
                        {viewingCustomer.phone}
                      </p>
                    )}
                    <p className="flex items-center gap-2 text-brand-text-muted">
                      <Calendar size={12} className="text-brand-green" />
                      Joined{' '}
                      {new Date(viewingCustomer.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-brand-cream rounded-lg p-3 sm:p-4">
                    <p className="text-[10px] sm:text-xs font-semibold text-brand-text-muted mb-1">
                      TOTAL ORDERS
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-brand-green">
                      {viewingCustomer.orders_count}
                    </p>
                  </div>
                  <div className="bg-brand-cream rounded-lg p-3 sm:p-4">
                    <p className="text-[10px] sm:text-xs font-semibold text-brand-text-muted mb-1">
                      TOTAL SPENT
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-brand-green">
                      Rs {viewingCustomer.total_spent.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Order History */}
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2 sm:mb-3">
                    Order History
                  </p>
                  {loadingOrders ? (
                    <div className="text-center py-5">
                      <Loader2 size={18} className="animate-spin text-brand-green mx-auto" />
                    </div>
                  ) : customerOrders.length === 0 ? (
                    <p className="text-xs sm:text-sm text-brand-text-muted text-center py-4">
                      No orders yet.
                    </p>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {customerOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center justify-between gap-3 pb-2 sm:pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                        >
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-brand-text-dark">
                              #{order.order_number}
                            </p>
                            <p className="text-[10px] sm:text-xs text-brand-text-muted">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`${getStatusColor(order.status)} text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full`}
                            >
                              {capitalize(order.status)}
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-brand-text-dark">
                              Rs {order.total.toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Loader2, X, Users, Phone, ShoppingCart, Calendar } from 'lucide-react';
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

  // Load orders when viewing a customer
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

  // Filter
  const filteredCustomers = customers.filter((customer) => {
    const q = searchQuery.toLowerCase();
    return (
      searchQuery === '' ||
      (customer.full_name || '').toLowerCase().includes(q) ||
      (customer.phone || '').includes(searchQuery)
    );
  });

  // Stats
  const totalCustomers = customers.length;
  const customersWithOrders = customers.filter((c) => c.orders_count > 0).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
          Customers
        </h1>
        <p className="text-sm text-brand-text-muted">
          View and manage all registered Dasi Life customers across Pakistan.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-brand-text-muted tracking-wide">
              TOTAL CUSTOMERS
            </p>
            <Users size={18} className="text-brand-text-muted" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-brand-text-dark">
            {totalCustomers}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-brand-text-muted tracking-wide">
              WITH ORDERS
            </p>
            <ShoppingCart size={18} className="text-brand-text-muted" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-brand-text-dark">
            {customersWithOrders}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-brand-text-muted tracking-wide">
              TOTAL REVENUE
            </p>
            <ShoppingCart size={18} className="text-brand-text-muted" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-brand-green">
            Rs {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
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
            className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={32} className="animate-spin text-brand-green mx-auto mb-3" />
            <p className="text-sm text-brand-text-muted">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="text-brand-text-muted mx-auto mb-4" />
            <p className="text-brand-text-muted">
              {customers.length === 0
                ? 'No customers yet.'
                : 'No customers found matching your search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-brand-text-muted uppercase tracking-wide border-b border-gray-200">
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Orders</th>
                  <th className="text-left px-4 py-3">Total Spent</th>
                  <th className="text-left px-4 py-3">Joined</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const initials = customer.full_name
                    ? customer.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'U';

                  return (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center text-sm font-semibold shrink-0">
                            {initials}
                          </div>
                          <p className="text-sm font-medium text-brand-text-dark">
                            {customer.full_name || 'Anonymous'}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-brand-text-muted">
                        {customer.phone || '—'}
                      </td>

                      <td className="px-4 py-3 text-sm font-medium text-brand-text-dark">
                        {customer.orders_count}
                      </td>

                      <td className="px-4 py-3 text-sm font-semibold text-brand-green">
                        Rs {customer.total_spent.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-sm text-brand-text-muted">
                        {new Date(customer.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setViewingCustomer(customer)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-green border border-brand-green rounded-md px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors"
                          >
                            <Eye size={12} />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-brand-text-muted text-center">
        Showing {filteredCustomers.length} of {customers.length} customers
      </p>

      {/* View Customer Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center text-base font-semibold">
                  {viewingCustomer.full_name
                    ? viewingCustomer.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'U'}
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-lg text-brand-green">
                    {viewingCustomer.full_name || 'Anonymous'}
                  </h2>
                  <p className="text-xs text-brand-text-muted">
                    Customer since{' '}
                    {new Date(viewingCustomer.created_at).toLocaleDateString(
                      'en-US',
                      { month: 'long', year: 'numeric' }
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="w-9 h-9 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-3">
                  Contact Information
                </p>
                <div className="space-y-2 text-sm">
                  {viewingCustomer.phone && (
                    <p className="flex items-center gap-2 text-brand-text-muted">
                      <Phone size={14} className="text-brand-green" />
                      {viewingCustomer.phone}
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-brand-text-muted">
                    <Calendar size={14} className="text-brand-green" />
                    Joined{' '}
                    {new Date(viewingCustomer.created_at).toLocaleDateString(
                      'en-US',
                      { month: 'long', day: 'numeric', year: 'numeric' }
                    )}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-cream rounded-lg p-4">
                  <p className="text-xs font-semibold text-brand-text-muted mb-1">
                    TOTAL ORDERS
                  </p>
                  <p className="text-2xl font-bold text-brand-green">
                    {viewingCustomer.orders_count}
                  </p>
                </div>
                <div className="bg-brand-cream rounded-lg p-4">
                  <p className="text-xs font-semibold text-brand-text-muted mb-1">
                    TOTAL SPENT
                  </p>
                  <p className="text-2xl font-bold text-brand-green">
                    Rs {viewingCustomer.total_spent.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Orders List */}
              <div>
                <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-3">
                  Order History
                </p>
                {loadingOrders ? (
                  <div className="text-center py-6">
                    <Loader2 size={20} className="animate-spin text-brand-green mx-auto" />
                  </div>
                ) : customerOrders.length === 0 ? (
                  <p className="text-sm text-brand-text-muted text-center py-4">
                    No orders yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-brand-text-dark">
                            #{order.order_number}
                          </p>
                          <p className="text-xs text-brand-text-muted">
                            {new Date(order.created_at).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric', year: 'numeric' }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`${getStatusColor(order.status)} text-xs font-semibold px-2.5 py-1 rounded-full`}
                          >
                            {capitalize(order.status)}
                          </span>
                          <p className="text-sm font-semibold text-brand-text-dark shrink-0">
                            Rs {order.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
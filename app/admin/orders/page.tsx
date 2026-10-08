'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Loader2, X, Package, MapPin, Phone, Mail, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllOrders, updateOrderStatus } from '@/services/admin/orderAdmin';
import type { OrderWithItems, OrderStatus } from '@/types/order';
import OrderPrintLabel from '@/components/admin/OrderPrintLabel';

const filters: { key: 'All' | OrderStatus; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const statusOptions: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled',
];

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | OrderStatus>('All');
  const [viewingOrder, setViewingOrder] = useState<OrderWithItems | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (viewingOrder?.id === orderId) {
        setViewingOrder({ ...viewingOrder, status: newStatus });
      }
    }
    setUpdatingId(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = activeFilter === 'All' || order.status === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getCount = (key: 'All' | OrderStatus) => {
    if (key === 'All') return orders.length;
    return orders.filter((o) => o.status === key).length;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
          Orders
        </h1>
        <p className="text-xs sm:text-sm text-brand-text-muted">
          Manage and track all Unani wellness orders.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 space-y-3 sm:space-y-4"
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
            placeholder="Search by order ID, customer name, or phone..."
            className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
                activeFilter === filter.key
                  ? 'bg-brand-green text-white'
                  : 'bg-white border border-gray-200 text-brand-text-dark hover:border-brand-green hover:text-brand-green'
              }`}
            >
              {filter.label}
              <span
                className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                  activeFilter === filter.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-brand-text-muted'
                }`}
              >
                {getCount(filter.key)}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={28} className="animate-spin text-brand-green mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-brand-text-muted">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <Package size={40} className="text-brand-text-muted mx-auto mb-4" />
            <p className="text-xs sm:text-sm text-brand-text-muted">
              {orders.length === 0 ? 'No orders yet.' : 'No orders match your filters.'}
            </p>
          </div>
        ) : (
          <>
            {/* ============================================ */}
            {/* DESKTOP TABLE — hidden on mobile (md+)     */}
            {/* ============================================ */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide border-b border-gray-200">
                    <th className="text-left px-4 py-3">Order</th>
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-left px-4 py-3">Phone</th>
                    <th className="text-left px-4 py-3">Total</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-brand-text-dark">
                        #{order.order_number}
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-text-dark truncate max-w-[120px]">
                        {order.customer_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-text-muted">
                        {order.customer_phone}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-brand-text-dark whitespace-nowrap">
                        Rs {order.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {updatingId === order.id ? (
                          <div className="flex items-center gap-2 text-xs text-brand-text-muted">
                            <Loader2 size={12} className="animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className={`${getStatusColor(order.status)} text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-green`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>
                                {capitalize(s)}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-text-muted whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setViewingOrder(order)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-green border border-brand-green rounded-md px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors"
                          >
                            <Eye size={12} />
                            View
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ============================================ */}
            {/* MOBILE CARDS — hidden on desktop            */}
            {/* ============================================ */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="p-4 space-y-3"
                >
                  {/* Top row: Order # + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-brand-text-dark">
                        #{order.order_number}
                      </p>
                      <p className="text-[10px] text-brand-text-muted mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    {updatingId === order.id ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-brand-text-muted">
                        <Loader2 size={12} className="animate-spin" />
                        Updating...
                      </div>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className={`${getStatusColor(order.status)} text-[10px] font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-green`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {capitalize(s)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Customer info */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-brand-text-dark">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-brand-text-muted flex items-center gap-1.5">
                      <Phone size={11} className="text-brand-green" />
                      {order.customer_phone}
                    </p>
                  </div>

                  {/* Total + View button */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="shrink-0">
                      <p className="text-[10px] text-brand-text-muted uppercase tracking-wide">
                        Total
                      </p>
                      <p className="text-base font-bold text-brand-green">
                        Rs {order.total.toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingOrder(order)}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-brand-green rounded-md px-4 py-2.5 hover:bg-black active:scale-95 transition-all shadow-sm shrink-0"
                    >
                      <Eye size={13} />
                      View
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <p className="text-[10px] sm:text-xs text-brand-text-muted text-center">
        Showing {filteredOrders.length} of {orders.length} orders
      </p>

      {/* View Order Modal */}
      <AnimatePresence>
        {viewingOrder && (
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
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 z-10 rounded-t-xl">
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading font-semibold text-base sm:text-xl text-brand-green truncate">
                    Order #{viewingOrder.order_number}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-brand-text-muted truncate">
                    {new Date(viewingOrder.created_at).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* PRINT BUTTON */}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 bg-brand-green hover:bg-black text-white text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors"
                  >
                    <Printer size={12} />
                    <span className="hidden sm:inline">Print</span>
                  </button>

                  {/* CLOSE BUTTON */}
                  <button
                    type="button"
                    onClick={() => setViewingOrder(null)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Status */}
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2">
                    Status
                  </p>
                  <span
                    className={`${getStatusColor(viewingOrder.status)} text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full inline-block`}
                  >
                    {capitalize(viewingOrder.status)}
                  </span>
                </div>

                {/* Customer */}
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2 sm:mb-3">
                    Customer Information
                  </p>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <p className="font-medium text-brand-text-dark">{viewingOrder.customer_name}</p>
                    <p className="flex items-center gap-2 text-brand-text-muted">
                      <Phone size={12} className="text-brand-green shrink-0" />
                      {viewingOrder.customer_phone}
                    </p>
                    {viewingOrder.customer_email && (
                      <p className="flex items-center gap-2 text-brand-text-muted">
                        <Mail size={12} className="text-brand-green shrink-0" />
                        <span className="break-all">{viewingOrder.customer_email}</span>
                      </p>
                    )}
                    <p className="flex items-start gap-2 text-brand-text-muted">
                      <MapPin size={12} className="text-brand-green mt-0.5 shrink-0" />
                      <span>
                        {viewingOrder.shipping_address}, {viewingOrder.shipping_city},{' '}
                        {viewingOrder.shipping_state} {viewingOrder.shipping_postal_code},{' '}
                        {viewingOrder.shipping_country}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2 sm:mb-3">
                    Order Items ({viewingOrder.order_items.length})
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    {viewingOrder.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 pb-2 sm:pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-brand-text-dark line-clamp-2">
                            {item.product_name}
                          </p>
                          <p className="text-[10px] sm:text-xs text-brand-text-muted">
                            Qty: {item.quantity} × Rs {item.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-brand-text-dark shrink-0">
                          Rs {item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-brand-cream rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-brand-text-muted">Subtotal</span>
                    <span className="text-brand-text-dark font-medium">
                      Rs {viewingOrder.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-brand-text-muted">Shipping</span>
                    <span className="text-brand-green font-medium">
                      {viewingOrder.shipping_fee === 0
                        ? 'FREE'
                        : `Rs ${viewingOrder.shipping_fee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="font-heading font-semibold text-xs sm:text-sm text-brand-green">Total</span>
                    <span className="font-heading font-bold text-sm sm:text-base text-brand-green">
                      Rs {viewingOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2">
                    Update Status
                  </p>
                  <select
                    value={viewingOrder.status}
                    onChange={(e) =>
                      handleStatusChange(viewingOrder.id, e.target.value as OrderStatus)
                    }
                    disabled={updatingId === viewingOrder.id}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer disabled:opacity-60"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {capitalize(s)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print Label — Sirf print ke waqt visible hoga */}
      {viewingOrder && <OrderPrintLabel order={viewingOrder} />}
    </div>
  );
}
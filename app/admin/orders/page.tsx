'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Loader2, X, Package, MapPin, Phone, Mail } from 'lucide-react';
import {
  getAllOrders,
  updateOrderStatus,
} from '@/services/admin/orderAdmin';
import type { OrderWithItems, OrderStatus } from '@/types/order';

const filters: { key: 'All' | OrderStatus; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const statusOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === 'All' || order.status === activeFilter;

    const matchesSearch =
      searchQuery === '' ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  // Counts per filter
  const getCount = (key: 'All' | OrderStatus) => {
    if (key === 'All') return orders.length;
    return orders.filter((o) => o.status === key).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
          Orders
        </h1>
        <p className="text-sm text-brand-text-muted">
          Manage and track all Unani wellness orders placed across Pakistan.
        </p>
      </div>

      {/* Filters + Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        {/* Search */}
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
            className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
                activeFilter === filter.key
                  ? 'bg-brand-green text-white'
                  : 'bg-white border border-gray-200 text-brand-text-dark hover:border-brand-green hover:text-brand-green'
              }`}
            >
              {filter.label}
              <span
                className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
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
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={32} className="animate-spin text-brand-green mx-auto mb-3" />
            <p className="text-sm text-brand-text-muted">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="text-brand-text-muted mx-auto mb-4" />
            <p className="text-brand-text-muted">
              {orders.length === 0
                ? 'No orders yet.'
                : 'No orders found matching your filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-brand-text-muted uppercase tracking-wide border-b border-gray-200">
                  <th className="text-left px-4 py-3">Order ID</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-brand-text-dark">
                      #{order.order_number}
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-text-dark">
                      {order.customer_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-text-muted">
                      {order.customer_phone}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-brand-text-dark">
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
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
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
                    <td className="px-4 py-3 text-sm text-brand-text-muted">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-brand-text-muted text-center">
        Showing {filteredOrders.length} of {orders.length} orders
      </p>

      {/* View Order Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-heading font-semibold text-xl text-brand-green">
                  Order #{viewingOrder.order_number}
                </h2>
                <p className="text-xs text-brand-text-muted">
                  {new Date(viewingOrder.created_at).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="w-9 h-9 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2">
                  Status
                </p>
                <span
                  className={`${getStatusColor(viewingOrder.status)} text-xs font-semibold px-3 py-1.5 rounded-full inline-block`}
                >
                  {capitalize(viewingOrder.status)}
                </span>
              </div>

              {/* Customer Info */}
              <div>
                <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-3">
                  Customer Information
                </p>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-brand-text-dark">
                    {viewingOrder.customer_name}
                  </p>
                  <p className="flex items-center gap-2 text-brand-text-muted">
                    <Phone size={14} className="text-brand-green" />
                    {viewingOrder.customer_phone}
                  </p>
                  {viewingOrder.customer_email && (
                    <p className="flex items-center gap-2 text-brand-text-muted">
                      <Mail size={14} className="text-brand-green" />
                      {viewingOrder.customer_email}
                    </p>
                  )}
                  <p className="flex items-start gap-2 text-brand-text-muted">
                    <MapPin size={14} className="text-brand-green mt-0.5 shrink-0" />
                    <span>
                      {viewingOrder.shipping_address},{' '}
                      {viewingOrder.shipping_city},{' '}
                      {viewingOrder.shipping_state}{' '}
                      {viewingOrder.shipping_postal_code},{' '}
                      {viewingOrder.shipping_country}
                    </span>
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-3">
                  Order Items ({viewingOrder.order_items.length})
                </p>
                <div className="space-y-3">
                  {viewingOrder.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-brand-text-dark line-clamp-2">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-brand-text-muted">
                          Qty: {item.quantity} × Rs {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-brand-text-dark shrink-0">
                        Rs {item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-brand-cream rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-text-muted">Subtotal</span>
                  <span className="text-brand-text-dark font-medium">
                    Rs {viewingOrder.subtotal.toLocaleString()}
                  </span>
                </div>
                {viewingOrder.discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-text-muted">Discount</span>
                    <span className="text-green-600 font-medium">
                      − Rs {viewingOrder.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-text-muted">Shipping</span>
                  <span className="text-brand-green font-medium">
                    {viewingOrder.shipping_fee === 0
                      ? 'FREE'
                      : `Rs ${viewingOrder.shipping_fee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="font-heading font-semibold text-brand-green">
                    Total
                  </span>
                  <span className="font-heading font-bold text-brand-green">
                    Rs {viewingOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {viewingOrder.notes && (
                <div>
                  <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2">
                    Order Notes
                  </p>
                  <p className="text-sm text-brand-text-muted italic bg-gray-50 rounded-lg p-3">
                    "{viewingOrder.notes}"
                  </p>
                </div>
              )}

              {/* Status Update in Modal */}
              <div>
                <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2">
                  Update Status
                </p>
                <select
                  value={viewingOrder.status}
                  onChange={(e) =>
                    handleStatusChange(
                      viewingOrder.id,
                      e.target.value as OrderStatus
                    )
                  }
                  disabled={updatingId === viewingOrder.id}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer disabled:opacity-60"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {capitalize(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
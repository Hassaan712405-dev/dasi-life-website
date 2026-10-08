'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  Loader2,
  X,
  Package,
  MapPin,
  Phone,
  Mail,
  Printer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllOrders,
  updateOrderStatus,
} from '@/services/admin/orderAdmin';
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
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  const [activeFilter, setActiveFilter] = useState<
    'All' | OrderStatus
  >('All');

  const [viewingOrder, setViewingOrder] =
    useState<OrderWithItems | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await getAllOrders();

      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingId(orderId);

      const result = await updateOrderStatus(
        orderId,
        newStatus
      );

      if (result.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order
          )
        );

        setViewingOrder((current) =>
          current?.id === orderId
            ? {
                ...current,
                status: newStatus,
              }
            : current
        );
      }
    } catch (error) {
      console.error(
        'Failed to update order status:',
        error
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const normalizedSearch =
      searchQuery.trim().toLowerCase();

    const matchesFilter =
      activeFilter === 'All' ||
      order.status === activeFilter;

    const matchesSearch =
      normalizedSearch === '' ||
      order.order_number
        .toLowerCase()
        .includes(normalizedSearch) ||
      order.customer_name
        .toLowerCase()
        .includes(normalizedSearch) ||
      order.customer_phone
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });

  const getCount = (key: 'All' | OrderStatus) => {
    if (key === 'All') {
      return orders.length;
    }

    return orders.filter(
      (order) => order.status === key
    ).length;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-6">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h1 className="text-2xl font-heading font-bold text-brand-green sm:text-3xl md:text-4xl">
          Orders
        </h1>

        <p className="mt-1 text-xs text-brand-text-muted sm:text-sm">
          Manage and track all Unani wellness orders.
        </p>
      </motion.div>

      {/* ========================================================= */}
      {/* FILTERS */}
      {/* ========================================================= */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
        }}
        className="w-full rounded-xl border border-gray-200 bg-white p-3 sm:p-4"
      >
        {/* Search */}
        <div className="relative w-full">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search order ID, customer name, or phone..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-brand-text-dark outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          />
        </div>

        {/* Filters */}
        <div className="mt-3 w-full overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex min-w-max items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.key)
                }
                className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all sm:px-4 ${
                  activeFilter === filter.key
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-brand-text-dark hover:border-brand-green hover:text-brand-green'
                }`}
              >
                <span>{filter.label}</span>

                <span
                  className={`min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${
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
      </motion.div>

      {/* ========================================================= */}
      {/* ORDERS CONTAINER */}
      {/* ========================================================= */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        {/* ======================================================= */}
        {/* LOADING */}
        {/* ======================================================= */}

        {loading ? (
          <div className="px-4 py-16 text-center sm:py-20">
            <Loader2
              size={30}
              className="mx-auto mb-3 animate-spin text-brand-green"
            />

            <p className="text-sm text-brand-text-muted">
              Loading orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* ===================================================== */
          /* EMPTY STATE */
          /* ===================================================== */

          <div className="px-4 py-14 text-center sm:py-16">
            <Package
              size={42}
              className="mx-auto mb-4 text-brand-text-muted"
            />

            <p className="text-sm text-brand-text-muted">
              {orders.length === 0
                ? 'No orders yet.'
                : 'No orders match your filters.'}
            </p>
          </div>
        ) : (
          <>
            {/* =================================================== */}
            {/* DESKTOP TABLE */}
            {/* =================================================== */}

            <div className="hidden w-full overflow-x-auto md:block">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-brand-text-muted">
                    <th className="whitespace-nowrap px-4 py-3.5">
                      Order
                    </th>

                    <th className="whitespace-nowrap px-4 py-3.5">
                      Customer
                    </th>

                    <th className="whitespace-nowrap px-4 py-3.5">
                      Phone
                    </th>

                    <th className="whitespace-nowrap px-4 py-3.5">
                      Total
                    </th>

                    <th className="whitespace-nowrap px-4 py-3.5">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-4 py-3.5">
                      Date
                    </th>

                    <th className="whitespace-nowrap px-4 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map(
                    (order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.03,
                        }}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      >
                        {/* Order */}
                        <td className="px-4 py-4 text-sm font-medium text-brand-text-dark">
                          #{order.order_number}
                        </td>

                        {/* Customer */}
                        <td className="max-w-[180px] px-4 py-4 text-sm text-brand-text-dark">
                          <span className="block truncate">
                            {order.customer_name}
                          </span>
                        </td>

                        {/* Phone */}
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-brand-text-muted">
                          {order.customer_phone}
                        </td>

                        {/* Total */}
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-brand-text-dark">
                          Rs{' '}
                          {order.total.toLocaleString()}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          {updatingId === order.id ? (
                            <div className="flex items-center gap-2 text-xs text-brand-text-muted">
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />

                              <span>
                                Updating...
                              </span>
                            </div>
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  order.id,
                                  e.target
                                    .value as OrderStatus
                                )
                              }
                              className={`${getStatusColor(
                                order.status
                              )} cursor-pointer rounded-full border-0 px-2.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-green/30`}
                            >
                              {statusOptions.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {capitalize(
                                      status
                                    )}
                                  </option>
                                )
                              )}
                            </select>
                          )}
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-brand-text-muted">
                          {formatDate(
                            order.created_at
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                setViewingOrder(
                                  order
                                )
                              }
                              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-brand-green px-3 py-2 text-xs font-medium text-brand-green transition-colors hover:bg-brand-green hover:text-white"
                              aria-label={`View order ${order.order_number}`}
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* =================================================== */}
            {/* MOBILE ORDER CARDS */}
            {/* =================================================== */}

            <div className="block divide-y divide-gray-100 md:hidden">
              {filteredOrders.map(
                (order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.03,
                    }}
                    className="p-4"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-brand-text-dark">
                          #{order.order_number}
                        </p>

                        <p className="mt-1 truncate text-xs text-brand-text-muted">
                          {order.customer_name}
                        </p>
                      </div>

                      {/* View Button - ALWAYS VISIBLE */}
                      <button
                        type="button"
                        onClick={() =>
                          setViewingOrder(order)
                        }
                        className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-lg border border-brand-green px-3 py-2 text-xs font-semibold text-brand-green transition-colors active:bg-brand-green active:text-white"
                        aria-label={`View order ${order.order_number}`}
                      >
                        <Eye size={15} />
                        <span>View</span>
                      </button>
                    </div>

                    {/* Customer Details */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-text-muted">
                          Phone
                        </p>

                        <p className="mt-1 truncate text-xs text-brand-text-dark">
                          {order.customer_phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-text-muted">
                          Date
                        </p>

                        <p className="mt-1 text-xs text-brand-text-dark">
                          {formatDate(
                            order.created_at
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Total + Status */}
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-text-muted">
                          Total
                        </p>

                        <p className="mt-0.5 text-sm font-bold text-brand-text-dark">
                          Rs{' '}
                          {order.total.toLocaleString()}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {updatingId === order.id ? (
                          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs text-brand-text-muted">
                            <Loader2
                              size={13}
                              className="animate-spin"
                            />

                            <span>
                              Updating...
                            </span>
                          </div>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target
                                  .value as OrderStatus
                              )
                            }
                            className={`${getStatusColor(
                              order.status
                            )} max-w-[130px] cursor-pointer rounded-full border-0 px-2.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-green/30`}
                            aria-label={`Change status for order ${order.order_number}`}
                          >
                            {statusOptions.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {capitalize(
                                    status
                                  )}
                                </option>
                              )
                            )}
                          </select>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </>
        )}
      </motion.div>

      {/* ========================================================= */}
      {/* RESULT COUNT */}
      {/* ========================================================= */}

      <p className="px-2 text-center text-[11px] text-brand-text-muted sm:text-xs">
        Showing {filteredOrders.length} of{' '}
        {orders.length} orders
      </p>

      {/* ========================================================= */}
      {/* VIEW ORDER MODAL */}
      {/* ========================================================= */}

      <AnimatePresence>
        {viewingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-0 sm:items-center sm:p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setViewingOrder(null);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
                y: 20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white sm:my-4 sm:min-h-0 sm:max-w-2xl sm:rounded-xl"
            >
              {/* ================================================= */}
              {/* MODAL HEADER */}
              {/* ================================================= */}

              <div className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
                <div className="min-w-0">
                  <h2 className="truncate font-heading text-base font-semibold text-brand-green sm:text-xl">
                    Order #
                    {viewingOrder.order_number}
                  </h2>

                  <p className="mt-0.5 text-[10px] text-brand-text-muted sm:text-xs">
                    {formatDateTime(
                      viewingOrder.created_at
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {/* PRINT */}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-brand-green px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-black"
                  >
                    <Printer size={14} />

                    <span className="hidden xs:inline sm:inline">
                      Print Label
                    </span>
                  </button>

                  {/* CLOSE */}
                  <button
                    type="button"
                    onClick={() =>
                      setViewingOrder(null)
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-brand-text-dark transition-colors hover:bg-gray-100"
                    aria-label="Close order details"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* ================================================= */}
              {/* MODAL BODY */}
              {/* ================================================= */}

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-5 sm:space-y-6">
                  {/* STATUS */}
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-brand-text-muted sm:text-xs">
                      Status
                    </p>

                    <span
                      className={`${getStatusColor(
                        viewingOrder.status
                      )} inline-flex rounded-full px-3 py-1.5 text-xs font-semibold`}
                    >
                      {capitalize(
                        viewingOrder.status
                      )}
                    </span>
                  </div>

                  {/* CUSTOMER */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-brand-text-muted sm:text-xs">
                      Customer Information
                    </p>

                    <div className="space-y-2.5 text-sm">
                      <p className="font-semibold text-brand-text-dark">
                        {viewingOrder.customer_name}
                      </p>

                      <p className="flex items-start gap-2 text-brand-text-muted">
                        <Phone
                          size={14}
                          className="mt-0.5 shrink-0 text-brand-green"
                        />

                        <span className="break-all">
                          {
                            viewingOrder.customer_phone
                          }
                        </span>
                      </p>

                      {viewingOrder.customer_email && (
                        <p className="flex items-start gap-2 text-brand-text-muted">
                          <Mail
                            size={14}
                            className="mt-0.5 shrink-0 text-brand-green"
                          />

                          <span className="break-all">
                            {
                              viewingOrder.customer_email
                            }
                          </span>
                        </p>
                      )}

                      <p className="flex items-start gap-2 text-brand-text-muted">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-brand-green"
                        />

                        <span className="break-words">
                          {
                            viewingOrder.shipping_address
                          }
                          ,{' '}
                          {
                            viewingOrder.shipping_city
                          }
                          ,{' '}
                          {
                            viewingOrder.shipping_state
                          }{' '}
                          {
                            viewingOrder.shipping_postal_code
                          }
                          ,{' '}
                          {
                            viewingOrder.shipping_country
                          }
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ORDER ITEMS */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-brand-text-muted sm:text-xs">
                      Order Items (
                      {
                        viewingOrder.order_items
                          .length
                      }
                      )
                    </p>

                    <div className="space-y-3">
                      {viewingOrder.order_items.map(
                        (item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-sm font-medium text-brand-text-dark">
                                {
                                  item.product_name
                                }
                              </p>

                              <p className="mt-1 text-xs text-brand-text-muted">
                                Qty:{' '}
                                {item.quantity}{' '}
                                × Rs{' '}
                                {item.price.toLocaleString()}
                              </p>
                            </div>

                            <p className="shrink-0 text-sm font-semibold text-brand-text-dark">
                              Rs{' '}
                              {item.subtotal.toLocaleString()}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* TOTALS */}
                  <div className="rounded-lg bg-brand-cream p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-brand-text-muted">
                          Subtotal
                        </span>

                        <span className="font-medium text-brand-text-dark">
                          Rs{' '}
                          {viewingOrder.subtotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-brand-text-muted">
                          Shipping
                        </span>

                        <span className="font-medium text-brand-green">
                          {viewingOrder.shipping_fee ===
                          0
                            ? 'FREE'
                            : `Rs ${viewingOrder.shipping_fee.toLocaleString()}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2.5">
                        <span className="font-heading text-sm font-semibold text-brand-green">
                          Total
                        </span>

                        <span className="font-heading text-base font-bold text-brand-green">
                          Rs{' '}
                          {viewingOrder.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* UPDATE STATUS */}
                  <div className="pb-2">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-brand-text-muted sm:text-xs">
                      Update Status
                    </p>

                    <div className="relative">
                      <select
                        value={viewingOrder.status}
                        onChange={(e) =>
                          handleStatusChange(
                            viewingOrder.id,
                            e.target
                              .value as OrderStatus
                          )
                        }
                        disabled={
                          updatingId ===
                          viewingOrder.id
                        }
                        className="h-12 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {statusOptions.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {capitalize(status)}
                            </option>
                          )
                        )}
                      </select>

                      {updatingId ===
                        viewingOrder.id && (
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                          <Loader2
                            size={17}
                            className="animate-spin text-brand-green"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* PRINT LABEL */}
      {/* ========================================================= */}

      {viewingOrder && (
        <OrderPrintLabel order={viewingOrder} />
      )}
    </div>
  );
}
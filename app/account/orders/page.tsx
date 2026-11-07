'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Loader2,
  Package,
  Eye,
  RotateCcw,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductImageUrl } from '@/lib/utils/productImage';

interface OrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  variant_name: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  // ✅ Nested product images (kyunke order_items mein image_url nahi hai)
  products?: {
    product_images?: { url: string; sort_order: number | null }[];
  } | null;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  total: number;
  subtotal: number;
  shipping_fee: number;
  status: string;
  payment_method: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  created_at: string;
  order_items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-purple-100 text-purple-700 border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function MyOrdersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setFetchError(
            'You are not logged in. Please checkout to create your account.'
          );
          setLoading(false);
          return;
        }

        setUser(authUser);

        // ✅ product_images ko join karein (order_items mein image_url nahi hai)
        const { data, error } = await supabase
          .from('orders')
          .select(
            `
            id, order_number, customer_name, customer_email, customer_phone,
            total, subtotal, shipping_fee, status, payment_method,
            shipping_address, shipping_city, shipping_state, created_at,
            order_items (
              id, product_id, product_name, variant_name, price, quantity, subtotal,
              products (
                product_images ( url, sort_order )
              )
            )
          `
          )
          .or(
            `customer_id.eq.${authUser.id},user_id.eq.${authUser.id},customer_email.eq.${authUser.email}`
          )
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Orders error:', JSON.stringify(error, null, 2));
          setFetchError(error.message || 'Failed to load orders.');
          setLoading(false);
          return;
        }

        setOrders((data as unknown as Order[]) || []);
        setLoading(false);
      } catch (err: any) {
        console.error('❌ Unexpected:', err);
        setFetchError(err?.message || 'Something went wrong.');
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleReorder = (order: Order) => {
    const existingCart = localStorage.getItem('dasi-life-cart');
    let cart: any[] = existingCart ? JSON.parse(existingCart) : [];

    order.order_items.forEach((item) => {
      if (!item.product_id) return;
      const cartItemId = item.variant_name
        ? `${item.product_id}::${item.variant_name}`
        : item.product_id;
      const existing = cart.find((c: any) => c.id === cartItemId);
      if (existing) existing.quantity += item.quantity;
      else {
        cart.push({
          id: cartItemId,
          productId: item.product_id,
          variantId: undefined,
          variantName: item.variant_name || undefined,
          name: item.product_name,
          slug: '',
          price: item.price,
          imageUrl: getItemImage(item),
          quantity: item.quantity,
        });
      }
    });

    localStorage.setItem('dasi-life-cart', JSON.stringify(cart));
    window.location.href = '/cart';
  };

  // ✅ Helper: order item ki image nikaalein
  const getItemImage = (item: OrderItem): string => {
    const images = item.products?.product_images || [];
    if (images.length === 0) return '/images/placeholder-product.png';

    // Sort by sort_order, pehli image uthayein
    const sorted = [...images].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );
    return sorted[0]?.url || '/images/placeholder-product.png';
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-brand-green" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-brand-cream py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl mb-2">
              Unable to Load Orders
            </h2>
            <p className="text-sm text-brand-text-muted mb-5">{fetchError}</p>
            <Link
              href="/checkout"
              className="inline-block bg-brand-green text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-black transition-colors"
            >
              Go to Checkout
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-brand-green mb-2">
            My Orders
          </h1>
          {user && (
            <p className="text-xs sm:text-sm text-brand-text-muted">
              Signed in as <strong>{user.email}</strong>
            </p>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
            <Package
              size={48}
              className="text-brand-text-muted mx-auto mb-4"
            />
            <h3 className="font-heading font-semibold text-lg text-brand-text-dark mb-2">
              No orders yet
            </h3>
            <p className="text-sm text-brand-text-muted mb-5">
              You haven't placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-brand-green hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading font-bold text-base sm:text-lg text-brand-green">
                          #{order.order_number}
                        </h3>
                        <span
                          className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border font-medium ${
                            STATUS_COLORS[order.status] ||
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-muted mt-1 flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-brand-text-muted">Total</p>
                      <p className="font-heading font-bold text-base sm:text-lg text-brand-green">
                        Rs {order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {order.order_items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 bg-gray-50 rounded-md p-2 pr-3"
                      >
                        <img
                          src={getItemImage(item)}
                          alt={item.product_name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="text-xs font-medium text-brand-text-dark line-clamp-1 max-w-[120px]">
                            {item.product_name}
                          </p>
                          <p className="text-[10px] text-brand-text-muted">
                            × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.order_items.length > 4 && (
                      <div className="flex items-center justify-center bg-gray-50 rounded-md px-3 text-xs text-brand-text-muted">
                        +{order.order_items.length - 4} more
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/order-success?order=${order.order_number}`}
                      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 border-2 border-brand-green text-brand-green rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 hover:bg-brand-green hover:!text-white"
                    >
                      <Eye size={14} />
                      View Details
                    </Link>
                    <button
                      onClick={() => handleReorder(order)}
                      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-brand-green text-white rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 hover:bg-black"
                    >
                      <RotateCcw size={14} />
                      Reorder
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
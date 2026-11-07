import { createClient } from '@/lib/supabase/client';

// ============================================
// TYPES
// ============================================
export interface AdminNotification {
  id: string;
  type: 'order' | 'review' | 'stock' | 'customer';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link?: string;
}

// Internal types for Supabase query results
interface RecentOrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  total: number | null;
  created_at: string;
  status: string;
}

interface PendingReviewRow {
  id: string;
  rating: number;
  created_at: string;
  product_id: string;
}

interface LowStockProductRow {
  id: string;
  name: string;
  stock: number | null;
}

// ============================================
// GET ADMIN NOTIFICATIONS
// ============================================
export async function getAdminNotifications(): Promise<AdminNotification[]> {
  const supabase = createClient();
  const notifications: AdminNotification[] = [];

  try {
    // 1. Recent new orders (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, total, created_at, status')
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(3);

    const typedOrders: RecentOrderRow[] = (recentOrders || []) as RecentOrderRow[];

    typedOrders.forEach((order: RecentOrderRow) => {
      notifications.push({
        id: `order-${order.id}`,
        type: 'order',
        title: 'New Order Placed',
        message: `${order.customer_name} placed order #${order.order_number} (Rs ${Number(order.total || 0).toLocaleString()})`,
        time: order.created_at,
        isRead: false,
        link: '/admin/orders',
      });
    });

    // 2. Pending reviews
    const { data: pendingReviews } = await supabase
      .from('reviews')
      .select('id, rating, created_at, product_id')
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
      .limit(3);

    const typedReviews: PendingReviewRow[] = (pendingReviews || []) as PendingReviewRow[];

    typedReviews.forEach((review: PendingReviewRow) => {
      notifications.push({
        id: `review-${review.id}`,
        type: 'review',
        title: 'Review Awaiting Approval',
        message: `A new ${review.rating}-star review needs your moderation.`,
        time: review.created_at,
        isRead: false,
        link: '/admin/reviews',
      });
    });

    // 3. Low stock products
    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('id, name, stock')
      .eq('is_active', true)
      .lt('stock', 10)
      .order('stock', { ascending: true })
      .limit(3);

    const typedProducts: LowStockProductRow[] = (lowStockProducts || []) as LowStockProductRow[];

    typedProducts.forEach((product: LowStockProductRow) => {
      notifications.push({
        id: `stock-${product.id}`,
        type: 'stock',
        title: 'Low Stock Alert',
        message: `${product.name} is running low (${product.stock || 0} left)`,
        time: new Date().toISOString(),
        isRead: false,
        link: '/admin/products',
      });
    });

    // Sort by time (newest first)
    notifications.sort(
      (a: AdminNotification, b: AdminNotification) =>
        new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    return notifications;
  } catch (err) {
    console.error('Get notifications error:', err);
    return [];
  }
}

// ============================================
// GET TIME AGO
// ============================================
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
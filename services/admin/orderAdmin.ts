import { createClient } from '@/lib/supabase/client';
import type { OrderWithItems, OrderStatus } from '@/types/order';

// ============================================
// GET ALL ORDERS (Admin)
// ============================================
export async function getAllOrders(): Promise<OrderWithItems[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (*)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get orders error:', error);
    return [];
  }

  return (data || []) as OrderWithItems[];
}

// ============================================
// UPDATE ORDER STATUS
// ============================================
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // 1. Update order status
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Update status error:', error);
    return { success: false, error: error.message };
  }

  // 2. Add to status history
  await supabase.from('order_status_history').insert({
    order_id: orderId,
    status,
    note: note || `Status changed to ${status} by admin`,
  });

  return { success: true };
}

// ============================================
// GET ORDER STATS
// ============================================
export async function getOrderStats(): Promise<{
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('status');

  if (error || !data) {
    return {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
  }

  return {
    total: data.length,
    pending: data.filter((o) => o.status === 'pending').length,
    processing: data.filter((o) => o.status === 'processing').length,
    shipped: data.filter((o) => o.status === 'shipped').length,
    delivered: data.filter((o) => o.status === 'delivered').length,
    cancelled: data.filter((o) => o.status === 'cancelled').length,
  };
}

// ============================================
// DELETE ORDER
// ============================================
export async function deleteOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from('orders').delete().eq('id', orderId);

  if (error) {
    console.error('Delete order error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
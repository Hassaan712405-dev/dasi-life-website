import { createClient } from '@/lib/supabase/client';
import { restoreStock } from '@/services/products/inventoryService';
import type { OrderWithItems, OrderStatus } from '@/types/order';

// ============================================
// GET ALL ORDERS (Admin)
// ============================================
export async function getAllOrders(): Promise<OrderWithItems[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get orders error:', error);
    return [];
  }

  return data as OrderWithItems[];
}

// ============================================
// UPDATE ORDER STATUS
// ✅ Stock restore karo — agar cancel ho raha hai
// ============================================
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // 1. Get current order + items
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) {
    return { success: false, error: 'Order not found' };
  }

  const oldStatus = order.status;

  // ✅ 2. Stock restore — agar order cancel ho raha hai
  if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
    const items = order.order_items || [];

    for (const item of items) {
      const result = await restoreStock(
        item.product_id,
        item.variant_id,
        item.quantity
      );

      if (!result.success) {
        console.error('Stock restore error:', result.error);
      }
    }
  }

  // 3. Update status
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (updateError) {
    console.error('Update order status error:', updateError);
    return { success: false, error: updateError.message };
  }

  // 4. Insert status history
  await supabase.from('order_status_history').insert({
    order_id: orderId,
    status: newStatus,
    note: `Status updated from ${oldStatus} to ${newStatus}`,
  });

  return { success: true };
}
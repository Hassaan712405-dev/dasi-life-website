import { createClient } from '@/lib/supabase/client';
import type {
  CreateOrderInput,
  CreateOrderResult,
  OrderRecord,
  OrderWithItems,
} from '@/types/order';

// ============================================
// GENERATE ORDER NUMBER
// ============================================
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `DL-${timestamp}${random}`;
}

// ============================================
// CREATE ORDER
// ============================================
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const orderNumber = generateOrderNumber();

  // 1. Insert order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user?.id || null,
      customer_name: input.customerName,
      customer_name_urdu: input.customerNameUrdu || null,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail,
      shipping_address: input.shippingAddress,
      shipping_address_urdu: input.shippingAddressUrdu || null,
      shipping_city: input.shippingCity,
      shipping_city_urdu: input.shippingCityUrdu || null,
      shipping_state: input.shippingState,
      shipping_state_urdu: input.shippingStateUrdu || null,
      shipping_postal_code: input.shippingPostalCode,
      shipping_country: input.shippingCountry,
      subtotal: input.subtotal,
      shipping_fee: input.shippingFee,
      discount: input.discount,
      total: input.total,
      payment_method: 'COD',
      status: 'pending',
      coupon_code: input.couponCode || null,
      notes: input.notes || null,
    })
    .select('id, order_number')
    .single();

  if (orderError || !orderData) {
    console.log('=== ORDER INSERT ERROR ===');
    console.log('Code:', orderError?.code);
    console.log('Message:', orderError?.message);
    console.log('Details:', orderError?.details);
    console.log('Hint:', orderError?.hint);
    console.log('=== END ERROR ===');

    let errorMsg = 'Failed to create order';
    if (orderError?.message) {
      errorMsg = orderError.message;
    } else if (orderError?.code) {
      errorMsg = `Database error: ${orderError.code}`;
    }

    return {
      success: false,
      error: errorMsg,
    };
  }

  // 2. Insert order items
  const orderItems = input.items.map((item) => ({
    order_id: orderData.id,
    product_id: item.productId.startsWith('sultani-')
      ? null
      : item.productId,
    product_name: item.productName,
    variant_name: null,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Order items insert error:', itemsError);
  }

  // 3. Insert status history
  await supabase.from('order_status_history').insert({
    order_id: orderData.id,
    status: 'pending',
    note: 'Order placed successfully via Cash on Delivery',
  });

  return {
    success: true,
    orderId: orderData.id,
    orderNumber: orderData.order_number,
  };
}

// ============================================
// GET USER ORDERS
// ============================================
export async function getUserOrders(): Promise<OrderWithItems[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (*)
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get orders error:', error);
    return [];
  }

  return data as OrderWithItems[];
}

// ============================================
// GET ORDER BY NUMBER (for tracking)
// ============================================
export async function getOrderByNumber(
  orderNumber: string
): Promise<(OrderWithItems & { order_status_history?: any[] }) | null> {
  const supabase = createClient();

  const normalized = orderNumber.trim().toUpperCase().replace(/^#/, '');
  const searchNumber = normalized.startsWith('DL-')
    ? normalized
    : `DL-${normalized}`;

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (*),
      order_status_history (*)
    `
    )
    .eq('order_number', searchNumber)
    .single();

  if (error) {
    console.error('Get order error:', error);
    return null;
  }

  // Sort status history (purana pehle)
  if (data && data.order_status_history) {
    data.order_status_history.sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  return data as OrderWithItems & { order_status_history?: any[] };
}

// ============================================
// GET SINGLE ORDER BY ID
// ============================================
export async function getOrderById(
  orderId: string
): Promise<OrderWithItems | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (*)
    `
    )
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Get order error:', error);
    return null;
  }

  return data as OrderWithItems;
}
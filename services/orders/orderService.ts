import { createClient } from '@/lib/supabase/client';
import type {
  CreateOrderInput,
  CreateOrderResult,
  OrderRecord,
  OrderWithItems,
} from '@/types/order';
import {
  reduceStock,
  checkStockAvailability,
} from '@/services/products/inventoryService';

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
// TYPES (internal)
// ============================================
interface ProductPriceRow {
  id: string;
  price: number;
}

interface VariantPriceRow {
  id: string;
  price: number;
}

interface SettingsRow {
  shipping_fee: number | null;
  free_shipping_threshold: number | null;
}

// ============================================
// CREATE ORDER
// ✅ GUEST CHECKOUT SUPPORT
// ✅ AUTO ACCOUNT LINKING (customer_id)
// ✅ ALTERNATE PHONE SUPPORT
// ============================================
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const supabase = createClient();

  // ✅ Guest ke liye user null ho sakta hai
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const productIds = input.items
    .map((i) => i.productId)
    .filter((id) => id && !id.startsWith('sultani-'));

  const variantIds = input.items
    .map((i) => i.variantId)
    .filter((id): id is string => !!id);

  const { data: productsRaw, error: productsError } = await supabase
    .from('products')
    .select('id, price')
    .in('id', productIds);

  if (productsError) {
    console.error('Failed to fetch products:', productsError);
    return { success: false, error: 'Failed to validate product prices.' };
  }

  const products = (productsRaw || []) as ProductPriceRow[];

  let variants: VariantPriceRow[] = [];
  if (variantIds.length > 0) {
    const { data: variantData } = await supabase
      .from('product_variants')
      .select('id, price')
      .in('id', variantIds);

    variants = (variantData || []) as VariantPriceRow[];
  }

  const productPriceMap = new Map<string, number>(
    products.map((p) => [p.id, Number(p.price)])
  );
  const variantPriceMap = new Map<string, number>(
    variants.map((v) => [v.id, Number(v.price)])
  );

  const validatedItems: Array<{
    order_id: string;
    product_id: string | null;
    variant_id: string | null;
    product_name: string;
    variant_name: string | null;
    price: number;
    quantity: number;
    subtotal: number;
  }> = [];

  let serverSubtotal = 0;

  for (const item of input.items) {
    let serverPrice: number | null = null;

    if (item.variantId && variantPriceMap.has(item.variantId)) {
      serverPrice = variantPriceMap.get(item.variantId)!;
    } else if (productPriceMap.has(item.productId)) {
      serverPrice = productPriceMap.get(item.productId)!;
    }

    if (serverPrice === null || serverPrice <= 0) {
      console.error(
        `Invalid product/variant: ${item.productId}/${item.variantId}`
      );
      return {
        success: false,
        error: `Product not found or has invalid price: ${item.productName}`,
      };
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 100
    ) {
      return {
        success: false,
        error: `Invalid quantity for ${item.productName}`,
      };
    }

    // ✅ STOCK CHECK — sirf real products ke liye
    if (!item.productId.startsWith('sultani-')) {
      const { available, currentStock } = await checkStockAvailability(
        item.productId,
        item.variantId || null,
        item.quantity
      );

      if (!available) {
        return {
          success: false,
          error: `Only ${currentStock} left in stock for ${item.productName}`,
        };
      }
    }

    const itemSubtotal = serverPrice * item.quantity;
    serverSubtotal += itemSubtotal;

    validatedItems.push({
      order_id: '',
      product_id: item.productId.startsWith('sultani-')
        ? null
        : item.productId,
      variant_id: item.variantId || null,
      product_name: item.productName,
      variant_name: item.variantName || null,
      price: serverPrice,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  const { data: settingsRaw } = await supabase
    .from('site_settings')
    .select('shipping_fee, free_shipping_threshold')
    .single();

  const settings = settingsRaw as SettingsRow | null;

  const shippingFee = Number(settings?.shipping_fee || 0);
  const freeShippingThreshold = Number(
    settings?.free_shipping_threshold || 0
  );

  const serverShipping =
    freeShippingThreshold === 0
      ? 0
      : serverSubtotal >= freeShippingThreshold
      ? 0
      : shippingFee;

  const serverDiscount = 0;
  const serverTotal = serverSubtotal + serverShipping - serverDiscount;

  const orderNumber = generateOrderNumber();

  // ✅ user?.id || null (guest)
  // ✅ input.customerId (auto-login customer)
  // ✅ customer_phone_alt support
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user?.id || null,
      customer_id: input.customerId || null,
      customer_name: input.customerName,
      customer_name_urdu: input.customerNameUrdu || null,
      customer_phone: input.customerPhone,
      customer_phone_alt: input.customerPhoneAlt || null,
      customer_email: input.customerEmail
        ? input.customerEmail.trim().toLowerCase()
        : null,
      shipping_address: input.shippingAddress,
      shipping_address_urdu: input.shippingAddressUrdu || null,
      shipping_city: input.shippingCity,
      shipping_city_urdu: input.shippingCityUrdu || null,
      shipping_state: input.shippingState,
      shipping_state_urdu: input.shippingStateUrdu || null,
      shipping_postal_code: input.shippingPostalCode || '',
      shipping_country: input.shippingCountry,
      subtotal: serverSubtotal,
      shipping_fee: serverShipping,
      discount: serverDiscount,
      total: serverTotal,
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

    let errorMsg = 'Failed to create order. Please try again.';
    if (orderError?.code === '23502') {
      errorMsg =
        'Order could not be placed (database constraint). Please contact support.';
    } else if (orderError?.code === '42501') {
      errorMsg =
        'Permission denied. Please ensure guest checkout is enabled.';
    } else if (orderError?.message) {
      errorMsg = orderError.message;
    }

    return {
      success: false,
      error: errorMsg,
    };
  }

  const finalOrderItems = validatedItems.map((item) => ({
    ...item,
    order_id: orderData.id,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(finalOrderItems);

  if (itemsError) {
    console.error('Order items insert error:', itemsError);
  }

  // ✅ REDUCE STOCK
  for (const item of validatedItems) {
    const result = await reduceStock(
      item.product_id,
      item.variant_id,
      item.quantity
    );

    if (!result.success) {
      console.error('Stock reduce error:', result.error);
    }
  }

  // ✅ Order status history (guest vs customer)
  let note = 'Order placed successfully via Guest Checkout';
  if (input.customerId) {
    note = 'Order placed successfully via Customer Account';
  } else if (user?.id) {
    note = 'Order placed successfully via Cash on Delivery';
  }

  await supabase.from('order_status_history').insert({
    order_id: orderData.id,
    status: 'pending',
    note,
  });

  return {
    success: true,
    orderId: orderData.id,
    order_number: orderData.order_number,
    orderNumber: orderData.order_number,
  } as CreateOrderResult;
}

// ============================================
// GET USER ORDERS (lifetime history)
// ✅ product_images join for images
// ============================================
export async function getUserOrders(): Promise<OrderWithItems[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // ✅ order_items ke saath products → product_images bhi fetch karein
  // (kyunke order_items mein image_url column nahi hai)
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (
        *,
        products (
          product_images ( url, sort_order )
        )
      )
    `
    )
    .or(
      `customer_id.eq.${user.id},user_id.eq.${user.id},customer_email.eq.${user.email}`
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get orders error:', error);
    return [];
  }

  return data as OrderWithItems[];
}

// ============================================
// GET ORDER BY NUMBER (tracking — guest + logged in)
// ✅ product_images join for images
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
      order_items (
        *,
        products (
          product_images ( url, sort_order )
        )
      ),
      order_status_history (*)
    `
    )
    .eq('order_number', searchNumber)
    .single();

  if (error) {
    console.error('Get order error:', error);
    return null;
  }

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
// ✅ product_images join for images
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
      order_items (
        *,
        products (
          product_images ( url, sort_order )
        )
      )
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

// ============================================
// CANCEL ORDER (customer can cancel pending order)
// ============================================
export async function cancelOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in.' };
  }

  // Verify ownership
  const { data: order } = await supabase
    .from('orders')
    .select('id, status, customer_id, customer_email')
    .eq('id', orderId)
    .single();

  if (!order) {
    return { success: false, error: 'Order not found.' };
  }

  const ownsOrder =
    order.customer_id === user.id || order.customer_email === user.email;

  if (!ownsOrder) {
    return { success: false, error: 'You do not have permission.' };
  }

  if (order.status !== 'pending') {
    return {
      success: false,
      error: 'Only pending orders can be cancelled.',
    };
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  await supabase.from('order_status_history').insert({
    order_id: orderId,
    status: 'cancelled',
    note: 'Order cancelled by customer',
  });

  return { success: true };
}
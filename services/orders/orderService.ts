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
// CREATE ORDER (with server-side price validation)
// ✅ GUEST CHECKOUT SUPPORT
// ✅ STOCK CHECK + REDUCE
// ============================================
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const productIds = input.items
    .map((i) => i.productId)
    .filter((id) => !id.startsWith('sultani-'));

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

    // ✅ STOCK CHECK
    const { available, currentStock } = await checkStockAvailability(
      item.productId.startsWith('sultani-') ? null : item.productId,
      item.variantId || null,
      item.quantity
    );

    if (!available) {
      return {
        success: false,
        error: `Only ${currentStock} left in stock for ${item.productName}`,
      };
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
    serverSubtotal >= freeShippingThreshold ? 0 : shippingFee;
  const serverDiscount = 0;
  const serverTotal = serverSubtotal + serverShipping - serverDiscount;

  const orderNumber = generateOrderNumber();

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user?.id || null,
      customer_name: input.customerName,
      customer_name_urdu: input.customerNameUrdu || null,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail || null,
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

  await supabase.from('order_status_history').insert({
    order_id: orderData.id,
    status: 'pending',
    note: user?.id
      ? 'Order placed successfully via Cash on Delivery'
      : 'Order placed successfully via Guest Checkout',
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
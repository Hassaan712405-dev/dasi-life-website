// ============================================
// ORDER TYPES
// ============================================

// ✅ Order status
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// ============================================
// ORDER ITEM INPUT (cart se aata hai)
// ============================================
export interface OrderItemInput {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// ============================================
// CREATE ORDER INPUT
// ============================================
export interface CreateOrderInput {
  customerName: string;
  customerNameUrdu?: string;
  customerPhone: string;
  customerPhoneAlt?: string;      // ✅ Alternate phone
  customerEmail: string;
  customerId?: string;            // ✅ Auto-login customer link
  shippingAddress: string;
  shippingAddressUrdu?: string;
  shippingCity: string;
  shippingCityUrdu?: string;
  shippingState: string;
  shippingStateUrdu?: string;
  shippingPostalCode: string;
  shippingCountry: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  notes?: string;
  couponCode?: string;
  items: OrderItemInput[];
}

// ============================================
// CREATE ORDER RESULT
// ============================================
export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  order_number?: string;          // ✅ Snake case alias (safety)
  error?: string;
}

// ============================================
// ORDER ITEM ROW (database se aata hai)
// ✅ image_url optional — kyunke order_items mein
//    nahi hota, product_images se join hota hai
// ============================================
export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  created_at?: string;
  // ✅ Nested product data (join se)
  products?: {
    product_images?: { url: string; sort_order: number | null }[];
  } | null;
}

// ============================================
// ORDER RECORD (orders table)
// ============================================
export interface OrderRecord {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_id: string | null;      // ✅ Auto-login customer
  customer_name: string;
  customer_name_urdu?: string | null;
  customer_phone: string;
  customer_phone_alt?: string | null;  // ✅ Alternate phone
  customer_email: string | null;
  shipping_address: string;
  shipping_address_urdu?: string | null;
  shipping_city: string;
  shipping_city_urdu?: string | null;
  shipping_state: string;
  shipping_state_urdu?: string | null;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  payment_method: string;
  status: OrderStatus;
  coupon_code?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

// ============================================
// ORDER WITH ITEMS (join result)
// ============================================
export interface OrderWithItems extends OrderRecord {
  order_items: OrderItemRow[];
}

// ============================================
// ORDER STATUS HISTORY
// ============================================
export interface OrderStatusHistoryRow {
  id: string;
  order_id: string;
  status: OrderStatus;
  note?: string | null;
  created_at: string;
}
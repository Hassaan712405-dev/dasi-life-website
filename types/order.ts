export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// ============================================
// ORDER ITEM INPUT (createOrder ke liye)
// ============================================
export interface OrderItemInput {
  productId: string;
  variantId?: string;         // ← NEW
  productName: string;
  variantName?: string;       // ← NEW
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
  customerEmail: string;
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
  items: OrderItemInput[];
  couponCode?: string;
  notes?: string;
}

// ============================================
// ORDER RECORD
// ============================================
export interface OrderRecord {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_name_urdu: string | null;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  shipping_address_urdu: string | null;
  shipping_city: string;
  shipping_city_urdu: string | null;
  shipping_state: string;
  shipping_state_urdu: string | null;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  payment_method: string;
  status: OrderStatus;
  coupon_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// ORDER ITEM RECORD (DB se aata hai)
// ============================================
export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;     // ← NEW
  product_name: string;
  variant_name: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  image_url?: string | null;     // ← NEW (optional)
}

// ============================================
// ORDER WITH ITEMS
// ============================================
export interface OrderWithItems extends OrderRecord {
  order_items: OrderItemRecord[];
}

// ============================================
// CREATE ORDER RESULT
// ============================================
export interface CreateOrderResult {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  error?: string;
}
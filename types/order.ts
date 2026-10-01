export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItemInput {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
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

export interface OrderRecord {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
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

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  variant_name: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderWithItems extends OrderRecord {
  order_items: OrderItemRecord[];
}

export interface CreateOrderResult {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  error?: string;
}
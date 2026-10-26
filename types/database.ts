export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  sku: string | null;
  sort_order?: number;
}

export interface ProductImage {
  id?: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary?: boolean;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  ingredients: string | null;
  usage_instructions: string | null;
  storage_instructions: string | null;
  shelf_life: string | null;
  suitable_for: string | null;
  warnings: string | null;
  video_url: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  product_images?: ProductImage[];   // ✅ includes id + is_primary
  product_variants?: ProductVariant[];
  categories?: { name: string } | null;  // ✅ for header search
}

// ============================================
// CATEGORY
// ============================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// ============================================
// REVIEW
// ============================================
export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  created_at: string;
}

// ============================================
// ORDER
// ============================================
export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  city: string;
  postal_code: string | null;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  payment_method: 'cod' | 'online';
  created_at: string;
  updated_at: string;
}

// ============================================
// ORDER ITEM
// ============================================
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  price: number;
  quantity: number;
  image_url: string | null;
}

// ============================================
// HERO POSTERS
// ============================================
export type {
  HeroPoster,
  HeroPosterWithProduct,
  HeroPosterFormData,
} from './hero-poster';
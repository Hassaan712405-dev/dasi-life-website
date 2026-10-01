export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  ingredients: string | null;
  usage_instructions: string | null;
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
  product_images?: { url: string; alt: string | null; sort_order: number }[];
}
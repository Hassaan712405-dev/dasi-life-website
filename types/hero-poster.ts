export type HeroPoster = {
  id: string;
  title_internal: string | null;
  image_url: string;
  mobile_image_url: string | null;
  storage_path: string | null;
  product_id: string;
  button_label: string;
  heading: string | null;        // ✅ ADDED
  description: string | null;    // ✅ ADDED
  button_link: string | null;    // ✅ ADDED
  sort_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type HeroPosterWithProduct = HeroPoster & {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    is_active: boolean;
  } | null;
};

export type HeroPosterFormData = {
  id?: string;
  title_internal?: string | null;
  image_url: string;
  mobile_image_url?: string | null;
  storage_path?: string | null;
  product_id: string;
  button_label: string;
  heading?: string | null;        // ✅ ADDED
  description?: string | null;    // ✅ ADDED
  button_link?: string | null;    // ✅ ADDED
  sort_order: number;
  is_active: boolean;
};
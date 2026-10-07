import { createClient } from '@/lib/supabase/client';

// ============================================
// TYPES
// ============================================
export interface ReviewWithProfile {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_approved: boolean;
  created_at: string;
  customer_name?: string;
  customer_initial?: string;
}

// Internal types for Supabase query results
interface ReviewRow {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_approved: boolean;
  created_at: string;
  customer_name: string | null;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
}

interface OrderItemWithOrder {
  id: string;
  order:
    | {
        user_id: string | null;
        status: string;
      }
    | {
        user_id: string | null;
        status: string;
      }[]
    | null;
}

// ============================================
// GET REVIEWS FOR PRODUCT
// ✅ Sirf APPROVED reviews public ko dikhengi
// ✅ customer_name column se naam use karo
// ============================================
export async function getProductReviews(
  productId: string
): Promise<ReviewWithProfile[]> {
  const supabase = createClient();

  // 1. Get approved reviews only
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get reviews error:', JSON.stringify(error, null, 2));
    return [];
  }

  if (!reviews || reviews.length === 0) return [];

  const typedReviews: ReviewRow[] = reviews as ReviewRow[];

  // 2. ✅ Directly use customer_name from reviews table
  return typedReviews.map((review: ReviewRow) => {
    const fullName = review.customer_name || 'Anonymous';
    return {
      id: review.id,
      product_id: review.product_id,
      user_id: review.user_id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      is_approved: review.is_approved,
      created_at: review.created_at,
      customer_name: fullName,
      customer_initial: fullName.charAt(0).toUpperCase(),
    };
  });
}

// ============================================
// CHECK IF USER CAN REVIEW (has purchased)
// ============================================
export async function canUserReviewProduct(
  productId: string
): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Check if user already reviewed
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('product_id', productId)
    .eq('user_id', user.id)
    .single();

  if (existingReview) return false;

  // Check if user purchased this product with delivered/shipped status
  const { data: orderItems } = await supabase
    .from('order_items')
    .select(
      `
      id,
      order:order_id (
        user_id,
        status
      )
    `
    )
    .eq('product_id', productId);

  if (!orderItems) return false;

  const typedItems: OrderItemWithOrder[] = orderItems as OrderItemWithOrder[];

  const hasPurchased = typedItems.some((item: OrderItemWithOrder) => {
    const order = Array.isArray(item.order) ? item.order[0] : item.order;

    return (
      order?.user_id === user.id &&
      (order?.status === 'delivered' || order?.status === 'shipped')
    );
  });

  return hasPurchased;
}

// ============================================
// SUBMIT REVIEW
// ✅ is_approved: false — Admin approval zaroori
// ✅ customer_name save karo
// ============================================
export async function submitReview(
  productId: string,
  rating: number,
  title: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to submit a review.',
    };
  }

  // ✅ Check if user already reviewed this product
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('product_id', productId)
    .eq('user_id', user.id)
    .single();

  if (existingReview) {
    return {
      success: false,
      error: 'You have already reviewed this product.',
    };
  }

  // ✅ Get customer name from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const customerName =
    profile?.full_name || user.email?.split('@')[0] || 'Customer';

  // ✅ Insert review — NOT approved by default
  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    rating,
    title: title.trim() || null,
    body: body.trim(),
    is_approved: false, // ✅ Admin approval zaroori
    customer_name: customerName, // ✅ Customer ka naam save karo
  });

  if (error) {
    console.error('Submit review error:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }

  return { success: true };
}
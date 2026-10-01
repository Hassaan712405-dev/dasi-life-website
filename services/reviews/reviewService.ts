import { createClient } from '@/lib/supabase/client';

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

// ============================================
// GET REVIEWS FOR PRODUCT
// ============================================
export async function getProductReviews(
  productId: string
): Promise<ReviewWithProfile[]> {
  const supabase = createClient();

  // 1. Get reviews
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

  // 2. Get unique user IDs
  const userIds = Array.from(new Set(reviews.map((r) => r.user_id)));

  // 3. Fetch profiles separately
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds);

  // 4. Create profile map
  const profileMap: Record<string, string> = {};
  (profiles || []).forEach((p) => {
    profileMap[p.id] = p.full_name || 'Anonymous';
  });

  // 5. Combine
  return reviews.map((review) => {
    const fullName = profileMap[review.user_id] || 'Anonymous';
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

  // Check if user purchased this product with delivered status
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

  const hasPurchased = orderItems.some((item: any) => {
    return (
      item.order?.user_id === user.id &&
      (item.order?.status === 'delivered' ||
        item.order?.status === 'shipped')
    );
  });

  return hasPurchased;
}

// ============================================
// SUBMIT REVIEW
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
    return { success: false, error: 'You must be logged in to submit a review.' };
  }

  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    rating,
    title: title.trim() || null,
    body: body.trim(),
    is_approved: true,
  });

  if (error) {
    console.error('Submit review error:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }

  // Update product rating_avg and rating_count
  const { data: allReviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_approved', true);

  if (allReviews && allReviews.length > 0) {
    const avg =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await supabase
      .from('products')
      .update({
        rating_avg: Math.round(avg * 100) / 100,
        rating_count: allReviews.length,
      })
      .eq('id', productId);
  }

  return { success: true };
}
import { createClient } from '@/lib/supabase/client';

export interface AdminReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_approved: boolean;
  created_at: string;
  product_name?: string;
  customer_name?: string;
  customer_initial?: string;
}

// ============================================
// GET ALL REVIEWS (Admin)
// ============================================
export async function getAllReviews(): Promise<AdminReview[]> {
  const supabase = createClient();

  // 1. Get reviews
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get reviews error:', JSON.stringify(error, null, 2));
    return [];
  }

  if (!reviews || reviews.length === 0) return [];

  // 2. Get unique product IDs and user IDs
  const productIds = Array.from(new Set(reviews.map((r) => r.product_id)));
  const userIds = Array.from(new Set(reviews.map((r) => r.user_id)));

  // 3. Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .in('id', productIds);

  // 4. Fetch profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds);

  // 5. Create maps
  const productMap: Record<string, string> = {};
  (products || []).forEach((p) => {
    productMap[p.id] = p.name;
  });

  const profileMap: Record<string, string> = {};
  (profiles || []).forEach((p) => {
    profileMap[p.id] = p.full_name || 'Anonymous';
  });

  // 6. Combine
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
      product_name: productMap[review.product_id] || 'Unknown Product',
      customer_name: fullName,
      customer_initial: fullName.charAt(0).toUpperCase(),
    };
  });
}

// ============================================
// APPROVE / UNAPPROVE REVIEW
// ============================================
export async function setReviewApproval(
  reviewId: string,
  approved: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // 1. Get review (to know product_id)
  const { data: review } = await supabase
    .from('reviews')
    .select('product_id')
    .eq('id', reviewId)
    .single();

  if (!review) {
    return { success: false, error: 'Review not found' };
  }

  // 2. Update approval
  const { error } = await supabase
    .from('reviews')
    .update({ is_approved: approved })
    .eq('id', reviewId);

  if (error) {
    console.error('Approve review error:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }

  // 3. Recalculate product rating
  await recalculateProductRating(review.product_id);

  return { success: true };
}

// ============================================
// DELETE REVIEW
// ============================================
export async function deleteReview(
  reviewId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // 1. Get the review first (to know product_id)
  const { data: review } = await supabase
    .from('reviews')
    .select('product_id')
    .eq('id', reviewId)
    .single();

  if (!review) {
    return { success: false, error: 'Review not found' };
  }

  const productId = review.product_id;

  // 2. Delete the review
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

  if (error) {
    console.error('Delete review error:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }

  // 3. Recalculate product rating
  await recalculateProductRating(productId);

  return { success: true };
}

// ============================================
// RECALCULATE PRODUCT RATING (helper)
// ============================================
async function recalculateProductRating(productId: string): Promise<void> {
  const supabase = createClient();

  // Get all approved reviews for this product
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_approved', true);

  if (!reviews || reviews.length === 0) {
    // No reviews — reset to 0
    await supabase
      .from('products')
      .update({
        rating_avg: 0,
        rating_count: 0,
      })
      .eq('id', productId);
    return;
  }

  // Calculate average
  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await supabase
    .from('products')
    .update({
      rating_avg: Math.round(avg * 100) / 100,
      rating_count: reviews.length,
    })
    .eq('id', productId);
}
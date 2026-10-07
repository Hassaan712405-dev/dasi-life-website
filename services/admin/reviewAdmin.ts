import { createClient } from '@/lib/supabase/client';

// ============================================
// TYPES
// ============================================
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

interface ProductNameRow {
  id: string;
  name: string;
}

interface RatingRow {
  rating: number;
}

interface ProductIdRow {
  product_id: string;
}

// ============================================
// GET ALL REVIEWS (Admin)
// ✅ customer_name column se naam use karo
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

  const typedReviews: ReviewRow[] = reviews as ReviewRow[];

  // 2. Get unique product IDs
  const productIds = Array.from(
    new Set(typedReviews.map((r: ReviewRow) => r.product_id))
  );

  // 3. Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .in('id', productIds);

  const typedProducts: ProductNameRow[] = (products || []) as ProductNameRow[];

  // 4. Create product map
  const productMap: Record<string, string> = {};
  typedProducts.forEach((p: ProductNameRow) => {
    productMap[p.id] = p.name;
  });

  // 5. ✅ Directly use customer_name from reviews table
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

  const typedReview = review as ProductIdRow;

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
  await recalculateProductRating(typedReview.product_id);

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

  const typedReview = review as ProductIdRow;
  const productId = typedReview.product_id;

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

  const typedReviews: RatingRow[] = (reviews || []) as RatingRow[];

  if (typedReviews.length === 0) {
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
    typedReviews.reduce((sum: number, r: RatingRow) => sum + r.rating, 0) /
    typedReviews.length;

  await supabase
    .from('products')
    .update({
      rating_avg: Math.round(avg * 100) / 100,
      rating_count: typedReviews.length,
    })
    .eq('id', productId);
}
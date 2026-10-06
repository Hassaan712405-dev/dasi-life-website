import { createClient } from '@/lib/supabase/client';

// ============================================
// INTERNAL TYPES
// ============================================
interface WishlistItemRow {
  product_id: string;
}

// ============================================
// GET OR CREATE USER WISHLIST
// ============================================
async function getOrCreateWishlist(userId: string): Promise<string | null> {
  const supabase = createClient();

  // Try to get existing wishlist
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existing) {
    return existing.id;
  }

  // Create new wishlist
  const { data: created, error } = await supabase
    .from('wishlists')
    .insert({ user_id: userId })
    .select('id')
    .single();

  if (error || !created) {
    console.error('Create wishlist error:', error);
    return null;
  }

  return created.id;
}

// ============================================
// GET WISHLIST ITEMS (product IDs)
// ============================================
export async function getWishlistProductIds(): Promise<string[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!wishlist) return [];

  const { data: items, error } = await supabase
    .from('wishlist_items')
    .select('product_id')
    .eq('wishlist_id', wishlist.id);

  if (error) {
    console.error('Get wishlist items error:', error);
    return [];
  }

  const typedItems: WishlistItemRow[] = (items || []) as WishlistItemRow[];

  return typedItems.map((item: WishlistItemRow) => item.product_id);
}

// ============================================
// ADD TO WISHLIST
// ============================================
export async function addToWishlist(productId: string): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const wishlistId = await getOrCreateWishlist(user.id);
  if (!wishlistId) return false;

  const { error } = await supabase
    .from('wishlist_items')
    .insert({ wishlist_id: wishlistId, product_id: productId });

  if (error) {
    // Duplicate key — already in wishlist
    if (error.code === '23505') return true;
    console.error('Add wishlist error:', error);
    return false;
  }

  return true;
}

// ============================================
// REMOVE FROM WISHLIST
// ============================================
export async function removeFromWishlist(productId: string): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!wishlist) return false;

  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('wishlist_id', wishlist.id)
    .eq('product_id', productId);

  if (error) {
    console.error('Remove wishlist error:', error);
    return false;
  }

  return true;
}

// ============================================
// CLEAR WISHLIST
// ============================================
export async function clearWishlist(): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!wishlist) return false;

  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('wishlist_id', wishlist.id);

  return !error;
}
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'; // ✅ NEW
import { createClient } from '@/lib/supabase/client';
import {
  getWishlistProductIds,
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  clearWishlist as clearWishlistService,
} from '@/services/wishlist/wishlistService';

// ============================================
// TYPES
// ============================================
export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
}

export interface WishlistResult {
  success: boolean;
  reason?: 'NOT_LOGGED_IN' | 'ERROR';
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  productIds: string[];
  loading: boolean;
  addToWishlist: (item: WishlistItem) => Promise<WishlistResult>;
  removeFromWishlist: (id: string) => Promise<WishlistResult>;
  toggleWishlist: (item: WishlistItem) => Promise<WishlistResult>;
  isInWishlist: (id: string) => boolean;
  getTotalItems: () => number;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    loadWishlist();

    // ✅ FIXED: Explicit types for event and session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          setWishlistItems([]);
          setLoading(false);
        } else if (event === 'SIGNED_IN') {
          await loadWishlist();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      const productIds = await getWishlistProductIds();

      if (productIds.length === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      const { data: products } = await supabase
        .from('products')
        .select('id, name, slug, price, product_images(url, sort_order)')
        .in('id', productIds);

      const items: WishlistItem[] = (products || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        imageUrl:
          p.product_images?.[0]?.url || '/images/placeholder-product.png',
      }));

      setWishlistItems(items);
    } catch (err) {
      console.error('Wishlist load error:', err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (
    item: WishlistItem
  ): Promise<WishlistResult> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, reason: 'NOT_LOGGED_IN' };
    }

    const success = await addToWishlistService(item.id);

    if (success) {
      setWishlistItems((prev) => {
        if (prev.find((p) => p.id === item.id)) return prev;
        return [...prev, item];
      });
      return { success: true };
    } else {
      return { success: false, reason: 'ERROR' };
    }
  };

  const removeFromWishlist = async (id: string): Promise<WishlistResult> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, reason: 'NOT_LOGGED_IN' };
    }

    const success = await removeFromWishlistService(id);

    if (success) {
      setWishlistItems((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } else {
      return { success: false, reason: 'ERROR' };
    }
  };

  const toggleWishlist = async (item: WishlistItem): Promise<WishlistResult> => {
    const inWishlist = wishlistItems.some((p) => p.id === item.id);
    if (inWishlist) {
      return removeFromWishlist(item.id);
    } else {
      return addToWishlist(item);
    }
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((p) => p.id === id);
  };

  const getTotalItems = () => {
    return wishlistItems.length;
  };

  const clearWishlist = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await clearWishlistService();
    setWishlistItems([]);
  };

  const refreshWishlist = async () => {
    await loadWishlist();
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        productIds: wishlistItems.map((item) => item.id),
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        getTotalItems,
        clearWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
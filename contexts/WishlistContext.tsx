'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  getWishlistProductIds,
  addToWishlist as addToDb,
  removeFromWishlist as removeFromDb,
  clearWishlist as clearDb,
} from '@/services/wishlist/wishlistService';

interface WishlistContextType {
  productIds: string[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'dasi-life-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist
  const loadWishlist = async () => {
    if (user) {
      // Logged-in: fetch from Supabase
      const ids = await getWishlistProductIds();
      setProductIds(ids);
    } else {
      // Guest: load from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProductIds(JSON.parse(stored));
        } else {
          setProductIds([]);
        }
      } catch {
        setProductIds([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWishlist();
  }, [user]);

  // Save guest wishlist to localStorage
  useEffect(() => {
    if (!user && !loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
      } catch {
        // ignore
      }
    }
  }, [productIds, user, loading]);

  // Merge guest wishlist into user account on login
  useEffect(() => {
    async function mergeGuestWishlist() {
      if (!user) return;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        const guestIds: string[] = JSON.parse(stored);
        if (guestIds.length === 0) return;

        // Add each guest item to user's wishlist
        for (const id of guestIds) {
          await addToDb(id);
        }

        // Clear localStorage
        localStorage.removeItem(STORAGE_KEY);

        // Reload from DB
        const ids = await getWishlistProductIds();
        setProductIds(ids);
      } catch (error) {
        console.error('Merge guest wishlist error:', error);
      }
    }

    if (!loading) {
      mergeGuestWishlist();
    }
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (user) {
      const success = await addToDb(productId);
      if (success) {
        setProductIds((prev) =>
          prev.includes(productId) ? prev : [...prev, productId]
        );
      }
    } else {
      setProductIds((prev) =>
        prev.includes(productId) ? prev : [...prev, productId]
      );
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      const success = await removeFromDb(productId);
      if (success) {
        setProductIds((prev) => prev.filter((id) => id !== productId));
      }
    } else {
      setProductIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const clearWishlist = async () => {
    if (user) {
      await clearDb();
    }
    setProductIds([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isInWishlist = (productId: string) => {
    return productIds.includes(productId);
  };

  const getTotalItems = () => productIds.length;

  return (
    <WishlistContext.Provider
      value={{
        productIds,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        getTotalItems,
        refresh: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
'use client';

import { createContext, useContext, ReactNode } from 'react';

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
// NO-OP PROVIDER (customer account system removed)
// ============================================
export function WishlistProvider({ children }: { children: ReactNode }) {
  const value: WishlistContextType = {
    wishlistItems: [],
    productIds: [],
    loading: false,
    addToWishlist: async () => ({ success: false, reason: 'NOT_LOGGED_IN' }),
    removeFromWishlist: async () => ({ success: false, reason: 'NOT_LOGGED_IN' }),
    toggleWishlist: async () => ({ success: false, reason: 'NOT_LOGGED_IN' }),
    isInWishlist: () => false,
    getTotalItems: () => 0,
    clearWishlist: async () => {},
    refreshWishlist: async () => {},
  };

  return (
    <WishlistContext.Provider value={value}>
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
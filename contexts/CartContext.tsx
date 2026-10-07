'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import type { CartItem, CartContextType } from '@/types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'dasi-life-cart';

// ✅ Unique cart item ID banao (variant-aware)
// Format: productId::variantId  ya  productId (agar variant nahi)
function generateCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}::${variantId}` : productId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    }
  }, [items, isLoaded]);

  const addToCart = (
    item: Omit<CartItem, 'quantity' | 'id'>,
    quantity: number = 1
  ) => {
    setItems((prev) => {
      const newItemId = generateCartItemId(item.productId, item.variantId);
      const existing = prev.find((i) => i.id === newItemId);

      if (existing) {
        return prev.map((i) =>
          i.id === newItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      return [
        ...prev,
        {
          ...item,
          id: newItemId,
          quantity,
        },
      ];
    });
  };

  // ✅ cartItemId se remove karo (variant-aware)
  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  // ✅ cartItemId se quantity update karo
  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // ✅ cartItemId se check karo
  const isInCart = (cartItemId: string) => {
    return items.some((i) => i.id === cartItemId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
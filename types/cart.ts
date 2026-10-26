export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  slug: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (
    item: Omit<CartItem, 'quantity' | 'id'>,
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  isInCart: (cartItemId: string) => boolean;
}
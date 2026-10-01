export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  isInCart: (productId: string) => boolean;
}
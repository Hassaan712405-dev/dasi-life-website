'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface StickyCTAProps {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  stock: number;
  variantId?: string;
  variantName?: string;
}

export default function StickyCTA({
  productId,
  name,
  slug,
  price,
  imageUrl,
  stock,
  variantId,
  variantName,
}: StickyCTAProps) {
  const [visible, setVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();

  const isOutOfStock = stock === 0;

  // ✅ Scroll pe show karo
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      {
        productId,
        variantId,
        name,
        variantName,
        slug,
        price,
        imageUrl,
      },
      1
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-brand-text-muted line-clamp-1">
                {name}
              </p>
              <p className="text-base font-bold text-brand-green">
                Rs {price.toLocaleString()}
              </p>
            </div>

            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              whileTap={{ scale: isOutOfStock ? 1 : 0.97 }}
              className={`inline-flex items-center justify-center gap-2 font-medium px-5 py-3 rounded-md text-sm transition-colors ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : justAdded
                  ? 'bg-green-600 text-white'
                  : 'bg-brand-green hover:bg-black text-white'
              }`}
            >
              {isOutOfStock ? (
                'Out of Stock'
              ) : justAdded ? (
                <>
                  <Check size={16} strokeWidth={3} />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add to Cart
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
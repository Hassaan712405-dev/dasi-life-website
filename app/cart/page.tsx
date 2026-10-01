'use client';

import Link from 'next/link';
import { ChevronRight, ShieldCheck, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/contexts/CartContext';
import FadeIn from '@/components/motion/FadeIn';

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8 pb-10 sm:pb-12 md:pb-16">
        {/* Breadcrumb */}
        <FadeIn>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs md:text-sm text-brand-text-muted mb-3 sm:mb-4">
            <Link href="/" className="hover:text-brand-green transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-brand-green font-medium">Cart</span>
          </div>
        </FadeIn>

        {/* Heading */}
        <FadeIn delay={0.1}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green mb-6 sm:mb-8 md:mb-10">
            Shopping Cart
          </h1>
        </FadeIn>

        {/* Empty State */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 md:p-20 text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-cream mx-auto flex items-center justify-center mb-5 sm:mb-6">
              <ShoppingBag size={28} className="text-brand-green" />
            </div>
            <h2 className="font-heading font-semibold text-xl sm:text-2xl text-brand-green mb-2 sm:mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-xs sm:text-sm text-brand-text-muted mb-6 sm:mb-8 max-w-md mx-auto">
              Looks like you haven't added anything yet. Explore our Unani
              formulations and start your wellness journey.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-brand-green hover:bg-black text-white font-medium px-6 sm:px-8 py-3 rounded-md transition-colors text-sm"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 sm:gap-8">
            {/* Left Side — Cart Items */}
            <div>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[1fr_100px_140px_100px] gap-4 items-center bg-brand-cream-dark rounded-lg px-4 py-3 mb-3 sm:mb-4 text-xs md:text-sm font-semibold text-brand-text-dark">
                <span>Product</span>
                <span className="text-center md:text-left">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-center md:text-right">Subtotal</span>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 sm:space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Trust Badges */}
              <FadeIn delay={0.3}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-brand-cream-dark rounded-xl p-3 sm:p-4 md:p-5 mt-5 sm:mt-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <ShieldCheck size={18} className="text-brand-green shrink-0 sm:hidden" />
                    <ShieldCheck size={22} className="text-brand-green shrink-0 hidden sm:block" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-brand-text-dark">
                        Secure Checkout
                      </p>
                      <p className="text-[10px] sm:text-xs text-brand-text-muted">
                        SSL Encrypted payments
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CreditCard size={18} className="text-brand-green shrink-0 sm:hidden" />
                    <CreditCard size={22} className="text-brand-green shrink-0 hidden sm:block" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-brand-text-dark">
                        Cash on Delivery
                      </p>
                      <p className="text-[10px] sm:text-xs text-brand-text-muted">
                        Pay when you receive
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Truck size={18} className="text-brand-green shrink-0 sm:hidden" />
                    <Truck size={22} className="text-brand-green shrink-0 hidden sm:block" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-brand-text-dark">
                        Free Delivery
                      </p>
                      <p className="text-[10px] sm:text-xs text-brand-text-muted">
                        Orders above Rs. 3,000
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Side — Summary */}
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}
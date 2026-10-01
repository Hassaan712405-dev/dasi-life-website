'use client';

import Link from 'next/link';
import { ChevronRight, ShieldCheck, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-brand-text-muted mb-4">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-green font-medium">Cart</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green mb-8 md:mb-10">
          Shopping Cart
        </h1>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 md:p-20 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-brand-cream mx-auto flex items-center justify-center mb-6">
              <ShoppingBag size={36} className="text-brand-green" />
            </div>
            <h2 className="font-heading font-semibold text-2xl text-brand-green mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-sm text-brand-text-muted mb-8">
              Looks like you haven't added anything yet. Explore our Unani
              formulations and start your wellness journey.
            </p>
            <Link href="/shop" className="btn-primary inline-flex">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Left Side — Cart Items */}
            <div>
              {/* Table Header (desktop only) */}
              <div className="hidden md:grid grid-cols-[1fr_100px_140px_100px] gap-4 items-center bg-brand-cream-dark rounded-lg px-4 py-3 mb-4 text-xs md:text-sm font-semibold text-brand-text-dark">
                <span>Product</span>
                <span className="text-center md:text-left">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-center md:text-right">Subtotal</span>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-brand-cream-dark rounded-xl p-4 md:p-5 mt-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={22} className="text-brand-green shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-brand-text-dark">
                      Secure Checkout
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      SSL Encrypted payments
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard size={22} className="text-brand-green shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-brand-text-dark">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      Pay when you receive
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={22} className="text-brand-green shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-brand-text-dark">
                      Free Delivery
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      Orders above Rs. 3,000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side — Order Summary */}
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}
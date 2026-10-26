'use client';

import Link from 'next/link';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  ShoppingBag,
  ArrowLeft,
  PackageCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/contexts/CartContext';
import FadeIn from '@/components/motion/FadeIn';

export default function CartPage() {
  const { items } = useCart();

  const itemCount = items.reduce(
    (total, item) => total + Math.max(0, Number(item.quantity) || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="container-custom pb-12 pt-5 sm:pb-16 sm:pt-8 lg:pb-20">
        {/* Breadcrumb */}
        <FadeIn>
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex items-center gap-2 text-xs text-brand-text-muted sm:mb-7 sm:text-sm"
          >
            <Link href="/" className="transition-colors hover:text-brand-green">
              Home
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page" className="font-semibold text-brand-green">
              Shopping Cart
            </span>
          </nav>
        </FadeIn>

        {/* Page heading */}
        <FadeIn delay={0.05}>
          <div className="mb-7 flex flex-col gap-4 border-b border-brand-green/10 pb-6 sm:mb-9 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-green/70">
                Your Dasi Life selection
              </p>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-brand-green sm:text-4xl lg:text-5xl">
                Shopping Cart
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-brand-text-muted sm:text-base">
                Review your products and quantities before continuing to checkout.
              </p>
            </div>

            {items.length > 0 && (
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-white px-4 py-2 text-sm font-medium text-brand-text-dark shadow-sm">
                  <ShoppingBag
                    size={16}
                    className="text-brand-green"
                    aria-hidden="true"
                  />
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
                <Link
                  href="/shop"
                  className="!inline-flex !min-h-10 !items-center !gap-2 !border-0 !bg-transparent !p-0 !shadow-none !text-sm !font-semibold !text-brand-green transition-colors duration-200 hover:!bg-transparent hover:!text-brand-green/70 hover:!shadow-none focus:!bg-transparent focus-visible:!bg-transparent focus-visible:!shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 active:!bg-transparent"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Continue shopping
                </Link>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Empty cart */}
        {items.length === 0 ? (
          <FadeIn delay={0.1}>
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mx-auto max-w-2xl rounded-2xl border border-brand-green/10 bg-white px-5 py-12 text-center shadow-sm sm:px-10 sm:py-16 lg:py-20"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-cream text-brand-green ring-8 ring-brand-cream/60">
                <ShoppingBag size={32} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-green/70">
                A fresh start
              </p>
              <h2 className="font-heading text-2xl font-bold text-brand-green sm:text-3xl">
                Your cart is empty
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-brand-text-muted sm:text-base">
                You haven’t added anything yet. Explore the Dasi Life collection
                and find the products that fit your routine.
              </p>
              <Link
                href="/shop"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
              >
                Explore products
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
            </motion.section>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
            {/* Cart items */}
            <section aria-labelledby="cart-items-heading" className="min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <h2
                  id="cart-items-heading"
                  className="font-heading text-lg font-bold text-brand-text-dark sm:text-xl"
                >
                  Your items
                </h2>
                <span className="text-xs text-brand-text-muted sm:text-sm">
                  {items.length} {items.length === 1 ? 'product' : 'products'}
                </span>
              </div>

              {/* Column labels on wide screens */}
              <div className="mb-3 hidden grid-cols-[minmax(0,1fr)_92px_112px_100px] items-center gap-3 rounded-lg border border-brand-green/10 bg-[#eee9dc] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brand-text-muted xl:grid">
                <span>Product</span>
                <span className="text-right">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Subtotal</span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="min-w-0"
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Reassurance information */}
              <FadeIn delay={0.15}>
                <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-brand-green/10 bg-white p-4 sm:mt-6 sm:grid-cols-2 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-green">
                      <ShieldCheck size={21} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-brand-text-dark">
                        Simple, secure ordering
                      </p>
                      <p className="mt-1 text-xs leading-5 text-brand-text-muted">
                        Review your details before placing your order.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-green">
                      <PackageCheck size={21} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-brand-text-dark">
                        Cash on Delivery
                      </p>
                      <p className="mt-1 text-xs leading-5 text-brand-text-muted">
                        Pay when your order arrives, if COD is available for your
                        address.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-brand-text-muted">
                <Truck
                  size={15}
                  className="shrink-0 text-brand-green"
                  aria-hidden="true"
                />
                <span>
                  Delivery charges, if any, are shown in the order summary.
                </span>
              </div>
            </section>

            {/* Order summary */}
            <aside
              className="min-w-0 lg:sticky lg:top-6"
              aria-label="Order summary"
            >
              <CartSummary />
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

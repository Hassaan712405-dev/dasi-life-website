'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ShoppingCart,
  X,
  Loader2,
  User,
  LogOut,
  ChevronDown,
  Heart,
  Menu,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/services/auth/authService';
import type { Product } from '@/types/database';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop All' },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/faq', label: 'FAQ' },
];

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { getTotalItems } = useCart();
  const { getTotalItems: getWishlistCount } = useWishlist();
  const { user, loading: authLoading } = useAuth();

  const cartCount = getTotalItems();
  const wishlistCount = getWishlistCount();

  // Scroll detection — shadow only, no layout shift
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smoothly focus search input after animation starts
  useEffect(() => {
    if (!searchOpen) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [searchOpen]);

  // Reset search after close animation
  useEffect(() => {
    if (!searchOpen) {
      const timer = setTimeout(() => {
        setQuery('');
        setResults([]);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Lock body scroll only for mobile drawer
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const scrollY = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      const top = document.body.style.top;

      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      if (top) {
        window.scrollTo(0, parseInt(top, 10) * -1);
      }
    };
  }, [mobileMenuOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        setSearchOpen(true);
      }

      if (e.key === 'Escape') {
        setSearchOpen(false);
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      const supabase = createClient();
      const searchTerm = `%${query.trim()}%`;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or(
          `name.ilike.${searchTerm},slug.ilike.${searchTerm},short_description.ilike.${searchTerm}`
        )
        .limit(5);

      if (!error && data) {
        setResults(data as Product[]);
      } else {
        setResults([]);
      }

      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    await signOut();

    setUserMenuOpen(false);
    setMobileMenuOpen(false);

    router.push('/');
    router.refresh();
  };

  const userInitials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      <header
        className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
        style={{ borderBottom: '1px solid #EBE4D6' }}
      >
        <div className="container-custom">
          {/* ================================================= */}
          {/* MAIN NAVBAR — FIXED HEIGHT / NO LAYOUT SHIFT     */}
          {/* ================================================= */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 py-3 sm:py-3.5 md:py-4">
            {/* HAMBURGER */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 hover:bg-brand-cream rounded-full transition-colors flex items-center justify-center shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} className="text-brand-text-dark" />
            </button>

            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group"
              aria-label="Desi Life Home"
            >
              <div className="relative h-10 w-28 sm:h-11 sm:w-32 md:h-12 md:w-36 lg:h-14 lg:w-44 transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src="/images/logo.png"
                  alt="Desi Life"
                  fill
                  className="object-contain object-left"
                  priority
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 176px"
                />
              </div>
            </Link>

            {/* ================================================= */}
            {/* DESKTOP CENTER AREA                              */}
            {/* NAV LINKS <-> SEARCH — SAME EXACT SPACE          */}
            {/* ================================================= */}
            <div className="hidden lg:flex flex-1 justify-center relative mx-4 xl:mx-8">
              <AnimatePresence mode="wait" initial={false}>
                {!searchOpen ? (
                  <motion.nav
                    key="navigation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.18,
                      ease: 'easeOut',
                    }}
                    className="flex items-center justify-center gap-6 xl:gap-8 text-sm font-medium text-brand-text-dark"
                  >
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="hover:text-brand-green transition-colors relative group py-1.5 whitespace-nowrap"
                      >
                        {link.label}

                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full" />
                      </Link>
                    ))}
                  </motion.nav>
                ) : (
                  <motion.form
                    key="search"
                    onSubmit={handleSubmit}
                    initial={{
                      opacity: 0,
                      scaleX: 0.92,
                      filter: 'blur(4px)',
                    }}
                    animate={{
                      opacity: 1,
                      scaleX: 1,
                      filter: 'blur(0px)',
                    }}
                    exit={{
                      opacity: 0,
                      scaleX: 0.92,
                      filter: 'blur(4px)',
                    }}
                    transition={{
                      duration: 0.28,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full max-w-2xl origin-center"
                  >
                    <div className="relative flex items-center">
                      {/* Search Icon */}
                      <Search
                        size={18}
                        className="absolute left-4 text-brand-text-muted pointer-events-none z-10"
                      />

                      {/* Search Input */}
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for Unani products, oils, capsules..."
                        autoComplete="off"
                        className="w-full h-10 sm:h-11 bg-brand-cream border border-gray-300 rounded-full pl-11 pr-24 text-sm text-brand-text-dark placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green focus:bg-white transition-all duration-200"
                      />

                      {/* Clear */}
                      <AnimatePresence>
                        {query && (
                          <motion.button
                            type="button"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => setQuery('')}
                            className="absolute right-12 w-7 h-7 rounded-full flex items-center justify-center text-brand-text-muted hover:text-brand-green hover:bg-brand-cream-dark transition-colors"
                            aria-label="Clear search"
                          >
                            <X size={15} />
                          </motion.button>
                        )}
                      </AnimatePresence>

                      {/* Close */}
                      <button
                        type="button"
                        onClick={closeSearch}
                        className="absolute right-2 w-8 h-8 rounded-full flex items-center justify-center text-brand-text-muted hover:text-brand-green hover:bg-brand-cream-dark transition-colors"
                        aria-label="Close search"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* ================================================= */}
              {/* SEARCH RESULTS DROPDOWN                           */}
              {/* ================================================= */}
              <AnimatePresence>
                {searchOpen && query.trim().length >= 2 && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -6,
                      scaleY: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scaleY: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                      scaleY: 0.96,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: 'top center' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-full max-w-2xl z-[80]"
                  >
                    <div className="bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
                      {loading ? (
                        <div className="flex items-center justify-center py-6 text-brand-text-muted text-sm">
                          <Loader2
                            size={18}
                            className="animate-spin mr-2"
                          />
                          Searching...
                        </div>
                      ) : results.length === 0 ? (
                        <div className="py-6 px-4 text-center text-sm text-brand-text-muted">
                          No products found for{' '}
                          <strong>"{query}"</strong>
                        </div>
                      ) : (
                        <>
                          <div className="max-h-[400px] overflow-y-auto">
                            {results.map((product) => (
                              <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                onClick={closeSearch}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-brand-cream transition-colors group border-b border-gray-100 last:border-b-0"
                              >
                                <div className="w-10 h-10 bg-brand-cream rounded-lg overflow-hidden shrink-0">
                                  <Image
                                    src={
                                      product.slug ===
                                      'sultani-herbal-majoon'
                                        ? '/images/product-majoon.png'
                                        : product.slug ===
                                          'sultani-herbal-hair-oil'
                                        ? '/images/product-hair-oil.png'
                                        : product.slug ===
                                          'sultani-herbal-capsule-joint-bone'
                                        ? '/images/product-joint-bone.png'
                                        : '/images/product-weight-loss.png'
                                    }
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    sizes="40px"
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-brand-text-dark group-hover:text-brand-green transition-colors line-clamp-1">
                                    {product.name}
                                  </p>

                                  <p className="text-xs text-brand-text-muted line-clamp-1">
                                    {product.short_description}
                                  </p>
                                </div>

                                <p className="font-semibold text-brand-green text-sm shrink-0">
                                  Rs {product.price.toLocaleString()}
                                </p>
                              </Link>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full text-center text-sm font-medium text-brand-gold hover:text-brand-green transition-colors py-3 border-t border-gray-100 bg-white"
                          >
                            View all results for "{query}" →
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ================================================= */}
            {/* RIGHT ICONS                                      */}
            {/* ================================================= */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 hover:bg-brand-cream rounded-full transition-colors flex items-center justify-center"
                aria-label="Search"
              >
                <Search size={20} className="text-brand-text-dark" />
              </button>

              {/* User */}
              {!authLoading && (
                <>
                  {user ? (
                    <div className="relative hidden sm:block" ref={userMenuRef}>
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 hover:bg-brand-cream rounded-full transition-colors"
                        aria-label="User menu"
                      >
                        <span className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-semibold">
                          {userInitials}
                        </span>

                        <ChevronDown
                          size={14}
                          className={`text-brand-text-dark transition-transform duration-200 ${
                            userMenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {userMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden z-50"
                          >
                            <div className="px-4 py-3 border-b border-gray-100 bg-brand-cream">
                              <p className="text-xs text-brand-text-muted mb-0.5">
                                Signed in as
                              </p>

                              <p className="text-sm font-medium text-brand-text-dark truncate">
                                {user.email}
                              </p>
                            </div>

                            <div className="py-2">
                              <Link
                                href="/account"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-text-dark hover:bg-brand-cream transition-colors"
                              >
                                <User
                                  size={16}
                                  className="text-brand-green"
                                />
                                My Account
                              </Link>

                              <Link
                                href="/account/orders"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-text-dark hover:bg-brand-cream transition-colors"
                              >
                                <ShoppingCart
                                  size={16}
                                  className="text-brand-green"
                                />
                                My Orders
                              </Link>

                              <Link
                                href="/wishlist"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-text-dark hover:bg-brand-cream transition-colors"
                              >
                                <Heart
                                  size={16}
                                  className="text-brand-green"
                                />
                                My Wishlist
                              </Link>
                            </div>

                            <div className="border-t border-gray-100 py-2">
                              <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <LogOut size={16} />
                                Logout
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="hidden sm:flex p-2 hover:bg-brand-cream rounded-full transition-colors"
                      aria-label="Login"
                    >
                      <User size={20} className="text-brand-text-dark" />
                    </Link>
                  )}
                </>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-brand-cream rounded-full transition-colors hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart size={20} className="text-brand-text-dark" />

                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 bg-brand-cream hover:bg-brand-cream-dark rounded-full transition-all duration-300 hover:scale-[1.02]"
                aria-label="Cart"
              >
                <ShoppingCart
                  size={18}
                  className="text-brand-text-dark"
                />

                <span className="text-sm font-medium text-brand-text-dark hidden sm:inline">
                  Cart
                </span>

                <span
                  className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 ${
                    cartCount > 0
                      ? 'bg-brand-gold text-white scale-100'
                      : 'bg-brand-gold/60 text-white scale-95'
                  }`}
                >
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================== */}
      {/* MOBILE MENU DRAWER                                    */}
      {/* ===================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-[60]"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="lg:hidden fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[70] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center"
                >
                  <div className="relative h-9 w-28">
                    <Image
                      src="/images/logo.png"
                      alt="Desi Life"
                      fill
                      className="object-contain object-left"
                      sizes="112px"
                    />
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 hover:bg-brand-cream rounded-full transition-colors flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X
                    size={20}
                    className="text-brand-text-dark"
                  />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="px-5 py-4 bg-brand-cream border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center text-sm font-semibold">
                      {userInitials}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-brand-text-muted">
                        Signed in as
                      </p>

                      <p className="text-sm font-medium text-brand-text-dark truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-5 py-4">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 px-3 text-base font-medium text-brand-text-dark hover:bg-brand-cream hover:text-brand-green rounded-md transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="my-4 border-t border-gray-100" />

                <div className="space-y-1">
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 text-sm font-medium text-brand-text-dark hover:bg-brand-cream hover:text-brand-green rounded-md transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Heart
                        size={18}
                        className="text-brand-green"
                      />
                      Wishlist
                    </span>

                    {wishlistCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 text-sm font-medium text-brand-text-dark hover:bg-brand-cream hover:text-brand-green rounded-md transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingCart
                        size={18}
                        className="text-brand-green"
                      />
                      Cart
                    </span>

                    {cartCount > 0 && (
                      <span className="bg-brand-gold text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                <div className="my-4 border-t border-gray-100" />

                {user ? (
                  <div className="space-y-1">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-3 text-sm font-medium text-brand-text-dark hover:bg-brand-cream hover:text-brand-green rounded-md transition-colors"
                    >
                      <User
                        size={18}
                        className="text-brand-green"
                      />
                      My Account
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-3 text-sm font-medium text-brand-text-dark hover:bg-brand-cream hover:text-brand-green rounded-md transition-colors"
                    >
                      <ShoppingCart
                        size={18}
                        className="text-brand-green"
                      />
                      My Orders
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 py-3 px-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-brand-green hover:bg-black text-white font-medium py-3 rounded-md transition-colors text-sm"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-white border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white font-medium py-3 rounded-md transition-colors text-sm"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
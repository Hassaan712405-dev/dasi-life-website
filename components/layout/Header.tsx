'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ShoppingCart,
  Menu,
  ChevronRight,
  User,
  LogOut,
  Package,
  Mail,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  MessageSquareText,
} from 'lucide-react';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { getProductImageUrl } from '@/lib/utils/productImage';
import type { Product } from '@/types/database';

// ✅ ReviewModal Import
import ReviewModal from '@/components/products/ReviewModal';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const iconButtonClass =
  'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1B5E20]/10 hover:text-[#1B5E20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-2 active:bg-[#1B5E20]/15';

const navLinkClass = (active: boolean) =>
  [
    'relative z-10 inline-flex items-center justify-center',
    'py-3 text-[15px] font-medium leading-none whitespace-nowrap',
    'text-transparent bg-clip-text',
    'transition-colors duration-300 ease-in-out',
    'after:content-[""] after:absolute after:left-0 after:bottom-[5px]',
    'after:h-[2px] after:w-full after:rounded-full',
    'after:bg-[#1B5E20] after:pointer-events-none',
    'after:origin-left after:scale-x-0',
    'after:transition-transform after:duration-300 after:ease-in-out',
    active
      ? '!text-[#1B5E20] after:scale-x-100'
      : '!text-[#1A1A1A] hover:!text-[#1B5E20] hover:after:scale-x-100',
    'focus-visible:outline-none focus-visible:!text-[#1B5E20]',
    'focus-visible:after:scale-x-100',
    'motion-reduce:transition-none motion-reduce:after:transition-none',
  ].join(' ');

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const supabase = createClient();
  const shouldReduceMotion = useReducedMotion();

  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // ✅ Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [shake, setShake] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  const isAnyLoading = authLoading || googleLoading;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail);

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 300, damping: 28 } as const);

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const staggerItem: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: springTransition,
    },
  };

  const btnClass =
    "relative isolate flex h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-[#1B5E20] text-sm font-medium text-white transition-colors duration-300 before:absolute before:inset-0 before:-z-10 before:translate-x-[-101%] before:bg-[#123E16] before:transition-transform before:duration-300 hover:before:translate-x-0 disabled:opacity-60";

  // Reset login state
  useEffect(() => {
    if (showLoginModal) {
      setLoginEmail('');
      setAuthError('');
      setAuthLoading(false);
      setGoogleLoading(false);
      setShake(false);
    }
  }, [showLoginModal]);

  // Supabase authentication listener
  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (event === 'SIGNED_OUT') {
        setShowLoginModal(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Search outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Login autofocus
  useEffect(() => {
    if (showLoginModal && emailInputRef.current) {
      const timer = window.setTimeout(() => {
        emailInputRef.current?.focus();
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [showLoginModal]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsSearchFocused(false);
    setShowLoginModal(false);
    setShowReviewModal(false);
  }, [pathname]);

  // Escape key support
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setIsSearchFocused(false);
        if (!isAnyLoading) {
          setShowLoginModal(false);
        }
        setShowReviewModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isAnyLoading]);

  // Product search
  useEffect(() => {
    const searchTerm = query.trim();
    if (searchTerm.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(
            `id, name, slug, price, short_description, categories ( name ), product_images ( id, url, alt, sort_order, is_primary )`
          )
          .eq('is_active', true)
          .or(
            `name.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%`
          )
          .limit(5);
        if (!cancelled) {
          if (error) {
            console.error('Product search error:', error);
            setResults([]);
          } else {
            setResults((data as unknown as Product[]) || []);
          }
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Product search failed:', error);
          setResults([]);
          setLoading(false);
        }
      }
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, supabase]);

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = query.trim();
    if (searchTerm) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsSearchFocused(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !isEmailValid) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auto-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok || !data.token_hash) {
        setAuthError(data.error || 'Failed to login. Please try again.');
        setAuthLoading(false);
        return;
      }
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: data.token_hash,
        type: 'magiclink',
      });
      if (verifyError) {
        setAuthError(verifyError.message);
        setAuthLoading(false);
        return;
      }
      setShowLoginModal(false);
      setLoginEmail('');
      router.refresh();
    } catch (err: any) {
      setAuthError(err.message || 'Something went wrong.');
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setAuthError('');
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const callbackUrl = `${baseUrl}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) {
      setAuthError(error.message);
      setGoogleLoading(false);
    }
  };

  const handleLogout = async () => {
    setShowLoginModal(false);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isAnyLoading) return;
    setShake(true);
    window.setTimeout(() => setShake(false), 500);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href === '/shop') {
      return (
        pathname === '/shop' ||
        pathname.startsWith('/product/') ||
        pathname.startsWith('/category/') ||
        pathname.startsWith('/search')
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 bg-[#FDFBF7] transition-[height,box-shadow,border-color] duration-300 ${
          scrolled
            ? 'h-[68px] shadow-md border-b border-transparent'
            : 'h-[80px] border-b border-[#EBE4D6]'
        }`}
      >
        <div className="mx-auto h-full max-w-[1400px] px-3 sm:px-6">
          <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4">
            {/* LOGO */}
            <Link
              href="/"
              className="group flex shrink-0 items-center"
              aria-label="Dasi Life Home"
            >
              <div className="relative h-10 w-28 shrink-0 transition-transform duration-300 group-hover:scale-[1.02] sm:h-11 sm:w-32 md:h-12 md:w-40 lg:h-14 lg:w-48">
                <Image
                  src="/images/logo.png"
                  alt="Dasi Life"
                  fill
                  priority
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav
              className="hidden items-center justify-center gap-8 lg:flex xl:gap-12"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={navLinkClass(active)}
                  >
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
              {/* DESKTOP SEARCH */}
              <div
                ref={searchRef}
                className="relative hidden w-[180px] md:block xl:w-[220px]"
              >
                <form onSubmit={handleSubmitSearch} role="search">
                  <div className="relative flex items-center">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 text-gray-500"
                    />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      placeholder="Search products..."
                      aria-label="Search products"
                      className="h-9 w-full rounded-full border border-[#DCD5C6] bg-white pl-9 pr-8 text-[13px] transition-all focus:border-[#1B5E20] focus:outline-none focus:ring-1 focus:ring-[#1B5E20]/30"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="absolute right-2 rounded-full p-1 text-gray-400 transition-colors hover:text-gray-700"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </form>

                <AnimatePresence>
                  {isSearchFocused && query.trim().length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                      className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#EBE4D6] bg-white shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2 p-4 text-center text-sm text-gray-500">
                          <Loader2 size={14} className="animate-spin text-[#1B5E20]" />
                          Searching...
                        </div>
                      ) : results.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No products found
                        </div>
                      ) : (
                        <div className="max-h-[320px] overflow-y-auto">
                          {results.map((product: any) => (
                            <Link
                              key={product.id}
                              href={`/product/${product.slug}`}
                              onClick={() => setIsSearchFocused(false)}
                              className="group flex items-center gap-3 border-b border-gray-100 px-3 py-2.5 transition-colors hover:bg-[#1B5E20]/5 last:border-0"
                            >
                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[#F5F0E8]">
                                <Image
                                  src={getProductImageUrl(product)}
                                  alt={product.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-[#1A1A1A] transition-colors group-hover:text-[#1B5E20]">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Rs {Number(product.price).toLocaleString()}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ✅ REVIEW BUTTON */}
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className={iconButtonClass}
                aria-label="Write a Review"
                title="Write a Review"
              >
                <MessageSquareText size={21} strokeWidth={1.8} />
              </button>

              {/* ACCOUNT ICON */}
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(!showLoginModal)}
                  className={iconButtonClass}
                  aria-label="Account menu"
                  title="Account"
                  aria-expanded={user ? showLoginModal : undefined}
                >
                  <User size={20} strokeWidth={1.8} />
                </button>

                <AnimatePresence>
                  {user && showLoginModal && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowLoginModal(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                        className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                      >
                        <div className="border-b border-gray-100 bg-[#FDFBF7] px-4 py-3">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="truncate text-sm font-medium">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/account/orders"
                            onClick={() => setShowLoginModal(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] transition-colors hover:bg-[#1B5E20]/5 hover:text-[#1B5E20]"
                          >
                            <Package size={15} />
                            My Orders
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 py-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                          >
                            <LogOut size={15} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* CART */}
              <Link
                href="/cart"
                className={iconButtonClass}
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
                title="Shopping Cart"
              >
                <ShoppingCart size={20} strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1B5E20] px-1 text-[10px] font-bold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* HAMBURGER */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden ${iconButtonClass}`}
                aria-label="Open menu"
                title="Open Menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu size={22} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ GLOBAL REVIEW MODAL */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        userEmail={user?.email}
      />

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && !user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md sm:p-6"
            onClick={handleModalBackdropClick}
          >
            <motion.div
              initial={{
                scale: shouldReduceMotion ? 1 : 0.96,
                opacity: 0,
                y: shouldReduceMotion ? 0 : 16,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                x: shake && !shouldReduceMotion ? [0, -6, 6, -6, 6, 0] : 0,
              }}
              exit={{
                scale: shouldReduceMotion ? 1 : 0.96,
                opacity: 0,
                y: shouldReduceMotion ? 0 : 16,
              }}
              transition={
                shake && !shouldReduceMotion
                  ? { duration: 0.4 }
                  : springTransition
              }
              className="relative flex max-h-[90dvh] w-full max-w-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_-20px_rgba(0,0,0,0.35)]"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-heading"
            >
              <div className="overflow-y-auto p-7 sm:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col"
                >
                  <motion.div
                    variants={staggerItem}
                    className="mb-6 flex flex-col items-center justify-center"
                  >
                    <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1B5E20] shadow-sm">
                      <User size={30} className="text-white" />
                    </div>
                    <h3
                      id="login-heading"
                      className="mb-1 text-center font-heading text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
                    >
                      Login
                    </h3>
                    <p className="text-center text-sm text-slate-500">
                      Welcome to Dasi Life
                    </p>
                  </motion.div>

                  <AnimatePresence>
                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="flex items-start gap-2 overflow-hidden rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600"
                      >
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <p>{authError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <motion.div variants={staggerItem} className="group relative">
                      <Mail
                        size={18}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                          isEmailValid
                            ? 'text-[#1B5E20]'
                            : 'text-slate-400 group-focus-within:text-[#1B5E20]'
                        }`}
                      />
                      <input
                        ref={emailInputRef}
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          setAuthError('');
                        }}
                        disabled={isAnyLoading}
                        autoComplete="email"
                        inputMode="email"
                        className={`h-[48px] w-full rounded-[5px] border bg-slate-50 pl-11 pr-10 text-[16px] text-slate-900 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B5E20] disabled:opacity-60 ${
                          loginEmail.length > 0 && !isEmailValid
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                            : 'border-slate-300 focus:border-[#1B5E20]'
                        }`}
                      />
                      {isEmailValid && (
                        <CheckCircle2
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
                        />
                      )}
                    </motion.div>

                    <motion.div
                      variants={staggerItem}
                      className="relative flex items-center py-2"
                    >
                      <div className="flex-grow border-t border-slate-200" />
                      <span className="mx-4 flex-shrink-0 bg-white px-2 text-xs font-medium uppercase tracking-widest text-slate-400">
                        OR
                      </span>
                      <div className="flex-grow border-t border-slate-200" />
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isAnyLoading}
                        className="flex h-[48px] w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-60"
                      >
                        {googleLoading ? (
                          <Loader2 size={20} className="animate-spin text-slate-500" />
                        ) : (
                          <GoogleIcon />
                        )}
                        Continue with Google
                      </button>
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <button
                        type="submit"
                        disabled={!isEmailValid || isAnyLoading}
                        className={btnClass}
                      >
                        <span className="relative z-10">
                          {authLoading ? (
                            <>
                              <Loader2 size={18} className="mr-2 inline-block animate-spin" />
                              Logging in...
                            </>
                          ) : (
                            'Login'
                          )}
                        </span>
                      </button>
                    </motion.div>
                  </form>

                  <motion.div variants={staggerItem} className="mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLoginModal(false);
                        setAuthError('');
                      }}
                      disabled={isAnyLoading}
                      className="flex h-11 w-full items-center justify-center rounded-md text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400"
                  >
                    <ShieldCheck size={14} />
                    <span>Secure & encrypted login</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/50 lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: shouldReduceMotion ? 0 : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: shouldReduceMotion ? 0 : '-100%' }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.3, ease: 'easeOut' }
              }
              className="fixed left-0 top-0 z-[110] flex h-[100dvh] w-[85%] max-w-sm flex-col bg-[#FDFBF7] shadow-2xl lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between border-b border-[#EBE4D6] px-5 py-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Dasi Life Home"
                >
                  <div className="relative h-9 w-[120px]">
                    <Image
                      src="/images/logo.png"
                      alt="Dasi Life"
                      fill
                      sizes="120px"
                      className="object-contain object-left"
                    />
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className={iconButtonClass}
                  aria-label="Close menu"
                  title="Close Menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav
                className="flex-1 overflow-y-auto px-3 py-4"
                aria-label="Mobile navigation links"
              >
                <ul className="space-y-1">
                  {NAV_LINKS.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className={`group flex items-center justify-between rounded-md border-l-[3px] px-3 py-3 text-base font-medium transition-colors duration-200 ${
                            active
                              ? 'border-[#1B5E20] bg-[#1B5E20]/5 text-[#1B5E20]'
                              : 'border-transparent text-[#1A1A1A] hover:bg-[#1B5E20]/5 hover:text-[#1B5E20]'
                          }`}
                        >
                          {link.label}
                          <ChevronRight
                            size={16}
                            className="opacity-40 transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="my-4 border-t border-[#EBE4D6]" />

                <ul className="space-y-1">
                  {/* ✅ Mobile Review Button */}
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowReviewModal(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-base font-medium text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1B5E20]/5 hover:text-[#1B5E20]"
                    >
                      <MessageSquareText size={18} />
                      Write a Review
                    </button>
                  </li>

                  <li>
                    <Link
                      href="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-md px-3 py-3 text-base font-medium text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1B5E20]/5 hover:text-[#1B5E20]"
                    >
                      <span className="flex items-center gap-3">
                        <ShoppingCart size={18} />
                        Cart
                      </span>
                      {cartCount > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1B5E20] px-1.5 text-xs font-bold text-white">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>
                  </li>

                  {user ? (
                    <>
                      <li>
                        <Link
                          href="/account/orders"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1B5E20]/5 hover:text-[#1B5E20]"
                        >
                          <Package size={18} />
                          My Orders
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-base font-medium text-red-600 transition-colors duration-200 hover:bg-red-50"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowLoginModal(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-base font-medium text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1B5E20]/5 hover:text-[#1B5E20]"
                      >
                        <User size={18} />
                        Login / Register
                      </button>
                    </li>
                  )}
                </ul>
              </nav>

              <div className="border-t border-[#EBE4D6] px-5 py-4">
                <p className="text-center text-xs text-gray-500">
                  © {new Date().getFullYear()} Dasi Life. All rights reserved.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
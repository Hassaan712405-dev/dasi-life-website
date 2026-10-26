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
  Menu,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/services/auth/authService';
import { getProductImageUrl } from '@/lib/utils/productImage';
import type { Product } from '@/types/database';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { getTotalItems } = useCart();
  const { getTotalItems: getWishlistCount } = useWishlist();
  const { user, loading: authLoading } = useAuth();

  const cartCount = getTotalItems();
  const wishlistCount = getWishlistCount();

  // ✅ FIXED: Scroll handler — only update if value actually changes
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled((prev) => {
        if (prev !== isScrolled) return isScrolled;
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Search — now fetches product_images for correct image
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
        .select(`
          id, name, slug, price, short_description,
          categories ( name ),
          product_images ( id, url, alt, sort_order, is_primary )
        `)
        .eq('is_active', true)
        .or(`name.ilike.${searchTerm},short_description.ilike.${searchTerm}`)
        .limit(5);

      if (!error && data) {
        setResults(data as unknown as Product[]);
      } else {
        setResults([]);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setIsSearchFocused(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [mobileMenuOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/shop') {
      return (
        pathname === '/shop' ||
        pathname.startsWith('/product') ||
        pathname.startsWith('/category') ||
        pathname.startsWith('/search')
      );
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`bg-[#FDFBF7] fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-md h-[68px]' : 'border-b border-[#EBE4D6] h-[80px]'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full">
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-full gap-4">

            {/* LEFT: Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="Dasi Life Home">
              <div className="relative h-10 w-28 sm:h-11 sm:w-32 md:h-12 md:w-40 lg:h-14 lg:w-48 transition-transform duration-300 group-hover:scale-[1.03]">
                <Image
                  src="/images/logo.png"
                  alt="Dasi Life"
                  fill
                  className="object-contain object-left"
                  priority
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                />
              </div>
            </Link>

            {/* CENTER: Nav Links */}
            <nav className="hidden lg:flex items-center justify-center gap-10 xl:gap-12" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link relative py-2 text-[15px] font-medium ${
                      active ? 'nav-link-active' : ''
                    }`}
                    style={{
                      backgroundColor: 'transparent',
                      color: active ? '#1B5E20' : '#1A1A1A',
                      padding: '8px 0',
                      textDecoration: 'none',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT: Search + Account + Cart */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 justify-end">

              <div ref={searchRef} className="hidden md:block relative w-[180px] xl:w-[220px]">
                <form onSubmit={handleSubmit} role="search">
                  <div className="relative flex items-center">
                    <Search size={15} className="absolute left-3 text-gray-500 pointer-events-none" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search products..."
                      aria-label="Search products"
                      className="w-full h-9 bg-white border border-[#DCD5C6] rounded-full pl-9 pr-8 text-[13px] text-[#1A1A1A] placeholder:text-gray-500 focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]/30 transition-all"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-2 p-1 text-gray-400 hover:text-gray-700 rounded-full"
                        aria-label="Clear search"
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
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#EBE4D6] shadow-xl overflow-hidden z-50"
                    >
                      {loading ? (
                        <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2 text-sm">
                          <Loader2 size={14} className="animate-spin text-[#1B5E20]" /> Searching...
                        </div>
                      ) : results.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No products found for "<strong>{query}</strong>"
                        </div>
                      ) : (
                        <div className="max-h-[320px] overflow-y-auto">
                          {results.map((product: any) => (
                            <Link
                              key={product.id}
                              href={`/product/${product.slug}`}
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1B5E20]/5 transition-colors border-b border-gray-100 last:border-0 group"
                            >
                              <div className="w-10 h-10 bg-[#F5F0E8] rounded-md overflow-hidden relative shrink-0">
                                {/* ✅ FIXED: Uses Supabase image */}
                                <Image
                                  src={getProductImageUrl(product)}
                                  alt={product.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1A1A1A] truncate group-hover:text-[#1B5E20] transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Rs {product.price.toLocaleString()}
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

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden w-10 h-10 hover:bg-[#1B5E20]/10 rounded-full transition-colors flex items-center justify-center"
                aria-label="Search"
              >
                <Search size={20} className="text-[#1A1A1A]" />
              </button>

              {!authLoading && (
                <>
                  {user ? (
                    <div className="relative hidden sm:block" ref={userMenuRef}>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center justify-center w-10 h-10 hover:bg-[#1B5E20]/10 rounded-full transition-colors"
                        aria-label="Account menu"
                        aria-expanded={userMenuOpen}
                      >
                        <User size={20} className="text-[#1A1A1A]" />
                      </button>
                      <AnimatePresence>
                        {userMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50"
                          >
                            <div className="px-4 py-3 border-b border-gray-100 bg-[#FDFBF7]">
                              <p className="text-xs text-gray-500">Signed in as</p>
                              <p className="text-sm font-medium truncate">{user.email}</p>
                            </div>
                            <div className="py-1">
                              <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#1B5E20]/5 hover:text-[#1B5E20] transition-colors">
                                <User size={15} /> My Account
                              </Link>
                              <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#1B5E20]/5 hover:text-[#1B5E20] transition-colors">
                                <ShoppingCart size={15} /> My Orders
                              </Link>
                              <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#1B5E20]/5 hover:text-[#1B5E20] transition-colors">
                                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                              </Link>
                            </div>
                            <div className="border-t border-gray-100 py-1">
                              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut size={15} /> Logout
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="hidden sm:flex w-10 h-10 hover:bg-[#1B5E20]/10 rounded-full transition-colors items-center justify-center"
                      aria-label="Login"
                    >
                      <User size={20} className="text-[#1A1A1A]" />
                    </Link>
                  )}
                </>
              )}

              <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 hover:bg-[#1B5E20]/10 rounded-full transition-colors"
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
              >
                <ShoppingCart size={20} className="text-[#1A1A1A]" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#1B5E20] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 hover:bg-[#1B5E20]/10 rounded-full transition-colors flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu size={22} className="text-[#1A1A1A]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Inline styles for nav hover */}
      <style jsx global>{`
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #1B5E20;
          transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-50%);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link-active::after {
          width: 100% !important;
        }
        .nav-link:hover {
          color: #1B5E20 !important;
        }
      `}</style>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-[100]"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="lg:hidden fixed top-0 left-0 h-full w-[85%] max-w-sm bg-[#FDFBF7] z-[110] flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBE4D6]">
                <Image
                  src="/images/logo.png"
                  alt="Dasi Life"
                  width={120}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 hover:bg-[#1B5E20]/10 rounded-full transition-colors flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-5 pt-4">
                <form onSubmit={handleSubmit} role="search">
                  <div className="relative flex items-center">
                    <Search size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products..."
                      aria-label="Search products"
                      className="w-full h-11 bg-white border border-[#DCD5C6] rounded-full pl-10 pr-4 text-sm text-[#1A1A1A] placeholder:text-gray-500 focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]/30 transition-all"
                    />
                  </div>
                </form>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between py-3 px-3 rounded-md text-base font-medium transition-colors ${
                            active
                              ? 'bg-[#1B5E20]/10 text-[#1B5E20]'
                              : 'text-[#1A1A1A] hover:bg-[#1B5E20]/5 hover:text-[#1B5E20]'
                          }`}
                        >
                          {link.label}
                          <ChevronRight size={16} className="opacity-40" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="my-4 border-t border-[#EBE4D6]" />

                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3 px-3 rounded-md text-base font-medium text-[#1A1A1A] hover:bg-[#1B5E20]/5 hover:text-[#1B5E20] transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <ShoppingCart size={18} /> Cart
                      </span>
                      {cartCount > 0 && (
                        <span className="bg-[#1B5E20] text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  {!user && (
                    <li>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-3 rounded-md text-base font-medium text-[#1A1A1A] hover:bg-[#1B5E20]/5 hover:text-[#1B5E20] transition-colors"
                      >
                        <User size={18} /> Login / Register
                      </Link>
                    </li>
                  )}
                  {user && (
                    <>
                      <li>
                        <Link
                          href="/account"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 py-3 px-3 rounded-md text-base font-medium text-[#1A1A1A] hover:bg-[#1B5E20]/5 hover:text-[#1B5E20] transition-colors"
                        >
                          <User size={18} /> My Account
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-3 py-3 px-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
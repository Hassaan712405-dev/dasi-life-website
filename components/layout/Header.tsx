'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Leaf, X, Loader2, User, LogOut, ChevronDown, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/services/auth/authService';
import type { Product } from '@/types/database';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { getTotalItems } = useCart();
  const { getTotalItems: getWishlistCount } = useWishlist();
  const { user, loading: authLoading } = useAuth();

  const cartCount = getTotalItems();
  const wishlistCount = getWishlistCount();

  // Focus input when opened
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [searchOpen]);

  // Reset query when closed
  useEffect(() => {
    if (!searchOpen) {
      const timer = setTimeout(() => {
        setQuery('');
        setResults([]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
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
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
  };

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const userInitials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between py-3 md:py-4 gap-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 z-20">
          <div className="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center">
            <Leaf className="text-white" size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl md:text-2xl font-heading font-bold tracking-tight">
            <span className="text-brand-green">DESÍ</span>
            <span className="text-brand-gold">LIFE</span>
          </span>
        </Link>

        {/* Center Area — Navigation OR Search */}
        <div className="hidden lg:flex flex-1 h-10 items-center justify-center relative">
          
          {/* Navigation */}
          <nav
            className={`absolute inset-0 flex items-center justify-center gap-8 text-sm font-medium text-brand-text-dark transition-all duration-300 ${
              searchOpen
                ? 'opacity-0 -translate-y-2 pointer-events-none'
                : 'opacity-100 translate-y-0'
            }`}
          >
            <Link href="/" className="hover:text-brand-green transition-colors relative group py-1.5">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/shop" className="hover:text-brand-green transition-colors relative group py-1.5">
              Shop All
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="hover:text-brand-green transition-colors relative group py-1.5">
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="hover:text-brand-green transition-colors relative group py-1.5">
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div
            className={`absolute inset-0 flex items-center transition-all duration-300 ${
              searchOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="w-full max-w-2xl mx-auto relative">
              <form onSubmit={handleSubmit} className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for Unani products, oils, capsules..."
                  className="w-full bg-brand-cream border border-gray-300 rounded-full pl-11 pr-11 py-2 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green transition-colors"
                    aria-label="Clear"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>

              {query.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-2xl z-50 overflow-hidden">
                  {loading ? (
                    <div className="flex items-center justify-center py-6 text-brand-text-muted text-sm">
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Searching...
                    </div>
                  ) : results.length === 0 ? (
                    <div className="py-6 px-4 text-center text-sm text-brand-text-muted">
                      No products found for "<strong>{query}</strong>"
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
                              <img
                                src={
                                  product.slug === 'sultani-herbal-majoon'
                                    ? '/images/product-majoon.png'
                                    : product.slug === 'sultani-herbal-hair-oil'
                                    ? '/images/product-hair-oil.png'
                                    : product.slug === 'sultani-herbal-capsule-joint-bone'
                                    ? '/images/product-joint-bone.png'
                                    : '/images/product-weight-loss.png'
                                }
                                alt={product.name}
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
              )}
            </div>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-20">

          {/* Search / Close Button */}
          <button
            type="button"
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            className="relative w-10 h-10 hover:bg-brand-cream rounded-full transition-colors flex items-center justify-center"
            aria-label={searchOpen ? 'Close search' : 'Search'}
          >
            <Search
              size={20}
              className={`absolute text-brand-text-dark transition-all duration-300 ${
                searchOpen
                  ? 'opacity-0 rotate-90 scale-50'
                  : 'opacity-100 rotate-0 scale-100'
              }`}
            />
            <X
              size={20}
              className={`absolute text-brand-text-dark transition-all duration-300 ${
                searchOpen
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 -rotate-90 scale-50'
              }`}
            />
          </button>

          {/* User — Auth State */}
          {!authLoading && (
            <>
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 pl-1.5 pr-2 py-1.5 hover:bg-brand-cream rounded-full transition-colors"
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

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden z-50">
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
                          <User size={16} className="text-brand-green" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-text-dark hover:bg-brand-cream transition-colors"
                        >
                          <ShoppingCart size={16} className="text-brand-green" />
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-text-dark hover:bg-brand-cream transition-colors"
                        >
                          <Heart size={16} className="text-brand-green" />
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
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-2 hover:bg-brand-cream rounded-full transition-colors"
                  aria-label="Login"
                >
                  <User size={20} className="text-brand-text-dark" />
                </Link>
              )}
            </>
          )}

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="relative p-2 hover:bg-brand-cream rounded-full transition-colors hidden sm:flex"
            aria-label="Wishlist"
          >
            <Heart size={20} className="text-brand-text-dark" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-2 px-3.5 py-2 bg-brand-cream hover:bg-brand-cream-dark rounded-full transition-colors"
          >
            <ShoppingCart size={18} className="text-brand-text-dark" />
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
    </header>
  );
}
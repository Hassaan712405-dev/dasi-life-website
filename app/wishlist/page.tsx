'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/types/database';

function getImageUrl(slug: string): string {
  const map: Record<string, string> = {
    'sultani-herbal-majoon': '/images/product-majoon.png',
    'sultani-herbal-hair-oil': '/images/product-hair-oil.png',
    'sultani-herbal-capsule-joint-bone': '/images/product-joint-bone.png',
    'sultani-herbal-capsule-weight-loss': '/images/product-weight-loss.png',
  };
  return map[slug] || '/images/product-majoon.png';
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { productIds, removeFromWishlist, clearWishlist, getTotalItems } = useWishlist();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products for wishlist items
  useEffect(() => {
    async function fetchProducts() {
      if (productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const supabase = createClient();

      // Try to fetch by ID first (UUIDs)
      // Otherwise fetch by slug
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      // If no data by ID, try by slug
      if (!data || data.length === 0) {
        const { data: slugData } = await supabase
          .from('products')
          .select('*')
          .in('slug', productIds);

        setProducts((slugData as Product[]) || []);
      } else {
        setProducts(data as Product[]);
      }

      setLoading(false);
    }

    if (!authLoading) {
      fetchProducts();
    }
  }, [productIds, authLoading]);

  // User initials
  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'U';
  const displayName = user?.email?.split('@')[0] || 'Guest';

  // Not logged in
  if (!authLoading && !user) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="container-custom py-20 text-center">
          <Heart size={48} className="text-brand-text-muted mx-auto mb-4" />
          <h1 className="text-3xl font-heading font-bold text-brand-green mb-3">
            Please Log In
          </h1>
          <p className="text-sm text-brand-text-muted mb-6">
            You need to be logged in to view your wishlist.
          </p>
          <Link href="/login" className="btn-primary inline-flex">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <AccountSidebar
            userName={displayName}
            userInitials={userInitials}
            userEmail={user?.email}
            joinedDate="Jan 2026"
          />

          {/* Right Content */}
          <div>
            {/* Heading + Clear All */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green">
                  My Wishlist
                </h1>
                <span className="bg-brand-green/10 text-brand-green text-xs md:text-sm font-medium px-3 py-1 rounded-full">
                  {getTotalItems()} items
                </span>
              </div>
              {productIds.length > 0 && (
                <button
                  type="button"
                  onClick={async () => {
                    await clearWishlist();
                  }}
                  className="text-sm text-brand-text-muted hover:text-red-500 transition-colors underline self-start sm:self-auto"
                >
                  Clear All Wishlist
                </button>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Loader2 size={32} className="animate-spin text-brand-green mx-auto mb-3" />
                <p className="text-sm text-brand-text-muted">Loading your wishlist...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Heart size={48} className="text-brand-text-muted mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-xl text-brand-green mb-3">
                  Your wishlist is empty
                </h3>
                <p className="text-sm text-brand-text-muted mb-6">
                  Save your favorite Unani products here for later.
                </p>
                <Link href="/shop" className="btn-primary inline-flex">
                  Browse Products
                </Link>
              </div>
            )}

            {/* Wishlist Grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative bg-brand-cream overflow-hidden">
                      <Link
                        href={`/product/${item.slug}`}
                        className="block overflow-hidden"
                      >
                        <img
                          src={getImageUrl(item.slug)}
                          alt={item.name}
                          className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      </Link>

                      {/* Remove Heart */}
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        aria-label="Remove from wishlist"
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Heart size={16} className="text-red-500 fill-red-500" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-heading font-semibold text-base md:text-lg text-brand-green hover:text-brand-green-light transition-colors line-clamp-2 mb-2">
                          {item.name}
                        </h3>
                      </Link>

                      <p className="text-xs md:text-sm text-brand-text-muted leading-relaxed line-clamp-2 mb-3">
                        {item.short_description}
                      </p>

                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-base md:text-lg font-bold text-brand-green">
                            Rs {item.price.toLocaleString()}
                          </span>
                          {item.compare_at_price && (
                            <span className="text-xs md:text-sm text-brand-text-muted line-through">
                              Rs {item.compare_at_price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            addToCart({
                              productId: item.id,
                              name: item.name,
                              slug: item.slug,
                              price: item.price,
                              imageUrl: getImageUrl(item.slug),
                            })
                          }
                          className="btn-small"
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
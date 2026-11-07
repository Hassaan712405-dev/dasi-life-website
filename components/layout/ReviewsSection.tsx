'use client';

import { useEffect, useState, useRef } from 'react';
import { Star, CheckCircle2, Quote, ArrowRight, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Review {
  id: string;
  customer_name: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified: boolean | null;
  created_at: string;
  product_id: string;
  products?: { name: string; slug: string } | null;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [liveUpdate, setLiveUpdate] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const cb = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  }, []);

  const fetchReviews = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(false);

    try {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from('reviews')
        .select('id, customer_name, rating, title, body, is_verified, created_at, product_id')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (fetchError) {
        console.error('[Reviews] fetch error:', fetchError);
        setError(true);
        if (showLoading) setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        if (isMountedRef.current) {
          setReviews([]);
          setAvgRating(0);
          setTotalReviews(0);
        }
        if (showLoading) setLoading(false);
        return;
      }

      const productIds = [...new Set(data.map((r: any) => r.product_id).filter(Boolean))];
      let productMap: Record<string, { name: string; slug: string }> = {};

      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select('id, name, slug')
          .in('id', productIds);

        if (products) {
          productMap = products.reduce(
            (acc: Record<string, { name: string; slug: string }>, p: any) => {
              acc[p.id] = { name: p.name, slug: p.slug };
              return acc;
            },
            {}
          );
        }
      }

      const typed: Review[] = data.map((r: any) => ({
        id: r.id,
        customer_name: r.customer_name,
        rating: r.rating,
        title: r.title,
        body: r.body,
        is_verified: r.is_verified,
        created_at: r.created_at,
        product_id: r.product_id,
        products: r.product_id ? productMap[r.product_id] || null : null,
      }));

      if (isMountedRef.current) setReviews(typed);

      const { data: allRatings } = await supabase
        .from('reviews')
        .select('rating')
        .eq('is_approved', true);

      if (allRatings && allRatings.length > 0 && isMountedRef.current) {
        const sum = allRatings.reduce(
          (acc: number, r: { rating: number }) => acc + r.rating,
          0
        );
        setAvgRating(sum / allRatings.length);
        setTotalReviews(allRatings.length);
      }

      if (showLoading) setLoading(false);
    } catch (e) {
      console.error('[Reviews] error:', e);
      if (isMountedRef.current) {
        setError(true);
        if (showLoading) setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchReviews();

    const supabase = createClient();
    const channel = supabase
      .channel('reviews-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reviews' },
        () => {
          setLiveUpdate(true);
          setTimeout(() => isMountedRef.current && setLiveUpdate(false), 3000);
          fetchReviews(false);
        }
      )
      .subscribe();

    const interval = setInterval(() => fetchReviews(false), 60000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchReviews(false);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isMountedRef.current = false;
      supabase.removeChannel(channel);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const renderStars = (rating: number, size: number = 14) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        className={
          i < Math.round(rating)
            ? 'fill-[#C9A961] text-[#C9A961]'
            : 'fill-gray-200 text-gray-200'
        }
      />
    ));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const marqueeReviews =
    reviews.length > 0 && reviews.length < 6
      ? [...reviews, ...reviews, ...reviews]
      : [...reviews, ...reviews];

  return (
    <section className="py-16 sm:py-20 bg-[#FDFBF7] relative overflow-hidden">
      {liveUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-4 z-50 bg-[#1B5E20] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
        >
          <RefreshCw size={12} className="animate-spin" />
          New reviews loaded
        </motion.div>
      )}

      <div className="absolute top-10 left-0 w-32 h-32 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#1B5E20">
          <path d="M50 10 Q30 30 30 50 Q30 70 50 90 Q70 70 70 50 Q70 30 50 10 Z" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-[#C9A961] font-semibold text-[11px] sm:text-xs tracking-[0.25em] uppercase mb-3">
            Customer Love
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#1B5E20] mb-4">
            Loved by Our Customers
          </h2>
          <p className="text-brand-text-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Real experiences from customers who have chosen Dasi Life for their
            everyday care.
          </p>

          {!loading && !error && totalReviews > 0 && (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-white border border-[#EBE4D6] px-5 py-3 rounded-full shadow-sm">
              <div className="flex items-center gap-0.5">
                {renderStars(avgRating, 16)}
              </div>
              <span className="text-base font-bold text-[#1B5E20]">
                {avgRating.toFixed(1)}
                <span className="text-sm font-normal text-gray-500">/5</span>
              </span>
              <span className="w-px h-4 bg-gray-300" />
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className="w-16 h-[2px] bg-[#C9A961] mx-auto mt-6" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-[#EBE4D6] animate-pulse"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-3.5 h-3.5 bg-gray-200 rounded" />
                  ))}
                </div>
                <div className="h-3 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded mb-2 w-4/5" />
                <div className="h-3 bg-gray-200 rounded w-2/5 mb-5" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#EBE4D6]">
            <p className="text-brand-text-muted mb-4">
              Could not load reviews right now.
            </p>
            <button
              onClick={() => fetchReviews(true)}
              className="bg-[#1B5E20] hover:bg-black text-white text-sm font-medium px-6 py-2.5 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && reviews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EBE4D6] max-w-2xl mx-auto">
            <Quote size={48} className="text-[#C9A961] mx-auto mb-4 opacity-50" />
            <h3 className="font-heading font-bold text-lg text-[#1B5E20] mb-2">
              Be the First to Share Your Experience
            </h3>
            <p className="text-sm text-brand-text-muted mb-6 max-w-md mx-auto">
              We would love to hear about your Dasi Life journey.
            </p>
          </div>
        )}

        {/* Marquee Track — NO BACKGROUND CHANGE on hover */}
        {!loading && !error && reviews.length > 0 && (
          <div
            className="relative overflow-hidden marquee-container py-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

            <div
              className={`flex gap-5 ${
                reducedMotion ? '' : 'animate-marquee-custom'
              }`}
              style={{
                animationPlayState:
                  isPaused || reducedMotion ? 'paused' : 'running',
                width: 'fit-content',
              }}
            >
              {marqueeReviews.map((review, i) => (
                <div
                  key={`${review.id}-${i}`}
                  className="review-card-simple group relative bg-white rounded-2xl p-5 border border-[#EBE4D6] transition-all duration-500 flex flex-col shrink-0 w-[380px] sm:w-[420px]"
                >
                  <div className="relative z-10">
                    {/* Quote Icon */}
                    <Quote
                      size={32}
                      className="absolute top-0 right-0 text-[#C9A961] opacity-15 transition-all duration-500 group-hover:opacity-30"
                    />

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {[...Array(5)].map((_, s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s < Math.round(review.rating)
                              ? 'fill-[#C9A961] text-[#C9A961]'
                              : 'fill-gray-200 text-gray-200'
                          }
                        />
                      ))}
                      <span className="ml-2 text-xs font-semibold text-gray-500">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Title */}
                    {review.title && (
                      <h4 className="font-heading font-bold text-sm text-[#1B5E20] mb-2 line-clamp-1">
                        {review.title}
                      </h4>
                    )}

                    {/* Body */}
                    {review.body ? (
                      <p className="text-sm text-[#1A1A1A] leading-relaxed mb-4 line-clamp-2">
                        &ldquo;{review.body}&rdquo;
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic mb-4">
                        No comment provided.
                      </p>
                    )}

                    {/* Product Link */}
                    {review.products && (
                      <Link
                        href={`/product/${review.products.slug}`}
                        className="text-xs text-[#1B5E20] font-medium hover:underline mb-3 inline-flex items-center gap-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-current" />
                        {review.products.name}
                      </Link>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {review.customer_name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1 truncate">
                            {review.customer_name || 'Anonymous'}
                            {review.is_verified && (
                              <CheckCircle2
                                size={12}
                                className="text-[#1B5E20] shrink-0"
                              />
                            )}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {!loading && !error && reviews.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white font-medium rounded-md transition-all duration-300 text-sm sm:text-base group"
            >
              Shop & Share Your Experience
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        @keyframes marquee-custom {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee-custom {
          animation: marquee-custom 60s linear infinite;
        }

        .marquee-container:hover .animate-marquee-custom {
          animation-play-state: paused;
        }

        /* ✅ Simple hover — only lift + shadow + gold border, NO background */
        .review-card-simple {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .review-card-simple:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px -12px rgba(27, 94, 32, 0.15);
          border-color: #c9a961;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-custom {
            animation: none !important;
          }
          .review-card-simple {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
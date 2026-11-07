'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ReviewModal from './ReviewModal';

interface ReviewSectionProps {
  productId: string;
  initialReviews?: any[];
  productName?: string;
}

export default function ReviewSection({
  productId,
  initialReviews = [],
  productName,
}: ReviewSectionProps) {
  const supabase = createClient();
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Logged-in user ka email nikaalein
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || null);
    });
  }, [supabase]);

  // Reviews fetch karein (hamesha fresh)
  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Reviews fetch error:', error);
    }
    if (data) {
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialReviews.length === 0) {
      fetchReviews();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleModalClose = () => {
    setShowModal(false);
    fetchReviews(); // naya review dikhane ke liye refresh
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-green mb-1">
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(averageRating)
                        ? 'fill-brand-gold text-brand-gold'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-brand-text-muted">
                {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-black text-white font-medium px-5 py-3 rounded-md transition-colors text-sm shrink-0"
        >
          <MessageSquare size={16} />
          Write a Review
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-brand-green" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-brand-text-muted mb-4">
            No reviews yet. Be the first to review this product!
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-black text-white font-medium px-5 py-3 rounded-md transition-colors text-sm"
          >
            <MessageSquare size={16} />
            Write the First Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-medium text-brand-text-dark">
                    {review.customer_name || review.name || 'Anonymous'}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < review.rating
                            ? 'fill-brand-gold text-brand-gold'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-brand-text-muted shrink-0">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.title && (
                <p className="font-medium text-sm text-brand-text-dark mb-1">
                  {review.title}
                </p>
              )}
              <p className="text-sm text-brand-text-muted leading-relaxed">
                {review.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={showModal}
        onClose={handleModalClose}
        userEmail={userEmail}
        productId={productId}
        productName={productName}
      />
    </div>
  );
}
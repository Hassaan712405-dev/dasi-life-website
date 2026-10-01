'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Loader2, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  getProductReviews,
  canUserReviewProduct,
  submitReview,
  ReviewWithProfile,
} from '@/services/reviews/reviewService';

interface ReviewSectionProps {
  productId: string;
  productName: string;
}

export default function ReviewSection({
  productId,
  productName,
}: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Load reviews
  useEffect(() => {
    async function loadReviews() {
      const data = await getProductReviews(productId);
      setReviews(data);
      setLoading(false);
    }
    loadReviews();
  }, [productId]);

  // Check if user can review
  useEffect(() => {
    async function checkCanReview() {
      if (!user) {
        setCanReview(false);
        return;
      }
      const can = await canUserReviewProduct(productId);
      setCanReview(can);
    }
    checkCanReview();
  }, [user, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!body.trim()) {
      setError('Please write a review before submitting.');
      return;
    }

    setSubmitting(true);

    const result = await submitReview(productId, rating, title, body);

    if (!result.success) {
      setError(result.error || 'Failed to submit review.');
      setSubmitting(false);
      return;
    }

    // Refresh reviews
    const data = await getProductReviews(productId);
    setReviews(data);

    setSubmitted(true);
    setSubmitting(false);
    setCanReview(false);

    // Reset form
    setRating(5);
    setTitle('');
    setBody('');
  };

  // Calculate average
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <p className="font-heading font-bold text-5xl text-brand-green mb-2">
            {averageRating.toFixed(1)}
          </p>
          <div className="flex items-center gap-0.5 justify-center md:justify-start mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.round(averageRating)
                    ? 'text-brand-gold fill-brand-gold'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <p className="text-sm text-brand-text-muted">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingCounts.map(({ star, count }) => {
            const percent =
              reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-brand-text-muted w-8">
                  {star}★
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-gold transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="text-sm text-brand-text-muted w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review */}
      {user && canReview && !submitted && (
        <div className="bg-brand-cream rounded-xl border border-gray-200 p-6">
          <h3 className="font-heading font-semibold text-xl text-brand-green mb-5">
            Write a Review
          </h3>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={
                        star <= (hoverRating || rating)
                          ? 'text-brand-gold fill-brand-gold'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Review Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                disabled={submitting}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your experience with this product..."
                required
                rows={4}
                disabled={submitting}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-8 py-3 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Success Message */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <Check size={32} className="text-green-600 mx-auto mb-3" />
          <p className="font-medium text-green-800 mb-1">
            Thank you for your review!
          </p>
          <p className="text-sm text-green-700">
            Your feedback helps other customers.
          </p>
        </div>
      )}

      {/* Not logged in prompt */}
      {!user && (
        <div className="bg-brand-cream rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-brand-text-muted mb-4">
            Please log in to write a review.
          </p>
          <Link href="/login" className="btn-primary inline-flex">
            Sign In
          </Link>
        </div>
      )}

      {/* Logged in but hasn't purchased */}
      {user && !canReview && !submitted && (
        <div className="bg-brand-cream rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-brand-text-muted">
            Only verified buyers can review this product.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="font-heading font-semibold text-xl text-brand-green mb-5">
          Customer Reviews
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 size={24} className="animate-spin text-brand-green mx-auto mb-2" />
            <p className="text-sm text-brand-text-muted">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-brand-text-muted">
              No reviews yet. Be the first to review {productName}!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center font-semibold text-sm">
                      {review.customer_initial}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-brand-green">
                        {review.customer_name}
                      </p>
                      <p className="text-xs text-brand-text-muted">
                        Verified Buyer •{' '}
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? 'text-brand-gold fill-brand-gold'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-medium text-sm text-brand-text-dark mb-2">
                    {review.title}
                  </h4>
                )}

                <p className="text-sm text-brand-text-muted leading-relaxed">
                  {review.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
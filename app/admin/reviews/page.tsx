'use client';

import { useEffect, useState } from 'react';
import { Star, Check, Trash2, Loader2, X, AlertCircle } from 'lucide-react';
import {
  getAllReviews,
  setReviewApproval,
  deleteReview,
  AdminReview,
} from '@/services/admin/reviewAdmin';

const filters = ['All', 'Approved', 'Pending'];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  async function loadReviews() {
    setLoading(true);
    const data = await getAllReviews();
    setReviews(data);
    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, []);

  const handleApprove = async (reviewId: string, approved: boolean) => {
    setProcessing(reviewId);
    const result = await setReviewApproval(reviewId, approved);
    if (result.success) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, is_approved: approved } : r
        )
      );
    }
    setProcessing(null);
  };

  const handleDelete = async (reviewId: string) => {
    setProcessing(reviewId);
    const result = await deleteReview(reviewId);
    if (result.success) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setDeleteConfirm(null);
    }
    setProcessing(null);
  };

  const filteredReviews = reviews.filter((review) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Approved') return review.is_approved;
    if (activeFilter === 'Pending') return !review.is_approved;
    return true;
  });

  const getCount = (filter: string) => {
    if (filter === 'All') return reviews.length;
    if (filter === 'Approved') return reviews.filter((r) => r.is_approved).length;
    if (filter === 'Pending') return reviews.filter((r) => !r.is_approved).length;
    return 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
          Reviews
        </h1>
        <p className="text-sm text-brand-text-muted">
          Moderate customer reviews to maintain authentic Unani feedback.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              activeFilter === filter
                ? 'bg-brand-green text-white'
                : 'bg-white border border-gray-200 text-brand-text-dark hover:border-brand-green hover:text-brand-green'
            }`}
          >
            {filter}
            <span
              className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                activeFilter === filter
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-brand-text-muted'
              }`}
            >
              {getCount(filter)}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Loader2 size={32} className="animate-spin text-brand-green mx-auto mb-3" />
          <p className="text-sm text-brand-text-muted">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Star size={48} className="text-brand-text-muted mx-auto mb-4" />
          <p className="text-brand-text-muted">
            {reviews.length === 0
              ? 'No reviews yet.'
              : 'No reviews found in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-200 p-5 md:p-6"
            >
              {/* Top Row */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    {review.customer_initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text-dark">
                      {review.customer_name}
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    review.is_approved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {review.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>

              {/* Product + Rating */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <p className="text-xs text-brand-text-muted">
                  Product:{' '}
                  <strong className="text-brand-text-dark">
                    {review.product_name}
                  </strong>
                </p>
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
                <p className="text-sm font-medium text-brand-text-dark mb-2">
                  {review.title}
                </p>
              )}

              {review.body && (
                <p className="text-sm text-brand-text-muted leading-relaxed italic mb-4">
                  "{review.body}"
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                {!review.is_approved ? (
                  <button
                    type="button"
                    onClick={() => handleApprove(review.id, true)}
                    disabled={processing === review.id}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-green border border-brand-green rounded-md px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors disabled:opacity-60"
                  >
                    {processing === review.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Check size={12} />
                    )}
                    Approve
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApprove(review.id, false)}
                    disabled={processing === review.id}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 border border-orange-600 rounded-md px-3 py-1.5 hover:bg-orange-600 hover:text-white transition-colors disabled:opacity-60"
                  >
                    Unapprove
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setDeleteConfirm(review.id)}
                  disabled={processing === review.id}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 border border-red-600 rounded-md px-3 py-1.5 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-60"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-brand-text-muted text-center">
        Showing {filteredReviews.length} of {reviews.length} reviews
      </p>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-brand-text-dark mb-1">
                    Delete Review?
                  </h3>
                  <p className="text-sm text-brand-text-muted">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="text-brand-text-muted hover:text-brand-text-dark transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border-2 border-gray-300 text-brand-text-dark font-medium py-2.5 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={processing === deleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-md transition-colors text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {processing === deleteConfirm ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Review'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
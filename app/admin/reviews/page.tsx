'use client';

import { useEffect, useState } from 'react';
import { Star, Check, Trash2, Loader2, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
          Reviews
        </h1>
        <p className="text-xs sm:text-sm text-brand-text-muted">
          Moderate customer reviews to maintain authentic feedback.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex flex-wrap items-center gap-2"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              activeFilter === filter
                ? 'bg-brand-green text-white'
                : 'bg-white border border-gray-200 text-brand-text-dark hover:border-brand-green hover:text-brand-green'
            }`}
          >
            {filter}
            <span
              className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                activeFilter === filter
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-brand-text-muted'
              }`}
            >
              {getCount(filter)}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Loader2 size={28} className="animate-spin text-brand-green mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-brand-text-muted">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
          <Star size={40} className="text-brand-text-muted mx-auto mb-4" />
          <p className="text-xs sm:text-sm text-brand-text-muted">
            {reviews.length === 0 ? 'No reviews yet.' : 'No reviews in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6"
            >
              {/* Top */}
              <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-green text-white flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0">
                    {review.customer_initial}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-brand-text-dark">
                      {review.customer_name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-brand-text-muted">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                    review.is_approved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {review.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>

              {/* Product + Rating */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <p className="text-[10px] sm:text-xs text-brand-text-muted">
                  Product:{' '}
                  <strong className="text-brand-text-dark">{review.product_name}</strong>
                </p>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < review.rating ? 'text-brand-gold fill-brand-gold' : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
              </div>

              {review.title && (
                <p className="text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                  {review.title}
                </p>
              )}

              {review.body && (
                <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed italic mb-3 sm:mb-4">
                  "{review.body}"
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                {!review.is_approved ? (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleApprove(review.id, true)}
                    disabled={processing === review.id}
                    className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-brand-green border border-brand-green rounded-md px-2.5 sm:px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors disabled:opacity-60"
                  >
                    {processing === review.id ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Check size={11} />
                    )}
                    Approve
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleApprove(review.id, false)}
                    disabled={processing === review.id}
                    className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-orange-600 border border-orange-600 rounded-md px-2.5 sm:px-3 py-1.5 hover:bg-orange-600 hover:text-white transition-colors disabled:opacity-60"
                  >
                    Unapprove
                  </motion.button>
                )}

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDeleteConfirm(review.id)}
                  disabled={processing === review.id}
                  className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-red-600 border border-red-600 rounded-md px-2.5 sm:px-3 py-1.5 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-60"
                >
                  <Trash2 size={11} />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-[10px] sm:text-xs text-brand-text-muted text-center">
        Showing {filteredReviews.length} of {reviews.length} reviews
      </p>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <AlertCircle size={18} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark mb-1">
                      Delete Review?
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-text-muted">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="text-brand-text-muted hover:text-brand-text-dark transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border-2 border-gray-300 text-brand-text-dark font-medium py-2.5 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={processing === deleteConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-md transition-colors text-xs sm:text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {processing === deleteConfirm ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
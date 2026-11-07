'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  MessageSquare,
  ShoppingBag,
  ChevronDown,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/types/database';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
  productId?: string;     // ✅ ADDED
  productName?: string;   // ✅ ADDED
}

export default function ReviewModal({
  isOpen,
  onClose,
  userEmail,
  productId,
  productName,
}: ReviewModalProps) {
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail(userEmail || '');
      setRating(5);
      setComment('');
      // ✅ Agar product page se aaya hai to wo product pehle se selected ho
      setSelectedProductId(productId || '');
      setSuccess(false);
      setError('');

      const fetchProducts = async () => {
        const { data, error } = await supabase
          .from('products')
          .select('id, name')
          .eq('is_active', true)
          .order('name');

        if (data) setProducts(data as Product[]);
        if (error) console.error('Error fetching products:', error);
      };
      fetchProducts();
    }
  }, [isOpen, userEmail, supabase, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId || !name.trim() || !comment.trim()) {
      setError('Please select a product and fill in all required fields.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let isVerified = false;
      if (email.trim()) {
        const { data: orderData } = await supabase
          .from('orders')
          .select('id, order_items!inner(product_id)')
          .eq('customer_email', email.trim().toLowerCase())
          .eq('order_items.product_id', selectedProductId)
          .limit(1);
        if (orderData && orderData.length > 0) isVerified = true;
      }

      const { error: dbError } = await supabase.from('reviews').insert({
        product_id: selectedProductId,
        user_id: user?.id || null,
        name: name.trim(),
        customer_name: name.trim(),
        email: email.trim() || null,
        rating,
        body: comment.trim(),
        is_approved: false,
        verified_purchase: isVerified,
      });

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => onClose(), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitting) return;
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
          onClick={handleBackdropClick}
        />

        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            x: shake ? [0, -6, 6, -6, 6, 0] : 0,
          }}
          exit={{ scale: 0.96, opacity: 0, y: 16 }}
          transition={
            shake
              ? { duration: 0.4 }
              : ({ type: 'spring', stiffness: 300, damping: 28 } as const)
          }
          className="bg-white rounded-2xl w-full max-w-[420px] shadow-[0_24px_70px_-20px_rgba(0,0,0,0.35)] relative overflow-hidden flex flex-col max-h-[90dvh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-7 sm:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-sm text-gray-500">
                  Your review has been submitted successfully.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-[#1B5E20] rounded-full flex items-center justify-center shadow-sm relative z-10 mb-4">
                    <MessageSquare size={28} className="text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-1 text-center font-heading">
                    Write a Review
                  </h3>
                  <p className="text-sm text-slate-500 text-center">
                    {productName
                      ? `Reviewing: ${productName}`
                      : 'Share your experience with us'}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-md flex items-start gap-2 mb-5">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <ShoppingBag
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1B5E20] transition-colors pointer-events-none z-10"
                    />
                    <select
                      required
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      disabled={!!productId}  // ✅ Agar product page se aaya hai to lock
                      className="w-full h-[48px] bg-slate-50 border border-slate-300 rounded-[5px] pl-11 pr-10 text-[14px] text-slate-900 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B5E20] focus:border-[#1B5E20] appearance-none cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>
                        Select a Product
                      </option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1B5E20] transition-colors"
                      />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full h-[48px] bg-slate-50 border border-slate-300 rounded-[5px] pl-11 pr-4 text-[14px] placeholder:text-[14px] text-slate-900 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B5E20] focus:border-[#1B5E20]"
                      />
                    </div>
                    <div className="relative group">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1B5E20] transition-colors"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email (Optional)"
                        className="w-full h-[48px] bg-slate-50 border border-slate-300 rounded-[5px] pl-11 pr-4 text-[14px] placeholder:text-[14px] text-slate-900 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B5E20] focus:border-[#1B5E20]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-start pt-1">
                    <label className="text-sm font-medium text-slate-700 mb-2">
                      Your Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform focus:outline-none"
                        >
                          <Star
                            size={30}
                            className={
                              star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your review here..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-[5px] p-4 text-[14px] placeholder:text-[14px] text-slate-900 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B5E20] focus:border-[#1B5E20] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative overflow-hidden w-full h-[48px] bg-[#1B5E20] text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center gap-2 z-[1] before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-full before:w-0 before:bg-black before:transition-all before:duration-300 before:rounded-md before:z-[-1] hover:before:w-full disabled:opacity-60 disabled:before:w-0"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        'Submit Review'
                      )}
                    </span>
                  </button>
                </form>

                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="mt-3 w-full h-11 flex items-center justify-center text-sm text-slate-600 font-medium hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
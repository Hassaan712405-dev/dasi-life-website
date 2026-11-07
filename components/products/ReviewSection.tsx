'use client';
import { useState } from 'react';
import { Star, MessageSquarePlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ReviewSection({ productId, initialReviews }: { productId: string; initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const { data, error } = await supabase.from('reviews').insert({
      product_id: productId,
      name: formData.name,
      email: formData.email || null,
      rating: formData.rating,
      comment: formData.comment,
      verified_purchase: false, // Server side logic baad mein
    }).select().single();

    setSubmitting(false);
    if (!error && data) {
      setReviews([data, ...reviews]);
      setShowForm(false);
      setFormData({ name: '', email: '', rating: 5, comment: '' });
    }
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-heading font-bold text-brand-green">Customer Reviews</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-md hover:bg-black transition-colors text-sm font-medium"
        >
          <MessageSquarePlus size={18} /> Write a Review
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Your Name *" required className="border p-2 rounded" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email (optional, for verified badge)" className="border p-2 rounded" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Rating:</span>
            {[1,2,3,4,5].map(star => (
              <Star key={star} size={24} className={star <= formData.rating ? 'fill-yellow-400 text-yellow-400 cursor-pointer' : 'text-gray-300 cursor-pointer'} onClick={() => setFormData({...formData, rating: star})} />
            ))}
          </div>
          <textarea placeholder="Your Review *" required rows={3} className="w-full border p-2 rounded" onChange={(e) => setFormData({...formData, comment: e.target.value})} />
          <button type="submit" disabled={submitting} className="bg-brand-green text-white px-6 py-2 rounded font-medium disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm">{review.name}</span>
              {review.verified_purchase && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">Verified Purchase</span>}
              <div className="flex text-yellow-400 ml-auto">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-gray-300'} />)}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{review.comment}</p>
            <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
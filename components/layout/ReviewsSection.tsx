import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Zainab K.',
    initial: 'Z',
    timeAgo: '2 days ago',
    rating: 5,
    text: 'The Sultani Herbal Majoon is incredible. Within a week, my daily afternoon fatigue disappeared completely. I feel significantly more active and focused during my work.',
  },
  {
    name: 'Bilal M.',
    initial: 'B',
    timeAgo: '1 week ago',
    rating: 5,
    text: "I was skeptical about herbal capsules, but the Joint & Bone formula has really eased my mother's daily knee stiffness. Authentic Unani medicine with high standards.",
  },
  {
    name: 'Ayesha R.',
    initial: 'A',
    timeAgo: '2 weeks ago',
    rating: 5,
    text: 'Highly recommend the Sultani Herbal Hair Oil. It has a beautiful earthy aroma and has dramatically reduced my hair fall. My hair feels much thicker and softer now.',
  },
  {
    name: 'Hamza T.',
    initial: 'H',
    timeAgo: '3 weeks ago',
    rating: 5,
    text: 'Amazing quality and fast delivery. The Sultani Majoon feels premium and my energy levels have noticeably improved.',
  },
  {
    name: 'Sana A.',
    initial: 'S',
    timeAgo: '1 month ago',
    rating: 5,
    text: 'Excellent products and great customer service. The hair oil is now a permanent part of my weekly routine.',
  },
  {
    name: 'Usman N.',
    initial: 'U',
    timeAgo: '1 month ago',
    rating: 5,
    text: 'Authentic Unani formulations. The Joint & Bone capsules have helped my father significantly with his knee pain.',
  },
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col w-[320px] md:w-[380px] shrink-0">
      {/* Stars + Time */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className="text-brand-gold fill-brand-gold"
            />
          ))}
        </div>
        <span className="text-xs text-brand-text-muted">{review.timeAgo}</span>
      </div>

      {/* Review Text */}
      <p className="text-sm text-brand-text-muted leading-relaxed italic mb-5 flex-1">
        "{review.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center font-semibold text-sm shrink-0">
          {review.initial}
        </div>
        <div>
          <p className="font-semibold text-sm text-brand-green">{review.name}</p>
          <p className="text-xs text-brand-text-muted">Verified Buyer</p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  // Duplicate reviews for seamless infinite loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="bg-brand-cream py-12 md:py-16 overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">
            Customer Reviews
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
            Loved by Thousands
          </h2>
        </div>
      </div>

      {/* Marquee Container — Full Width */}
      <div className="marquee-container relative w-full">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-brand-cream to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-brand-cream to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Reviews */}
        <div className="flex gap-6 animate-marquee w-max">
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
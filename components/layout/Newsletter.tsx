'use client';

import { useState } from 'react';
import FadeIn from '@/components/motion/FadeIn';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="bg-brand-green py-10 sm:py-12 md:py-16">
      <div className="container-custom">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-brand-gold font-semibold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase mb-2 sm:mb-3">
              Stay Connected with Nature
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-3 sm:mb-4">
              Join the Dasi Life Community
            </h2>

            <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto">
              Subscribe to receive traditional wellness tips, early access to
              new collections, and special community discounts.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-md text-sm text-brand-text-dark bg-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <button
                type="submit"
                className="bg-brand-gold hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm whitespace-nowrap"
              >
                {submitted ? 'Subscribed ✓' : 'Subscribe'}
              </button>
            </form>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
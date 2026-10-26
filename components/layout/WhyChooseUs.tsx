'use client';

import { Leaf, Truck, Wallet, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const BENEFITS = [
  {
    icon: Leaf,
    title: 'Natural & Organic',
    description:
      'Discover products inspired by nature and thoughtful herbal traditions.',
  },
  {
    icon: Truck,
    title: 'Free Home Delivery',
    description:
      'Enjoy convenient home delivery with a simple shopping experience.',
  },
  {
    icon: Wallet,
    title: 'Cash on Delivery',
    description:
      'Pay upon delivery for a convenient shopping experience.',
  },
  {
    icon: Headphones,
    title: 'Here for You',
    description:
      "Need assistance? We're here to help make your shopping experience easier.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20 bg-[#FDFBF7] relative overflow-hidden">

      {/* Subtle decorative botanical accent */}
      <div className="absolute top-10 right-0 w-40 h-40 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#1B5E20">
          <path d="M50 10 Q30 30 30 50 Q30 70 50 90 Q70 70 70 50 Q70 30 50 10 Z" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <p className="text-[#C9A961] font-semibold text-[11px] sm:text-xs tracking-[0.25em] uppercase mb-3">
            Our Promise
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#1B5E20] mb-4">
            Why Choose Dasi Life?
          </h2>
          <p className="text-brand-text-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Thoughtfully chosen products, convenient shopping, and friendly support—all in one place.
          </p>
          <div className="w-16 h-[2px] bg-[#C9A961] mx-auto mt-6" />
        </div>

        {/* ✅ 4 Benefit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="benefit-card group relative bg-white rounded-2xl p-6 sm:p-7 border border-[#EBE4D6] flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="benefit-icon-wrap w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#1B5E20]/8 flex items-center justify-center mb-5 transition-all duration-500 ease-out">
                  <div className="benefit-icon">
                    <Icon
                      size={28}
                      className="text-[#1B5E20]"
                      strokeWidth={1.7}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#1B5E20] mb-3 transition-colors duration-500">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-brand-text-muted leading-relaxed">
                  {benefit.description}
                </p>

                {/* Subtle gold accent line at bottom */}
                <div className="benefit-accent-line w-8 h-[2px] bg-[#C9A961]/40 mt-5 transition-all duration-500 ease-out" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ✅ Ultra-smooth hover CSS */}
      <style jsx global>{`
        /* === Benefit Card hover — Lift + Shadow + Border (NO bg change) === */
        .benefit-card {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 1px 3px rgba(27, 94, 32, 0.04),
                      0 1px 2px rgba(27, 94, 32, 0.06);
          will-change: transform, box-shadow;
        }

        .benefit-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -12px rgba(27, 94, 32, 0.15),
                      0 8px 16px -8px rgba(201, 169, 97, 0.1);
          border-color: #C9A961;
        }

        /* === Icon animation on hover === */
        .benefit-card:hover .benefit-icon-wrap {
          background-color: #1B5E20;
          transform: scale(1.08);
          box-shadow: 0 8px 20px -6px rgba(27, 94, 32, 0.35);
        }

        .benefit-card:hover .benefit-icon {
          transform: scale(1.15) rotate(-5deg);
        }

        .benefit-card:hover .benefit-icon svg {
          color: #FFFFFF;
        }

        .benefit-icon {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .benefit-icon svg {
          transition: color 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* === Accent line grows on hover === */
        .benefit-card:hover .benefit-accent-line {
          width: 24px;
          background-color: #C9A961;
        }

        /* === Reduced motion === */
        @media (prefers-reduced-motion: reduce) {
          .benefit-card,
          .benefit-card:hover,
          .benefit-icon,
          .benefit-icon-wrap,
          .benefit-accent-line {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
'use client';

import { Leaf, ShieldCheck, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/motion/FadeIn';

const DEFAULT_BENEFITS = [
  'Premium herbal formulation',
  'Carefully selected ingredients',
  'Traditional Unani inspiration',
  'Quality-focused preparation',
  'Easy daily use',
];

interface ProductBenefitsProps {
  benefits?: string[];
}

export default function ProductBenefits({ benefits }: ProductBenefitsProps) {
  const items = benefits && benefits.length > 0 ? benefits : DEFAULT_BENEFITS;

  return (
    <FadeIn>
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-5 sm:mb-6 md:mb-8">
          Why Choose This Product
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {items.map((benefit, index) => {
            const icons = [Leaf, ShieldCheck, Sparkles, Heart, CheckCircle2];
            const Icon = icons[index % icons.length];

            return (
              <div
                key={index}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4 sm:p-5"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-brand-green" />
                </div>
                <p className="text-xs sm:text-sm md:text-base font-medium text-brand-text-dark leading-relaxed">
                  {benefit}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}
'use client';

import { Leaf, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const BADGES = [
  {
    icon: Leaf,
    title: '100% Natural',
    subtitle: 'Herbal Ingredients',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    subtitle: 'Safe & Reliable',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    subtitle: 'Across Pakistan',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    subtitle: 'Hassle Free',
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-[#FDFBF7] py-8 border-y border-[#EBE4D6]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {BADGES.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex items-center gap-3 justify-start md:justify-center">
                <div className="w-10 h-10 rounded-full bg-[#EBE4D6]/50 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-[#1B5E20]" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-brand-text-dark">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-brand-text-muted">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
'use client';

import { Leaf, BookOpen, ShieldCheck, Truck } from 'lucide-react';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

const badges = [
  {
    icon: Leaf,
    title: '100% Organic',
    subtitle: 'Wildcrafted herbs',
  },
  {
    icon: BookOpen,
    title: 'Traditional Recipes',
    subtitle: 'Authentic Unani medicine',
  },
  {
    icon: ShieldCheck,
    title: 'Third-Party Tested',
    subtitle: 'Zero chemicals',
  },
  {
    icon: Truck,
    title: 'COD Active',
    subtitle: 'Nationwide delivery',
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-brand-cream-dark border-y border-brand-green/10">
      <div className="container-custom py-5 sm:py-6 md:py-8">
        <Stagger
          staggerDelay={0.08}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <StaggerItem key={index}>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center">
                    <Icon
                      size={16}
                      className="text-brand-green sm:hidden"
                      strokeWidth={2}
                    />
                    <Icon
                      size={20}
                      className="text-brand-green hidden sm:block md:hidden"
                      strokeWidth={2}
                    />
                    <Icon
                      size={22}
                      className="text-brand-green hidden md:block"
                      strokeWidth={2}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs sm:text-sm md:text-base text-brand-green leading-tight truncate">
                      {badge.title}
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted leading-tight mt-0.5 line-clamp-1">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
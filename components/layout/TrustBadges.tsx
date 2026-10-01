import { Leaf, BookOpen, ShieldCheck, Truck } from 'lucide-react';

const badges = [
  {
    icon: Leaf,
    title: '100% Organic',
    subtitle: 'Certified wildcrafted herbs',
  },
  {
    icon: BookOpen,
    title: 'Traditional Recipes',
    subtitle: 'Authentic Unani medicine',
  },
  {
    icon: ShieldCheck,
    title: 'Third-Party Tested',
    subtitle: 'Zero harmful chemicals',
  },
  {
    icon: Truck,
    title: 'Nationwide Shipping',
    subtitle: 'Cash on delivery active',
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-brand-cream-dark border-y border-brand-green/10">
      <div className="container-custom py-6 md:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center">
                  <Icon
                    size={20}
                    className="text-brand-green"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-brand-green leading-tight">
                    {badge.title}
                  </p>
                  <p className="text-xs md:text-sm text-brand-text-muted leading-tight mt-0.5">
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
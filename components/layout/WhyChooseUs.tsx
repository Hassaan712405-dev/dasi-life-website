import { Leaf, Truck, ShieldCheck } from 'lucide-react';
import FadeIn from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

const features = [
  {
    icon: Leaf,
    title: 'Pure Ingredients',
    description:
      'We source our raw herbs exclusively from clean mountain valleys and organic farms to guarantee absolute wellness.',
  },
  {
    icon: Truck,
    title: 'COD + Free Delivery',
    description:
      'Enjoy stress-free shopping with our secure Cash on Delivery option and FREE nationwide delivery across Pakistan.',
  },
  {
    icon: ShieldCheck,
    title: 'Lab Verified',
    description:
      'All batches are thoroughly evaluated by certified third-party laboratories for premium safety and potency.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <div className="container-custom">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="text-brand-gold font-semibold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase mb-2 sm:mb-3">
              The Dasi Life Standard
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
              Why Choose Us
            </h2>
          </div>
        </FadeIn>

        {/* Features Grid */}
        <Stagger
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={index}>
                <div className="bg-[#FAF8F5] rounded-xl border border-gray-200 p-5 sm:p-6 md:p-8 hover:shadow-xl hover:border-brand-green/30 transition-all duration-500 h-full flex flex-col items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-brand-green/10 flex items-center justify-center mb-4 sm:mb-5">
                    <Icon
                      size={20}
                      className="text-brand-green md:hidden"
                      strokeWidth={2}
                    />
                    <Icon
                      size={24}
                      className="text-brand-green hidden md:block"
                      strokeWidth={2}
                    />
                  </div>

                  <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-2 sm:mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
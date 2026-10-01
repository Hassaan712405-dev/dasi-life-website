import { Leaf, Truck, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Pure Ingredients',
    description:
      'We source our raw herbs exclusively from clean mountain valleys and organic farms to guarantee absolute wellness.',
  },
  {
    icon: Truck,
    title: 'Cash on Delivery',
    description:
      'Enjoy stress-free shopping with our secure Cash on Delivery option available all across Pakistan.',
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
    <section className="bg-white py-12 md:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">
            The Dasi Life Standard
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
            Why Choose Us
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-[#FAF8F5] rounded-xl border border-gray-200 p-6 md:p-8 hover:shadow-xl hover:border-brand-green/30 transition-shadow duration-500 flex flex-col items-start"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-brand-green/10 flex items-center justify-center mb-5">
                  <Icon size={24} className="text-brand-green" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-brand-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
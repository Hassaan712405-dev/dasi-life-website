import Link from 'next/link';
import { Leaf, BookOpen, ShieldCheck } from 'lucide-react';

const coreValues = [
  {
    icon: Leaf,
    title: 'Natural Purity',
    description:
      'We source our raw herbs exclusively from pristine high-altitude mountain valleys, selecting only wildcrafted botanicals.',
  },
  {
    icon: BookOpen,
    title: 'Traditional Wisdom',
    description:
      'Formulations are crafted by expert Hakims utilizing authentic, unmodified Unani-Tibb apothecary transcripts.',
  },
  {
    icon: ShieldCheck,
    title: 'Modern Quality',
    description:
      'All batches undergo rigorous modern evaluation, certified third-party testing, and zero chemical additives.',
  },
];

const team = [
  {
    name: 'Hakim Tariq Mahmood',
    role: 'HEAD UNANI CONSULTANT',
    description:
      'Over 30 years researching traditional Unani Tibb formulations and botanical pharmacopoeias.',
    imageUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop&q=80',
  },
  {
    name: 'Dr. Ayesha Alvi',
    role: 'LEAD BOTANIST & QUALITY OFFICER',
    description:
      'Ph.D in Ethnobotany, verifying natural extract percentages and laboratory safety profiles.',
    imageUrl:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=600&fit=crop&q=80',
  },
  {
    name: 'Kamran Shah',
    role: 'FOUNDER & SOURCING LEAD',
    description:
      'Committed to transparent wildcrafting, traveling northern Pakistan valleys for raw elements.',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&q=80',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80')",
          }}
        ></div>
        {/* Green Overlay */}
        <div className="absolute inset-0 bg-brand-green/85"></div>

        {/* Content */}
        <div className="container-custom relative text-center">
          <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-4">
            Our Heritage
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-5">
            Our Story
          </h1>
          <p className="text-white/85 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Pioneering organic Unani remedies in Pakistan, prepared according to
            natural lore and validated by modern laboratory standards.
          </p>
        </div>
      </section>

      {/* Two-Column Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg bg-brand-cream aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80"
                alt="Pristine mountain valley where Dasi Life herbs are sourced"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Content */}
            <div>
              <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-4">
                The Unani Tradition
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green leading-tight mb-6">
                Reviving Ancient Wisdom for Modern Lifestyles
              </h2>
              <p className="text-sm md:text-base text-brand-text-muted leading-relaxed mb-4">
                Dasi Life is dedicated to reviving centuries-old herbal solutions
                for modern lifestyles. We believe that wellness lies in returning
                to natural remedies crafted with absolute purity. Our signature
                Unani preparations utilize premium cold-pressed herbs, raw honey,
                and organic minerals prepared according to authentic texts.
              </p>
              <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
                Our quest is to replace synthetic, temporary fixes with
                wholesome, organic elixirs that target root concerns and promote
                daily vigor, resilience, and balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-brand-cream-dark py-12 md:py-20">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-3">
              Foundations of Trust
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
              Our Core Values
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 hover:shadow-xl hover:border-brand-green/30 transition-shadow duration-500"
                >
                  <div className="w-12 h-12 rounded-lg bg-brand-green/10 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-brand-green" strokeWidth={2} />
                  </div>
                  <h3 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-brand-text-muted leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Herbal Pioneers */}
      <section className="bg-white py-12 md:py-20">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-3">
              Experts Behind the Recipes
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
              Our Herbal Pioneers
            </h2>
          </div>

          {/* Team Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-brand-cream rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-500"
              >
                <div className="aspect-square overflow-hidden bg-brand-cream-dark">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-heading font-semibold text-lg md:text-xl text-brand-green mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-gold font-semibold text-xs tracking-wide uppercase mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-brand-text-muted leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-green py-14 md:py-20">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-4">
            Embark on Natural Healing
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-5">
            Experience the Dasi Life
          </h2>
          <p className="text-white/85 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Reclaim your vitality and balance. Explore our authentic hand-blended
            elixirs, oils, and natural supplements.
          </p>
          <Link
            href="/shop"
            className="inline-flex bg-brand-gold hover:bg-black text-white font-medium px-8 py-3.5 rounded-md transition-colors text-base"
          >
            Shop Bestsellers Now
          </Link>
        </div>
      </section>
    </div>
  );
}
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, BookOpen, ShieldCheck, Heart, Award, Sparkles } from 'lucide-react';
import FadeIn from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

// ============================================
// CORE VALUES
// ============================================
const coreValues = [
  {
    icon: Leaf,
    title: 'Natural Purity',
    description:
      'We source our raw herbs exclusively from pristine high-altitude mountain valleys, selecting only wildcrafted botanicals that nature perfected over centuries.',
  },
  {
    icon: BookOpen,
    title: 'Traditional Wisdom',
    description:
      'Our formulations are crafted by expert Hakims utilizing authentic, unmodified Unani-Tibb apothecary transcripts preserved across generations.',
  },
  {
    icon: ShieldCheck,
    title: 'Modern Quality',
    description:
      'Every batch undergoes rigorous modern evaluation, certified third-party testing, and is guaranteed free from chemical additives or synthetic fillers.',
  },
];

// ============================================
// MILESTONES
// ============================================
const milestones = [
  {
    year: '2018',
    title: 'The Beginning',
    description:
      'Dasi Life was founded with a single mission — to bring authentic Unani wellness to modern Pakistani households.',
  },
  {
    year: '2020',
    title: 'Ethical Sourcing',
    description:
      'Established direct partnerships with wildcrafters across Hunza, Swat, and Kashmir valleys for premium herb sourcing.',
  },
  {
    year: '2022',
    title: 'Lab Certification',
    description:
      'Achieved third-party lab certification for all formulations, setting new standards for herbal product quality in Pakistan.',
  },
  {
    year: '2024',
    title: 'Growing Community',
    description:
      'Thousands of families now trust Dasi Life for their daily wellness needs.',
  },
];

// ============================================
// PROMISES
// ============================================
const promises = [
  {
    icon: Heart,
    title: 'Root Concerns, Not Symptoms',
    description:
      'Our formulations target the underlying cause of imbalance — not temporary relief.',
  },
  {
    icon: Award,
    title: 'Zero Compromise on Purity',
    description:
      'No fillers, no synthetics, no shortcuts. Only what nature provides, prepared with respect.',
  },
  {
    icon: Sparkles,
    title: 'Transparent & Honest',
    description:
      'Every ingredient is listed. Every source is traceable. Every claim is backed by tradition.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* HERO SECTION */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80"
          alt="Herbal wellness background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/95 via-brand-green/85 to-brand-green-dark/95"></div>

        <FadeIn>
          <div className="container-custom relative text-center max-w-3xl mx-auto">
            <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4 sm:mb-5">
              Our Heritage
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.1] mb-5 sm:mb-6">
              Our Story
            </h1>
            <div className="w-16 sm:w-20 h-0.5 bg-brand-gold mx-auto mb-5 sm:mb-6"></div>
            <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Pioneering organic Unani remedies in Pakistan — prepared according
              to ancient wisdom, validated by modern science.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* STORY SECTION */}
      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
            <FadeIn>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
                  alt="Pristine mountain valley where Dasi Life herbs are sourced"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-3 sm:mb-4">
                  The Unani Tradition
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-brand-green leading-tight mb-5 sm:mb-6">
                  Reviving Ancient Wisdom for Modern Living
                </h2>
                <div className="w-12 h-0.5 bg-brand-gold mb-5 sm:mb-6"></div>

                <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed mb-4">
                  Dasi Life is dedicated to reviving centuries-old herbal
                  solutions for modern lifestyles. We believe that true wellness
                  lies in returning to natural remedies — crafted with absolute
                  purity and rooted in the timeless science of Unani-Tibb.
                </p>

                <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed mb-4">
                  Our signature preparations utilize premium cold-pressed herbs,
                  raw mountain honey, and organic minerals — prepared according
                  to authentic Unani texts that have guided Hakims for over a
                  thousand years.
                </p>

                <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
                  Our mission is simple: replace synthetic, temporary fixes with
                  wholesome organic elixirs that address root concerns and
                  promote lasting vitality, resilience, and balance.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-brand-cream-dark py-12 sm:py-16 md:py-24">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
              <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-3 sm:mb-4">
                Foundations of Trust
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-brand-green mb-4">
                Our Core Values
              </h2>
              <div className="w-16 h-0.5 bg-brand-gold mx-auto mb-5"></div>
              <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed">
                Three principles guide every formulation we create — from the
                mountain valleys where we source to the final product in your
                hands.
              </p>
            </div>
          </FadeIn>

          <Stagger
            staggerDelay={0.12}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-7"
          >
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <StaggerItem key={index}>
                  <div className="group bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 hover:shadow-2xl hover:border-brand-green/20 transition-all duration-500 h-full">
                    <div className="w-14 h-14 rounded-xl bg-brand-green/10 flex items-center justify-center mb-5 group-hover:bg-brand-green group-hover:scale-110 transition-all duration-500">
                      <Icon
                        size={24}
                        className="text-brand-green group-hover:text-white transition-colors duration-500"
                        strokeWidth={2}
                      />
                    </div>
                    <h3 className="font-heading font-semibold text-xl sm:text-2xl text-brand-green mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-brand-text-muted leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* MILESTONES / TIMELINE */}
      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
              <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-3 sm:mb-4">
                Our Journey
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-brand-green mb-4">
                Milestones That Shaped Us
              </h2>
              <div className="w-16 h-0.5 bg-brand-gold mx-auto"></div>
            </div>
          </FadeIn>

          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-brand-gold/30 -translate-x-1/2"></div>

            <Stagger staggerDelay={0.15} className="space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => (
                <StaggerItem key={index}>
                  <div
                    className={`relative md:grid md:grid-cols-2 md:gap-8 items-center ${
                      index % 2 === 0 ? '' : 'md:direction-rtl'
                    }`}
                  >
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-4 h-4 rounded-full bg-brand-gold ring-4 ring-white"></div>
                    </div>

                    <div
                      className={`${
                        index % 2 === 0
                          ? 'md:text-right md:pr-12'
                          : 'md:col-start-2 md:pl-12'
                      }`}
                    >
                      <div className="bg-brand-cream rounded-xl p-5 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <p className="text-brand-gold font-bold text-2xl sm:text-3xl font-heading mb-2">
                          {milestone.year}
                        </p>
                        <h3 className="font-heading font-semibold text-lg sm:text-xl text-brand-green mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-brand-text-muted leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* PROMISES */}
      <section className="bg-brand-cream-dark py-12 sm:py-16 md:py-24">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
              <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-3 sm:mb-4">
                What We Stand For
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-brand-green mb-4">
                Our Promise to You
              </h2>
              <div className="w-16 h-0.5 bg-brand-gold mx-auto"></div>
            </div>
          </FadeIn>

          <Stagger
            staggerDelay={0.12}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-7 max-w-5xl mx-auto"
          >
            {promises.map((promise, index) => {
              const Icon = promise.icon;
              return (
                <StaggerItem key={index}>
                  <div className="text-center bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-500 h-full">
                    <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-5">
                      <Icon size={24} className="text-brand-gold" strokeWidth={2} />
                    </div>
                    <h3 className="font-heading font-semibold text-lg sm:text-xl text-brand-green mb-3">
                      {promise.title}
                    </h3>
                    <p className="text-sm text-brand-text-muted leading-relaxed">
                      {promise.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <FadeIn>
        <section className="bg-gradient-to-br from-brand-green via-brand-green-light to-brand-green-dark py-14 sm:py-16 md:py-20 lg:py-24">
          <div className="container-custom text-center max-w-2xl mx-auto">
            <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-4 sm:mb-5">
              Embark on Natural Healing
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-5 sm:mb-6">
              Experience the Dasi Life
            </h2>
            <div className="w-16 h-0.5 bg-brand-gold mx-auto mb-5 sm:mb-6"></div>
            <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto">
              Reclaim your vitality and balance. Explore our authentic
              hand-blended elixirs, oils, and natural supplements.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-brand-gold hover:bg-white hover:text-brand-green text-white font-semibold px-8 sm:px-10 py-3.5 sm:py-4 rounded-md transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-2xl"
            >
              Shop Bestsellers Now
            </Link>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
import Link from 'next/link';
import FadeIn from '@/components/motion/FadeIn';

export default function RootedSection() {
  return (
    <section className="bg-brand-cream py-10 sm:py-12 md:py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          
          {/* Left Side — Image */}
          <FadeIn delay={0.1} x={-30} y={0}>
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <img
                  src="/images/product-majoon.png"
                  alt="Dasi Life — Rooted in tradition, proven by science"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </FadeIn>

          {/* Right Side — Text */}
          <FadeIn delay={0.2} x={30} y={0}>
            <div className="text-center lg:text-left">
              <p className="text-brand-gold font-semibold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase mb-3 sm:mb-4">
                Established Heritage
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green leading-tight mb-4 sm:mb-5 lg:mb-6">
                Rooted in Tradition, Proven by Science
              </h2>

              <p className="text-brand-text-muted text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4">
                Dasi Life is dedicated to reviving centuries-old herbal solutions
                for modern lifestyles. We believe that wellness lies in returning
                to natural remedies crafted with absolute purity. Our signature
                'Sultani' formulations utilize cold-pressed herbs, raw honey, and
                organic minerals prepared according to authentic Unani scripts.
              </p>

              <p className="text-brand-text-muted text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-6 lg:mb-7">
                Each formulation is processed under rigorous quality checks and
                tested in modern laboratories, ensuring that you receive the
                absolute best of nature.
              </p>

              <Link
                href="/about"
                className="inline-block bg-brand-green hover:bg-black text-white font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-md transition-colors text-sm sm:text-base"
              >
                Read Our Full Story
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
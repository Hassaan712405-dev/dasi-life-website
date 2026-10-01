import Link from 'next/link';

export default function RootedSection() {
  return (
    <section className="bg-brand-cream py-12 md:py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Side — Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <img
                src="/images/product-majoon.png"
                alt="Dasi Life — Rooted in tradition, proven by science"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Right Side — Text */}
          <div className="text-center lg:text-left">
            <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-4">
              Established Heritage
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green leading-tight mb-6">
              Rooted in Tradition, Proven by Science
            </h2>

            <p className="text-brand-text-muted text-sm md:text-base leading-relaxed mb-4">
              Dasi Life is dedicated to reviving centuries-old herbal solutions
              for modern lifestyles. We believe that wellness lies in returning
              to natural remedies crafted with absolute purity. Our signature
              'Sultani' formulations utilize cold-pressed herbs, raw honey, and
              organic minerals prepared according to authentic Unani scripts.
            </p>

            <p className="text-brand-text-muted text-sm md:text-base leading-relaxed mb-7">
              Each formulation is processed under rigorous quality checks and
              tested in modern laboratories, ensuring that you receive the
              absolute best of nature.
            </p>

            <Link href="/about" className="btn-primary">
              Read Our Full Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
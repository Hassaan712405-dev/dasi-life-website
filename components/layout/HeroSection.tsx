import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="bg-brand-cream py-12 md:py-20">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Left Side — Text */}
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-5">
                            Traditional Unani Elixirs
                        </p>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-brand-green leading-tight mb-6">
                            Ancient Wisdom, Modern Wellness
                        </h1>

                        <p className="text-brand-text-muted text-base md:text-lg leading-relaxed mb-7 max-w-xl mx-auto lg:mx-0">
                            Dasi Life bridges ancient herbal medicine with premium standards.
                            Reclaim your daily vitality, strength, and immunity through our
                            meticulously prepared organic formulations.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/shop" className="btn-primary">
                                Shop Bestsellers
                            </Link>
                            <Link href="/about" className="btn-secondary">
                                Our Heritage
                            </Link>
                        </div>
                    </div>

                    {/* Right Side — Image */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-md lg:max-w-lg">
                            <img
                                src="/images/hero-majoon.png"
                                alt="Sultani Herbal Majoon — Dasi Life premium Unani elixir"
                                className="w-full h-auto rounded-2xl shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
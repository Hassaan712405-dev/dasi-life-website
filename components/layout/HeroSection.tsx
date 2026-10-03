'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ParallaxImage from '@/components/motion/ParallaxImage';
import FloatingElement from '@/components/motion/FloatingElement';
import { Leaf } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-brand-cream py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Floating decorative elements */}
      <FloatingElement
        duration={6}
        distance={30}
        delay={0}
        className="absolute top-10 left-5 sm:left-10 opacity-20 pointer-events-none"
      >
        <Leaf
          size={40}
          className="text-brand-green"
          strokeWidth={1}
        />
      </FloatingElement>

      <FloatingElement
        duration={5}
        distance={25}
        delay={1}
        className="absolute bottom-10 right-5 sm:right-10 opacity-20 pointer-events-none rotate-45"
      >
        <Leaf
          size={60}
          className="text-brand-green"
          strokeWidth={1}
        />
      </FloatingElement>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">
          
          {/* Left Side — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-widest uppercase mb-3 sm:mb-4">
              Traditional Unani Elixirs
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-6xl font-heading font-bold text-brand-green leading-tight mb-4 sm:mb-5 lg:mb-6">
              Ancient Wisdom, Modern Wellness
            </h1>

            <p className="text-brand-text-muted text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-7 lg:mb-8 max-w-lg mx-auto lg:mx-0">
              Dasi Life bridges ancient herbal medicine with premium standards.
              Reclaim your daily vitality, strength, and immunity through our
              meticulously prepared organic formulations.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="bg-brand-green hover:bg-black text-white font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-md transition-colors text-center text-sm sm:text-base"
              >
                Shop Bestsellers
              </Link>

              <Link
                href="/about"
                className="bg-white border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-md transition-colors text-center text-sm sm:text-base"
              >
                Our Heritage
              </Link>
            </div>
          </motion.div>

          {/* Right Side — Image with Parallax */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            {/* Fixed aspect ratio reserves image space and helps reduce CLS */}
            <div className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-md md:max-w-lg lg:max-w-lg mx-auto rounded-2xl shadow-xl overflow-hidden aspect-[4/5] sm:aspect-square">
              <ParallaxImage
                src="/images/hero-majoon.png"
                alt="Sultani Herbal Majoon — Dasi Life premium Unani elixir"
                intensity={20}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
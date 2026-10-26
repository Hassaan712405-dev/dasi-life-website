'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeroPosterWithProduct } from '@/types/hero-poster';

const INTERVAL = 5000;
const TRANSITION_MS = 1000;

export default function HeroCarousel({
  posters,
}: {
  posters: HeroPosterWithProduct[];
}) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const displayPosters = posters.length > 0 ? posters : [
    {
      id: 'fallback',
      image_url: '/images/hero-majoon.png',
      heading: "Nature's Goodness",
      description:
        'Discover our meticulously crafted herbal formulations for your daily vitality.',
      button_label: 'Shop Now',
      button_link: '/shop',
    } as any,
  ];

  const count = displayPosters.length;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const cb = () => setReduced(mq.matches);
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  }, []);

  // Clamp index if count decreases
  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  // Robust timer
  useEffect(() => {
    if (count <= 1 || reduced) return;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [advance, count, reduced]);

  const activePoster = displayPosters[index];

  const href =
    activePoster?.button_link ||
    (activePoster?.product?.slug
      ? `/product/${activePoster.product.slug}`
      : '/shop');

  return (
    <section className="relative w-full bg-[#F8F6EF] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[560px] lg:min-h-[640px] py-12 lg:py-0">

          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left pt-8 lg:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activePoster?.id || index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <p className="text-[#C9A961] font-semibold text-xs tracking-[0.2em] uppercase mb-4">
                  Natural Wellness • Inspired by Nature
                </p>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-[#1B5E20] leading-[1.1] mb-6">
                  {activePoster?.heading || "Nature's Goodness"}
                </h1>

                <p className="text-brand-text-muted text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                  {activePoster?.description ||
                    'Discover our meticulously crafted herbal formulations for your daily vitality.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href={href}
                    className="bg-[#1B5E20] hover:bg-black text-white font-medium px-8 py-3.5 rounded-md shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base w-full sm:w-auto text-center"
                  >
                    {activePoster?.button_label || 'Shop Now'}
                  </Link>

                  <Link
                    href="/about"
                    className="text-[#1B5E20] hover:text-black font-medium text-sm sm:text-base underline underline-offset-4 decoration-[#1B5E20]/30 hover:decoration-[#1B5E20] transition-colors w-full sm:w-auto text-center py-3"
                  >
                    Explore Our Story
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            {count > 1 && (
              <div className="flex items-center justify-center lg:justify-start gap-2.5 mt-10">
                {displayPosters.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      height: '10px',
                      width: i === index ? '32px' : '10px',
                      backgroundColor:
                        i === index ? '#1B5E20' : 'rgba(27, 94, 32, 0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                    onMouseEnter={(e) => {
                      if (i !== index) {
                        e.currentTarget.style.backgroundColor =
                          'rgba(27, 94, 32, 0.6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (i !== index) {
                        e.currentTarget.style.backgroundColor =
                          'rgba(27, 94, 32, 0.3)';
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Image */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end items-center h-[350px] sm:h-[450px] lg:h-[600px] w-full">
            <div className="relative w-full h-full max-w-[500px] lg:max-w-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${activePoster?.id || index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{
                    duration: reduced ? 0 : TRANSITION_MS / 1000,
                    ease: 'easeOut',
                  }}
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-[#EBE4D6]"
                >
                  <Image
                    src={activePoster?.image_url || '/images/hero-majoon.png'}
                    alt={activePoster?.heading || 'Dasi Life Product'}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
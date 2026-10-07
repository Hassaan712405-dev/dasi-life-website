'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-brand-cream rounded-2xl overflow-hidden border border-gray-200 mb-3 sm:mb-4 relative aspect-square"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {images.map((img, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-brand-cream rounded-lg overflow-hidden border-2 transition-all aspect-square relative ${
              activeIndex === index
                ? 'border-brand-green'
                : 'border-gray-200 hover:border-brand-green/50'
            }`}
          >
            <Image
              src={img}
              alt={`${alt} thumbnail ${index + 1}`}
              fill
              sizes="120px"
              className="object-cover"
              loading="lazy"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
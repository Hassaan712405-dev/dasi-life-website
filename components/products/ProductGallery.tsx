'use client';

import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="bg-brand-cream rounded-2xl overflow-hidden border border-gray-200 mb-4">
        <img
          src={images[activeIndex]}
          alt={alt}
          className="w-full aspect-square object-cover"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`bg-brand-cream rounded-lg overflow-hidden border-2 transition-all ${
              activeIndex === index
                ? 'border-brand-green'
                : 'border-gray-200 hover:border-brand-green/50'
            }`}
          >
            <img
              src={img}
              alt={`${alt} thumbnail ${index + 1}`}
              className="w-full aspect-square object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
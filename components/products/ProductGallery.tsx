'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Ensure at least one image
  const displayImages = images.length > 0 ? images : ['/images/placeholder-product.png'];
  const hasMultiple = displayImages.length > 1;

  // Reset on images change
  useEffect(() => {
    setActiveIndex(0);
  }, [images.length]);

  const goToPrevious = () => {
    setActiveIndex((i) => (i === 0 ? displayImages.length - 1 : i - 1));
  };

  const goToNext = () => {
    setActiveIndex((i) => (i === displayImages.length - 1 ? 0 : i + 1));
  };

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative aspect-square bg-[#F8F6EF] rounded-2xl overflow-hidden border border-[#EBE4D6] group">
          <Image
            src={displayImages[activeIndex]}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          />

          {/* Zoom hint */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn size={16} className="text-brand-text-dark" />
          </div>

          {/* Prev/Next */}
          {hasMultiple && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-brand-green hover:text-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-brand-green hover:text-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Counter */}
          {hasMultiple && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {activeIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultiple && (
          <div className="grid grid-cols-4 gap-2">
            {displayImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  activeIndex === index
                    ? 'border-brand-green ring-2 ring-brand-green/20'
                    : 'border-[#EBE4D6] hover:border-brand-green/50'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={img}
                  alt={`${alt} - ${index + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Image */}
          <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
            <Image
              src={displayImages[activeIndex]}
              alt={alt}
              fill
              sizes="90vw"
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Prev/Next */}
          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>

              {/* Thumbnails bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-lg">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(index);
                    }}
                    className={`relative w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                      activeIndex === index
                        ? 'border-white'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="50px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
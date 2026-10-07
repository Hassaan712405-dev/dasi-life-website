'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import FadeIn from '@/components/motion/FadeIn';

interface ProductVideoProps {
  videoUrl: string | null;
  posterUrl?: string;
  productName: string;
}

export default function ProductVideo({
  videoUrl,
  posterUrl,
  productName,
}: ProductVideoProps) {
  const [playing, setPlaying] = useState(false);

  // ✅ Agar video nahi hai, kuch bhi render nahi karo
  if (!videoUrl) return null;

  return (
    <FadeIn>
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-5 sm:mb-6 md:mb-8">
          Product Video
        </h2>

        <div className="relative aspect-video bg-brand-cream rounded-2xl overflow-hidden border border-gray-200 max-w-3xl">
          {!playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label={`Play ${productName} video`}
            >
              {posterUrl && (
                <img
                  src={posterUrl}
                  alt={productName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <span className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play
                  size={28}
                  className="text-brand-green ml-1"
                  fill="currentColor"
                />
              </span>
            </button>
          ) : (
            <video
              src={videoUrl}
              poster={posterUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
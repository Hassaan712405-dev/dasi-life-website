'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface ProductVideoProps {
  videoUrl: string | null | undefined;
  posterUrl?: string;
  productName?: string;
}

/**
 * Extract YouTube video ID from any format:
 * - https://youtu.be/VIDEO_ID
 * - https://youtu.be/VIDEO_ID?si=...
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&t=...
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
function getYouTubeId(url: string): string | null {
  try {
    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if URL is a direct video file (MP4, WebM, etc.)
 */
function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i.test(url);
}

/**
 * Check if URL is a Vimeo video
 */
function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export default function ProductVideo({
  videoUrl,
  posterUrl,
  productName,
}: ProductVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // If no video URL, render nothing
  if (!videoUrl || videoUrl.trim() === '') {
    return null;
  }

  const cleanUrl = videoUrl.trim();
  const youtubeId = getYouTubeId(cleanUrl);
  const vimeoId = getVimeoId(cleanUrl);
  const directVideo = isDirectVideo(cleanUrl);

  // YouTube
  if (youtubeId) {
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;

    return (
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-4">
          Watch {productName || 'Product'} in Action
        </h2>
        <div className="w-16 h-[2px] bg-[#C9A961] mb-5" />

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl border border-[#EBE4D6]">
          {!isPlaying ? (
            <>
              {/* Poster thumbnail */}
              {youtubeId ? (
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                  alt={productName || 'Product video'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to lower quality thumbnail
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                  }}
                />
              ) : posterUrl ? (
                <img
                  src={posterUrl}
                  alt={productName || 'Product video'}
                  className="w-full h-full object-cover"
                />
              ) : null}

              {/* Play button */}
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group"
                aria-label="Play video"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 group-hover:bg-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <Play
                    size={32}
                    className="text-[#1B5E20] fill-[#1B5E20] ml-1"
                  />
                </div>
              </button>
            </>
          ) : (
            <iframe
              src={embedUrl}
              title={productName ? `${productName} video` : 'Product video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    );
  }

  // Vimeo
  if (vimeoId) {
    const embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;

    return (
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-4">
          Watch {productName || 'Product'} in Action
        </h2>
        <div className="w-16 h-[2px] bg-[#C9A961] mb-5" />

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl border border-[#EBE4D6]">
          {!isPlaying ? (
            <>
              {posterUrl && (
                <img
                  src={posterUrl}
                  alt={productName || 'Product video'}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group"
                aria-label="Play video"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 group-hover:bg-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <Play
                    size={32}
                    className="text-[#1B5E20] fill-[#1B5E20] ml-1"
                  />
                </div>
              </button>
            </>
          ) : (
            <iframe
              src={embedUrl}
              title={productName ? `${productName} video` : 'Product video'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    );
  }

  // Direct video file (MP4, WebM)
  if (directVideo) {
    return (
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-4">
          Watch {productName || 'Product'} in Action
        </h2>
        <div className="w-16 h-[2px] bg-[#C9A961] mb-5" />

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl border border-[#EBE4D6]">
          <video
            controls
            poster={posterUrl}
            className="w-full h-full"
            preload="metadata"
          >
            <source src={cleanUrl} />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  }

  // Unknown format - return null (or you can show a link)
  console.warn('[ProductVideo] Unsupported video URL:', cleanUrl);
  return null;
}
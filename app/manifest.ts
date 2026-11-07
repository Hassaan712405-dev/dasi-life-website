import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dasi Life — Premium Unani Herbal Wellness',
    short_name: 'Dasi Life',
    description:
      'Premium Desi-inspired herbal wellness bridging traditional Unani formulations with modern laboratory standards.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1F4A2C',
    theme_color: '#1B5E20',
    orientation: 'portrait',
    categories: ['shopping', 'health', 'wellness'],
    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/android-chrome-256x256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/android-chrome-256x256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/motion/PageTransition';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

export const metadata: Metadata = {
  title: {
    default: 'Dasi Life — Premium Unani Herbal Wellness',
    template: '%s | Dasi Life',
  },
  description:
    'Dasi Life bridges ancient herbal medicine with premium standards. Reclaim your daily vitality, strength, and immunity through our meticulously prepared organic formulations.',
  keywords: [
    'Unani',
    'herbal',
    'Pakistan',
    'Majoon',
    'Hair Oil',
    'Capsules',
    'Dasi Life',
    'Sultani',
    'Organic',
    'Wellness',
    'Cash on Delivery',
  ],
  authors: [{ name: 'Dasi Life' }],
  creator: 'Dasi Life',
  publisher: 'Dasi Life',
  metadataBase: new URL('https://dasilife.store'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://dasilife.store',
    siteName: 'Dasi Life',
    title: 'Dasi Life — Premium Unani Herbal Wellness',
    description:
      'Premium Desi-inspired herbal wellness bridging traditional Unani formulations with modern laboratory standards.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dasi Life — Premium Unani Herbal Wellness',
    description:
      'Premium Desi-inspired herbal wellness bridging traditional Unani formulations with modern laboratory standards.',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col">
        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
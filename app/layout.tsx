import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/motion/PageTransition';
import ScrollProgress from '@/components/motion/ScrollProgress';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import MetaPixel from '@/components/analytics/MetaPixel';

// ============================================
// ORGANIZATION SCHEMA
// ============================================
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dasi Life',
  url: 'https://www.dasilife.store',
  logo: 'https://www.dasilife.store/images/logo.png',
  description: 'Premium Unani Herbal Wellness',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-342-2544495',
    contactType: 'Customer Service',
    areaServed: 'PK',
    availableLanguage: ['en', 'ur'],
  },
};

// ============================================
// WEBSITE SCHEMA
// ============================================
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Dasi Life',
  url: 'https://www.dasilife.store',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.dasilife.store/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

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
  metadataBase: new URL('https://www.dasilife.store'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://www.dasilife.store',
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <Analytics />
        <SpeedInsights />

        {/* Meta Pixel */}
        <MetaPixel />

        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
              {/* ✅ Header pehle */}
              <Header />
              
              {/* ✅ ScrollProgress header ke baad */}
              <ScrollProgress />

              {/* ✅ main pe padding — no flex */}
              <main className="pt-[68px] sm:pt-[72px] md:pt-[76px] lg:pt-[88px]">
                <PageTransition>{children}</PageTransition>
              </main>

              <Footer />
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>

        {/* Google Analytics 4 */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingSocialSidebar from '@/components/layout/FloatingSocialSidebar';
import PageTransition from '@/components/motion/PageTransition';
import ScrollProgress from '@/components/motion/ScrollProgress';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import MetaPixel from '@/components/analytics/MetaPixel';

import { MessageCircle, Mail } from 'lucide-react';

// ✅ Custom SVG Icons (Brand Colors ke sath)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.433H7.078v-3.494h3.047V9.407c0-3.02 1.792-4.689 4.533-4.689 1.312 0 2.686.236 2.686.236v2.96H15.83c-1.491 0-1.956.929-1.956 1.883v2.276h3.328l-.532 3.494h-2.796V24C19.612 23.093 24 18.099 24 12.073Z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.05.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1Z" />
  </svg>
);

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
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className="pb-[64px] md:pb-0">
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <Analytics />
        <SpeedInsights />
        <MetaPixel />

        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
              
              <Header />
              <ScrollProgress />

              <main className="pt-[76px] min-h-screen"> 
                <PageTransition>{children}</PageTransition>
              </main>

              <Footer />

              <FloatingSocialSidebar />
              
              {/* ============================================ */}
              {/* ✅ Mobile Bottom Fixed Bar (Icons with Brand Colors) */}
              {/* ============================================ */}
              <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-[64px] flex items-center justify-around shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe">
                
                {/* WhatsApp */}
                <a href="https://wa.me/923422544495" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full group">
                  <MessageCircle size={22} className="mb-1 text-[#25D366] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold text-gray-600 group-hover:text-[#25D366] transition-colors">WhatsApp</span>
                </a>

                {/* Email */}
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=desilifestore@gmail.com&su=Product%20Inquiry`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full border-x border-gray-100 group">
                  <Mail size={22} className="mb-1 text-[#EA4335] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold text-gray-600 group-hover:text-[#EA4335] transition-colors">Email</span>
                </a>

                {/* Facebook */}
                <a href="https://web.facebook.com/desilifestore" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full group">
                  <FacebookIcon className="mb-1 text-[#1877F2] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold text-gray-600 group-hover:text-[#1877F2] transition-colors">Facebook</span>
                </a>

                {/* TikTok */}
                <a href="https://www.tiktok.com/@desilifestore" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full border-l border-gray-100 group">
                  <TikTokIcon className="mb-1 text-black group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold text-gray-600 group-hover:text-black transition-colors">TikTok</span>
                </a>

              </div>

            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>

        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
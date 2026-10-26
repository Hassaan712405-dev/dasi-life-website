'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Copy, Check } from 'lucide-react';
import { useState } from 'react';

// Custom SVG icons
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const FACEBOOK_URL = 'https://web.facebook.com/desilifestore';
const EMAIL = 'desilifestore@gmail.com';
const PHONE = '+923422544495';
const WHATSAPP_NUMBER = '923422544495';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappMessage = encodeURIComponent(
    'Hello Dasi Life! I would like to know more about your products.'
  );

  // ✅ Copy email state
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for old browsers
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ✅ Gmail compose URL (works in browser)
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=Product%20Inquiry`;

  return (
    <footer className="bg-[#1B5E20] text-[#FDFBF7] pt-16 pb-8">

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Main Grid — 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">

          {/* ───── Column 1: Brand ───── */}
          <div>
            <Link href="/" className="inline-block mb-5" aria-label="Dasi Life Home">
              <div className="relative h-12 w-40">
                <Image
                  src="/images/logo.png"
                  alt="Dasi Life"
                  fill
                  className="object-contain object-left brightness-0 invert"
                />
              </div>
            </Link>

            <p className="text-sm text-white/75 leading-relaxed mb-6">
              Discover thoughtfully selected herbal and personal care products
              with a simple, convenient shopping experience. Dasi Life brings
              nature-inspired care closer to your everyday routine.
            </p>

            <div className="flex items-center gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon w-10 h-10 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Visit Dasi Life on Facebook"
                title="Facebook"
              >
                <FacebookIcon />
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Contact Dasi Life on WhatsApp"
                title="WhatsApp"
              >
                <WhatsAppIcon />
              </a>

              {/* ✅ Email — Opens Gmail compose in browser (reliable) */}
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon w-10 h-10 rounded-full bg-white/10 hover:bg-[#EA4335] flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Email Dasi Life via Gmail"
                title="Email via Gmail"
              >
                <Mail size={18} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon w-10 h-10 rounded-full bg-white/10 hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Visit Dasi Life on TikTok"
                title="TikTok (coming soon)"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* ───── Column 2: Quick Links ───── */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* ───── Column 3: Customer Service ───── */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 text-white">
              Customer Service
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link inline-block text-white/75 hover:text-[#C9A961] transition-colors duration-300">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* ───── Column 4: Get in Touch ───── */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 text-white">
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#C9A961] shrink-0 mt-0.5" />
                <span className="text-white/75">Mailsi, Pakistan</span>
              </li>

              {/* ✅ Email — Multiple working methods */}
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-[#C9A961] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  {/* Method 1: Gmail in browser */}
                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/75 hover:text-[#C9A961] transition-colors duration-300 break-all block"
                    title="Open in Gmail"
                  >
                    {EMAIL}
                  </a>

                  {/* Method 2: Native mailto */}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-[10px] text-white/50 hover:text-[#C9A961] transition-colors duration-300 block mt-1"
                    title="Open in default mail app"
                  >
                    or use email app →
                  </a>

                  {/* Method 3: Copy to clipboard */}
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded bg-white/10 hover:bg-[#C9A961] text-white transition-colors"
                    title="Copy email to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check size={10} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={10} /> Copy Email
                      </>
                    )}
                  </button>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={18} className="text-[#C9A961] shrink-0 mt-0.5" />
                <a
                  href={`tel:${PHONE}`}
                  className="text-white/75 hover:text-[#C9A961] transition-colors duration-300"
                >
                  +92 342 2544495
                </a>
              </li>

              <li className="pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5A] text-white text-xs font-semibold px-4 py-2.5 rounded-md transition-all duration-300 hover:scale-105 shadow-md"
                >
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ───── Bottom Bar ───── */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/60 text-center sm:text-left">
            © {currentYear} Dasi Life. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <Link href="/privacy" className="hover:text-[#C9A961] transition-colors duration-300">
              Privacy
            </Link>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <Link href="/terms" className="hover:text-[#C9A961] transition-colors duration-300">
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        .footer-link {
          position: relative;
          padding-left: 0;
          transition: padding-left 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                      color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .footer-link::before {
          content: '›';
          position: absolute;
          left: -12px;
          opacity: 0;
          transition: opacity 0.3s ease, left 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          color: #C9A961;
          font-weight: bold;
        }

        .footer-link:hover {
          padding-left: 8px;
        }

        .footer-link:hover::before {
          opacity: 1;
          left: 0;
        }

        .social-icon {
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-link,
          .footer-link::before,
          .social-icon {
            transition: none !important;
            transform: none !important;
          }
          .footer-link:hover {
            padding-left: 0 !important;
          }
          .footer-link:hover::before {
            display: none !important;
          }
          .social-icon:hover {
            transform: none !important;
          }
        }
      `}</style>
    </footer>
  );
}
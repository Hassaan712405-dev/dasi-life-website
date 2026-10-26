'use client';

import { usePathname } from 'next/navigation';
import { Mail } from 'lucide-react';

const WhatsAppIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.52 0 .19 5.33.19 11.89c0 2.1.55 4.14 1.59 5.95L.1 24l6.31-1.65a11.9 11.9 0 0 0 5.67 1.45h.01c6.56 0 11.89-5.34 11.9-11.9a11.82 11.82 0 0 0-3.47-8.42ZM12.09 21.8h-.01a9.87 9.87 0 0 1-5.03-1.37l-.36-.22-3.74.98.99-3.65-.23-.37a9.86 9.86 0 0 1-1.51-5.28c0-5.45 4.44-9.89 9.89-9.89a9.83 9.83 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.23-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.34Z" />
  </svg>
);

const FacebookIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.433H7.078v-3.494h3.047V9.407c0-3.02 1.792-4.689 4.533-4.689 1.312 0 2.686.236 2.686.236v2.96H15.83c-1.491 0-1.956.929-1.956 1.883v2.276h3.328l-.532 3.494h-2.796V24C19.612 23.093 24 18.099 24 12.073Z" />
  </svg>
);

const TikTokIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.05.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1Z" />
  </svg>
);

// ✅ Official working URLs
const EMAIL = 'desilifestore@gmail.com';
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=Product%20Inquiry`;
const FACEBOOK_URL = 'https://web.facebook.com/desilifestore';
const TIKTOK_URL = 'https://www.tiktok.com/@desilifestore'; // ⚠️ Replace with your official TikTok URL
const WHATSAPP_URL = 'https://wa.me/923422544495?text=Hello%20Dasi%20Life!%20I%20would%20like%20to%20know%20more%20about%20your%20products.';

const LINKS = [
  {
    id: 'whatsapp',
    name: 'WHATSAPP',
    icon: WhatsAppIcon,
    href: WHATSAPP_URL,
    color: '#25D366',
    hoverColor: '#20BD5A',
    aria: 'Contact Dasi Life on WhatsApp',
    external: true,
  },
  {
    id: 'email',
    name: 'EMAIL',
    icon: Mail,
    href: GMAIL_COMPOSE, // ✅ Gmail compose opens in browser
    color: '#EA4335',
    hoverColor: '#D93025',
    aria: 'Email Dasi Life via Gmail',
    external: true,
  },
  {
    id: 'facebook',
    name: 'FACEBOOK',
    icon: FacebookIcon,
    href: FACEBOOK_URL, // ✅ Official Facebook URL
    color: '#1877F2',
    hoverColor: '#166FE5',
    aria: 'Visit Dasi Life on Facebook',
    external: true,
  },
  {
    id: 'tiktok',
    name: 'TIKTOK',
    icon: TikTokIcon,
    href: TIKTOK_URL, // ⚠️ Replace with official TikTok URL
    color: '#000000',
    hoverColor: '#222222',
    aria: 'Visit Dasi Life on TikTok',
    external: true,
  },
];

export default function FloatingSocialSidebar() {
  const pathname = usePathname();

  // Never render floating social links on admin routes.
  const isAdminRoute =
    pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdminRoute) {
    return null;
  }

  return (
    <aside
      className="floating-social-sidebar"
      aria-label="Dasi Life social media and contact links"
    >
      {LINKS.map((link) => {
        const Icon = link.icon;

        return (
          <a
            key={link.id}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            aria-label={link.aria}
            className="floating-social-link"
            style={
              {
                '--button-color': link.color,
                '--button-hover-color': link.hoverColor,
              } as React.CSSProperties
            }
          >
            <span className="floating-social-icon">
              <Icon size={22} />
            </span>
            <span className="floating-social-label">{link.name}</span>
          </a>
        );
      })}

      <style jsx>{`
        .floating-social-sidebar {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 60;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          width: max-content;
          max-width: 100vw;
        }

        .floating-social-link {
          position: relative;
          display: flex;
          align-items: center;
          flex: 0 0 auto;
          width: 50px;
          height: 50px;
          box-sizing: border-box;
          overflow: hidden;
          border-radius: 3px;
          color: #ffffff;
          background-color: var(--button-color);
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 2px 7px rgb(0 0 0 / 16%);
          transition:
            width 400ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 200ms ease,
            box-shadow 250ms ease;
        }

        .floating-social-icon {
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          flex: 0 0 50px;
        }

        .floating-social-label {
          display: block;
          padding-left: 50px;
          padding-right: 16px;
          font-size: 12px;
          line-height: 1;
          font-weight: 750;
          letter-spacing: 1px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(8px);
          transition:
            opacity 180ms ease,
            transform 250ms ease,
            visibility 0s linear 250ms;
        }

        @media (hover: hover) and (pointer: fine) {
          .floating-social-link:hover {
            width: 180px;
            background-color: var(--button-hover-color);
            box-shadow: 0 5px 14px rgb(0 0 0 / 22%);
          }

          .floating-social-link:hover .floating-social-label {
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
            transition-delay: 80ms, 0ms, 0ms;
          }
        }

        .floating-social-link:focus-visible {
          outline: 2px solid #c9a961;
          outline-offset: 2px;
          width: 180px;
        }

        .floating-social-link:focus-visible .floating-social-label {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
          transition-delay: 0ms;
        }

        @media (max-width: 768px) {
          .floating-social-link {
            width: 46px;
            height: 46px;
          }

          .floating-social-icon {
            width: 46px;
            height: 46px;
          }

          .floating-social-label {
            display: none;
          }

          .floating-social-link:focus-visible {
            width: 46px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-social-link,
          .floating-social-label {
            transition: none !important;
          }
        }
      `}</style>
    </aside>
  );
}
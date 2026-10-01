import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-brand-text-muted mb-8">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-green font-medium">Privacy Policy</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">
            Your Privacy
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-brand-text-muted">
            Last Updated: January 1, 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
          {/* 1. Information We Collect */}
          <section className="pb-6 md:pb-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              1. Information We Collect
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed mb-4">
              To process your Cash on Delivery (COD) orders and provide a
              personalized wellness experience, we collect the following
              information:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex gap-3 text-sm md:text-base text-brand-text-muted leading-relaxed">
                <span className="text-brand-green font-bold shrink-0">•</span>
                <span>
                  <strong className="text-brand-text-dark">Personal Details:</strong>{' '}
                  Full name, phone number, email address, and shipping address.
                </span>
              </li>
              <li className="flex gap-3 text-sm md:text-base text-brand-text-muted leading-relaxed">
                <span className="text-brand-green font-bold shrink-0">•</span>
                <span>
                  <strong className="text-brand-text-dark">Order Information:</strong>{' '}
                  Products purchased, order value, and delivery preferences.
                </span>
              </li>
              <li className="flex gap-3 text-sm md:text-base text-brand-text-muted leading-relaxed">
                <span className="text-brand-green font-bold shrink-0">•</span>
                <span>
                  <strong className="text-brand-text-dark">Technical Data:</strong>{' '}
                  IP address, browser type, and device information for security
                  and analytics.
                </span>
              </li>
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              Your information is used strictly to fulfil orders, send SMS/phone
              confirmations for Cash on Delivery dispatches, provide customer
              support, and improve our wellness services. We may occasionally
              notify you about new Unani formulations or seasonal promotions,
              which you can opt out of at any time.
            </p>
          </section>

          {/* 3. Data Protection & Security */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              3. Data Protection &amp; Security
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              We implement industry-standard SSL encryption and secure server
              protocols to protect your personal data from unauthorized access,
              alteration, or disclosure. Your payment method for COD orders is
              never stored in our systems.
            </p>
          </section>

          {/* 4. Cookies & Tracking */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              4. Cookies &amp; Tracking
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              Our website uses cookies and similar tracking technologies to
              enhance your browsing experience, remember your cart, and analyze
              site traffic. You can disable cookies in your browser settings, but
              this may affect certain website features.
            </p>
          </section>

          {/* 5. Third-Party Sharing */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              5. Third-Party Sharing
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              We never sell your personal information. Your data is only shared
              with essential partners such as our courier networks (TCS, Leopard,
              M&amp;P) for order delivery, and with trusted payment settlement
              providers (EasyPaisa, JazzCash) for refunds. All partners adhere to
              strict confidentiality agreements.
            </p>
          </section>

          {/* 6. Your Rights */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              6. Your Rights
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              You have the right to access, update, or delete your personal
              information at any time. You may also request that we stop sending
              marketing communications. To exercise any of these rights, simply
              contact our support team.
            </p>
          </section>

          {/* 7. Contact Us */}
          <section className="pt-6 md:pt-8">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              7. Contact Us
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              For any privacy-related inquiries, please contact our data
              protection officer at{' '}
              <strong className="text-brand-text-dark">
                privacy@dasilife.store
              </strong>{' '}
              or call +92 300 1234567. Our physical office is at: Studio 4B,
              Heritage Plaza, Lahore, Pakistan.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
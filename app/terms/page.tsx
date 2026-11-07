import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-brand-text-muted mb-8">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-green font-medium">Terms of Service</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">
            Legal Agreement
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-brand-text-muted">
            Last Updated: January 1, 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
          {/* 1. Acceptance of Terms */}
          <section className="pb-6 md:pb-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              By accessing and placing an order on dasilife.store, you accept and
              agree to be bound by these Terms of Service. If you do not agree to
              these terms, please refrain from using our traditional Unani
              e-commerce portal.
            </p>
          </section>

          {/* 2. Use of Website */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              2. Use of Website
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              You agree to use this site for legitimate shopping purposes only.
              You must provide authentic delivery addresses, contact numbers, and
              confirm Cash on Delivery dispatches in good faith. False ordering
              or systematic cancellations may result in account termination.
            </p>
          </section>

          {/* 3. Product Information & Health Disclaimer */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              3. Product Information &amp; Health Disclaimer
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              Dasi Life herbal formulations (Sultani Herbal Majoon, Herbal
              Capsules, and Hair Oils) are prepared in adherence to authentic
              Unani scripts. However, natural botanical compounds may yield
              varied individual results. Product descriptions and historical
              Unani references are for educational purposes and should not
              substitute professional medical advice.
            </p>
          </section>

          {/* 4. Ordering, Pricing, & Payment */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              4. Ordering, Pricing, &amp; Payment
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              All prices listed on our site are in PKR (Pakistani Rupees). We
              reserve the right to modify prices or discontinue promotional
              discounts. Cash on Delivery is our verified payment standard. Our
              fulfillment team reserves the right to cancel orders that fail
              telephonic/SMS verification.
            </p>
          </section>

          {/* 5. Intellectual Property */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              All brand identity assets, site graphics, custom laboratory images,
              and product catalog copy are the exclusive intellectual property of
              Dasi Life. Unauthorized duplication or reproduction for commercial
              gain is strictly prohibited.
            </p>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              Dasi Life is not liable for any indirect or accidental events
              resulting from the misuse or storage negligence of our organic
              formulations. All herbal items should be stored in cool, dry
              conditions away from direct sunlight.
            </p>
          </section>

          {/* 7. Contact & Governance */}
          <section className="pt-6 md:pt-8">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              7. Contact &amp; Governance
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              These terms are governed by the laws of Pakistan. For physical
              inquiries or dispute resolution, contact our corporate office at:
              Rehman Town Mailsi, Pakistan, or write to{' '}
              <strong className="text-brand-text-dark">
                dasilife@gmail.com
              </strong>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
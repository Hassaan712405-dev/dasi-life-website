import Link from 'next/link';
import { ChevronRight, Phone } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-brand-text-muted mb-8">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-green font-medium">Returns Policy</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">
            Satisfaction Guaranteed
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
            Returns &amp; Refund Policy
          </h1>
        </div>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
          {/* 1. Return Eligibility */}
          <section className="pb-6 md:pb-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              1. Return Eligibility
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              We take immense pride in the premium standards of our herbal
              formulations. If you receive a damaged, leaked, or incorrect
              product, you are eligible for a replacement or return within{' '}
              <strong className="text-brand-text-dark">
                7 days of delivery.
              </strong>
            </p>
          </section>

          {/* 2. How to Return */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              2. How to Return
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed mb-4">
              To initiate a return request, please follow these steps:
            </p>
            <ol className="space-y-2.5 pl-1">
              <li className="flex gap-3 text-sm md:text-base text-brand-text-muted leading-relaxed">
                <span className="text-brand-text-dark font-medium shrink-0">
                  1.
                </span>
                <span>Capture a clear photo or video of the damaged/incorrect product.</span>
              </li>
              <li className="flex gap-3 text-sm md:text-base text-brand-text-muted leading-relaxed">
                <span className="text-brand-text-dark font-medium shrink-0">
                  2.
                </span>
                <span>
                  Email us at{' '}
                  <strong className="text-brand-text-dark">
                    returns@dasilife.store
                  </strong>{' '}
                  or Whatsapp our team at{' '}
                  <strong className="text-brand-text-dark">+92 300 1234567</strong>{' '}
                  with your order number.
                </span>
              </li>
              <li className="flex gap-3 text-sm md:text-base text-brand-text-muted leading-relaxed">
                <span className="text-brand-text-dark font-medium shrink-0">
                  3.
                </span>
                <span>
                  Our courier partner will collect the product from your address,
                  or we will guide you on returning it to our Lahore lab hub.
                </span>
              </li>
            </ol>
          </section>

          {/* 3. Refund Process */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              3. Refund Process
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              Once the returned herbal formula is received and inspected at our
              pharmacy hub, we will process your refund. Refunds for orders paid
              via Cash on Delivery are completed via{' '}
              <strong className="text-brand-text-dark">
                EasyPaisa, JazzCash, or Bank Transfer
              </strong>{' '}
              within 5 to 7 business days.
            </p>
          </section>

          {/* 4. Non-Returnable Items */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              4. Non-Returnable Items
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              To maintain laboratory hygiene and safety guidelines, used
              capsules, unsealed jars, or partially consumed herbal majoon
              compounds cannot be returned unless there is a proven quality or
              consistency defect.
            </p>
          </section>

          {/* 5. Contact for Returns */}
          <section className="pt-6 md:pt-8">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              5. Contact for Returns
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed mb-5">
              Need instant assistance with returns? Please call our dedicated
              Unani advisory line:
            </p>
            <div className="bg-brand-cream-dark rounded-xl p-4 md:p-5 flex items-center gap-3">
              <Phone size={20} className="text-brand-green shrink-0" />
              <p className="text-sm md:text-base font-semibold text-brand-text-dark">
                Call Center Support: +92 300 1234567{' '}
                <span className="font-normal text-brand-text-muted">
                  (10:00 AM - 6:00 PM, Monday to Saturday)
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
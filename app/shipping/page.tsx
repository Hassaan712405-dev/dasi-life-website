import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-brand-text-muted mb-8">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-green font-medium">Shipping Policy</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">
            Customer Support
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
            Shipping &amp; Delivery Policy
          </h1>
        </div>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
          {/* 1. Delivery Areas */}
          <section className="pb-6 md:pb-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              1. Delivery Areas
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              We deliver nationwide across Pakistan, reaching all major cities
              (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan,
              Peshawar, Quetta, Gujranwala, and more) as well as remote rural
              areas. Every shipment is carefully packaged to maintain the natural
              potency of our herbal ingredients.
            </p>
          </section>

          {/* 2. Shipping Times */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              2. Shipping Times
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed mb-4">
              Orders are processed immediately within 24 hours of confirmation.
              Under standard delivery parameters:
            </p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex gap-3 text-sm md:text-base text-brand-text-muted leading-relaxed">
                <span className="text-brand-green font-bold shrink-0">•</span>
                <span>
                  <strong className="text-brand-text-dark">Major Cities:</strong>{' '}
                  3 to 5 business days.
                </span>
              </li>
              <li className="flex gap-3 text-sm md:text-base text-brand-text-muted leading-relaxed">
                <span className="text-brand-green font-bold shrink-0">•</span>
                <span>
                  <strong className="text-brand-text-dark">
                    Other Districts &amp; Remote Locations:
                  </strong>{' '}
                  5 to 7 business days.
                </span>
              </li>
            </ul>
          </section>

          {/* 3. Shipping Costs */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              3. Shipping Costs
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              To keep premium Unani healthcare accessible, we offer{' '}
              <strong className="text-brand-text-dark">
                FREE Delivery on ALL orders nationwide
              </strong>
              . No minimum order value required.
            </p>
          </section>

          {/* 4. COD Processing */}
          <section className="py-6 md:py-8 border-b border-gray-200">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              4. Cash on Delivery (COD) Processing
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              Our main checkout standard is Cash on Delivery (COD). You only pay
              when the package arrives safely at your doorstep. Upon placing your
              order, our service team will contact you via SMS or Phone Call to
              verify details before dispatching.
            </p>
          </section>

          {/* 5. Order Processing & Tracking */}
          <section className="pt-6 md:pt-8">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-4">
              5. Order Processing &amp; Tracking
            </h2>
            <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
              Once dispatched, you will receive a tracking link via email or SMS.
              You can monitor your package through our partner courier networks
              (TCS, Leopard, or M&P) at any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
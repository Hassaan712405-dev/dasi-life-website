import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-brand-cream min-h-screen relative overflow-hidden flex items-center justify-center py-20">
      {/* Decorative leaf outlines */}
      <div className="absolute top-20 left-10 md:left-20 opacity-20 pointer-events-none">
        <Leaf size={80} className="text-brand-green" strokeWidth={1} />
      </div>
      <div className="absolute bottom-20 right-10 md:right-20 opacity-20 pointer-events-none rotate-45">
        <Leaf size={100} className="text-brand-green" strokeWidth={1} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Small Leaf Icon */}
          <div className="flex justify-center mb-4">
            <Leaf size={32} className="text-brand-gold" strokeWidth={1.5} />
          </div>

          {/* 404 Number */}
          <h1
            className="font-heading font-bold leading-none mb-6"
            style={{
              fontSize: 'clamp(6rem, 20vw, 14rem)',
              color: '#EBE4D6',
              letterSpacing: '-0.02em',
            }}
          >
            404
          </h1>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green leading-tight mb-5">
            Apothecary Path Lost
          </h2>

          {/* Paragraph */}
          <p className="text-sm md:text-base text-brand-text-muted leading-relaxed mb-8 max-w-lg mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable. Let us help you find the
            correct formulation.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="btn-primary w-full sm:w-auto px-8 py-3.5"
            >
              Go to Homepage
            </Link>
            <Link
              href="/shop"
              className="btn-secondary w-full sm:w-auto px-8 py-3.5"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
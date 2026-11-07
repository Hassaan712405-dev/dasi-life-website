'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RootedSection() {
  return (
    <section className="py-16 bg-[#FDFBF7] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* LEFT: Testimonial Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden min-h-[300px] flex items-center p-8 sm:p-12 shadow-sm border border-[#EBE4D6]"
          >
            {/* Background Image with Overlay */}
            <Image
              src="/images/hero-majoon.png" // Aap isko kisi aur herbal image se replace kar sakte hain
              alt="Customer Testimonial Background"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 text-white max-w-md">
              <Quote size={32} className="text-[#C9A961] mb-4 opacity-80" />
              <p className="text-lg sm:text-xl font-accent italic leading-relaxed mb-6">
                "Dasi Life has completely changed my skincare routine. Natural, effective and trustworthy."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center overflow-hidden relative">
                  {/* Customer Avatar Placeholder */}
                  <span className="text-sm font-bold">A</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Ayesha Khan</p>
                  <p className="text-xs text-white/70">Verified Buyer</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Brand Story Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden min-h-[300px] flex items-center p-8 sm:p-12 bg-[#F5F0E8] border border-[#EBE4D6] shadow-sm group"
          >
            {/* Background Textures (Optional) */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 pointer-events-none">
               <Image 
                 src="/images/hero-majoon.png" // Herbal imagery
                 alt="Herbs"
                 fill
                 className="object-cover object-right mask-image-gradient"
               />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-md">
              <div className="w-10 h-10 rounded-full bg-[#1B5E20]/10 flex items-center justify-center mb-4">
                <LeafIcon />
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-brand-green mb-4">
                Wellness You Can Trust
              </h3>
              <p className="text-sm sm:text-base text-brand-text-dark leading-relaxed mb-6">
                At Dasi Life, we bring you the purity of nature with the power of traditional wisdom. Our formulations are crafted with care to support your holistic well-being.
              </p>
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-green hover:text-black transition-colors"
              >
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// Chhota sa custom Leaf SVG icon
function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
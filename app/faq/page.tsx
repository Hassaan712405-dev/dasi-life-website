'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

const faqs = [
  {
    question: 'How do I place an order and pay via Cash on Delivery (COD)?',
    answer: "Placing an order is extremely easy. Simply browse our apothecary catalog, add your preferred Sultani Herbal Majoon or capsules to the cart, and proceed to checkout. On the checkout screen, select 'Cash on Delivery' as your payment option. You will pay the courier in cash when your package is delivered to your doorstep anywhere in Pakistan.",
    category: 'Shipping & COD',
  },
  {
    question: 'Are Dasi Life products 100% natural and safe?',
    answer: 'Yes, absolute botanical integrity is our core standard. We source raw ingredients exclusively from clean mountain valleys and certified organic farms. Our signature Unani preparations contain only cold-pressed herbs, wild roots, raw honey, and organic minerals. We use zero artificial colors, heavy metals, or harmful preservatives.',
    category: 'Authenticity',
  },
  {
    question: 'How long does nationwide shipping take within Pakistan?',
    answer: 'We deliver nationwide with leading courier services. Shipping generally takes 2 to 4 business days for major cities (Lahore, Karachi, Islamabad) and 4 to 6 business days for other regional districts. Delivery is completely free on all orders over Rs. 3,000.',
    category: 'Shipping & COD',
  },
  {
    question: 'What is your return and exchange policy?',
    answer: 'We want you to be completely satisfied with your wellness journey. If you receive a damaged jar or would like to request an exchange, you can contact us at support@dasilife.store within 14 days of purchase. Unopened bottles in original packaging qualify for immediate refunds or replacements.',
    category: 'Returns',
  },
  {
    question: 'Can I take herbal capsules and Sultani Majoon together?',
    answer: 'Our products are prepared to harmonize together safely. However, we always recommend consulting our in-house Hakim or your personal medical advisor to establish a tailored daily regimen that matches your physical constitution (mizaj).',
    category: 'Our Products',
  },
];

const tabs = ['General', 'Shipping & COD', 'Returns', 'Our Products', 'Authenticity'];

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState('Shipping & COD');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter((faq) => {
    const matchesTab =
      activeTab === 'General' ||
      activeTab === 'Shipping & COD'
        ? activeTab === 'Shipping & COD'
          ? faq.category === 'Shipping & COD'
          : true
        : faq.category === activeTab;

    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-8 sm:pt-12 md:pt-16 text-center">
        <FadeIn>
          <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">
            Got Questions?
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-brand-green leading-tight mb-6 sm:mb-8">
            Frequently Asked Questions
          </h1>

          <div className="max-w-2xl mx-auto relative mb-6 sm:mb-8">
            <Search
              size={18}
              className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-brand-text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for questions (e.g. shipping, dosage, COD)..."
              className="w-full bg-white border border-gray-300 rounded-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3 sm:py-4 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8 sm:mb-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-brand-green text-white'
                    : 'bg-white border border-gray-200 text-brand-text-dark hover:border-brand-green hover:text-brand-green'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </FadeIn>
      </div>

      <div className="container-custom pb-10 sm:pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
              <p className="text-xs sm:text-sm text-brand-text-muted">
                No questions found. Try a different search or tab.
              </p>
            </div>
          ) : (
            <Stagger staggerDelay={0.08}>
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <StaggerItem key={index}>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-md">
                      <button
                        type="button"
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex items-center justify-between gap-4 text-left p-4 sm:p-5 md:p-6"
                      >
                        <span className="font-heading font-semibold text-sm sm:text-base md:text-lg text-brand-green">
                          {faq.question}
                        </span>
                        <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-cream flex items-center justify-center text-brand-green">
                          {isOpen ? (
                            <Minus size={14} strokeWidth={2.5} />
                          ) : (
                            <Plus size={14} strokeWidth={2.5} />
                          )}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 -mt-1">
                              <p className="text-xs sm:text-sm md:text-base text-brand-text-muted leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </div>

        {/* CTA */}
        <FadeIn>
          <div className="max-w-4xl mx-auto mt-10 sm:mt-12 md:mt-16 bg-brand-cream-dark rounded-2xl border border-gray-200 p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-5">
            <div>
              <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-2">
                Still have questions?
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-brand-text-muted leading-relaxed">
                If you didn't find the answer you were looking for, please get in
                touch. Our customer support representatives and Unani hakims are
                active and ready to assist you.
              </p>
            </div>
            <Link
              href="/contact"
              className="w-full md:w-auto text-center bg-brand-green hover:bg-black text-white font-medium px-6 sm:px-8 py-3 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm"
            >
              Contact Support
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
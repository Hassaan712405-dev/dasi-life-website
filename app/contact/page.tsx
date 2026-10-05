'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import FadeIn from '@/components/motion/FadeIn';
import { submitContactMessage } from '@/services/contact/contactService';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Product Recommendation',
    message: '',
  });

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email.');
      setLoading(false);
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number.');
      setLoading(false);
      return;
    }
    if (!formData.message.trim()) {
      setError('Please enter your message.');
      setLoading(false);
      return;
    }

    const result = await submitContactMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to send message. Please try again.');
      return;
    }

    setFormSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Product Recommendation',
      message: '',
    });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-8 sm:pt-12 md:pt-16 text-center">
        <FadeIn>
          <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">
            Reach Out to Us
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-brand-green leading-tight mb-3 sm:mb-4">
            Get in Touch
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-brand-text-muted leading-relaxed max-w-2xl mx-auto">
            Have questions about our Unani recipes, ordering process, or
            personalized herbal recommendations? Our team of Unani experts is here
            to guide you.
          </p>
        </FadeIn>
      </div>

      <div className="container-custom py-8 sm:py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 sm:gap-6 lg:gap-8">
          {/* Form */}
          <FadeIn>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8">
              <h2 className="font-heading font-semibold text-xl sm:text-2xl text-brand-green mb-4 sm:mb-6">
                Send Us a Message
              </h2>

              {/* Success Message */}
              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 bg-green-50 border border-green-200 rounded-md p-3 flex items-start gap-2"
                >
                  <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-green-700 font-medium">
                      Message sent successfully!
                    </p>
                    <p className="text-[10px] sm:text-xs text-green-600 mt-0.5">
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2"
                >
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-red-600">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Enter your name"
                      required
                      disabled={loading}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="name@email.com"
                      required
                      disabled={loading}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="+92 300 1234567"
                      required
                      disabled={loading}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      required
                      disabled={loading}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer disabled:opacity-60"
                    >
                      <option>Product Recommendation</option>
                      <option>Order Support</option>
                      <option>Shipping Inquiry</option>
                      <option>Returns &amp; Refunds</option>
                      <option>General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="How can we assist you today?"
                    required
                    disabled={loading}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none disabled:opacity-60"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-brand-green hover:bg-black text-white font-medium py-3 sm:py-3.5 rounded-md transition-colors text-xs sm:text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </form>
            </div>
          </FadeIn>

          {/* Info - Same as before */}
          <FadeIn delay={0.2}>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-7">
                <h2 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-4 sm:mb-5">
                  Apothecary Headquarters
                </h2>

                <div className="space-y-4 sm:space-y-5">
                  <div className="flex gap-3">
                    <Phone size={18} className="text-brand-gold shrink-0 mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-brand-text-dark mb-0.5 sm:mb-1">
                        Call or WhatsApp
                      </p>
                      <a
                        href="tel:+923422544495"
                        className="text-xs sm:text-sm text-brand-text-muted hover:text-brand-green transition-colors block"
                      >
                        0342 2544495
                      </a>
                      <p className="text-[10px] sm:text-xs text-brand-gold mt-1">
                        Available Mon–Sat, 9:00 AM – 8:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail size={18} className="text-brand-gold shrink-0 mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-brand-text-dark mb-0.5 sm:mb-1">
                        Support Email
                      </p>
                      <a
                        href="mailto:dasilife@gmail.com"
                        className="text-xs sm:text-sm text-brand-text-muted hover:text-brand-green transition-colors break-all"
                      >
                        dasilife@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin size={18} className="text-brand-gold shrink-0 mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-brand-text-dark mb-0.5 sm:mb-1">
                        Physical Studio
                      </p>
                      <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                        Rehman Town Mailsi
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Clock size={18} className="text-brand-gold shrink-0 mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-brand-text-dark mb-0.5 sm:mb-1">
                        Support Hours
                      </p>
                      <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                        Mon–Sat, 9:00 AM – 8:00 PM
                      </p>
                      <p className="text-[10px] sm:text-xs text-brand-text-muted italic mt-1">
                        We reply to all messages within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-brand-cream-dark rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-7">
                <h3 className="font-heading font-semibold text-base sm:text-lg md:text-xl text-brand-green mb-2 sm:mb-3">
                  Free Hakim Consultation
                </h3>
                <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed mb-3 sm:mb-4">
                  Unsure which Majoon or capsule fits your metabolic profile?
                  Request a private health assessment with our consulting
                  practitioner.
                </p>
                <a
                  href="https://wa.me/923422544495"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-brand-gold hover:text-brand-green transition-colors"
                >
                  <MessageCircle size={14} />
                  Schedule Free Call →
                </a>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Map */}
        <FadeIn delay={0.3}>
          <div className="mt-10 sm:mt-12 md:mt-16">
            <h2 className="font-heading font-semibold text-xl sm:text-2xl md:text-3xl text-brand-green mb-4 sm:mb-5">
              Our Location
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d865.5406318347581!2d72.16892846958862!3d29.801848598440458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393c8f2bc1491751%3A0xff5518f49a049b0c!2sRomi%20Software%20House!5e0!3m2!1sen!2sus!4v1790497916019!5m2!1sen!2sus"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Dasi Life Location"
                className="sm:h-[400px]"
              ></iframe>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
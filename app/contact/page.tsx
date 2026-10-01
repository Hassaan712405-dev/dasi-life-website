'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 4000);
    };

    return (
        <div className="bg-brand-cream min-h-screen">
            {/* Hero Heading */}
            <div className="container-custom pt-12 md:pt-16 text-center">
                <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">
                    Reach Out to Us
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-brand-green leading-tight mb-4">
                    Get in Touch
                </h1>
                <p className="text-sm md:text-base text-brand-text-muted leading-relaxed max-w-2xl mx-auto">
                    Have questions about our Unani recipes, ordering process, or
                    personalized herbal recommendations? Our team of Unani experts is here
                    to guide you.
                </p>
            </div>

            {/* Main Grid */}
            <div className="container-custom py-10 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8">

                    {/* Left — Contact Form */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                        <h2 className="font-heading font-semibold text-2xl text-brand-green mb-6">
                            Send Us a Message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Row 1: Name + Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-dark mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        required
                                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-dark mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="name@email.com"
                                        required
                                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Phone + Subject */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-dark mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+92 300 1234567"
                                        required
                                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-dark mb-2">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer"
                                    >
                                        <option>Product Recommendation</option>
                                        <option>Order Support</option>
                                        <option>Shipping Inquiry</option>
                                        <option>Returns & Refunds</option>
                                        <option>General Question</option>
                                    </select>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                                    Your Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={5}
                                    placeholder="How can we assist you today?"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                                ></textarea>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn-primary w-full py-3.5 text-base"
                            >
                                Send Message
                            </button>

                            {formSubmitted && (
                                <p className="text-sm text-brand-green font-medium text-center">
                                    ✓ Message sent! We'll get back to you soon.
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Right — Info Cards */}
                    <div className="space-y-6">
                        {/* Apothecary Headquarters */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-7">
                            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-5">
                                Apothecary Headquarters
                            </h2>

                            <div className="space-y-5">
                                {/* Call or WhatsApp */}
                                <div className="flex gap-3">
                                    <Phone size={20} className="text-brand-gold shrink-0 mt-1" />
                                    <div>
                                        <p className="text-sm font-semibold text-brand-text-dark mb-1">
                                            Call or WhatsApp
                                        </p>
                                        <p className="text-sm text-brand-text-muted">
                                            +92 300 1234567
                                        </p>
                                        <p className="text-xs text-brand-gold mt-1">
                                            Available Mon–Sat, 9:00 AM – 6:00 PM
                                        </p>
                                    </div>
                                </div>

                                {/* Support Email */}
                                <div className="flex gap-3">
                                    <Mail size={20} className="text-brand-gold shrink-0 mt-1" />
                                    <div>
                                        <p className="text-sm font-semibold text-brand-text-dark mb-1">
                                            Support Email
                                        </p>
                                        <p className="text-sm text-brand-text-muted">
                                            support@dasilife.store
                                        </p>
                                    </div>
                                </div>

                                {/* Physical Studio */}
                                <div className="flex gap-3">
                                    <MapPin size={20} className="text-brand-gold shrink-0 mt-1" />
                                    <div>
                                        <p className="text-sm font-semibold text-brand-text-dark mb-1">
                                            Physical Studio
                                        </p>
                                        <p className="text-sm text-brand-text-muted leading-relaxed">
                                            Studio 4B, Heritage Plaza, Gulberg III, Lahore, Pakistan
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Free Hakim Consultation */}
                        <div className="bg-brand-cream-dark rounded-2xl border border-gray-200 p-6 md:p-7">
                            <h3 className="font-heading font-semibold text-lg md:text-xl text-brand-green mb-3">
                                Free Hakim Consultation
                            </h3>
                            <p className="text-sm text-brand-text-muted leading-relaxed mb-4">
                                Unsure which Majoon or capsule fits your metabolic profile?
                                Request a private health assessment with our consulting
                                practitioner.
                            </p>
                            <a
                                href="https://wa.me/923001234567"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-gold hover:text-brand-green transition-colors"
                            >
                                Schedule Free Call →
                            </a>
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className="mt-12 md:mt-16">
                    <h2 className="font-heading font-semibold text-2xl md:text-3xl text-brand-green mb-5">
                        Our Location in Lahore
                    </h2>
                    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d865.5406318347581!2d72.16892846958862!3d29.801848598440458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393c8f2bc1491751%3A0xff5518f49a049b0c!2sRomi%20Software%20House!5e0!3m2!1sen!2sus!4v1790497916019!5m2!1sen!2sus"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="Dasi Life Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
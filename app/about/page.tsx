import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, HeartHandshake, Leaf, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import FadeIn from '@/components/motion/FadeIn';

export const metadata: Metadata = {
  title: 'About Us | Dasi Life',
  description:
    'Discover Dasi Life — rooted in tradition, made for everyday care. Learn about our mission and our commitment to quality, transparency, and customer care.',
};

const COMMITMENTS = [
  {
    number: '01',
    title: 'Quality',
    description:
      'A thoughtful approach to product quality and presentation, so every order feels as considered as it looks.',
    detail: 'Thoughtfully considered',
    icon: Leaf,
  },
  {
    number: '02',
    title: 'Transparency',
    description:
      'Clear, accurate product information helps you understand your choices and shop with confidence.',
    detail: 'Clear by design',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'Customer Care',
    description:
      'A helpful, straightforward shopping experience — from your first visit to the moment your order arrives.',
    detail: 'Here to help',
    icon: HeartHandshake,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-brand-cream">
      {/* SECTION 1 — ABOUT DASi LIFE */}
      <section className="relative">
        <div className="container-custom py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left content */}
            <div className="order-2 lg:order-1 lg:col-span-6">
              <FadeIn>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B18A3B] sm:text-xs">
                  Our Story
                </p>

                <h1 className="mb-6 font-heading text-4xl font-bold leading-[1.06] text-[#1B5E20] sm:text-5xl md:text-6xl xl:text-7xl">
                  Rooted in
                  <span className="mt-1 block font-light italic text-[#2E7D32]">
                    tradition.
                  </span>
                  <span className="mt-4 block text-3xl font-semibold leading-tight text-[#1B5E20]/85 sm:text-4xl lg:text-[2.65rem]">
                    Made for everyday care.
                  </span>
                </h1>

                <p className="max-w-xl text-base leading-8 text-brand-text-dark sm:text-lg">
                  Dasi Life brings a thoughtful approach to everyday care,
                  inspired by traditional herbal practices and a commitment to
                  quality.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-9">
                  <Link
                    href="/shop"
                    className="group inline-flex items-center gap-2 rounded-md bg-[#1B5E20] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-black sm:px-7 sm:text-base"
                  >
                    Explore Our Products
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-md border border-[#1B5E20]/30 px-6 py-3.5 text-sm font-medium text-[#1B5E20] transition-all duration-300 hover:border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white sm:px-7 sm:text-base"
                  >
                    Get in Touch
                  </Link>
                </div>

                <div className="mt-9 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-brand-text-muted sm:mt-11">
                  <span className="h-px w-9 bg-[#C9A961]" />
                  Everyday care, thoughtfully considered
                </div>
              </FadeIn>
            </div>

            {/* Right image — intentionally larger and prominent */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <FadeIn delay={0.15}>
                <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#EBE4D6] bg-[#F1EBDD] shadow-xl sm:rounded-3xl">
                    <Image
                      src="/images/hero-majoon.png"
                      alt="Dasi Life — herbal wellness craftsmanship"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#123B18]/35 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/25 bg-white/90 p-4 backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9A7834] sm:text-xs">
                        The Dasi Life approach
                      </p>
                      <p className="mt-1 font-heading text-lg font-semibold text-[#1B5E20] sm:text-xl">
                        Crafted with care. Rooted in tradition.
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-3 -right-3 -z-0 hidden h-full w-full rounded-3xl border border-[#C9A961]/50 sm:block" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        <div className="container-custom">
          <div className="h-px bg-[#E6DECF]" />
        </div>
      </section>

      {/* SECTION 2 — OUR MISSION */}
      <section className="relative bg-white">
        <div className="container-custom py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B18A3B] sm:text-xs">
                    Our Mission
                  </p>
                  <div className="mt-4 h-px w-12 bg-[#C9A961]" />
                </div>

                <div className="md:col-span-9">
                  <h2 className="max-w-4xl font-heading text-2xl font-bold leading-tight text-[#1B5E20] sm:text-3xl md:text-4xl lg:text-5xl">
                    Making everyday care more{' '}
                    <span className="font-light italic text-[#2E7D32]">
                      thoughtful
                    </span>{' '}
                    — one considered choice at a time.
                  </h2>

                  <p className="mt-5 max-w-2xl text-base leading-8 text-brand-text-dark sm:mt-6 sm:text-lg">
                    Our mission is to make everyday care more thoughtful
                    through clear product information, a quality-focused
                    approach, and a better customer experience.
                  </p>

                  <div className="mt-7 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-brand-text-muted">
                    <span className="h-px w-8 bg-[#C9A961]" />
                    Dasi Life
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECTION 3 — OUR COMMITMENT */}
      <section className="relative overflow-hidden bg-[#F6F3EA]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#C9A961]/20" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#C9A961]/20" />

        <div className="container-custom py-14 sm:py-16 lg:py-20">
          {/* Heading */}
          <FadeIn>
            <div className="relative mb-9 grid grid-cols-1 items-end gap-5 sm:mb-12 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-8">
                <div className="mb-4 inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-[#C9A961]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A78335] sm:text-xs">
                    Our Commitment
                  </p>
                </div>
                <h2 className="max-w-3xl font-heading text-3xl font-bold leading-[1.12] text-[#1B5E20] sm:text-4xl md:text-5xl lg:text-6xl">
                  The principles behind{' '}
                  <span className="font-light italic text-[#2E7D32]">
                    what we do.
                  </span>
                </h2>
              </div>

              <div className="md:col-span-4 md:pb-1">
                <p className="max-w-sm text-sm leading-7 text-brand-text-muted sm:text-base md:ml-auto">
                  The details matter. We aim to make every part of your Dasi
                  Life experience clear, considered, and dependable.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Commitment panels */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {COMMITMENTS.map((item, index) => {
              const Icon = item.icon;

              return (
                <FadeIn key={item.number} delay={index * 0.1}>
                  <article className="group relative flex h-full min-h-[285px] flex-col overflow-hidden rounded-2xl border border-[#E8E0D0] bg-white p-6 shadow-[0_8px_30px_rgba(27,94,32,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A961]/70 hover:shadow-[0_18px_40px_rgba(27,94,32,0.09)] sm:p-7 lg:p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F0E5] text-[#1B5E20] transition-colors duration-300 group-hover:bg-[#1B5E20] group-hover:text-white">
                        <Icon size={22} strokeWidth={1.7} />
                      </div>
                      <span className="font-heading text-4xl font-semibold leading-none text-[#C9A961]/45">
                        {item.number}
                      </span>
                    </div>

                    <div className="mt-8">
                      <h3 className="font-heading text-xl font-bold text-[#1B5E20] sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-brand-text-muted sm:text-base">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center gap-2 border-t border-[#EEE8DC] pt-5 text-xs font-semibold uppercase tracking-[0.13em] text-[#397341]">
                      <Check size={14} strokeWidth={2} />
                      {item.detail}
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>

          {/* Closing call to action */}
          <FadeIn>
            <div className="mt-8 flex flex-col justify-between gap-5 rounded-2xl bg-[#1B5E20] px-6 py-7 text-white sm:mt-10 sm:flex-row sm:items-center sm:px-8 lg:px-10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E4CB8D] sm:text-xs">
                  Experience Dasi Life
                </p>
                <h3 className="mt-2 font-heading text-xl font-semibold sm:text-2xl">
                  Thoughtful care starts with a considered choice.
                </h3>
              </div>
              <Link
                href="/shop"
                className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#1B5E20] transition-colors duration-300 hover:bg-[#EDE5D2]"
              >
                Explore Our Products
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}

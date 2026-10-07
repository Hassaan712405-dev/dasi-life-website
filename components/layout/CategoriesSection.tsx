import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import FadeIn from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

const categories = [
  {
    name: 'Herbal Majoon',
    slug: 'herbal-majoon',
    description: 'Semi-solid restorative elixirs rich in natural honey and hand-selected roots.',
    productCount: 2,
    imageUrl: '/images/product-majoon.png',
  },
  {
    name: 'Herbal Capsules',
    slug: 'herbal-capsules',
    description: 'Standardized high-potency extracts prepared for modern organic ease.',
    productCount: 6,
    imageUrl: '/images/product-weight-loss.png',
  },
  {
    name: 'Hair & Body Care',
    slug: 'hair-body-care',
    description: 'Cold-pressed oil distillations and natural extracts for physical vitality.',
    productCount: 4,
    imageUrl: '/images/product-hair-oil.png',
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <div className="container-custom">
        <FadeIn>
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="text-brand-gold font-semibold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase mb-2 sm:mb-3">
              Wellness Departments
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
              Shop by Category
            </h2>
          </div>
        </FadeIn>

        <Stagger
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
        >
          {categories.map((category) => (
            <StaggerItem key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                className="group block bg-[#F0EDE6] rounded-xl overflow-hidden border border-gray-300 shadow-md hover:shadow-xl hover:border-brand-green/40 transition-all duration-500 h-full"
              >
                <div className="relative overflow-hidden bg-white aspect-[4/3]">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-1.5 sm:mb-2">
                    {category.name}
                  </h3>

                  <p className="text-[11px] sm:text-xs md:text-sm text-brand-text-muted leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs md:text-sm font-medium text-brand-text-muted">
                      {category.productCount} Products
                    </span>
                    <span className="flex items-center gap-1 text-brand-gold font-medium text-[11px] sm:text-xs md:text-sm group-hover:gap-2 transition-all duration-300">
                      Explore
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
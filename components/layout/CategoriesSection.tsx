import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
    imageUrl: '/images/product-joint-bone.png',
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
    <section className="bg-white py-12 md:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">
            Wellness Departments
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
            Shop by Category
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group bg-[#F0EDE6] rounded-xl overflow-hidden border border-gray-300 shadow-md hover:shadow-xl hover:border-brand-green/40 transition-shadow duration-500 flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-white aspect-[4/3]">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-2">
                  {category.name}
                </h3>

                <p className="text-xs md:text-sm text-brand-text-muted leading-relaxed mb-4 line-clamp-2">
                  {category.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium text-brand-text-muted">
                    {category.productCount} Products
                  </span>
                  <span className="flex items-center gap-1 text-brand-gold font-medium text-xs md:text-sm group-hover:gap-2 transition-all duration-300">
                    Shop Now
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
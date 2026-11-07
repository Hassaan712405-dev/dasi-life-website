'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getProductImageUrl } from '@/lib/utils/productImage';

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug, image_url')
        .eq('is_active', true)
        .order('sort_order')
        .limit(6); // Image mein 6 categories hain

      if (data) setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  if (loading) return <div className="h-48 flex items-center justify-center">Loading categories...</div>;
  if (categories.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#FDFBF7]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-green">
            Shop by Category
          </h2>
          <Link href="/shop" className="text-sm font-medium text-brand-text-dark hover:text-brand-green flex items-center gap-1 transition-colors">
            Explore All <ArrowRight size={16} />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center"
            >
              {/* Gol Image Container */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-transparent group-hover:border-[#EBE4D6] transition-all duration-300 shadow-sm group-hover:shadow-md relative mb-4">
                <Image
                  src={cat.image_url || '/images/placeholder-category.png'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-semibold text-brand-text-dark group-hover:text-brand-green transition-colors text-center">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopSidebarProps {
  categories: Category[];
  activeCategory?: string;
}

const PRICE_MIN = 1000;
const PRICE_MAX = 3000;

export default function ShopSidebar({
  categories,
  activeCategory,
}: ShopSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMin = Number(searchParams.get('minPrice') || PRICE_MIN);
  const currentMax = Number(searchParams.get('maxPrice') || PRICE_MAX);
  const currentSort = searchParams.get('sortBy') || 'popularity';

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`?${params.toString()}`);
  };

  const handleCategoryClick = (slug?: string) => {
    updateParams({ category: slug || null });
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      updateParams({
        minPrice: value > PRICE_MIN ? String(value) : null,
      });
    } else {
      updateParams({
        maxPrice: value < PRICE_MAX ? String(value) : null,
      });
    }
  };

  const handleSortChange = (value: string) => {
    updateParams({
      sortBy: value === 'popularity' ? null : value,
    });
  };

  return (
    <aside className="space-y-4 sm:space-y-6">
      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#F0EDE6] rounded-xl border border-gray-300 p-4 sm:p-5"
      >
        <h3 className="font-heading font-semibold text-base sm:text-lg text-brand-green mb-3 sm:mb-4">
          Categories
        </h3>
        <ul className="space-y-2.5 sm:space-y-3">
          {/* All Categories */}
          <li>
            <button
              type="button"
              onClick={() => handleCategoryClick()}
              className="flex items-center gap-3 cursor-pointer group w-full text-left"
            >
              <input
                type="checkbox"
                readOnly
                checked={!activeCategory}
                className="w-4 h-4 rounded border-gray-400 accent-brand-green pointer-events-none"
              />
              <span
                className={`text-xs sm:text-sm transition-colors ${
                  !activeCategory
                    ? 'text-brand-green font-medium'
                    : 'text-brand-text-dark group-hover:text-brand-green'
                }`}
              >
                All Products
              </span>
            </button>
          </li>

          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => handleCategoryClick(cat.slug)}
                className="flex items-center gap-3 cursor-pointer group w-full text-left"
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={activeCategory === cat.slug}
                  className="w-4 h-4 rounded border-gray-400 accent-brand-green pointer-events-none"
                />
                <span
                  className={`text-xs sm:text-sm transition-colors ${
                    activeCategory === cat.slug
                      ? 'text-brand-green font-medium'
                      : 'text-brand-text-dark group-hover:text-brand-green'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Price Range */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#F0EDE6] rounded-xl border border-gray-300 p-4 sm:p-5"
      >
        <h3 className="font-heading font-semibold text-base sm:text-lg text-brand-green mb-3 sm:mb-4">
          Price Range
        </h3>

        <div className="mb-3 sm:mb-4">
          <label className="block text-[10px] sm:text-xs text-brand-text-muted mb-1.5 sm:mb-2">
            Min: Rs {currentMin.toLocaleString()}
          </label>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={100}
            value={currentMin}
            onChange={(e) => handlePriceChange('min', Number(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand-green"
          />
        </div>

        <div className="mb-1 sm:mb-2">
          <label className="block text-[10px] sm:text-xs text-brand-text-muted mb-1.5 sm:mb-2">
            Max: Rs {currentMax.toLocaleString()}
          </label>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={100}
            value={currentMax}
            onChange={(e) => handlePriceChange('max', Number(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand-green"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] sm:text-xs text-brand-text-muted mt-2">
          <span>Rs {PRICE_MIN.toLocaleString()}</span>
          <span>Rs {PRICE_MAX.toLocaleString()}</span>
        </div>
      </motion.div>

      {/* Sort By */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[#F0EDE6] rounded-xl border border-gray-300 p-4 sm:p-5"
      >
        <h3 className="font-heading font-semibold text-base sm:text-lg text-brand-green mb-3 sm:mb-4">
          Sort By
        </h3>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer"
        >
          <option value="popularity">Popularity</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </motion.div>
    </aside>
  );
}
import Link from 'next/link';
import { Search as SearchIcon, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { searchProducts } from '@/services/products/searchProducts';

function getImageUrl(slug: string): string {
  const map: Record<string, string> = {
    'sultani-herbal-majoon': '/images/product-majoon.png',
    'sultani-herbal-hair-oil': '/images/product-hair-oil.png',
    'sultani-herbal-capsule-joint-bone': '/images/product-joint-bone.png',
    'sultani-herbal-capsule-weight-loss': '/images/product-weight-loss.png',
  };
  return map[slug] || '/images/product-majoon.png';
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const results = query ? await searchProducts(query, 50) : [];

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-brand-text-muted mb-4">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-green font-medium">Search</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-3">
            Search the Apothecary
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green mb-6">
            Your Search Results
          </h1>

          {/* Search Form */}
          <form
            action="/search"
            method="GET"
            className="max-w-2xl mx-auto relative"
          >
            <SearchIcon
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text-muted"
            />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for products..."
              className="w-full bg-white border border-gray-300 rounded-full pl-14 pr-32 py-4 text-base text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-green hover:bg-black text-white font-medium px-5 py-2.5 rounded-full transition-colors text-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {query && (
          <div>
            <p className="text-center text-sm text-brand-text-muted mb-8">
              Showing {results.length} result{results.length !== 1 ? 's' : ''}{' '}
              for <strong className="text-brand-text-dark">"{query}"</strong>
            </p>

            {results.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-2xl mx-auto">
                <SearchIcon
                  size={48}
                  className="text-brand-text-muted mx-auto mb-4"
                />
                <h3 className="font-heading font-semibold text-xl text-brand-green mb-3">
                  No results found
                </h3>
                <p className="text-sm text-brand-text-muted mb-6">
                  Try searching for "majoon", "oil", or "capsule".
                </p>
                <Link href="/shop" className="btn-primary inline-flex">
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    slug={product.slug}
                    shortDescription={product.short_description || ''}
                    price={product.price}
                    compareAtPrice={product.compare_at_price || product.price}
                    imageUrl={getImageUrl(product.slug)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-2xl mx-auto">
            <SearchIcon
              size={48}
              className="text-brand-text-muted mx-auto mb-4"
            />
            <h3 className="font-heading font-semibold text-xl text-brand-green mb-3">
              Start typing to search
            </h3>
            <p className="text-sm text-brand-text-muted mb-6">
              Search across our full apothecary of Unani formulations.
            </p>
            <Link href="/shop" className="btn-primary inline-flex">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
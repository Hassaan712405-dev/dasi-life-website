import ProductCard from '@/components/products/ProductCard';
import { getProducts } from '@/services/products/getProducts';

export default async function BestsellersSection() {
  // Fetch featured products from Supabase
 const products = await getProducts({ limit: 4 });

  // Agar koi product nahi, to section hide karein
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-brand-gold font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">
            Apothecary Essentials
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
            Our Bestsellers
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              slug={product.slug}
              shortDescription={product.short_description || ''}
              price={product.price}
              compareAtPrice={product.compare_at_price || product.price}
              imageUrl={
                product.slug === 'sultani-herbal-majoon'
                  ? '/images/product-majoon.png'
                  : product.slug === 'sultani-herbal-hair-oil'
                  ? '/images/product-hair-oil.png'
                  : product.slug === 'sultani-herbal-capsule-joint-bone'
                  ? '/images/product-joint-bone.png'
                  : product.slug === 'sultani-herbal-capsule-weight-loss'
                  ? '/images/product-weight-loss.png'
                  : '/images/product-majoon.png'
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
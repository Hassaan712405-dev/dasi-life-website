import ProductCard from '@/components/products/ProductCard';
import { getProducts } from '@/services/products/getProducts';
import { getProductImageUrl } from '@/lib/utils/productImage';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import FadeIn from '@/components/motion/FadeIn';

export default async function BestsellersSection() {
  const products = await getProducts({ featuredOnly: true, limit: 4 });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <div className="container-custom">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="text-brand-gold font-semibold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase mb-2 sm:mb-3">
              Apothecary Essentials
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green">
              Our Bestsellers
            </h2>
          </div>
        </FadeIn>

        {/* Products Grid */}
        <Stagger
          staggerDelay={0.1}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard
                name={product.name}
                slug={product.slug}
                shortDescription={product.short_description || ''}
                price={product.price}
                compareAtPrice={product.compare_at_price || product.price}
                imageUrl={getProductImageUrl(product)}
                productId={product.id}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
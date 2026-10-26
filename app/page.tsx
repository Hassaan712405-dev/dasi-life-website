import HeroSection from '@/components/layout/HeroSection';
import TrustBadges from '@/components/layout/TrustBadges';
import BestsellersSection from '@/components/layout/BestsellersSection';
import ReviewsSection from '@/components/layout/ReviewsSection';
import WhyChooseUs from '@/components/layout/WhyChooseUs';
import Footer from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBadges />
      <BestsellersSection />
      <ReviewsSection />
      <WhyChooseUs />
      {/* Footer already rendered in app/layout.tsx — no need to add here */}
    </main>
  );
}
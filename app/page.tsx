import HeroSection from '@/components/layout/HeroSection';
import TrustBadges from '@/components/layout/TrustBadges';
import BestsellersSection from '@/components/layout/BestsellersSection';
import RootedSection from '@/components/layout/RootedSection';
import CategoriesSection from '@/components/layout/CategoriesSection';
import ReviewsSection from '@/components/layout/ReviewsSection';
import WhyChooseUs from '@/components/layout/WhyChooseUs';
import Newsletter from '@/components/layout/Newsletter';

// ✅ Homepage ko 1 ghante ke liye cache karein
export const revalidate = 3600;

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBadges />
      <BestsellersSection />
      <RootedSection />
      <CategoriesSection />
      <ReviewsSection />
      <WhyChooseUs />
      <Newsletter />
    </main>
  );
}
import HeroCarousel from './HeroCarousel';
import { getHeroPosters } from '@/services/hero/getHeroPosters';

export default async function HeroSection() {
  const posters = await getHeroPosters();
  return <HeroCarousel posters={posters} />;
}
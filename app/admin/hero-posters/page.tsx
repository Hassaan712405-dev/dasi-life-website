import HeroPosterManager from '@/components/admin/HeroPosterManager';
import { listAllPosters } from '@/services/admin/heroPosterAdmin';

export const dynamic = 'force-dynamic';

export default async function HeroPostersPage() {
  const posters = await listAllPosters().catch(() => []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-green mb-2">
          Homepage Hero Posters
        </h1>
        <p className="text-sm text-brand-text-muted">
          Manage the four full-screen posters shown at the top of the homepage.
          Each poster links to a product detail page.
        </p>
      </div>

      <HeroPosterManager initialPosters={posters} />
    </div>
  );
}
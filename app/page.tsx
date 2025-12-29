import { HeroCarousel, TrendingSection, TrendingTVSection, PopularSection, PopularTVSection, UpcomingSection } from '@/features/home';

export default function Home() {
  return (
    <div className="space-y-12 md:space-y-16">
      <HeroCarousel />
      <TrendingSection />
      <TrendingTVSection />
      <UpcomingSection />
      <PopularSection />
      <PopularTVSection />
    </div>
  );
}

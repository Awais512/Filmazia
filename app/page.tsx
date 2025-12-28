import HeroCarousel from '@/components/home/hero-carousel';
import TrendingSection from '@/components/home/trending-section';
import TrendingTVSection from '@/components/home/trending-tv-section';
import PopularSection from '@/components/home/popular-section';
import PopularTVSection from '@/components/home/popular-tv-section';
import UpcomingSection from '@/components/home/upcoming-section';

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

import { MovieGridSkeleton } from '@/shared/ui';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <MovieGridSkeleton count={20} />
    </div>
  );
}

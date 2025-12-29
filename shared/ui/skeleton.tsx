import { cn } from '@/shared/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-cinematic-gray rounded',
        className
      )}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function MovieHeroSkeleton() {
  return (
    <div className="relative h-[70vh] w-full">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

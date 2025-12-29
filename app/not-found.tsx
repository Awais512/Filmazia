import { Button } from '@/shared/ui';
import Link from 'next/link';
import { Film, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-cinematic-gray flex items-center justify-center">
          <Film className="w-12 h-12 text-accent-amber" />
        </div>
        <h1 className="font-display text-4xl font-bold text-white">
          Page Not Found
        </h1>
        <p className="text-gray-400 max-w-md">
          The movie you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="font-display text-4xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="text-gray-400 max-w-md">
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

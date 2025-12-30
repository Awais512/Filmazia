'use client';

import { Play, ShoppingCart, DollarSign } from 'lucide-react';
import { MovieDetails, TVShowDetails, WatchProvidersResponse } from './types';

interface StreamingProvidersProps {
  watchProviders: WatchProvidersResponse | null;
  type: 'movie' | 'tv';
}

function StreamingProviders({ watchProviders, type }: StreamingProvidersProps) {
  if (!watchProviders || !watchProviders.results) {
    return null;
  }

  // Get providers for US region (can be extended to support multiple regions)
  const usProviders = watchProviders.results['US'];
  if (!usProviders) {
    return null;
  }

  const hasAnyProviders =
    (usProviders.flatrate && usProviders.flatrate.length > 0) ||
    (usProviders.rent && usProviders.rent.length > 0) ||
    (usProviders.buy && usProviders.buy.length > 0);

  if (!hasAnyProviders) {
    return null;
  }

  const ProviderSection = ({
    title,
    providers,
    icon: Icon,
  }: {
    title: string;
    providers: typeof usProviders.flatrate;
    icon: React.ElementType;
  }) => {
    if (!providers || providers.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {providers.map((provider) => (
            <div
              key={provider.provider_id}
              className="relative group"
              title={provider.provider_name}
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                alt={provider.provider_name}
                className="w-16 h-10 object-contain rounded bg-cinematic-gray/50 hover:bg-cinematic-gray transition-colors"
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {provider.provider_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Streaming Providers</h3>
      <div className="space-y-4">
        <ProviderSection
          title="Streaming"
          providers={usProviders.flatrate}
          icon={Play}
        />
        <ProviderSection title="Rent" providers={usProviders.rent} icon={ShoppingCart} />
        <ProviderSection title="Buy" providers={usProviders.buy} icon={DollarSign} />
      </div>
      {usProviders.link && (
        <a
          href={usProviders.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-cinematic-accent hover:text-cinematic-accent/80 transition-colors"
        >
          View all streaming options
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}

// Movie-specific wrapper component
interface MovieStreamingProvidersProps {
  movie: MovieDetails;
}

export function MovieStreamingProviders({ movie }: MovieStreamingProvidersProps) {
  return <StreamingProviders watchProviders={movie.watch_providers} type="movie" />;
}

// TV Show-specific wrapper component
interface TVShowStreamingProvidersProps {
  show: TVShowDetails;
}

export function TVShowStreamingProviders({ show }: TVShowStreamingProvidersProps) {
  return <StreamingProviders watchProviders={show.watch_providers} type="tv" />;
}

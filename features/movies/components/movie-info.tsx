'use client';

import { Clock, Calendar, DollarSign, Building } from 'lucide-react';
import { MovieDetails } from '@/shared/tmdb/types';
import { formatRuntime, formatDate } from '@/shared/utils';

interface MovieInfoProps {
  movie: MovieDetails;
}

export function MovieInfo({ movie }: MovieInfoProps) {
  const infoItems = [
    {
      icon: Calendar,
      label: 'Release Date',
      value: movie.release_date ? formatDate(movie.release_date) : 'N/A',
    },
    {
      icon: Clock,
      label: 'Runtime',
      value: movie.runtime ? formatRuntime(movie.runtime) : 'N/A',
    },
    {
      icon: DollarSign,
      label: 'Budget',
      value: movie.budget
        ? `$${movie.budget.toLocaleString()}`
        : 'N/A',
    },
    {
      icon: DollarSign,
      label: 'Revenue',
      value: movie.revenue
        ? `$${movie.revenue.toLocaleString()}`
        : 'N/A',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {infoItems.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <item.icon className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </div>
          <p className="text-white font-medium">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

interface ProductionCompaniesProps {
  companies: MovieDetails['production_companies'];
}

export function ProductionCompanies({ companies }: ProductionCompaniesProps) {
  if (!companies || companies.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Production Companies</h3>
      <div className="flex flex-wrap gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex items-center gap-3 px-4 py-2 bg-cinematic-gray rounded-lg"
          >
            {company.logo_path ? (
              <img
                src={tmdb.getImageUrl(company.logo_path, 'profile', 'small') || undefined}
                alt={company.name}
                className="h-8 object-contain"
              />
            ) : (
              <Building className="w-6 h-6 text-gray-400" />
            )}
            <span className="text-sm text-gray-300">{company.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Circular import fix for tmdb
import { tmdb } from '@/shared/tmdb/api';

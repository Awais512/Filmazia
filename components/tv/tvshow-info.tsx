'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Award, Globe, User } from 'lucide-react';
import { TVShowDetails } from '@/lib/tmdb-types';
import { cn } from '@/lib/utils';

interface TVShowInfoProps {
  show: TVShowDetails;
}

export default function TVShowInfo({ show }: TVShowInfoProps) {
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const infoItems = [
    {
      icon: Calendar,
      label: 'First Aired',
      value: show.first_air_date
        ? new Date(show.first_air_date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        : 'N/A',
    },
    {
      icon: Calendar,
      label: 'Last Aired',
      value: show.last_air_date
        ? new Date(show.last_air_date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        : 'N/A',
    },
    {
      icon: Clock,
      label: 'Episode Runtime',
      value: show.episode_run_time.length > 0
        ? formatRuntime(show.episode_run_time[0])
        : 'N/A',
    },
    {
      icon: Globe,
      label: 'Status',
      value: show.status,
    },
    {
      icon: Award,
      label: 'Type',
      value: show.type,
    },
    {
      icon: User,
      label: 'Seasons',
      value: `${show.number_of_seasons} (${show.number_of_episodes} episodes)`,
    },
  ];

  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-2xl font-bold text-white mb-6"
      >
        Show Info
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {infoItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 bg-cinematic-gray rounded-xl"
          >
            <item.icon className="w-5 h-5 text-accent-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-400 mb-1">{item.label}</p>
              <p className="text-white font-medium">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Networks */}
      {show.networks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 p-4 bg-cinematic-gray rounded-xl"
        >
          <p className="text-sm text-gray-400 mb-3">Networks</p>
          <div className="flex flex-wrap gap-4">
            {show.networks.map((network) => (
              <div
                key={network.id}
                className="flex items-center gap-2 px-3 py-2 bg-cinematic-black/50 rounded-lg"
              >
                {network.logo_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${network.logo_path}`}
                    alt={network.name}
                    className="h-6 w-auto object-contain"
                  />
                )}
                <span className="text-white text-sm">{network.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Production Companies */}
      {show.production_companies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 p-4 bg-cinematic-gray rounded-xl"
        >
          <p className="text-sm text-gray-400 mb-3">Production Companies</p>
          <div className="flex flex-wrap gap-4">
            {show.production_companies.slice(0, 5).map((company) => (
              <div
                key={company.id}
                className="flex items-center gap-2 px-3 py-2 bg-cinematic-black/50 rounded-lg"
              >
                {company.logo_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                    alt={company.name}
                    className="h-6 w-auto object-contain"
                  />
                )}
                <span className="text-white text-sm">{company.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}

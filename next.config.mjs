/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
    // Cache remote images for 1 day (in seconds)
    minimumCacheTTL: 60 * 60 * 24,
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Clapperboard } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignIn = pathname === '/auth/sign-in';

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-cinematic-black">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-amber/20 via-cinematic-black to-accent-crimson/10" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-amber/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-crimson/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent-amber/50 blur-lg rounded-full" />
                <Film className="relative w-12 h-12 text-accent-amber" strokeWidth={1.5} />
              </div>
              <span className="font-display text-4xl font-bold text-white tracking-tight">
                FILMAZIA
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-400 font-light max-w-md mx-auto leading-relaxed"
            >
              Your personal cinema sanctuary.{' '}
              <span className="text-accent-amber">Curate.</span>{' '}
              <span className="text-accent-crimson">Discover.</span>{' '}
              <span className="text-white">Experience.</span>
            </motion.p>

            {/* Decorative Film Strip */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 200 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex justify-center mt-12"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 20 }}
                    animate={{ height: [20, 40, 20] }}
                    transition={{
                      delay: 0.8 + i * 0.1,
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className="w-3 bg-white/20 rounded-sm"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 bg-cinematic-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Clapperboard className="w-8 h-8 text-accent-amber" />
            <span className="font-display text-2xl font-bold text-white">FILMAZIA</span>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Link
              href="/auth/sign-in"
              className={`relative px-6 py-2 text-sm font-medium transition-colors ${
                isSignIn ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Sign In
              {isSignIn && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-amber"
                />
              )}
            </Link>
            <div className="w-px h-6 bg-white/10" />
            <Link
              href="/auth/sign-up"
              className={`relative px-6 py-2 text-sm font-medium transition-colors ${
                !isSignIn ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Sign Up
              {!isSignIn && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-amber"
                />
              )}
            </Link>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}

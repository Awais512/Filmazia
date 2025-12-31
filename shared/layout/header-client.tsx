'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Film, LogOut, Settings, Bell } from 'lucide-react'
import { useUIStore, useNotificationsStore } from '@/store'
import { SearchBar } from '@/features/search'
import { signOutAction } from '@/features/auth/actions'
import { useAuth } from '@/features/auth/components/auth-provider'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface HeaderClientProps {
  user: SupabaseUser | null
}

// Helper to get user display name from metadata
const getUserDisplayName = (user: SupabaseUser): string => {
  return user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
}

// Helper to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function HeaderClient({ user }: HeaderClientProps) {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore()
  const { unreadCount, notifications, markAsRead, clearAll } = useNotificationsStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { signOut } = useAuth()

  // Track scroll position to show/hide border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Memoize user display info
  const userDisplayName = useMemo(() => user ? getUserDisplayName(user) : '', [user])
  const userInitials = useMemo(() => user ? getInitials(userDisplayName) : '', [user, userDisplayName])
  const userAvatarUrl = user?.user_metadata?.avatar_url

  // NEW: Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showUserMenu || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu, showNotifications])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/tv', label: 'TV Shows' },
    { href: '/watchlist', label: 'Watchlist' },
    { href: '/favorites', label: 'Favorites' },
  ]

  const authNavLinks = [
    { href: '/profile', label: 'Profile' },
  ]

  const handleSignOut = async () => {
    setShowUserMenu(false)
    await signOut()
    await signOutAction()
    router.refresh()
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-cinematic-black/80 backdrop-blur-md transition-colors duration-200 ${isScrolled ? 'border-b border-cinematic-gray' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Film className="w-8 h-8 text-accent-amber transition-transform group-hover:rotate-12" />
            <span className="font-display text-xl font-bold tracking-tight">
              Filmazia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-accent-amber transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-amber transition-all group-hover:w-full" />
              </Link>
            ))}
            {user && authNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-accent-amber transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-amber transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Search & Auth */}
          <div className="flex items-center gap-4">
            <SearchBar />

            {user && (
              /* Notifications Bell */
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-300 hover:text-accent-amber transition-colors rounded-lg"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 bg-cinematic-dark border border-cinematic-gray rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-cinematic-gray flex items-center justify-between">
                        <h3 className="text-white font-medium">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={() => clearAll()}
                            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-cinematic-gray/50 hover:bg-cinematic-gray/30 transition-colors cursor-pointer ${
                                !notification.isRead ? 'bg-cinematic-gray/10' : ''
                              }`}
                              onClick={() => {
                                if (!notification.isRead) {
                                  markAsRead(notification.id)
                                }
                              }}
                            >
                              <p className="text-white text-sm font-medium">
                                {notification.title}
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                {notification.message}
                              </p>
                              <p className="text-gray-500 text-xs mt-2">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user ? (
              /* User Menu */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 text-gray-300 hover:text-accent-amber transition-colors rounded-full"
                >
                  {userAvatarUrl ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-cinematic-gray hover:ring-accent-amber/50 transition-all">
                      <Image
                        src={userAvatarUrl}
                        alt={userDisplayName}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-amber to-accent-amber/70 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-cinematic-gray hover:ring-accent-amber/50 transition-all">
                      {userInitials}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-72 bg-cinematic-dark border border-cinematic-gray rounded-2xl shadow-2xl overflow-hidden"
                    >
                      {/* User Info Section */}
                      <div className="p-4 bg-gradient-to-b from-cinematic-gray/30 to-transparent">
                        <div className="flex items-center gap-3">
                          {userAvatarUrl ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-accent-amber/30 flex-shrink-0">
                              <Image
                                src={userAvatarUrl}
                                alt={userDisplayName}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-amber to-accent-amber/70 flex items-center justify-center text-white text-base font-semibold flex-shrink-0">
                              {userInitials}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {userDisplayName}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Actions */}
                      <div className="p-2">
                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-accent-amber hover:bg-cinematic-gray rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <div className="h-px bg-cinematic-gray my-2" />
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-red-400 hover:bg-cinematic-gray rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Sign In Button */
              <Link
                href="/auth/sign-in"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent-amber hover:bg-accent-amber/80 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-accent-amber transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cinematic-dark border-t border-cinematic-gray"
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-300 hover:text-accent-amber hover:bg-cinematic-gray rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {user && authNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-300 hover:text-accent-amber hover:bg-cinematic-gray rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/auth/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-center text-white bg-accent-amber hover:bg-accent-amber/80 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

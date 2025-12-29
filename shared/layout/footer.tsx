import Link from 'next/link';
import { Film, Github, Twitter } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    product: [
      { label: 'Browse Movies', href: '/movies' },
      { label: 'Search', href: '/search' },
      { label: 'Watchlist', href: '/watchlist' },
      { label: 'Favorites', href: '/favorites' },
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Careers', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="hidden md:block bg-cinematic-dark border-t border-cinematic-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Film className="w-8 h-8 text-accent-amber" />
              <span className="font-display text-xl font-bold">Filmazia</span>
            </Link>
            <p className="text-sm text-gray-400">
              Track your favorite movies, build your watchlist, and discover new films.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-accent-amber transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-amber transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cinematic-gray flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            Powered by TMDB. Not affiliated with any streaming service.
          </p>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Filmazia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

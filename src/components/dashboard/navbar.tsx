'use client';

import { Menu, X } from 'lucide-react';
import { DashboardUserButton } from './dashboard-user-button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  user?: {
    email: string;
    role: string;
    username: string;
    name: string;
    bankName?: string;
  } | null;
}

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/contact', label: 'Contact Us' },
  { path: '/about', label: 'About Us' },
];

export function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-bold text-sky-700">
              TB<span className="text-sky-500">ML</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-2 flex-1 mx-12">
            {navItems.map((item) => {
              // Exact match for home, startsWith for others
              const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-5 py-2 rounded-lg text-base font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-sky-700 bg-sky-50 shadow-md'
                      : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop User Button */}
          <div className="hidden md:flex items-center">
            {user ? (
              <DashboardUserButton />
            ) : (
              <Link href="/sign-in" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-sky-700 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 pb-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={handleNavClick}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-sky-700 bg-sky-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-slate-200 mt-3 pt-3 px-4 flex justify-start">
              {user ? (
                <DashboardUserButton />
              ) : (
                <Link href="/sign-in" onClick={handleNavClick} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-colors w-full text-center">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

